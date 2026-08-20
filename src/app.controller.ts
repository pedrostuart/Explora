import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class AppController {
  @Get('status')
  status() {
    return { ok: true, mensagem: 'Servidor Explora+ rodando' };
  }
}
