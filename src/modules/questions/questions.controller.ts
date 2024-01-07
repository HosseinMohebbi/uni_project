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
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../auth/guards';
import { QueriesDto, ResponseHandler } from '../../../libs/common/src';
import { Request } from 'express';
import { ListeningQuestionAnswerDto, SpeakingQuestionAnswerDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('listening-questions')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async listeningQuestions(@Query() query: QueriesDto, @Req() req: Request) {
    const { data, total } = await this.questionsService.listeningQuestions(
      req.user['id'],
      { isActive: true },
      query?.pageHandler,
    );
    return ResponseHandler.successArray({
      data,
      wrap: 'listeningQuestions',
      meta: { total, pageSize: query?.pageSize, page: query?.page },
    });
  }

  @Post('/:id/listening-answer')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async listeningQuestionAnswer(
    @Body() body: ListeningQuestionAnswerDto,
    @Req() req: Request,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    await this.questionsService.listeningQuestionAnswer({
      userId: req.user['id'],
      questionId: id,
      answer: body.answer,
    });
    return ResponseHandler.success({
      message: 'Data Was Successfully Recorded',
      httpStatus: HttpStatus.OK,
    });
  }

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

  @Post('/:id/speaking-answer')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('answer'))
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
      answer: answer,
      description: body.description,
    });

    return ResponseHandler.success({
      message: 'Data Was Successfully Recorded',
      httpStatus: HttpStatus.OK,
    });
  }
}
