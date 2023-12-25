import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service';
import { ResponseHandler } from '../../../libs/common/src';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('')
  async findMany() {
    const data = await this.tagsService.findAll({
      isActive: true,
    });
    return ResponseHandler.successArray({
      data,
      wrap: 'tags',
    });
  }
}
