import { Module } from '@nestjs/common';
import { TranslationModule } from './i18n/translation.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../libs/common/src/exceptions/HttpExceptionFilter';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '../libs/common/src';
import { TokenModule } from './jwt/token.module';
import { ModulesModule } from './modules/modules.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    ModulesModule,
    TokenModule,
    ConfigModule,
    TranslationModule,
    PrismaModule,
    S3Module,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
