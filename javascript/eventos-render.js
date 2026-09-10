const API_URL_EVENTOS = "http://localhost:3000/eventos";

// ==============================
// FORMATA DATA (YYYY-MM-DD -> DD/MM)
// ==============================

function formatarDataEvento(data) {
    if (!data) return "";
    const partes = data.split("T")[0].split("-");
    return `${partes[2]}/${partes[1]}`;
}

// ==============================
// NORMALIZA NOME DE CATEGORIA
// Remove acento, deixa minúsculo, troca espaço por nada
// ==============================

function normalizarCategoria(nome) {
    if (!nome) return "";
    return nome
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .replace(/\s+/g, "")             // remove espaços
        .trim();
}

// ==============================
// MONTA O CARD
// ==============================

function criarCardEventos(evento) {

    // ---- data-preferencias ----
    // Vem do array de categorias do evento
    const preferencias = (evento.categorias || [])
        .map(c => normalizarCategoria(c.nome))
        .filter(Boolean)
        .join(",");

    // ---- data-preco ----
    // Pega o MENOR preço entre os ingressos
    const precos = (evento.ingressos || [])
        .map(i => Number(i.preco))
        .filter(p => !isNaN(p));

    const precoMin = precos.length > 0 ? Math.min(...precos) : "";

    // ---- data (DD/MM) ----
    const dataFormatada = formatarDataEvento(evento.data);

    return `
        <a href="informação_evento.html?id=${evento.id}"
           class="caixa_eventos"
           data-preferencias="${preferencias}"
           data-preco="${precoMin}">
            <span class="data_evento">${dataFormatada}</span>
            <img src="${evento.imagem || 'img/sem-imagem.png'}" alt="${evento.nome_evento}">
            <div class="texto-evento">
                <p class="nome_show">${evento.nome_evento}</p>
                <p class="distancia_show">${evento.logradouro} - ${evento.cidade}</p>
            </div>
        </a>
    `;
}

// ==============================
// BUSCA E RENDERIZA
// ==============================

async function carregarEventosPagina() {

    const container = document.querySelector(".itens-pesquisa");
    if (!container) return;

    try {
        const resposta = await fetch(API_URL_EVENTOS);
        const eventos = await resposta.json();

        if (!Array.isArray(eventos) || eventos.length === 0) {
            console.warn("Nenhum evento cadastrado");
            return;
        }

        // Remove cards antigos estáticos (menos a <p> de "nenhuma pesquisa")
        container.querySelectorAll(".caixa_eventos").forEach(el => el.remove());

        // Insere os novos
        const html = eventos.map(criarCardEventos).join("");
        container.insertAdjacentHTML("afterbegin", html);

        console.log(`🟢 ${eventos.length} eventos renderizados`);

    } catch (erro) {
        console.error("❌ Erro ao carregar eventos:", erro);
    }
}

// ==============================
// INICIA
// ==============================

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", carregarEventosPagina);
} else {
    carregarEventosPagina();
}