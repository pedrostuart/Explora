import { Module } from '@nestjs/common';


import { HttpModule } from '@nestjs/axios';
import { LocalizacaoController } from './localizacao.controller';
import { LocalizacaoService } from './localizacao.service';

@Module({
  
  imports: [HttpModule],
  controllers: [LocalizacaoController],
  providers: [LocalizacaoService],
})
export class LocalizacaoModule {}