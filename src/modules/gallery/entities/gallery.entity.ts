import { Files, PhotoGallery } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class GalleryEntity implements PhotoGallery {
  id: number;
  title: string | null;
  description: string | null;
  imageId: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  @Exclude()
  Image?: Files;

  constructor(
    partial: Partial<GalleryEntity>,
    omit?: Array<keyof GalleryEntity>,
  ) {
    omit?.forEach((property) => {
      delete this[property];
    });
    Object.assign(this, partial);
  }

  @Expose({ name: 'image' })
  transformImage() {
    return this.Image?.url;
  }
}
