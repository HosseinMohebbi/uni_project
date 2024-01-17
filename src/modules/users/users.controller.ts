import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards';
import { ResponseHandler } from '../../../libs/common/src';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getUser(@Req() req: Request) {
    const data = await this.usersService.findOne(
      {
        id: req?.user['id'],
      },
      { Profile: true },
    );
    return ResponseHandler.success({
      wrap: 'user',
      data,
    });
  }

  @Get('/info')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async userInfo(@Req() req: Request) {
    const { user, counterTags } = await this.usersService.userInfo(
      req?.user['id'],
    );
    return ResponseHandler.success({
      data: {
        user,
        counterTags,
      },
    });
  }
}
