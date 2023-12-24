import { PrismaClient, Role } from '@prisma/client';
import { Logger } from '@nestjs/common';
import HashPasswordUtil from '../libs/common/src/utilities/hash-password.util';
import { SlugifyHandler } from '../libs/common/src';

const prisma = new PrismaClient();
const logger = new Logger('seeder');

async function newAdmin() {
  const adminInfo = {
    email: 'admin@example.com',
    role: Role.ADMIN,
    password: await HashPasswordUtil.HashPassword('123456789'),
    nickName: 'mr.Admin',
  };
  return prisma.users.upsert({
    where: {
      email: adminInfo.email,
    },
    create: {
      email: adminInfo.email,
      role: adminInfo.role,
      password: adminInfo.password,
      Profile: {
        create: {
          nickName: adminInfo.nickName,
        },
      },
    },
    update: {
      email: adminInfo.email,
      role: adminInfo.role,
      password: adminInfo.password,
      Profile: {
        update: {
          nickName: adminInfo.nickName,
        },
      },
    },
  });
}

async function addTags() {
  const tags = [
    {
      name: 'سیاسی',
      slug: SlugifyHandler.persianSlug('سیاسی'),
    },
    {
      name: 'اقتصادی',
      slug: SlugifyHandler.persianSlug('اقتصادی'),
    },
    {
      name: 'فرهنگی',
      slug: SlugifyHandler.persianSlug('فرهنگی'),
    },
    {
      name: 'ورزشی',
      slug: SlugifyHandler.persianSlug('ورزشی'),
    },
  ];
  for (const tag of tags) {
    const findTag = await prisma.tags.findFirst({
      where: { name: tag.name, slug: tag.slug },
    });
    if (findTag) continue;
    await prisma.tags.createMany({
      data: tags,
    });
  }
}

(async () => {
  try {
    await newAdmin();
    logger.log('* newAdmin successfully!');
  } catch (e) {
    logger.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }

  try {
    await addTags();
    logger.log('* addTags successfully!');
  } catch (e) {
    logger.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
