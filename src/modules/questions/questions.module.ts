import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { ListeningQuestionsController } from './listening-questions.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { SpeakingQuestionsController } from './speaking-questions.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ListeningQuestionsController, SpeakingQuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
