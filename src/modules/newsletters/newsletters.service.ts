import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DataSetNewsletter } from './interfaces';
import { NewsletterEntity } from './entities/newsletter.entity';
import { TagsService } from '../tags/tags.service';
import { Prisma } from '@prisma/client';
import { Pagination } from '../../../libs/common/src';
import { TagEntity } from '../tags/entities/tag.entity';

@Injectable()
export class NewslettersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tagService: TagsService,
  ) {}

  async findAll(where?: Prisma.NewslettersWhereInput, query?: Pagination) {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.newsletters.findMany({
        where,
        take: query?.pageSize,
        skip: query?.skip ?? 0,
        select: {
          id: true,
          title: true,
        },
      }),
      this.prismaService.newsletters.count({ where }),
    ]);
    return {
      data: data.map((newsletter) => new NewsletterEntity(newsletter)),
      total,
    };
  }

  async getAllNotAnswered(
    userId: number,
    where?: Prisma.NewslettersWhereInput,
    query?: Pagination,
  ) {
    const data: NewsletterEntity[] = [];
    const { data: newsletters, total } = await this.findAll(where, query);

    for (const newsletter of newsletters) {
      const answers =
        await this.prismaService.userNewsletterTagsCounter.findFirst({
          where: {
            userId,
            newsletterId: newsletter.id,
          },
        });

      if (newsletter.id != answers?.newsletterId) {
        data.push(newsletter);
      }
    }

    return { data, total };
  }

  async findOne(userId: number, id: string | number) {
    const newsletter = await this.prismaService.newsletters.findFirst({
      where: { id: Number(id) },
    });
    const answered =
      await this.prismaService.userNewsletterTagsCounter.findFirst({
        where: {
          userId,
          newsletterId: newsletter.id,
        },
      });
    if (!newsletter || answered) {
      throw new NotFoundException('Newsletter Not Found!');
    }
    const { data: tags } = await this.tagService.findAll({
      isActive: true,
    });

    return {
      newsletter: new NewsletterEntity(newsletter),
      tags: tags.map((tag) => new TagEntity(tag)),
    };
  }

  async dataSet(data: DataSetNewsletter) {
    const tags: number[] = await this.tagService.isExistTag(data.tagIds);
    const newsletter = await this.prismaService.newsletters.findFirst({
      where: { id: data.newsletterId },
    });
    if (!newsletter) throw new NotFoundException('Newsletter Not Found!');
    const isExist =
      await this.prismaService.userNewsletterTagsCounter.findFirst({
        where: {
          newsletterId: newsletter.id,
          userId: data.userId,
        },
      });
    if (isExist) {
      throw new BadRequestException('the data has already been recorded');
    }
    for (const tag of tags) {
      await this.prismaService.userNewsletterTagsCounter.create({
        data: {
          newsletterId: newsletter.id,
          tagId: tag,
          userId: data.userId,
        },
      });
    }
    return true;
  }
}
