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










@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    
    
    if (exception instanceof OrigemNaoPermitidaError) {
      return response.status(HttpStatus.FORBIDDEN).json({ erro: exception.message });
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    
    
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
