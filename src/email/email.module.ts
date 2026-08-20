import { Global, Module } from '@nestjs/common';

import { EmailService } from './email.service';

// Global — usado por Auth (confirmação/recuperação) e Eventos (RN-051/052).
@Global()
@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
