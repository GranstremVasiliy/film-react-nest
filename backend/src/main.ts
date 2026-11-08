import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TSKVLogger } from './logger/tskv.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);
  const logFormat = config.get<string>('LOG_FORMAT') ?? 'dev';

  switch (logFormat) {
    case 'dev':
      app.useLogger(app.get(DevLogger));
      break;

    case 'json':
      app.useLogger(app.get(JsonLogger));
      break;

    case 'tskv':
      app.useLogger(app.get(TSKVLogger));
      break;

    default:
      throw new Error(
        `Некорректный LOG_FORMAT: "${logFormat}". Допустимые значения: dev, json, tskv.`,
      );
  }
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = config.get('PORT') ?? 3000;
  await app.listen(port);
}
bootstrap();
