import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const logger = new Logger();

  const appContext = await NestFactory.createApplicationContext(
    ConfigModule.forRoot(),
  );
  const configService = appContext.get<ConfigService>(ConfigService);
  const isDevelopment = configService.get('NODE_ENV') === 'development';
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });

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
  app.enableCors();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(configService.get('PORT'));
  logger.log(`Application listening on port ${configService.get('PORT')}`);
}

bootstrap();
