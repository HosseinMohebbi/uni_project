import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { UserErrorEnum } from '../../../../libs/common/src/exceptions/enums';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService
        .get('SECRET_ACCESS_TOKEN')
        .replace(/\\n/gm, '\n'),
      // algorithms: ['RS256'],
    });
  }

  async validate(payload: any): Promise<any> {
    const { uid } = payload;
    const user = await this.usersService.findUnique({
      uid,
    });

    if (!user) {
      throw new NotFoundException(UserErrorEnum.USER_NOT_FOUND);
    }

    return {
      ...user,
      ...payload,
    };
  }
}
