import { ApiProperty } from '@nestjs/swagger';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class SpeakingQuestionAnswerDto {
  @ApiProperty({ required: true })
  @IsFile()
  @MaxFileSize(10 * 1024 * 1024)
  @HasMimeType(
    [
      'audio/mpeg',
      'audio/ogg',
      'audio/mp3',
      'audio/m4p',
      'audio/mogg',
      'audio/oga',
      'audio/webm',
    ],
    {
      message: 'only audio file types are allowed',
    },
  )
  answer: MemoryStoredFile;
}
