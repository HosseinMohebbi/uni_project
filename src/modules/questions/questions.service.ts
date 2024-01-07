import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Pagination } from '../../../libs/common/src';
import { ListeningQuestionsEntity, SpeakingQuestionsEntity } from './entities';
import { ListeningQuestionAnswer, SpeakingQuestionAnswer } from './interfaces';
import { S3Service } from '../../s3/s3.service';
import { BucketsNameEnum } from '../../s3/enums';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: S3Service,
  ) {}
  async listeningQuestionsFindAll(
    where?: Prisma.ListeningQuestionsWhereInput,
    query?: Pagination,
  ) {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.listeningQuestions.findMany({
        include: {
          Audio: true,
        },
        where,
        take: query?.pageSize,
        skip: query?.skip ?? 0,
      }),
      this.prismaService.listeningQuestions.count({ where }),
    ]);
    return {
      data: data.map((question) => new ListeningQuestionsEntity(question)),
      total,
    };
  }

  async listeningQuestions(
    userId: number,
    where?: Prisma.ListeningQuestionsWhereInput,
    query?: Pagination,
  ) {
    const data: ListeningQuestionsEntity[] = [];
    const { data: questions, total } = await this.listeningQuestionsFindAll(
      where,
      query,
    );
    for (const question of questions) {
      const answer = await this.prismaService.listeningAnswers.findFirst({
        where: {
          userId,
          questionId: question.id,
        },
      });
      if (question.id != answer?.questionId) {
        data.push(question);
      }
    }

    return { data, total };
  }

  async speakingQuestionsFindAll(
    where?: Prisma.SpeakingQuestionsWhereInput,
    query?: Pagination,
  ) {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.speakingQuestions.findMany({
        where,
        take: query?.pageSize,
        skip: query?.skip ?? 0,
      }),
      this.prismaService.speakingQuestions.count({ where }),
    ]);
    return {
      data: data.map((question) => new SpeakingQuestionsEntity(question)),
      total,
    };
  }

  async speakingQuestions(
    userId: number,
    where?: Prisma.SpeakingQuestionsWhereInput,
    query?: Pagination,
  ) {
    const data: SpeakingQuestionsEntity[] = [];
    const { data: questions, total } = await this.speakingQuestionsFindAll(
      where,
      query,
    );
    for (const question of questions) {
      const answer = await this.prismaService.speakingAnswers.findFirst({
        where: {
          userId,
          questionId: question.id,
        },
      });
      if (question.id != answer?.questionId) {
        data.push(question);
      }
    }

    return { data, total };
  }

  async listeningQuestionAnswer(data: ListeningQuestionAnswer) {
    const findQuestion = await this.prismaService.listeningQuestions.findFirst({
      where: {
        id: data.questionId,
      },
    });
    if (!findQuestion) {
      throw new BadRequestException('This question does not exist');
    }
    const findAnswer = await this.prismaService.listeningAnswers.findFirst({
      where: {
        userId: data.userId,
        questionId: data.questionId,
      },
    });
    if (findAnswer) {
      throw new BadRequestException('This question has already been answered');
    }
    await this.prismaService.listeningAnswers.create({
      data: {
        userId: data.userId,
        questionId: data.questionId,
        answer: data.answer,
      },
    });
    return true;
  }

  async speakingQuestionAnswer(data: SpeakingQuestionAnswer) {
    const findQuestion = await this.prismaService.speakingQuestions.findFirst({
      where: {
        id: data.questionId,
      },
    });
    if (!findQuestion) {
      throw new BadRequestException('This question does not exist');
    }
    const findAnswer = await this.prismaService.speakingAnswers.findFirst({
      where: {
        userId: data.userId,
        questionId: data.questionId,
      },
    });
    if (findAnswer) {
      throw new BadRequestException('This question has already been answered');
    }
    const file = await this.fileService.create({
      file: data.answer,
      bucketName: BucketsNameEnum.SPEAKING_ANSWER,
    });

    await this.prismaService.speakingAnswers.create({
      data: {
        userId: data.userId,
        questionId: data.questionId,
        answerId: file.id,
        description: data.description,
      },
    });

    return true;
  }
}
