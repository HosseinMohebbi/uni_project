import { PrismaClient, RoleEnum } from '@prisma/client';
import { Logger } from '@nestjs/common';
import HashPasswordUtil from '../libs/common/src/utilities/hash-password.util';
import { SlugifyHandler } from '../libs/common/src';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

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

async function uploadImage() {
  const imagesPath: string = path.join(__dirname, '/..', '/public/images');
  const savePath = `${process.env.UPLOAD_FULL_PATH}/${process.env.IMAGES_UPLOAD_PATH}`;

  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath, { recursive: true });
  }

  const infoPhotos = [
    {
      title: 'جمعیت',
      description:
        'اگر شما یک طراح هستین و یا با طراحی های گرافیکی سروکار دارید به متن های برخورده اید که با نام لورم ایپسوم شناخته می‌شوند.',
    },
    {
      title: 'تکنولوژی',
      description:
        'اگر شما یک طراح هستین و یا با طراحی های گرافیکی سروکار دارید به متن های برخورده اید که با نام لورم ایپسوم شناخته می‌شوند.',
    },
    {
      title: 'طبیعت',
      description:
        'اگر شما یک طراح هستین و یا با طراحی های گرافیکی سروکار دارید به متن های برخورده اید که با نام لورم ایپسوم شناخته می‌شوند.',
    },
    {
      title: 'برگ درختان آمازون',
      description:
        'اگر شما یک طراح هستین و یا با طراحی های گرافیکی سروکار دارید به متن های برخورده اید که با نام لورم ایپسوم شناخته می‌شوند.',
    },
    {
      title: 'ریل قطار قدیمی',
      description:
        'اگر شما یک طراح هستین و یا با طراحی های گرافیکی سروکار دارید به متن های برخورده اید که با نام لورم ایپسوم شناخته می‌شوند.',
    },
    {
      title: 'یک خانه زیبا در طبیعت',
      description:
        'اگر شما یک طراح هستین و یا با طراحی های گرافیکی سروکار دارید به متن های برخورده اید که با نام لورم ایپسوم شناخته می‌شوند.',
    },
    {
      title: 'پرنده دریایی',
      description:
        'اگر شما یک طراح هستین و یا با طراحی های گرافیکی سروکار دارید به متن های برخورده اید که با نام لورم ایپسوم شناخته می‌شوند.',
    },
    {
      title: 'کارخانه مواد نفتی',
      description:
        'اگر شما یک طراح هستین و یا با طراحی های گرافیکی سروکار دارید به متن های برخورده اید که با نام لورم ایپسوم شناخته می‌شوند.',
    },
    {
      title: 'شهر شلوغ',
      description:
        'اگر شما یک طراح هستین و یا با طراحی های گرافیکی سروکار دارید به متن های برخورده اید که با نام لورم ایپسوم شناخته می‌شوند.',
    },
    {
      title: 'کشور آمریکا',
      description:
        'اگر شما یک طراح هستین و یا با طراحی های گرافیکی سروکار دارید به متن های برخورده اید که با نام لورم ایپسوم شناخته می‌شوند.',
    },
  ];

  try {
    const files: string[] = fs.readdirSync(imagesPath);
    for (const [index, filename] of files.entries()) {
      const sourcePath: string = path.join(imagesPath, filename);
      const fileExtension: string = path.extname(filename);
      const fileSize: number = fs.statSync(sourcePath).size;
      const newFilename: string = `${Math.floor(
        Math.random() * 1000 * 1000,
      )}${fileExtension}`;
      const isExist = await prisma.photoGallery.findFirst({
        where: {
          title: infoPhotos[index].title,
          description: infoPhotos[index].description,
        },
      });
      if (isExist) continue;
      const destinationPath = path.join(savePath, `${newFilename}`);
      fs.copyFileSync(sourcePath, destinationPath);
      const url = `${process.env.UPLOAD_PATH}/${process.env.IMAGES_UPLOAD_PATH}/${newFilename}`;
      const file = await prisma.files.create({
        data: {
          name: newFilename,
          path: path.join(
            process.env.UPLOAD_FULL_PATH,
            process.env.IMAGES_UPLOAD_PATH,
            newFilename,
          ),
          url,
          size: fileSize,
          extension: fileExtension,
        },
      });
      await prisma.photoGallery.create({
        data: {
          imageId: file.id,
          title: infoPhotos[index].title,
          description: infoPhotos[index].description,
        },
      });
      logger.warn(`File "${filename}" successfully copied to "Minio" ${url}.`);
    }
  } catch (e) {
    logger.error(e);
  }
}

async function uploadAudio() {
  const audiosPath: string = __dirname + '/..' + '/public/audios';
  const savePath = `${process.env.UPLOAD_FULL_PATH}/${process.env.AUDIOS_UPLOAD_PATH}`;

  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath, { recursive: true });
  }

  const questionInfo = [
    {
      title: 'سوال اول',
      description: 'توضیحات سوال اول ',
    },
    {
      title: 'سوال دوم',
      description: 'توضیحات سوال دوم ',
    },
    {
      title: 'سوال سوم',
      description: 'توضیحات سوال سوم ',
    },
  ];

  try {
    const files: string[] = fs.readdirSync(audiosPath);
    for (const [index, filename] of files.entries()) {
      const sourcePath: string = path.join(audiosPath, filename);
      const fileExtension: string = path.extname(filename);
      const fileSize: number = fs.statSync(sourcePath).size;
      const newFilename: string = `${Math.floor(
        Math.random() * 1000 * 1000,
      )}${fileExtension}`;
      const isExist = await prisma.listeningQuestions.findFirst({
        where: {
          title: questionInfo[index].title,
          description: questionInfo[index].description,
        },
      });
      if (isExist) continue;
      const destinationPath = path.join(savePath, `${newFilename}`);
      fs.copyFileSync(sourcePath, destinationPath);
      const url = `${process.env.UPLOAD_PATH}/${process.env.AUDIOS_UPLOAD_PATH}/${newFilename}`;
      const file = await prisma.files.create({
        data: {
          name: newFilename,
          path: path.join(
            process.env.UPLOAD_FULL_PATH,
            process.env.AUDIOS_UPLOAD_PATH,
            newFilename,
          ),
          url,
          size: fileSize,
          extension: fileExtension,
        },
      });

      await prisma.listeningQuestions.create({
        data: {
          audioId: file.id,
          title: questionInfo[index].title,
          description: questionInfo[index].description,
        },
      });
      logger.warn(`File "${filename}" successfully copied to "Minio" ${url}.`);
    }
  } catch (e) {
    logger.error(e);
  }
}

async function addQuestionsSpeaking() {
  const questions = [
    {
      question:
        'متن زیر را با بیان ساده بخوانید و فایل ضبط شده آن را ارسال کنید.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      question:
        'متن زیر را با بیان ساده بخوانید و فایل ضبط شده آن را ارسال کنید.',
      description:
        'Sem et tortor consequat id porta nibh venenatis cras sed. Nulla facilisi etiam dignissim diam quis. Accumsan in nisl nisi scelerisque eu ultrices vitae auctor eu. Ornare lectus sit amet est placerat in egestas erat. Turpis egestas sed tempus urna et pharetra pharetra massa massa. Ac turpis egestas maecenas pharetra convallis posuere morbi leo urna. Metus aliquam eleifend mi in nulla posuere. Diam in arcu cursus euismod. Non quam lacus suspendisse faucibus interdum posuere lorem ipsum dolor. Eget velit aliquet sagittis id consectetur purus ut faucibus. Risus ultricies tristique nulla aliquet enim. Habitasse platea dictumst vestibulum rhoncus. Vestibulum sed arcu non odio euismod lacinia at quis risus. Aliquam sem et tortor consequat id. Neque laoreet suspendisse interdum consectetur libero id faucibus. Donec adipiscing tristique risus nec feugiat in fermentum. Quis varius quam quisque id diam vel quam elementum.',
    },
    {
      question:
        'متن زیر را با بیان ساده بخوانید و فایل ضبط شده آن را ارسال کنید.',
      description:
        'Nisl tincidunt eget nullam non nisi. Faucibus scelerisque eleifend donec pretium vulputate sapien nec sagittis aliquam. Egestas purus viverra accumsan in nisl nisi scelerisque. Id venenatis a condimentum vitae. Porttitor eget dolor morbi non arcu risus. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus et netus. Eu feugiat pretium nibh ipsum consequat nisl. Sit amet consectetur adipiscing elit ut aliquam purus sit. Dolor magna eget est lorem ipsum dolor sit amet. In aliquam sem fringilla ut morbi. Nulla posuere sollicitudin aliquam ultrices. Eu nisl nunc mi ipsum. Euismod elementum nisi quis eleifend. Habitant morbi tristique senectus et netus et malesuada fames.',
    },
    {
      question:
        'متن زیر را با بیان ساده بخوانید و فایل ضبط شده آن را ارسال کنید.',
      description:
        'Blandit libero volutpat sed cras ornare arcu dui vivamus arcu. Eu consequat ac felis donec et odio pellentesque. Quam pellentesque nec nam aliquam sem et tortor consequat id. Nibh tortor id aliquet lectus proin. Augue ut lectus arcu bibendum at. Accumsan tortor posuere ac ut consequat semper. Euismod lacinia at quis risus sed. Ac tortor dignissim convallis aenean. Orci eu lobortis elementum nibh. Ut consequat semper viverra nam libero justo laoreet. Risus commodo viverra maecenas accumsan lacus vel facilisis. Amet nulla facilisi morbi tempus iaculis urna id volutpat. Maecenas pharetra convallis posuere morbi leo urna molestie at. Nulla aliquet porttitor lacus luctus accumsan tortor. Sit amet purus gravida quis blandit turpis cursus in hac. Ullamcorper morbi tincidunt ornare massa eget egestas purus viverra.',
    },
    {
      question:
        'متن زیر را با بیان ساده بخوانید و فایل ضبط شده آن را ارسال کنید.',
      description:
        'Mi sit amet mauris commodo quis imperdiet massa. Enim lobortis scelerisque fermentum dui faucibus in ornare. Enim sit amet venenatis urna cursus. Dolor magna eget est lorem ipsum dolor sit amet consectetur. Congue eu consequat ac felis donec et odio. Orci ac auctor augue mauris augue neque. Sit amet dictum sit amet justo donec. Ut sem viverra aliquet eget sit amet tellus. Pellentesque sit amet porttitor eget dolor morbi non arcu risus. Nibh cras pulvinar mattis nunc sed blandit libero volutpat sed. Pellentesque diam volutpat commodo sed egestas egestas. Faucibus ornare suspendisse sed nisi lacus sed viverra. Neque egestas congue quisque egestas diam in arcu cursus.',
    },
  ];

  for (const question of questions) {
    const isExist = await prisma.speakingQuestions.findFirst({
      where: {
        question: question.question,
        description: question.description,
      },
    });
    if (isExist) continue;
    await prisma.speakingQuestions.create({
      data: {
        question: question.question,
        description: question.description,
      },
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

  try {
    await uploadImage();
    logger.log('* uploadImage successfully!');
  } catch (e) {
    logger.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }

  try {
    await uploadAudio();
    logger.log('* uploadAudio successfully!');
  } catch (e) {
    logger.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }

  try {
    await addQuestionsSpeaking();
    logger.log('* addQuestionsSpeaking successfully!');
  } catch (e) {
    logger.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
