import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';




@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(): Promise<void> {
    throw new HttpException(
      { erro: 'Muitas tentativas. Tente novamente mais tarde.' },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
