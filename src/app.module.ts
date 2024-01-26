import { Module } from '@nestjs/common';
import { TranslationModule } from './i18n/translation.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../libs/common/src/exceptions/HttpExceptionFilter';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '../libs/common/src';
import { TokenModule } from './jwt/token.module';
import { ModulesModule } from './modules/modules.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';

@Module({
  imports: [
    ModulesModule,
    TokenModule,
    ConfigModule,
    TranslationModule,
    PrismaModule,
    MulterModule.register({
      dest: 'public/uploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: 'public/uploads',
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
