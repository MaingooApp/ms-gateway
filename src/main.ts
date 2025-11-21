import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RequestMethod } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { envs } from './config';
import { RpcToHttpExceptionFilter } from './common';

async function bootstrap() {
  const logger = new Logger('Gateway');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useBodyParser('json', { limit: '20mb' });
  app.useBodyParser('urlencoded', { limit: '20mb', extended: true });

  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: 'health',
        method: RequestMethod.GET,
      },
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const corsOrigins = envs.corsOrigins;
  app.enableCors({
    origin: corsOrigins.includes('*') ? true : corsOrigins,
    credentials: true,
  });

  app.useGlobalFilters(new RpcToHttpExceptionFilter());

  await app.listen(envs.port);
  logger.log(`Gateway running on port ${envs.port}`);
}
bootstrap();
