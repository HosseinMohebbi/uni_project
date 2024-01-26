import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('')
export class AppController {
  constructor() {}

  @Get('/uploads/?')
  serveFile(@Res() res: Response): void {
    console.log(res);

    // res.sendFile(filePath);
  }
}
