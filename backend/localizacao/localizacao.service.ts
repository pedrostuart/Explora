import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';



import { lastValueFrom } from 'rxjs';

@Injectable()
export class LocalizacaoService {
  
  constructor(private readonly httpService: HttpService) {}

  
  
  
  async buscarCep(cep: string) {
    
    
    
    
    
    const cepInformado = (cep || '').trim();
    if (!/^\d{5}-?\d{3}$/.test(cepInformado)) {
      throw new BadRequestException('Formato de CEP inválido. Use 00000-000 ou 00000000.');
    }
    const cepLimpo = cepInformado.replace('-', '');

    try {
      
      
      
      
      const resposta = await lastValueFrom(
        this.httpService.get(`https://viacep.com.br/ws/${cepLimpo}/json/`),
      );

      
      
      const dados = resposta.data;

      
      
      
      
      
      if (dados.erro) {
        throw new NotFoundException('CEP não encontrado.');
      }

      if (!dados.cep || !dados.localidade || !dados.uf) {
        throw new NotFoundException('CEP não encontrado.');
      }

      
      
      
      
      return {
        cep: dados.cep,
        logradouro: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf,
        regiao: dados.regiao,
      };
    } catch (erro) {
      
      
      
      if (
        erro instanceof NotFoundException ||
        erro instanceof BadRequestException
      ) {
        throw erro;
      }

      
      
      throw new ServiceUnavailableException(
        'Não foi possível consultar o serviço de CEP.',
      );
    }
  }

  
  
  

  async buscarCidade(cidade: string) {
    
    if (!cidade || cidade.trim().length < 2) {
      throw new BadRequestException('Informe uma cidade válida.');
    }

    try {
      
      
      
      
      
      const cidadeCodificada = encodeURIComponent(cidade.trim());

      
      
      
      
      
      const resposta = await lastValueFrom(
        this.httpService.get('https://geocoding-api.open-meteo.com/v1/search', {
          params: {
            name: cidade.trim(),
            count: 1,
            language: 'pt',
            countryCode: 'BR',
          },
        }),
      );

      const dados = resposta.data;

      
      
      
      
      if (!dados.results || dados.results.length === 0) {
        throw new NotFoundException('Localidade não encontrada.');
      }

      
      const localizacao = dados.results[0];
      
      
      
      return {
        cidade: localizacao.name,
        
        
        estado: localizacao.admin1,
        pais: localizacao.country,
        latitude: localizacao.latitude,
        longitude: localizacao.longitude,
      };
    } catch (erro) {
      if (
        erro instanceof NotFoundException ||
        erro instanceof BadRequestException
      ) {
        throw erro;
      }
      throw new ServiceUnavailableException(
        'Não foi possível consultar o serviço de localização.',
      );
    }
  }
  
  
  

  async buscarCepComCoordenadas(cep: string) {
    
    const endereco = await this.buscarCep(cep);

    
    
    const localizacao = await this.buscarCidade(endereco.cidade);

    
    return {
      cep: endereco.cep,
      logradouro: endereco.logradouro,
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      estado: endereco.estado,
      latitude: localizacao.latitude,
      longitude: localizacao.longitude,
    };
  }
}
