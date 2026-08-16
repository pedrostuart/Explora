import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

import { OrigemNaoPermitidaError } from '../errors/origem-nao-permitida.error';

// O front-end (public/javascript/*.js) sempre lê `dados.erro` (string) ou
// `dados.erros` (lista com `.msg`). Este filtro garante que QUALQUER exceção
// lançada pela API — vinda de um guard, de um pipe de validação, do multer
// ou de um throw manual — chegue ao cliente nesse mesmo formato, exatamente
// como acontecia nas rotas Express originais.
//
// RN-024 — erros internos (500) NUNCA expõem stack trace/detalhes técnicos
// ao cliente; em compensação, o erro completo é sempre logado no servidor
// (via Logger) para não perder a informação de diagnóstico.
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // RN-023 — origem bloqueada pelo CORS: responde 403 limpo, em vez do
    // 500 genérico que o Express usaria por padrão para esse tipo de erro.
    if (exception instanceof OrigemNaoPermitidaError) {
      return response.status(HttpStatus.FORBIDDEN).json({ erro: exception.message });
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // RN-024 — qualquer erro não esperado (500) é registrado no servidor com
    // stack trace completo, mesmo que o cliente só receba a mensagem genérica.
    if (status >= 500) {
      const erro = exception instanceof Error ? exception : new Error(String(exception));
      this.logger.error(`${request.method} ${request.url} -> ${erro.message}`, erro.stack);
    }

    const corpo =
      exception instanceof HttpException ? exception.getResponse() : null;

    if (corpo && typeof corpo === 'object' && ('erro' in corpo || 'erros' in corpo)) {
      return response.status(status).json(corpo);
    }

    if (typeof corpo === 'string') {
      return response.status(status).json({ erro: corpo });
    }

    if (corpo && typeof corpo === 'object' && 'message' in (corpo as any)) {
      const mensagem = (corpo as any).message;
      const erro = Array.isArray(mensagem) ? mensagem.join(' ') : mensagem;
      return response.status(status).json({ erro });
    }

    return response
      .status(status)
      .json({ erro: 'Ocorreu um erro inesperado no servidor.' });
  }
}
