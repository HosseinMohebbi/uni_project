import { ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';
import { AuthErrorEnum, UserErrorEnum } from './enums';

export class ErrorHandler {
  constructor(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const object = exception.getResponse();
    const i18n = I18nContext.current(host);

    const json = {
      statusCode: status,
      message: object['message'].toUpperCase(),
      httpMessage: object['message'],
      timestamp: new Date(),
    };

    if (object['message']) {
      json.message = ErrorHandler.UserErrorExceptions(json.message, i18n);
      json.message = ErrorHandler.AuthErrorExceptions(json.message, i18n);
      return response.status(status).json(json);
    }
    return response.status(status).json(json);
  }

  public static UserErrorExceptions(
    message: string,
    i18n: I18nContext<Record<string, unknown>>,
  ) {
    for (const key in UserErrorEnum) {
      if (UserErrorEnum.hasOwnProperty(key) && UserErrorEnum[key] === message) {
        return i18n.t(`exceptions.user.${message}`);
      }
    }
    return message;
  }

  public static AuthErrorExceptions(
    message: string,
    i18n: I18nContext<Record<string, unknown>>,
  ) {
    for (const key in AuthErrorEnum) {
      if (AuthErrorEnum.hasOwnProperty(key) && AuthErrorEnum[key] === message) {
        return i18n.t(`exceptions.auth.${message}`);
      }
    }
    return message;
  }
}
