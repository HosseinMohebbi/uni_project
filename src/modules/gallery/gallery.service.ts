import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GalleryEntity } from './entities/gallery.entity';
import { Prisma } from '@prisma/client';
import { DataSetGallery } from './interfaces';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class GalleryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tagService: TagsService,
  ) {}
  async findAll(
    where?: Prisma.PhotoGalleryWhereInput,
    include?: Prisma.PhotoGalleryInclude,
  ) {
    const galleries = await this.prismaService.photoGallery.findMany({
      where,
      include,
    });
    return galleries.map((gallery) => new GalleryEntity(gallery));
  }

  async dataSet(data: DataSetGallery) {
    const tags: number[] = await this.tagService.isExistTag(data.tagIds);
    const gallery = await this.prismaService.photoGallery.findFirst({
      where: {
        id: data.galleryId,
      },
    });
    if (!gallery) throw new NotFoundException('PhotoGallery Not Found!');
    const isExist = await this.prismaService.userGalleryTagsCounter.findFirst({
      where: {
        photoGalleryId: gallery.id,
        userId: data.userId,
      },
    });
    if (isExist) {
      throw new BadRequestException('the data has already been recorded');
    }
    for (const tag of tags) {
      await this.prismaService.userGalleryTagsCounter.create({
        data: {
          photoGalleryId: gallery.id,
          tagId: tag,
          userId: data.userId,
        },
      });
    }
    return true;
  }
}
