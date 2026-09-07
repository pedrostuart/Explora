export interface ResultadoPaginado<T> {
  itens: T[];
  paginacao: {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
  };
}




export function paginar<T>(itens: T[], pagina = 1, limite = 20): ResultadoPaginado<T> {
  const paginaSegura = Math.max(1, pagina);
  const limiteSeguro = Math.max(1, limite);
  const total = itens.length;
  const totalPaginas = Math.max(1, Math.ceil(total / limiteSeguro));
  const inicio = (paginaSegura - 1) * limiteSeguro;

  return {
    itens: itens.slice(inicio, inicio + limiteSeguro),
    paginacao: { pagina: paginaSegura, limite: limiteSeguro, total, totalPaginas },
  };
}
