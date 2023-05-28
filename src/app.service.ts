import { Injectable } from '@nestjs/common';
import { connectToPrinter, getPrinterStatus, getPrintProgress, getExtruderTemperature } from './helpers/printer-data-helper';
import { sendFileToPrinter } from './helpers/printer-file-sender-helper';

@Injectable()
export class AppService {
  private printerPort = 8899;
  private printerAdresss = '192.168.50.252'; // Remember to give your printer an fixed IP addr in your router to avoid problems!

  async getData(): Promise<any> {
    const printerData: any = {};

    try {
      printerData.printerConnection = await connectToPrinter(this.printerAdresss, this.printerPort);
      printerData.printerStatus = await getPrinterStatus(this.printerAdresss, this.printerPort);
      printerData.printProgress = await getPrintProgress(this.printerAdresss, this.printerPort);
      printerData.extruderTemperature = await getExtruderTemperature(this.printerAdresss, this.printerPort);
      printerData.printerAddress = this.printerAdresss;
    } catch (res) {
      printerData.printerConnection = res;
    }

    console.log(printerData);

    return printerData;
  }

  async sendFile(file: Express.Multer.File): Promise<any> {
    console.log(`File upload: ${file.originalname}`);
    sendFileToPrinter(this.printerAdresss, this.printerPort, file.buffer, file.originalname);
  }
}
