import { PrismaClient, RoleEnum } from '@prisma/client';
import { Logger } from '@nestjs/common';
import HashPasswordUtil from '../libs/common/src/utilities/hash-password.util';
import { SlugifyHandler } from '../libs/common/src';
import * as fs from 'fs';
import * as path from 'path';
import Minio, { ItemBucketMetadata } from 'minio';
import * as process from 'process';

const prisma = new PrismaClient();
const logger = new Logger('seeder');

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: Number(process.env.MINIO_PORT),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

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
    {
      name: 'تکنولوژی',
      slug: SlugifyHandler.persianSlug('تکنولوژی'),
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

async function minioFunction(
  bucketName: string,
  objectName: string,
  file: string,
) {
  bucketName = bucketName.toLowerCase();
  const bucketExists = await minioClient.bucketExists(bucketName);
  if (!bucketExists) {
    await minioClient.makeBucket(bucketName, 'us-east-1');
  }
  const metaData: ItemBucketMetadata = {
    'Content-Type': 'application/octet-stream',
    'x-amz-expiration': new Date('2300-01-01').toUTCString(),
  };

  await minioClient.fPutObject(bucketName, objectName, file, metaData);
}

async function uploadImage() {
  const imagesPath: string = __dirname + '/..' + '/public/images';
  const uploadPathName: string = '/public/uploads';
  const uploadPath: string = __dirname + '/..' + uploadPathName;
  const bucketName: string = 'gallery';

  try {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    const files: string[] = fs.readdirSync(imagesPath);
    for (const filename of files) {
      const sourcePath: string = path.join(imagesPath, filename);
      const fileExtension: string = path.extname(filename);
      const fileSize: number = fs.statSync(sourcePath).size;
      const newFilename: string = `${Math.floor(
        Math.random() * 1000 * 1000,
      )}${fileExtension}`;
      const destinationPath: string = path.join(uploadPath, newFilename);

      const readStream: fs.ReadStream = fs.createReadStream(sourcePath);
      const writeStream: fs.WriteStream = fs.createWriteStream(destinationPath);
      readStream.pipe(writeStream);

      await minioFunction(bucketName);

      const file = await prisma.files.create({
        data: {
          name: newFilename.replace(fileExtension, ''),
          path: uploadPathName,
          url: destinationPath,
          size: fileSize,
          extension: fileExtension,
        },
      });

      await prisma.photoGallery.create({
        data: {
          imageId: file.id,
          title: newFilename.replace(fileExtension, ''),
        },
      });

      logger.warn(
        `File "${filename}" successfully copied to "${uploadPath}" ${destinationPath}.`,
      );
    }
  } catch (e) {
    logger.error(e);
  }
}

(async () => {
  // try {
  //   await newAdmin();
  //   logger.log('* newAdmin successfully!');
  // } catch (e) {
  //   logger.error(e);
  //   process.exit(1);
  // } finally {
  //   await prisma.$disconnect();
  // }
  //
  // try {
  //   await addTags();
  //   logger.log('* addTags successfully!');
  // } catch (e) {
  //   logger.error(e);
  //   process.exit(1);
  // } finally {
  //   await prisma.$disconnect();
  // }
  //
  // try {
  //   await addNewsletter();
  //   logger.log('* addNewsletter successfully!');
  // } catch (e) {
  //   logger.error(e);
  //   process.exit(1);
  // } finally {
  //   await prisma.$disconnect();
  // }

  try {
    await uploadImage();
    logger.log('* uploadImage successfully!');
  } catch (e) {
    logger.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
