import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: true,
    whitelist: true,
    forbidUnknownValues: true,
    forbidNonWhitelisted: true,
  }));

  await app.listen(config.get('PORT'));
}
bootstrap();
