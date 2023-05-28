import { Socket } from "net";

export const connectToPrinter = (printerAddr: string, printerPort: number) => {
  const client = new Socket();

  client.connect(printerPort, printerAddr, () => {
    console.log('Connecting...');
    client.write('~M601 S1\r\n'); // Req. Control
  });

  return new Promise((resolve, reject) => {
    client.on('data', (data) => {
      if (data.includes('Control Success.')) {
        console.log('Connected - ' + new Date());
        client.destroy();
        resolve('Connected');
      }
    });

    client.on('error', () => {
      console.log('Connection failed - ' + new Date());
      client.destroy();
      reject('Unknown connection error - Printer may be offline?');
    });
  });
}

export const getPrinterStatus = (printerAddr: string, printerPort: number) => {
  const client = new Socket();
  client.connect(printerPort, printerAddr, () => {
    console.log('Requesting machine status...');
    client.write('~M119\r\n'); // Status
  });

  return new Promise((resolve) => {
    client.on('data', (data) => {
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

export const getPrintProgress = (printerAddr: string, printerPort: number) => {
  const client = new Socket();
  client.connect(printerPort, printerAddr, () => {
    console.log('Requesting print progress...');
    client.write('~M27\r\n'); // Progress
  });

  return new Promise((resolve) => {
    client.on('data', (data) => {
      console.log(`Data returned:\n ${data.toString()}`);
      client.destroy();
      resolve(Number(data.toString().split('byte ')[1].split('/')[0]));
    });
  });
}

export const getExtruderTemperature = (printerAddr: string, printerPort: number) => {
  const client = new Socket();
  client.connect(printerPort, printerAddr, () => {
    console.log('Requesting extruder temperature...');
    client.write('~M105\r\n'); // Temperature
  });

  return new Promise((resolve) => {
    client.on('data', (data) => {
      console.log(`Data returned:\n ${data.toString()}`);
      client.destroy();
      resolve(
        data.toString().split(' ')[2].replace('Received.\r\nT0:', '') + 'ºC',
      );
    });
  });
}