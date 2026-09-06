/*
  Cliente HTTP compartilhado para consumir a API do Explora+.
  Usado pela página de mapa e pela aba de pesquisa de eventos (barra-pesquisa-mapa.js
  e barra-pesquisa.js) para: buscar coordenadas por CEP, geocodificar um nome de
  cidade/local, listar categorias e buscar eventos (por nome, categoria ou
  proximidade lat/lng).
*/

const ApiExplora = (() => {
  // Faz a requisição e já trata erro de rede e erro retornado pela API
  // (formato padrão do backend: { erro: "..." } ou { erros: [{ msg: "..." }] }).
  async function requisitar(caminho) {
    let resposta;
    try {
      resposta = await fetch(caminho);
    } catch (erroDeRede) {
      throw new Error('Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.');
    }

    let dados = null;
    try {
      dados = await resposta.json();
    } catch (erroDeParse) {
      // resposta sem corpo JSON (ex.: 204) — segue sem dados
    }

    if (!resposta.ok) {
      const mensagem =
        (dados && dados.erro) ||
        (dados && dados.erros && dados.erros.map((e) => e.msg).join(', ')) ||
        'Ocorreu um erro ao consultar o servidor.';
      throw new Error(mensagem);
    }

    return dados;
  }

  // Verifica se o texto digitado "parece" um CEP (8 dígitos, com ou sem hífen/espaços)
  function ehCep(texto) {
    return /^\d{5}-?\d{3}$/.test((texto || '').trim());
  }

  function pareceCep(texto) {
    return /^[\d\s-]+$/.test((texto || '').trim());
  }

  function limparCep(texto) {
    return (texto || '').replace(/\D/g, '');
  }

  // GET /api/localizacao/cep/:cep/coordenadas -> { cep, logradouro, bairro, cidade, estado, latitude, longitude }
  async function buscarCoordenadasPorCep(cep) {
    return requisitar(`/api/localizacao/cep/${limparCep(cep)}/coordenadas`);
  }

  // GET /api/localizacao/cep/:cep -> { cep, logradouro, bairro, cidade, estado, regiao }
  async function buscarEnderecoPorCep(cep) {
    return requisitar(`/api/localizacao/cep/${limparCep(cep)}`);
  }

  // GET /api/localizacao/cidade/:cidade -> { cidade, estado, pais, latitude, longitude }
  async function buscarLocalizacaoPorCidade(nomeCidade) {
    return requisitar(`/api/localizacao/cidade/${encodeURIComponent((nomeCidade || '').trim())}`);
  }

  // GET /api/eventos?q=&lat=&lng=&raioKm=&categoria=&gratuito=&ordenar=&pagina=&limite=
  async function buscarEventos(parametros = {}) {
    const query = new URLSearchParams();
    Object.entries(parametros).forEach(([chave, valor]) => {
      if (valor !== undefined && valor !== null && valor !== '') {
        query.append(chave, valor);
      }
    });
    const sufixo = query.toString() ? `?${query.toString()}` : '';
    return requisitar(`/api/eventos${sufixo}`);
  }

  // GET /api/eventos/:id -> { evento: {...} }
  async function buscarEventoPorId(id) {
    return requisitar(`/api/eventos/${encodeURIComponent(id)}`);
  }

  // GET /api/eventos/sugestoes?q= -> { sugestoes: ["Nome do evento", ...] }
  async function buscarSugestoes(q) {
    return requisitar(`/api/eventos/sugestoes?q=${encodeURIComponent(q)}`);
  }

  // GET /api/categorias -> { categorias: [{ id, nome, ativa }, ...] }
  let categoriasCache = null;
  async function buscarCategorias() {
    if (categoriasCache) return categoriasCache;
    const resultado = await requisitar('/api/categorias');
    categoriasCache = (resultado && resultado.categorias) || [];
    return categoriasCache;
  }

  return {
    ehCep,
    pareceCep,
    limparCep,
    buscarCoordenadasPorCep,
    buscarEnderecoPorCep,
    buscarLocalizacaoPorCidade,
    buscarEventos,
    buscarEventoPorId,
    buscarSugestoes,
    buscarCategorias,
  };
})();
