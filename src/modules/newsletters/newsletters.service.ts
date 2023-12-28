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
      }),
      this.prismaService.newsletters.count(),
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
