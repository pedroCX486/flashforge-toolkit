import { Injectable } from '@nestjs/common';
import { Socket } from 'net';

@Injectable()
export class AppService {
  private printerPort = 8899;
  private printerAdresss = '192.168.50.252'; // Remember to give your printer an fixed IP addr in your router to avoid problems!

  async getData(): Promise<any> {
    const printerData: any = {};

    try {
      printerData.printerConnection = await this.connectToPrinter();
      printerData.printerStatus = await this.getPrinterStatus();
      printerData.printProgress = await this.getPrintProgress();
      printerData.extruderTemperature = await this.getExtruderTemperature();
      printerData.printerAddress = this.printerAdresss;
    } catch (res) {
      printerData.printerConnection = res;
    }

    console.log(printerData);

    return printerData;
  }

  connectToPrinter() {
    const client = new Socket();

    client.connect(this.printerPort, this.printerAdresss, function () {
      console.log('Connecting...');
      client.write('~M601 S1\r\n'); // Req. Control
    });

    return new Promise((resolve, reject) => {
      client.on('data', function (data) {
        if (data.includes('Control Success.')) {
          console.log('Connected - ' + new Date());
          client.destroy();
          resolve('Connected');
        }
      });

      client.on('error', function () {
        console.log('Connection failed - ' + new Date());
        client.destroy();
        reject('Unknown connection error - Printer may be offline?');
      });
    });
  }

  getPrinterStatus() {
    const client = new Socket();
    client.connect(this.printerPort, this.printerAdresss, function () {
      console.log('Requesting machine status...');
      client.write('~M119\r\n'); // Status
    });

    return new Promise((resolve) => {
      client.on('data', function (data) {
        console.log(`Data returned:\n ${data.toString()}`);
        client.destroy();
        resolve(
          data.toString().includes('MachineStatus: READY')
            ? 'Idle/Ready'
            : data.toString().includes('MachineStatus: BUILDING_FROM_SD')
            ? 'Printing'
            : 'Unknown Status',
        );
      });
    });
  }

  getPrintProgress() {
    const client = new Socket();
    client.connect(this.printerPort, this.printerAdresss, function () {
      console.log('Requesting print progress...');
      client.write('~M27\r\n'); // Progress
    });

    return new Promise((resolve) => {
      client.on('data', function (data) {
        console.log(`Data returned:\n ${data.toString()}`);
        client.destroy();
        resolve(Number(data.toString().split('byte ')[1].split('/')[0]));
      });
    });
  }

  getExtruderTemperature() {
    const client = new Socket();
    client.connect(this.printerPort, this.printerAdresss, function () {
      console.log('Requesting extruder temperature...');
      client.write('~M105\r\n'); // Temperature
    });

    return new Promise((resolve) => {
      client.on('data', function (data) {
        console.log(`Data returned:\n ${data.toString()}`);
        client.destroy();
        resolve(
          data.toString().split(' ')[2].replace('Received.\r\nT0:', '') + 'ºC',
        );
      });
    });
  }
}
