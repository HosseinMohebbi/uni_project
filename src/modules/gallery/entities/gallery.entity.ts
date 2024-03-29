import { Files, PhotoGallery } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";
import * as path from "path";
import * as process from "process";

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
    omit?: Array<keyof GalleryEntity>
  ) {
    omit?.forEach((property) => {
      delete this[property];
    });
    Object.assign(this, partial);
  }

  @Expose({ name: "image" })
  transformImage() {
    if (this.Image && this.imageId) {
      return path.join(
        `${process.env.HOST_URI}:${process.env.PORT}`,
        this.Image?.url
      ).replaceAll('\\','/').replace(':/','://');
    }
  }
}
