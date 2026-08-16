import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AppThrottlerGuard } from './guards/app-throttler.guard';

// Módulo global: concentra o JwtModule (usado pelo AuthService para
// assinar/verificar tokens), o ThrottlerModule (RN-020 — rate limiting) e os
// guards exigirLogin/exigirAdmin, para que qualquer módulo da aplicação
// possa usá-los sem precisar reimportar nada.
@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'troque-este-segredo-em-producao',
        signOptions: { expiresIn: '30m' }, // RN-008 — padrão; login/2FA/pre-auth sobrescrevem quando precisam
      }),
    }),
    // RN-020 — limite padrão de requisições por IP para TODA a API.
    // Rotas individuais podem sobrescrever com @Throttle(...) (ex.: login).
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60 * 1000, // 1 minuto
        limit: 100, // 100 requisições/minuto por IP nas rotas em geral
      },
    ]),
  ],
  providers: [
    AuthGuard,
    AdminGuard,
    // Aplica o rate limiting a TODAS as rotas da aplicação automaticamente.
    { provide: APP_GUARD, useClass: AppThrottlerGuard },
  ],
  exports: [JwtModule, AuthGuard, AdminGuard],
})
export class SegurancaModule {}
