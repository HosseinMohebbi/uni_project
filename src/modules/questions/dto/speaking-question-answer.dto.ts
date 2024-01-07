import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SpeakingQuestionAnswerDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
