import { Global, Module } from '@nestjs/common';

import { AuditoriaService } from './auditoria.service';

// Global: registrarLog é usado por praticamente todos os módulos de domínio
@Global()
@Module({
  providers: [AuditoriaService],
  exports: [AuditoriaService],
})
export class AuditoriaModule {}
