import { Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { PrismaService } from '../prisma/prisma.service';
import { MakeBucketOpt } from 'minio';
import {
  CreateFile,
  ResponseUploadFileBuffer,
  UploadFileBufferMinio,
} from './interfaces';
import RandomHandler from '../../libs/common/src/utilities/random-handler';
import { FileEntity } from './entities/file.entity';

@Injectable()
export class S3Service {
  constructor(
    private prismaService: PrismaService,
    private readonly minioService: MinioService,
  ) {}

  async create(data: CreateFile): Promise<FileEntity> {
    if (!(await this.bucketExists(data.bucketName))) {
      await this.makeBucket(data.bucketName);
    }

    const { url, bucketName, objectName } = await this.uploadFileBuffer({
      bucketName: data.bucketName,
      file: {
        originalName: data.file.originalname,
        file: data.file.buffer,
        size: data.file.size,
      },
      objectName: data.objectName,
    });

    const file = await this.prismaService.files.create({
      data: {
        bucketName: bucketName,
        objectName: objectName,
        url: url,
      },
    });

    return new FileEntity(file);
  }

  private async uploadFileBuffer({
    bucketName,
    file,
    metaData,
    objectName,
  }: UploadFileBufferMinio): Promise<ResponseUploadFileBuffer> {
    const extname = file.originalName.substring(
      file.originalName.lastIndexOf('.'),
      file.originalName.length,
    );

    const randomName = RandomHandler.UniqRandomString(10, true);
    objectName =
      (objectName
        ? `${objectName}_${randomName}`
        : `${bucketName}_${randomName}`) + extname;

    const fileBuffer: Buffer = file.file;

    if (!metaData) {
      metaData = {
        'Content-Type': 'application/octet-stream',
        'x-amz-expiration': new Date('2900-01-01').toUTCString(),
      };
    }

    await this.minioService.client.putObject(
      bucketName,
      objectName,
      fileBuffer,
      metaData,
    );

    const url = await this.getLinkFile(bucketName, objectName);

    return {
      bucketName,
      objectName,
      url,
    };
  }

  private async getLinkFile(
    bucketName: string,
    objectName: string,
  ): Promise<string> {
    return this.minioService.client.presignedGetObject(bucketName, objectName);
  }
  private async bucketExists(bucketName: string): Promise<boolean> {
    return this.minioService.client.bucketExists(bucketName);
  }
  private async makeBucket(
    bucketName: string,
    region?: string,
    makeOpts?: MakeBucketOpt,
  ) {
    bucketName = bucketName.toLowerCase();
    return this.minioService.client.makeBucket(
      bucketName,
      region || 'us-east-1',
      makeOpts,
    );
  }
}
