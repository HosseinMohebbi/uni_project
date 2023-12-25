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
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class NewslettersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tagService: TagsService,
  ) {}

  async findAll(
    where?: Prisma.NewslettersWhereInput,
    include?: Prisma.NewslettersInclude<DefaultArgs>,
  ): Promise<NewsletterEntity[]> {
    const newsletters = await this.prismaService.newsletters.findMany({
      where,
      include,
    });
    return newsletters.map((newsletter) => new NewsletterEntity(newsletter));
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
