import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AppThrottlerGuard } from './guards/app-throttler.guard';





@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'troque-este-segredo-em-producao',
        signOptions: { expiresIn: '30m' }, 
      }),
    }),
    
    
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60 * 1000, 
        limit: 100, 
      },
    ]),
  ],
  providers: [
    AuthGuard,
    AdminGuard,
    
    { provide: APP_GUARD, useClass: AppThrottlerGuard },
  ],
  exports: [JwtModule, AuthGuard, AdminGuard],
})
export class SegurancaModule {}
