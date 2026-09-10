// ==============================
// BARRA DE PESQUISA
// ==============================

let boxPesquisa = document.querySelector(".itens-pesquisa");
let inputCarrosel = document.querySelector(".input-pesquisa");

function formatText(valorText) {
    return valorText.toLowerCase().trim();
}

inputCarrosel.addEventListener("input", (evento) => {
    let valorInput = formatText(evento.target.value);

    let itens = document.querySelectorAll(
        ".itens-pesquisa a:not(#txt-vermais-eventos)"
    );

    let txtSemResultados = document.getElementById("txt-pesquisas");
    let vermaisEventos = document.getElementById("txt-vermais-eventos");

    let todosResultados = false;

    itens.forEach(item => {
        if (formatText(item.textContent).indexOf(valorInput) === -1) {
            item.style.display = 'none';
        } else {
            item.style.display = 'flex';
            todosResultados = true;
        }
    });

    if (todosResultados) {
        if (txtSemResultados) txtSemResultados.style.display = 'none';
        if (vermaisEventos) vermaisEventos.style.display = 'block';
    } else {
        if (txtSemResultados) txtSemResultados.style.display = 'block';
        if (vermaisEventos) vermaisEventos.style.display = 'none';
    }

    boxPesquisa.style.display = 'flex';
});

document.addEventListener("click", (event) => {
    let documentoClick = event.target;
    if (documentoClick !== inputCarrosel && documentoClick !== boxPesquisa) {
        if (boxPesquisa) boxPesquisa.style.display = 'none';
    }
});

// ==============================
// CARREGAR EVENTOS DA API
// ==============================

const API_URL = "http://localhost:3000/eventos";

function formatarData(data) {
    if (!data) return "";
    const partes = data.split("T")[0].split("-");
    return `${partes[2]}/${partes[1]}`;
}

function criarCardEvento(evento) {
    return `
        <div class="caixa_eventos">
            <a href="informação_evento.html?id=${evento.id}">
                <span class="data_evento">${formatarData(evento.data)}</span>
                <img src="${evento.imagem || 'img/sem-imagem.png'}" alt="${evento.nome_evento}">
            </a>
            <div class="texto-evento">
                <p class="nome_show">${evento.nome_evento}</p>
                <p class="distancia_show">${evento.logradouro} - ${evento.cidade}</p>
            </div>
        </div>
    `;
}

function criarCardCarrossel(evento) {
    return `
        <div class="carrosel-eventos">
            <a href="informação_evento.html?id=${evento.id}">
                <span class="data_evento">${formatarData(evento.data)}</span>
                <img src="${evento.imagem || 'img/sem-imagem.png'}" alt="${evento.nome_evento}">
            </a>
            <div class="texto-evento">
                <p class="nome_show">${evento.nome_evento}</p>
                <p class="distancia_show">${evento.logradouro} - ${evento.cidade}</p>
            </div>
        </div>
    `;
}

function criarItemPesquisa(evento) {
    return `
        <a href="informação_evento.html?id=${evento.id}">
            <img src="${evento.imagem || 'img/sem-imagem.png'}" alt="${evento.nome_evento}">
            <div class="texto-evento">
                <span class="data_evento">${formatarData(evento.data)}</span>
                <p class="nome_show">${evento.nome_evento}</p>
                <p class="distancia_show">${evento.logradouro} - ${evento.cidade}</p>
            </div>
        </a>
    `;
}

async function carregarEventos() {
    try {
        console.log("🔵 Iniciando fetch...");
        const resposta = await fetch(API_URL);
        console.log("🔵 Status:", resposta.status);

        const eventos = await resposta.json();
        console.log("🔵 Eventos recebidos:", eventos.length);

        if (!Array.isArray(eventos) || eventos.length === 0) {
            console.warn("⚠️ Nenhum evento");
            return;
        }

        const containerDestaques = document.querySelector(".eventos_destaque .linha_eventos");
        if (containerDestaques) {
            containerDestaques.innerHTML = eventos.slice(0, 5).map(criarCardEvento).join("");
            console.log("🟢 Destaques:", containerDestaques.children.length);
        }

        const containerProximos = document.querySelector(".eventos_proximos .linha_eventos");
        if (containerProximos) {
            const proximos = [...eventos].sort((a, b) => new Date(a.data) - new Date(b.data)).slice(0, 5);
            containerProximos.innerHTML = proximos.map(criarCardEvento).join("");
            console.log("🟢 Próximos:", containerProximos.children.length);
        }

        const carrosseis = document.querySelectorAll(".single-item");
        if (carrosseis[0]) {
            carrosseis[0].innerHTML = eventos.slice(0, 5).map(criarCardCarrossel).join("");
        }
        if (carrosseis[1]) {
            const proximos = [...eventos].sort((a, b) => new Date(a.data) - new Date(b.data)).slice(0, 5);
            carrosseis[1].innerHTML = proximos.map(criarCardCarrossel).join("");
        }

        const containerPesquisa = document.querySelector(".itens-pesquisa");
        if (containerPesquisa) {
            containerPesquisa.querySelectorAll("a:not(#txt-vermais-eventos)").forEach(item => item.remove());
            const htmlItens = eventos.slice(0, 20).map(criarItemPesquisa).join("");
            containerPesquisa.insertAdjacentHTML("afterbegin", htmlItens);
        }

        if (window.jQuery) {
            jQuery(".single-item").slick({
    dots: true,
    autoplay: true,
    arrows: true,
});
        }

        console.log("PRONTO");

    } catch (erro) {
        console.error("Erro:", erro);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", carregarEventos);
} else {
    carregarEventos();
}