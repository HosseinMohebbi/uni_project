import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { ResponseHandler } from '../../../libs/common/src';
import { I18nService } from 'nestjs-i18n';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly i18n: I18nService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.register(body);
    response.cookie('token', accessToken, { httpOnly: true });
    response.cookie('refresh-token', refreshToken, { httpOnly: true });
    return ResponseHandler.successAuth({
      message: this.i18n.t('messages.admin.auth.login', {
        args: { name: `${user.Profile?.firstName || 'کاربر'}` },
      }),
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.login(body);
    response.cookie('token', accessToken, { httpOnly: true });
    response.cookie('refresh-token', refreshToken, { httpOnly: true });
    return ResponseHandler.successAuth({
      message: this.i18n.t('messages.admin.auth.login', {
        args: { name: `${user.Profile?.firstName || 'کاربر'}` },
      }),
    });
  }
}
