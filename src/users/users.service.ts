import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUser, UpdateUser } from './interfaces';
import { UserEntity } from './entities/user.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUser): Promise<UserEntity> {
    const user = await this.prisma.users.create({
      data,
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

  async findAll(
    where?: Prisma.UsersWhereInput,
    include?: Prisma.UsersInclude,
  ): Promise<UserEntity[]> {
    return this.prisma.users.findMany({ where, include });
  }

  async update(id: number, data: UpdateUser) {
    const findUser = await this.findOne({ id });
    if (!findUser) return;
    const user = await this.prisma.users.update({
      where: {
        id,
      },
      data,
    });
    return new UserEntity(user);
  }

  async delete(id: number) {
    const user = await this.findOne({ id });
    if (!user) return;
    return this.prisma.users.delete({ where: { id } });
  }
}
