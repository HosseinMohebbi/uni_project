import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Login, Register } from './interfaces';
import { UserErrorEnum } from '../../../libs/common/src/exceptions/enums';
import { TokenService } from '../../jwt/token.service';
import HashPasswordUtil from '../../../libs/common/src/utilities/hash-password.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async register(data: Register) {
    let user = await this.usersService.findOne({
      OR: [{ email: data.email }],
    });
    if (user) {
      throw new BadRequestException(UserErrorEnum.ALREADY_REGISTERED_USER);
    }
    user = await this.usersService.create(data, { Profile: true });
    await this.usersService.update(user.id, { lastLogin: new Date() });
    const { accessToken, refreshToken } =
      await this.tokenService.getTokens(user);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async login(data: Login) {
    const user = await this.usersService.findOne(
      { email: data.email },
      { Profile: true },
    );
    if (!user) {
      throw new NotFoundException(UserErrorEnum.USER_NOT_FOUND);
    }
    if (
      !(await HashPasswordUtil.VerifyPassword(data.password, user.password))
    ) {
      throw new NotFoundException(UserErrorEnum.USER_NOT_FOUND);
    }
    await this.usersService.update(user.id, { lastLogin: new Date() });
    const { accessToken, refreshToken } =
      await this.tokenService.getTokens(user);
    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
