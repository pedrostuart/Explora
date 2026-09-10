// ==============================
// CONFIG
// ==============================

const API_URL = "http://localhost:3000/eventos";

// ==============================
// HELPERS
// ==============================

function formatarDataLonga(data) {
    if (!data) return "--";
    const d = new Date(data.split("T")[0] + "T00:00:00");
    const dias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho",
                   "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    return `${dias[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}

function formatarDataCurta(data) {
    if (!data) return "";
    const p = data.split("T")[0].split("-");
    return `${p[2]}/${p[1]}`;
}

function corStatus(status) {
    if (status === "Disponível") return "var(--verde)";
    if (status === "Esgotado") return "red";
    return "orange";
}

// ==============================
// PEGA ID DA URL
// ==============================

const params = new URLSearchParams(window.location.search);
const eventoId = params.get("id");

// ==============================
// RENDERIZA O EVENTO
// ==============================

async function carregarEvento() {

    if (!eventoId) {
        console.warn("Nenhum id na URL");
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/${eventoId}`);
        if (!resposta.ok) throw new Error("Evento não encontrado");

        const evento = await resposta.json();

        // ---- TOPO ----
        document.getElementById("info-nome").textContent = evento.nome_evento;
        document.getElementById("info-descricao").textContent = evento.descricao;
        document.getElementById("info-data").textContent = formatarDataLonga(evento.data);
        document.getElementById("info-horario").textContent =
            `${evento.hora_inicio.substring(0,5)} - ${evento.hora_fim.substring(0,5)}`;
        document.getElementById("info-local").textContent =
            `${evento.logradouro}, ${evento.numero_local} - ${evento.cidade}/${evento.estado}`;

        // ---- SOBRE ----
        document.getElementById("info-sobre").textContent = evento.descricao;
        document.getElementById("info-destaque").textContent = evento.destaque_evento || "--";
        document.getElementById("info-capacidade").textContent =
            `${evento.capacidade.toLocaleString("pt-BR")} pessoas`;
        document.getElementById("info-hora-inicio").textContent = evento.hora_inicio.substring(0,5);
        document.getElementById("info-classificacao").textContent =
            `+${evento.classificacao_etaria} anos`;

        // ---- INGRESSOS ----
        renderizarIngressos(evento.ingressos || []);

        // ---- LOCAL ----
        document.getElementById("info-local-nome").textContent = evento.logradouro;
        document.getElementById("info-local-endereco").textContent =
            `${evento.logradouro}, ${evento.numero_local} - ${evento.cidade} - ${evento.estado}`;

        document.getElementById("info-link-compra").href = evento.link_compra || "#";

        // ---- ARTISTAS ----
        renderizarArtistas(evento.artistas || []);

        // ---- EVENTOS SIMILARES ----
        carregarSimilares(evento.id);

    } catch (erro) {
        console.error("❌ Erro ao carregar evento:", erro);
        document.getElementById("info-nome").textContent = "Evento não encontrado";
    }
}

// ==============================
// RENDERIZA INGRESSOS
// ==============================

function renderizarIngressos(ingressos) {

    const container = document.getElementById("lista-ingressos");
    container.innerHTML = "";

    if (ingressos.length === 0) {
        container.innerHTML = "<p>Nenhum ingresso cadastrado.</p>";
        return;
    }

    // Ordena por preço e pega o menor
    const ordenados = [...ingressos].sort((a, b) => Number(a.preco) - Number(b.preco));
    const precoMin = ordenados[0].preco;

    document.getElementById("info-preco-min").textContent =
        `${Number(precoMin).toFixed(0)}R$`;

    ingressos.forEach(ing => {
        const div = document.createElement("div");
        div.classList.add("precos-ingressos");
        div.innerHTML = `
            <h2>${ing.nome_ingresso}</h2>
            <p>
                <span style="color: ${corStatus(ing.status)};">&bull;</span>
                ${Number(ing.preco).toFixed(0)}R$ - ${ing.status}
            </p>
        `;
        container.appendChild(div);
    });
}

// ==============================
// RENDERIZA ARTISTAS
// ==============================

function renderizarArtistas(artistas) {

    const container = document.getElementById("lista-artistas");
    container.innerHTML = "";

    if (artistas.length === 0) {
        container.innerHTML = "<p>Nenhum artista cadastrado.</p>";
        return;
    }

    artistas.forEach(art => {
        const div = document.createElement("div");
        div.classList.add("artistas");
        div.innerHTML = `
            <a href="#">
                <img src="${art.imagem || 'img/sem-imagem.png'}" alt="${art.nome}">
                <h2>${art.nome}</h2>
                <p>Atração</p>
            </a>
        `;
        container.appendChild(div);
    });
}

// ==============================
// CARREGA EVENTOS SIMILARES
// ==============================

async function carregarSimilares(idAtual) {

    const container = document.getElementById("lista-similares");
    container.innerHTML = "";

    try {
        const resposta = await fetch(API_URL);
        const todos = await resposta.json();

        // Qualquer evento que não seja o atual, pega 3
        const similares = todos
            .filter(e => Number(e.id) !== Number(idAtual))
            .slice(0, 3);

        if (similares.length === 0) {
            container.innerHTML = "<p>Nenhum evento similar.</p>";
            return;
        }

        similares.forEach(ev => {
            const div = document.createElement("div");
            div.classList.add("eventos-recomendados");
            div.innerHTML = `
                <a href="informação_evento.html?id=${ev.id}">
                    <span class="data_evento">${formatarDataCurta(ev.data)}</span>
                    <img src="${ev.imagem || 'img/sem-imagem.png'}" alt="${ev.nome_evento}">
                </a>
                <div class="texto-evento">
                    <p class="nome_show">${ev.nome_evento}</p>
                    <p class="distancia_show">${ev.logradouro} - ${ev.cidade}</p>
                </div>
            `;
            container.appendChild(div);
        });

    } catch (erro) {
        console.error("Erro ao carregar similares:", erro);
    }
}

// ==============================
// INTERAÇÕES (manter os listeners do seu código original)
// ==============================

document.addEventListener("DOMContentLoaded", () => {

    // Abrir/fechar ingressos
    const btnAbrir = document.querySelector(".btn-preferencia");
    const box = document.getElementById("ingressos");

    if (btnAbrir && box) {
        btnAbrir.addEventListener("click", () => {
            box.style.display = "flex";
            document.body.style.overflow = "hidden";
        });
    }

    const fechar = document.querySelector("#ingressos .fechar-menu");
    if (fechar && box) {
        fechar.addEventListener("click", () => {
            box.style.display = "none";
            document.body.style.overflow = "auto";
        });
    }

    // Ler mais
    const lerMais = document.querySelector(".ler-mais");
    const extras = document.getElementById("extras");
    if (lerMais && extras) {
        lerMais.addEventListener("click", () => {
            if (lerMais.textContent === "Ler mais") {
                extras.style.display = "flex";
                lerMais.textContent = "Ler menos";
            } else {
                extras.style.display = "none";
                lerMais.textContent = "Ler mais";
            }
        });
    }

    // Salvar / Visitado
    const btns = document.querySelector(".btns-ingressos");
    if (btns) {
        const btnSalvar = btns.children[0];
        const btnVisitado = btns.children[2];

        if (btnSalvar) {
            btnSalvar.addEventListener("click", () => {
                btnSalvar.classList.toggle("btn-ativo");
                btnSalvar.classList.toggle("btn-comprar");
            });
        }
        if (btnVisitado) {
            btnVisitado.addEventListener("click", () => {
                btnVisitado.classList.toggle("btn-ativo");
                btnVisitado.classList.toggle("btn-comprar");
            });
        }
    }

    // Carrega os dados do evento
    carregarEvento();
});