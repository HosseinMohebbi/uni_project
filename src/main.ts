import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const isDevelopment =
    configService.get<string>('NODE_ENV').toLowerCase() === 'development';

  if (isDevelopment) {
    const config = new DocumentBuilder()
      .setTitle(configService.get('APP_NAME'))
      .setDescription(configService.get('APP_DESCRIPTION'))
      .setVersion(configService.get('APP_VERSION'))
      .addTag(configService.get('APP_TAGS'))
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalFilters(new I18nValidationExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {},
    }),
  );
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  app.enableCors();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(configService.get<number>('PORT'));
}

bootstrap();
