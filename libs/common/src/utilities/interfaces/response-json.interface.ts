import { HttpStatus } from '@nestjs/common';

interface meta {
  total: number;
  page: number;
  pageSize: number;
}

export interface ResponseJsonInterface {
  message?: string;
  wrap?: string;
  data?: any;
  httpStatus?: HttpStatus;
  meta?: meta;
}
