import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/getData')
  getData(): any {
    return this.appService.getData();
  }

  @Post('/sendFile')
  @UseInterceptors(FileInterceptor('file'))
  sendFile(@UploadedFile() file: Express.Multer.File): any {
    return this.appService.sendFile(file);
  }
}
