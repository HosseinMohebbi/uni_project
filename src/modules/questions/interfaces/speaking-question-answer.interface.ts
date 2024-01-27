export interface SpeakingQuestionAnswer {
  userId: number;
  questionId: number;
  file: Express.Multer.File;
  description?: string;
}
