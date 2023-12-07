import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { AuthErrorEnum } from '../../libs/common/src/exceptions/enums';
import {
  CreateTokenInterface,
  GetTokensInterface,
  ResponseGetTokensInterface,
} from './interfaces';
import { Users } from '@prisma/client';
import { UserEntity } from '../modules/users/entities/user.entity';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getTokens(
    user: Users | UserEntity,
    options?: GetTokensInterface,
  ): Promise<ResponseGetTokensInterface> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAsync({
        uid: user.uid,
        expiresIn:
          options?.tokenExpireAtDay ??
          this.configService.get<string>('EXPIRED_AT_ACCESS_TOKEN'),
        secret: this.configService.get<string>('SECRET_ACCESS_TOKEN'),
      }),
      this.signAsync({
        uid: user.uid,
        expiresIn:
          options?.tokenExpireAtDay ??
          this.configService.get<string>('EXPIRED_AT_REFRESH_TOKEN'),
        secret: this.configService.get<string>('SECRET_REFRESH_TOKEN'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signAsync(data: CreateTokenInterface) {
    const payload = {
      uid: data.uid,
    };

    const options = {
      expiresIn:
        data.expiresIn ??
        this.configService.get<string>('EXPIRED_AT_ACCESS_TOKEN'),
      secret:
        data.secret ?? this.configService.get<string>('SECRET_ACCESS_TOKEN'),
    };
    return this.jwtService.signAsync(payload, options);
  }

  async verifyToken(token: string) {
    try {
      return jwt.verify(token, this.configService.get('SECRET_ACCESS_TOKEN'));
    } catch (err) {
      throw new UnauthorizedException(AuthErrorEnum.AUTHENTICATION_FAILED);
    }
  }

  async verifyRefreshToken(refreshToken: string) {
    try {
      return jwt.verify(
        refreshToken,
        this.configService.get('SECRET_REFRESH_TOKEN'),
      );
    } catch (err) {
      throw new UnauthorizedException(AuthErrorEnum.AUTHENTICATION_FAILED);
    }
  }
  async tokenAuth(payload: string | object | Buffer, expiresIn?: string) {
    expiresIn =
      expiresIn ||
      this.configService.get<string>('EXPIRED_AT_AUTH_TOKEN', '5m');
    return jwt.sign(payload, this.configService.get('SECRET_ACCESS_AUTH'), {
      expiresIn,
    });
  }

  async decodedTokenAuth(token: string) {
    try {
      return jwt.verify(token, this.configService.get('SECRET_ACCESS_AUTH'));
    } catch (err) {
      throw new UnauthorizedException(AuthErrorEnum.AUTHENTICATION_FAILED);
    }
  }
}
