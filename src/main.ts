import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: true,
    whitelist: true,
    forbidUnknownValues: true,
    forbidNonWhitelisted: true,
  }));

  app.setBaseViewsDir(join(__dirname, 'katalog', 'templates'));
  app.setViewEngine('hbs');

  await app.listen(config.get('PORT'));
}
bootstrap();
