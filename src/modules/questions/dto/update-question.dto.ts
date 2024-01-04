import { PartialType } from '@nestjs/swagger';
import { ListeningQuestionAnswerDto } from './listening-question-answer.dto';

export class UpdateQuestionDto extends PartialType(
  ListeningQuestionAnswerDto,
) {}
