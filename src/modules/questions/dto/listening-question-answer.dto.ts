import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ListeningQuestionAnswerDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  answer: string;
}
