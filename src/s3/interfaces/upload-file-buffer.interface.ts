import { ItemBucketMetadata } from 'minio';

export interface UploadFileBufferMinio {
  file: {
    file: Buffer;
    size: number;
    originalName: string;
    ext?: string;
  };
  bucketName: string;
  objectName?: string;
  perObjectName?: string;
  metaData?: ItemBucketMetadata;
}
