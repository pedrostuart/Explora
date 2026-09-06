import { Controller, Get, Param } from '@nestjs/common';
import { LocalizacaoService } from './localizacao.service';

@Controller('api/localizacao')
export class LocalizacaoController {
  constructor(private readonly localizacaoService: LocalizacaoService) {}

  
  
  

  @Get('cep/:cep')
  buscarCep(@Param('cep') cep: string) {
    return this.localizacaoService.buscarCep(cep);
  }

  
  
  

  @Get('cidade/:cidade')
  buscarCidade(@Param('cidade') cidade: string) {
    return this.localizacaoService.buscarCidade(cidade);
  }

  
  
  
  @Get('cep/:cep/coordenadas')
  buscarCepComCoordenadas(@Param('cep') cep: string) {
    return this.localizacaoService.buscarCepComCoordenadas(cep);
  }
}
