import { HttpStatus } from '@nestjs/common';

export interface ResponseAuthInterface {
  message?: string;
  wrap?: string;
  data?: any;
  httpStatus?: HttpStatus;
  options?: object;
  method?:
    | 'register'
    | 'login'
    | 'verifyPhone'
    | 'logout'
    | 'verifyEmail'
    | 'changePhoneNumber';
}
