import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';
import * as cookieParser from 'cookie-parser';
import { PaginaAuthMiddleware } from './common/middleware/pagina-auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  
  
  const caminhosPossiveis = [join(process.cwd(), 'views'), join(__dirname, 'views')];
  
  const pastaEstatica = caminhosPossiveis.find(caminho => fs.existsSync(caminho)) || caminhosPossiveis[0];
  
  app.use(cookieParser(process.env.JWT_SECRET || 'troque-este-segredo-em-producao'));
  app.use(app.get(PaginaAuthMiddleware).use.bind(app.get(PaginaAuthMiddleware)));
  app.useStaticAssets(pastaEstatica);

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

  
  
  
  const origensPermitidas = (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((origem) => origem.trim());
  app.enableCors({
    origin: origensPermitidas,
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
