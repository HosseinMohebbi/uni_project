import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUser, UpdateUser } from './interfaces';
import { UserEntity } from './entities/user.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateUser,
    include?: Prisma.UsersInclude,
  ): Promise<UserEntity> {
    const user = await this.prisma.users.create({
      data: {
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        Profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
        },
      },
      include,
    });
    return new UserEntity(user);
  }

  async findOne(
    where?: Prisma.UsersWhereInput,
    include?: Prisma.UsersInclude,
  ): Promise<UserEntity | null> {
    const user = await this.prisma.users.findFirst({ where, include });
    if (!user) return null;
    return new UserEntity(user);
  }

  async update(id: number, data: UpdateUser) {
    const user = await this.prisma.users.update({
      where: {
        id,
      },
      data,
    });
    return new UserEntity(user);
  }

  async delete(id: number) {
    return this.prisma.users.delete({ where: { id } });
  }
}
