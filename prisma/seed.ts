import { PrismaClient, RoleEnum } from '@prisma/client';
import { Logger } from '@nestjs/common';
import HashPasswordUtil from '../libs/common/src/utilities/hash-password.util';
import { SlugifyHandler } from '../libs/common/src';

const prisma = new PrismaClient();
const logger = new Logger('seeder');

async function newAdmin() {
  const adminInfo = {
    email: 'admin@example.com',
    role: RoleEnum.ADMIN,
    password: await HashPasswordUtil.HashPassword('123456789'),
    nickName: 'mr.Admin',
    emailVerifiedAt: new Date(),
  };
  return prisma.users.upsert({
    where: {
      email: adminInfo.email,
    },
    create: {
      email: adminInfo.email,
      role: adminInfo.role,
      password: adminInfo.password,
      emailVerifiedAt: adminInfo.emailVerifiedAt,
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
      emailVerifiedAt: adminInfo.emailVerifiedAt,
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
    {
      name: 'پزشکی',
      slug: SlugifyHandler.persianSlug('پزشکی'),
    },
    {
      name: 'سینما',
      slug: SlugifyHandler.persianSlug('سینما'),
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

async function addNewsletter() {
  const newsletters = [
    {
      title: 'کشف جدیدی در علم نانوتکنولوژی',
      description:
        'تحقیقات جدید نشان می‌دهد که مواد نانوآلیاژهای جدید می‌توانند کارآمدترین روش در تولید انرژی پاک باشند.',
    },
    {
      title: 'پیشرفت‌های جدید در درمان سرطان',
      description:
        'تیم پژوهشی موفق به توسعه روش درمانی نوین برای سرطانهای خاصی شده که باعث افزایش بازماندگی بیماران می‌شود.',
    },
    {
      title: 'راهکارهای جدید برای مقابله با تغییرات اقلیمی',
      description:
        'محققان اعلام کرده‌اند که استفاده از فناوری‌های جدید می‌تواند در مقابله با تاثیرات منفی تغییرات اقلیمی موثر باشد.',
    },
    {
      title: 'راه اندازی مرکز فضایی جدید',
      description:
        'در یک قدم مهم، کشوری توانسته است مرکز فضایی جدید خود را با موفقیت راه اندازی کند و به فعالیت‌های فضایی جهانی ملحق شود.',
    },
    {
      title: 'تازه‌ترین پیشرفت در حوزه هوش مصنوعی',
      description:
        'پژوهشگران موفق به ابداع الگوریتم جدیدی شده‌اند که در بهبود عملکرد سیستم‌های هوش مصنوعی بسیار موثر است.',
    },
    {
      title: 'افتتاح نمایشگاه هنری منحصر به فرد',
      description:
        'نمایشگاه هنری جدید به افتتاح رسیده است که آثار هنرمندان معاصر را به نمایش می‌گذارد و با استقبال عمومی روبرو شده است.',
    },
  ];
  for (const newsletter of newsletters) {
    const findNewsletter = await prisma.newsletters.findFirst({
      where: { title: newsletter.title },
    });
    if (findNewsletter) continue;
    await prisma.newsletters.createMany({
      data: newsletters,
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

  try {
    await addNewsletter();
    logger.log('* addNewsletter successfully!');
  } catch (e) {
    logger.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
