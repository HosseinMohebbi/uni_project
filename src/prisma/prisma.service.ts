import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import HashPasswordUtil from '../../libs/common/src/utilities/hash-password.util';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();

    // hash password user
    this.$use(async (params, next) => {
      if (
        (params.action == 'create' || params.action == 'update') &&
        params.model == 'Users'
      ) {
        const user = params.args?.data;
        if (!user?.password) return next(params);
        user.password = await HashPasswordUtil.HashPassword(user.password);
        params.args.data = user;
      }
      return next(params);
    });
  }
}
