import { Files, ListeningQuestions } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import * as path from 'path';

export class ListeningQuestionsEntity implements ListeningQuestions {
  id: number;
  title: string | null;
  description: string | null;
  audioId: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  @Exclude()
  Audio?: Files;

  constructor(
    partial: Partial<ListeningQuestionsEntity>,
    omit?: Array<keyof ListeningQuestionsEntity>,
  ) {
    omit?.forEach((property) => {
      delete this[property];
    });
    Object.assign(this, partial);
  }

  @Expose({ name: 'audio' })
  transformImage() {
    return path.join(
      `${process.env.HOST_URI}:${process.env.PORT}`,
      this.Audio?.url,
    );
  }
}
