import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { TagEntity } from './entities/tag.entity';
import { CreateTag, UpdateTag } from './interfaces';
import { Pagination } from '../../../libs/common/src';

@Injectable()
export class TagsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateTag): Promise<TagEntity> {
    const tag = await this.prismaService.tags.create({ data });
    return new TagEntity(tag);
  }

  async findAll(
    where?: Prisma.TagsWhereInput,
    include?: Prisma.TagsInclude,
    query?: Pagination,
    omit?: Array<keyof TagEntity>,
  ) {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.tags.findMany({
        where,
        include,
        take: query?.pageSize,
        skip: query?.skip ?? 0,
      }),
      this.prismaService.tags.count(),
    ]);
    return {
      data: data.map((tag) => new TagEntity(tag, omit)),
      total,
    };
  }

  async findOne(
    where: Prisma.TagsWhereInput,
    include: Prisma.TagsInclude,
  ): Promise<TagEntity | null> {
    const tag = await this.prismaService.tags.findFirst({ where, include });
    if (!tag) return null;
    return new TagEntity(tag);
  }

  async isExistTag(idTag: number[]): Promise<number[]> {
    const tags: Array<number> = [];
    for (const id of idTag) {
      const tag = await this.prismaService.tags.findUnique({ where: { id } });
      if (tag) tags.push(tag.id);
    }
    return tags;
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
