import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// O JwtModule já é fornecido globalmente pelo SegurancaModule (src/common),
// então basta injetar o JwtService normalmente aqui.
@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
