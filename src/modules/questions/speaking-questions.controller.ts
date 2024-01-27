import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards';
import { QueriesDto, ResponseHandler } from 'libs/common/src';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';
import { SpeakingQuestionAnswerDto } from './dto';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class SpeakingQuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('speaking-questions')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async speakingQuestions(@Query() query: QueriesDto, @Req() req: Request) {
    const { data, total } = await this.questionsService.speakingQuestions(
      req.user['id'],
      { isActive: true },
      query?.pageHandler,
    );
    return ResponseHandler.successArray({
      data,
      wrap: 'speakingQuestions',
      meta: { total, pageSize: query?.pageSize, page: query?.page },
    });
  }

  @Get('speaking-questions/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findOne(@Req() req: Request, @Param('id') id: number) {
    const data = await this.questionsService.findOneSpeakingQuestion(
      req.user['id'],
      id,
    );
    return ResponseHandler.successArray({
      data,
    });
  }

  @Post('/:id/speaking-answer')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('answer', UploadService.multerOptions('audios')),
  )
  async speakingQuestionAnswer(
    @Body() body: SpeakingQuestionAnswerDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'audio/mpeg' }),
        ],
      }),
    )
    answer: Express.Multer.File,
    @Req() req: Request,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    await this.questionsService.speakingQuestionAnswer({
      userId: req.user['id'],
      questionId: id,
      file: answer,
      description: body.description,
    });

    return ResponseHandler.success({
      message: 'Data Was Successfully Recorded',
      httpStatus: HttpStatus.OK,
    });
  }
}
