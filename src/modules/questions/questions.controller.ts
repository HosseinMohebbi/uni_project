import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../auth/guards';
import { QueriesDto, ResponseHandler } from '../../../libs/common/src';
import { Request } from 'express';
import { ListeningQuestionAnswerDto } from './dto';

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
}
