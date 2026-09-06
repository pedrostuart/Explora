/*
  Renderização dos cards de evento (.caixa_eventos) a partir dos dados
  retornados pela API (GET /api/eventos). Usado pela aba de pesquisa
  (barra-pesquisa.js) para substituir os cards estáticos por eventos reais.
*/

function normalizarTextoBusca(texto) {
  return (texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .toLowerCase()
    .trim();
}

function formatarDataEvento(dataIso) {
  if (!dataIso) return '';
  const data = new Date(dataIso);
  if (Number.isNaN(data.getTime())) return '';

  const hoje = new Date();
  const mesmoDia =
    data.getFullYear() === hoje.getFullYear() &&
    data.getMonth() === hoje.getMonth() &&
    data.getDate() === hoje.getDate();

  if (mesmoDia) return 'HOJE';

  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}`;
}

function formatarLocalEvento(evento) {
  const local = evento.bairro || evento.cidade || '';
  if (evento.distancia_km !== undefined && evento.distancia_km !== null) {
    return local ? `${local} - ${evento.distancia_km}km de distância` : `${evento.distancia_km}km de distância`;
  }
  return local;
}

function criarCardEvento(evento) {
  const link = document.createElement('a');
  link.href = `informacoes_evento.html?id=${evento.id}`;
  if (evento.distancia_km != null) {
    link.href += `&km=${encodeURIComponent(evento.distancia_km)}`;
  }
  link.className = 'caixa_eventos';
  link.dataset.preferencias = normalizarTextoBusca(evento.categoria_nome || '');
  link.dataset.preco = evento.preco != null ? evento.preco : '0';
  if (evento.distancia_km != null) {
    link.dataset.distanciaKm = String(evento.distancia_km);
  }

  const dataSpan = document.createElement('span');
  dataSpan.className = 'data_evento';
  dataSpan.textContent = formatarDataEvento(evento.data_hora);

  const img = document.createElement('img');
  img.src = evento.imagem_capa || 'img/imagem_evento.jpg';
  img.alt = `Imagem do evento ${evento.nome}`;

  const textoDiv = document.createElement('div');
  textoDiv.className = 'texto-evento';

  const nomeP = document.createElement('p');
  nomeP.className = 'nome_show';
  nomeP.textContent = evento.nome;

  const distanciaP = document.createElement('p');
  distanciaP.className = 'distancia_show';
  distanciaP.textContent = formatarLocalEvento(evento);

  textoDiv.appendChild(nomeP);
  textoDiv.appendChild(distanciaP);

  link.appendChild(dataSpan);
  link.appendChild(img);
  link.appendChild(textoDiv);

  return link;
}

// Substitui todos os cards (.caixa_eventos) já renderizados dentro de `container`
// pelos itens de `eventos`. Mantém quaisquer outros elementos (ex.: a mensagem
// estática #txt-pesquisas) intactos.
function renderizarListaEventos(container, eventos, mensagemVazio) {
  if (!container) return;

  container.querySelectorAll('.caixa_eventos, .mensagem-busca').forEach((el) => el.remove());

  const mensagemPesquisa = document.getElementById('txt-pesquisas');

  if (!eventos || eventos.length === 0) {
    if (mensagemPesquisa) {
      mensagemPesquisa.textContent = mensagemVazio || 'Nenhum evento encontrado.';
      mensagemPesquisa.style.display = 'block';
    }
    return;
  }

  if (mensagemPesquisa) mensagemPesquisa.style.display = 'none';

  eventos.forEach((evento) => container.appendChild(criarCardEvento(evento)));
}
