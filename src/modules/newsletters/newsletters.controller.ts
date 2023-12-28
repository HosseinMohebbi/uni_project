import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NewslettersService } from './newsletters.service';
import { DataSetNewsletterDto } from './dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards';
import { QueriesDto, ResponseHandler } from '../../../libs/common/src';

@Controller('newsletters')
export class NewslettersController {
  constructor(private readonly newslettersService: NewslettersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() query: QueriesDto, @Req() req: Request) {
    const { data, total } = await this.newslettersService.getAllNotAnswered(
      req.user['id'],
      { isActive: true },
      query.pageHandler,
    );
    return ResponseHandler.successArray({
      data,
      wrap: 'newsletters',
      meta: { total, pageSize: query?.pageSize, page: query?.page },
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
