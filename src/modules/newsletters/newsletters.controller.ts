import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NewslettersService } from './newsletters.service';
import { DataSetNewsletterDto } from './dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards';
import { ResponseHandler } from '../../../libs/common/src';

@Controller('newsletters')
export class NewslettersController {
  constructor(private readonly newslettersService: NewslettersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const data = await this.newslettersService.findAll({ isActive: true });
    return ResponseHandler.successArray({
      wrap: 'newsletters',
      data,
    });
  }

  @Post(':id/data-set')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async dataSet(
    @Body() body: DataSetNewsletterDto,
    @Req() req: Request,
    @Param('id') id: number,
  ) {
    await this.newslettersService.dataSet({
      userId: req.user['id'],
      newsletterId: id,
      tagIds: body.tagIds,
    });
    return ResponseHandler.success({
      message: 'Data Was Successfully Recorded',
      httpStatus: HttpStatus.OK,
    });
  }
}
