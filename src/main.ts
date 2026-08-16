import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Intercepta e formata as mensagens do class-validator para coincidir com o front-end
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const errosFormatados = errors.map((err) => ({
          msg: Object.values(err.constraints || {}).join(', '),
        }));
        return new BadRequestException({ erros: errosFormatados });
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
