import { Tags } from '@prisma/client';
import { ConvertorUtl } from '../../../../libs/common/src';

export class TagEntity implements Tags {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<TagEntity>, omit?: Array<keyof TagEntity>) {
    omit?.forEach((property) => {
      delete this[property];
    });
    Object.assign(this, ConvertorUtl.JsonBigintString(partial));
  }
}
