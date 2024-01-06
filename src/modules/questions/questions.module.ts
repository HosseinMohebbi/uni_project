import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { S3Module } from '../../s3/s3.module';

@Module({
  imports: [PrismaModule, S3Module],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
