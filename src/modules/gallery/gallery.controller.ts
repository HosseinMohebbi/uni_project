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
import { GalleryService } from './gallery.service';
import { JwtAuthGuard } from '../auth/guards';
import { ResponseHandler } from '../../../libs/common/src';
import { Request } from 'express';
import { DataSetGalleryDto } from './dto';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const data = await this.galleryService.findAll(
      { isActive: true },
      { Image: true },
    );
    return ResponseHandler.successArray({
      wrap: 'gallery',
      data,
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
