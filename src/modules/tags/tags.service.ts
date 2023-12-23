import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { TagEntity } from './entities/tag.entity';
import { CreateTag, UpdateTag } from './interfaces';

@Injectable()
export class TagsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateTag): Promise<TagEntity> {
    const tag = await this.prismaService.tags.create({ data });
    return new TagEntity(tag);
  }

  async findAll(
    where: Prisma.TagsWhereInput,
    include: Prisma.TagsInclude,
  ): Promise<TagEntity[]> {
    const tags = await this.prismaService.tags.findMany({ where, include });
    return tags.map((tag) => new TagEntity(tag));
  }

  async findOne(
    where: Prisma.TagsWhereInput,
    include: Prisma.TagsInclude,
  ): Promise<TagEntity | null> {
    const tag = await this.prismaService.tags.findFirst({ where, include });
    if (!tag) return null;
    return new TagEntity(tag);
  }

  async update(id: number, data: UpdateTag): Promise<TagEntity> {
    const tag = await this.prismaService.tags.update({
      where: { id },
      data,
    });
    return new TagEntity(tag);
  }

  async delete(id: number) {
    return this.prismaService.tags.delete({ where: { id } });
  }
}
