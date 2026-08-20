import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

// Guard de rate limiting aplicado GLOBALMENTE a toda a API (RN-020).
// Rotas específicas podem sobrescrever o limite padrão com @Throttle(...)
// (ex.: o login usa um limite mais rígido, 20 requisições a cada 15 minutos).
@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(): Promise<void> {
    throw new HttpException(
      { erro: 'Muitas tentativas. Tente novamente mais tarde.' },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
