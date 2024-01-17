import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUser, UpdateUser } from './interfaces';
import { UserEntity } from './entities/user.entity';
import { Prisma } from '@prisma/client';
import { UserErrorEnum } from '../../../libs/common/src/exceptions/enums';

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
        password: data.password,
        Profile: {
          create: {
            nickName: data.nickName,
          },
        },
      },
      include,
    });
    return new UserEntity(user);
  }

  async findUnique(
    where?: Prisma.UsersWhereUniqueInput,
    include?: Prisma.UsersInclude,
  ) {
    const user = await this.prisma.users.findUnique({ where, include });
    if (!user) return null;
    return user;
  }

  async findOne(
    where?: Prisma.UsersWhereInput,
    include?: Prisma.UsersInclude,
  ): Promise<UserEntity | null> {
    const user = await this.prisma.users.findFirst({ where, include });
    if (!user) return null;
    return new UserEntity(user);
  }

  async counterTags(userId: number) {
    const tags = await this.prisma.tags.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
      },
    });
    const counterTag = [];
    let counterNumber = 0;
    for (const tag of tags) {
      const findTagNewsletter =
        await this.prisma.userNewsletterTagsCounter.findFirst({
          where: {
            userId,
            tagId: tag.id,
          },
        });
      if (findTagNewsletter) {
        counterNumber++;
      }
      const findTagGallery = await this.prisma.userGalleryTagsCounter.findFirst(
        {
          where: {
            userId,
            tagId: tag.id,
          },
        },
      );
      if (findTagGallery) {
        counterNumber++;
      }
      counterTag.push({
        ...tag,
        count: counterNumber,
      });
      counterNumber = 0;
    }
    return counterTag;
  }

  async userInfo(userId: number) {
    const user = await this.findOne(
      {
        id: userId,
      },
      { Profile: true },
    );
    if (!user) throw new NotFoundException(UserErrorEnum.USER_NOT_FOUND);
    const counterTags = await this.counterTags(userId);
    return {
      user,
      counterTags,
    };
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
