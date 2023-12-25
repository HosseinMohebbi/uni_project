import { Newsletters } from '@prisma/client';

export class NewsletterEntity implements Newsletters {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    partial: Partial<NewsletterEntity>,
    omit?: Array<keyof NewsletterEntity>,
  ) {
    omit?.forEach((property) => {
      delete this[property];
    });
    Object.assign(this, partial);
  }
}
