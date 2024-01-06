import { BucketsNameEnum } from '../enums';

export interface CreateFile {
  file: Express.Multer.File;
  bucketName: BucketsNameEnum;
  objectName?: string;
  perObjectName?: string;
}
