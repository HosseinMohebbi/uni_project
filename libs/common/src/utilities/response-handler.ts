import { PaginationUtil } from './index';
import {
  ResponseAuthInterface,
  ResponseErrorInterface,
  ResponseJsonInterface,
} from './interfaces';
import { HttpStatus } from '@nestjs/common';

export class ResponseHandler {
  private static readonly trueStatus = 'success';
  private static readonly falseStatus = 'error';
  public static successArray(body: ResponseJsonInterface) {
    return {
      status: this.trueStatus,
      httpStatus: body?.httpStatus ?? HttpStatus.OK,
      message: body?.message ?? undefined,
      [body?.wrap ?? 'data']: body?.data ?? undefined,
      meta: body?.meta
        ? PaginationUtil.metaPagination(
            body.meta.total,
            body.meta.page,
            body.meta.pageSize,
          )
        : undefined,
    };
  }

  public static success(body: ResponseJsonInterface) {
    return {
      status: this.trueStatus,
      httpStatus: body?.httpStatus ?? HttpStatus.OK,
      message: body?.message ?? undefined,
      [body?.wrap ?? 'data']: body?.data ?? undefined,
    };
  }

  public static successAuth(body: ResponseAuthInterface) {
    return {
      status: this.trueStatus,
      httpStatus: body?.httpStatus ?? HttpStatus.OK,
      message: body?.message ?? undefined,
      [body?.wrap ?? 'data']: body?.data ?? undefined,
      options: body.options ?? undefined,
      method: body.method ?? undefined,
    };
  }

  public static error(body: ResponseErrorInterface) {
    return {
      status: this.falseStatus,
      httpMessage: body.httpMessage,
      httpStatus: body?.httpStatus ?? HttpStatus.BAD_REQUEST,
      message: body?.message,
      [body?.wrap ?? 'data']: body?.data ?? undefined,
      data: body.data,
      options: body.options,
    };
  }
}
