// Erro específico lançado pelo callback de CORS quando a origem da
// requisição não está na lista permitida (RN-023). Tratado especificamente
// pelo HttpExceptionFilter para responder 403 com o formato { erro } já
// esperado pelo front-end, em vez do 500 genérico que o Express usaria por
// padrão para erros lançados fora do fluxo normal de rotas/guards.
export class OrigemNaoPermitidaError extends Error {
  constructor(mensagem = 'Origem não permitida pela política de CORS.') {
    super(mensagem);
    this.name = 'OrigemNaoPermitidaError';
  }
}
