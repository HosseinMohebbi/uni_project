import { Controller, Get, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { QueriesDto, ResponseHandler } from '../../../libs/common/src';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('')
  async findMany(@Query() query: QueriesDto) {
    const { data, total } = await this.tagsService.findAll(
      {
        isActive: true,
      },
      undefined,
      query.pageHandler,
    );
    return ResponseHandler.successArray({
      data,
      wrap: 'tags',
      meta: { total, pageSize: query?.pageSize, page: query?.page },
    });
  }
}
