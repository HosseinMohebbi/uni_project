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
import { GalleryService } from './gallery.service';
import { JwtAuthGuard } from '../auth/guards';
import { QueriesDto, ResponseHandler } from '../../../libs/common/src';
import { Request } from 'express';
import { DataSetGalleryDto } from './dto';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() query: QueriesDto, @Req() req: Request) {
    const { data, total } = await this.galleryService.getAllNotAnswered(
      req.user['id'],
      { isActive: true },
      query.pageHandler,
    );
    return ResponseHandler.successArray({
      wrap: 'gallery',
      data,
      meta: { total, pageSize: query?.pageSize, page: query?.page },
    });
  }

  @Post(':id/data-set')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async dataSet(
    @Body() body: DataSetGalleryDto,
    @Req() req: Request,
    @Param('id') id: number,
  ) {
    await this.galleryService.dataSet({
      userId: req.user['id'],
      galleryId: id,
      tagIds: body.tagIds,
    });
    return ResponseHandler.success({
      message: 'Data Was Successfully Recorded',
      httpStatus: HttpStatus.OK,
    });
  }
}
