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
export class ListeningQuestionsController {
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

  @Get('listening-questions/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async findOne(@Req() req: Request, @Param('id') id: number) {
    const data = await this.questionsService.findOneListeningQuestion(
      req.user['id'],
      id,
    );
    return ResponseHandler.successArray({
      data,
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
