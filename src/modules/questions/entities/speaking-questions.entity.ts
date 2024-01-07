import { SpeakingQuestions } from '@prisma/client';

export class SpeakingQuestionsEntity implements SpeakingQuestions {
  id: number;
  question: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    partial: Partial<SpeakingQuestionsEntity>,
    omit?: Array<keyof SpeakingQuestionsEntity>,
  ) {
    omit?.forEach((property) => {
      delete this[property];
    });
    Object.assign(this, partial);
  }
}
