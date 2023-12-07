import { HttpStatus } from '@nestjs/common';

export interface ResponseErrorInterface {
  message: string;
  httpMessage: string;
  httpStatus?: HttpStatus;
  wrap?: string;
  data?: any;
  options?: object;
}
