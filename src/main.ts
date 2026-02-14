import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { RpcCustomExceptionFilter } from './common';

async function bootstrap() {
  const logger = new Logger('Main-Gateway');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    //Validacion de datos
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //Captura la excepcion y la maneja en el filtro "RpcCustomExceptionFilter"
  app.useGlobalFilters(new RpcCustomExceptionFilter());

  await app.listen(envs.port);

  logger.log(`Application is running on: ${envs.port}`);
}
bootstrap();
