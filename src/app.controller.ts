import { Controller, Get, Param, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Controller('')
export class AppController {
  constructor(private readonly config: ConfigService) {}

  @Get('/uploads/images/:filename')
  async imageFiles(@Param('filename') filename, @Res() res: Response) {
    const rootPath = `${this.config.get<string>(
      'UPLOAD_FULL_PATH',
    )}/${this.config.get<string>('IMAGES_UPLOAD_PATH')}`;
    return res.sendFile(filename, { root: rootPath });
  }

  @Get('/uploads/audios/:filename')
  async audioFiles(@Param('filename') filename, @Res() res: Response) {
    const rootPath = `${this.config.get<string>(
      'UPLOAD_FULL_PATH',
    )}/${this.config.get<string>('AUDIOS_UPLOAD_PATH')}`;
    res.sendFile(filename, { root: rootPath });
  }
}
