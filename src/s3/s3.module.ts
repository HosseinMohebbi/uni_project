import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    NestjsFormDataModule.config({
      isGlobal: true,
      storage: MemoryStoredFile,
    }),
    MinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          endPoint: config.get('MINIO_ENDPOINT'),
          port: parseInt(config.get('MINIO_PORT')),
          useSSL: false,
          accessKey: config.get('MINIO_ACCESS_KEY'),
          secretKey: config.get('MINIO_SECRET_KEY'),
        };
      },
    }),
  ],
  controllers: [],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
