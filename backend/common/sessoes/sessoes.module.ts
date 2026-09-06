import { Global, Module } from '@nestjs/common';

import { SessoesService } from './sessoes.service';

@Global()
@Module({
  providers: [SessoesService],
  exports: [SessoesService],
})
export class SessoesModule {}
