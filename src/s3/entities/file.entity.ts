import { Files } from '@prisma/client';

export class FileEntity implements Files {
  id: number;
  name: string | null;
  description: string | null;
  bucketName: string | null;
  objectName: string | null;
  url: string | null;
  path: string | null;
  extension: string | null;
  size: number | null;
  disk: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<FileEntity>, omit?: Array<keyof FileEntity>) {
    omit?.forEach((property) => {
      delete this[property];
    });
    Object.assign(this, partial);
  }
}
