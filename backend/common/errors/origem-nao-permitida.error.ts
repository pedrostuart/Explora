




export class OrigemNaoPermitidaError extends Error {
  constructor(mensagem = 'Origem não permitida pela política de CORS.') {
    super(mensagem);
    this.name = 'OrigemNaoPermitidaError';
  }
}
