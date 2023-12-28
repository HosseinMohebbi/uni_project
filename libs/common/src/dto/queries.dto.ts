import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationUtil } from '../utilities';

export class QueriesDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number = 10;

  get pageHandler(): { page: number; pageSize: number; skip: number } {
    return PaginationUtil.paginateHandler(this.page, this.pageSize);
  }
}
