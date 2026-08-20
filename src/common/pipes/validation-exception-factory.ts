import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

// Reproduz o formato de erros.array() do express-validator, que o front-end
// consome como `dadosCadastro.erros.map((e) => e.msg)`.
function extrairMensagens(erro: ValidationError): { msg: string; param: string }[] {
  const mensagens: { msg: string; param: string }[] = [];

  if (erro.constraints) {
    for (const msg of Object.values(erro.constraints)) {
      mensagens.push({ msg, param: erro.property });
    }
  }

  if (erro.children?.length) {
    for (const filho of erro.children) {
      mensagens.push(...extrairMensagens(filho));
    }
  }

  return mensagens;
}

export function validationExceptionFactory(erros: ValidationError[]): BadRequestException {
  const listaErros = erros.flatMap((erro) => extrairMensagens(erro));
  return new BadRequestException({ erros: listaErros });
}
