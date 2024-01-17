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
import { Pagination } from '../../../libs/common/src';
import { TagEntity } from '../tags/entities/tag.entity';

@Injectable()
export class GalleryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tagService: TagsService,
  ) {}

  async findAll(where?: Prisma.PhotoGalleryWhereInput, query?: Pagination) {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.photoGallery.findMany({
        where,
        take: query?.pageSize,
        skip: query?.skip ?? 0,
        select: {
          id: true,
          title: true,
        },
      }),
      this.prismaService.photoGallery.count(),
    ]);
    return {
      data: data.map((gallery) => new GalleryEntity(gallery)),
      total,
    };
  }

  async getAllNotAnswered(
    userId: number,
    where?: Prisma.PhotoGalleryWhereInput,
    query?: Pagination,
  ) {
    const data: GalleryEntity[] = [];
    const { data: galleries, total } = await this.findAll(where, query);
    for (const gallery of galleries) {
      const answers = await this.prismaService.userGalleryTagsCounter.findFirst(
        {
          where: {
            userId,
            photoGalleryId: gallery.id,
          },
        },
      );
      if (gallery.id != answers?.photoGalleryId) {
        data.push(gallery);
      }
    }

    return { data, total };
  }

  async findOne(userId: number, id: string | number) {
    const gallery = await this.prismaService.photoGallery.findFirst({
      where: { id: Number(id) },
      include: {
        Image: true,
      },
    });
    const answered = await this.prismaService.userGalleryTagsCounter.findFirst({
      where: {
        userId,
        photoGalleryId: gallery.id,
      },
    });
    if (!gallery || answered) {
      throw new NotFoundException('PhotoGallery Not Found!');
    }
    const { data: tags } = await this.tagService.findAll({
      isActive: true,
    });

    return {
      gallery: new GalleryEntity(gallery),
      tags: tags.map((tag) => new TagEntity(tag)),
    };
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
