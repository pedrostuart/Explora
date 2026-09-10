const API_URL = "http://localhost:3000/eventos";
const CATEGORIAS_URL = "http://localhost:3000/categorias";

const modal = document.getElementById("modal");
const formEvento = document.getElementById("formEvento");
const listaEventos = document.getElementById("listaEventos");
const listaCategorias = document.getElementById("listaCategorias");
const listaArtistas = document.getElementById("listaArtistas");
const listaIngressos = document.getElementById("listaIngressos");

const btnNovoEvento = document.getElementById("btnNovoEvento");
const btnFecharModal = document.getElementById("btnFecharModal");
const btnCancelar = document.getElementById("btnCancelar");
const btnAdicionarIngresso = document.getElementById("btnAdicionarIngresso");

const tituloModal = document.getElementById("tituloModal");


// ==============================
// LISTAR EVENTOS
// ==============================

async function listarEventos() {

    try {

        const resposta = await fetch(API_URL);
        const eventos = await resposta.json();

        listaEventos.innerHTML = "";

        eventos.forEach(evento => {

            const div = document.createElement("div");

            div.classList.add("evento");

            div.innerHTML = `
                <h3>${evento.nome_evento}</h3>

                <p>${evento.descricao}</p>

                <p>
                    <strong>Data:</strong>
                    ${formatarData(evento.data)}
                </p>

                <p>
                    <strong>Horário:</strong>
                    ${evento.hora_inicio} - ${evento.hora_fim}
                </p>

                <p>
                    <strong>Local:</strong>
                    ${evento.logradouro}, ${evento.numero_local}
                </p>

                <p>
                    ${evento.cidade} - ${evento.estado}
                </p>

                <div class="evento-botoes">

                    <button
                        class="btn-editar"
                        onclick="editarEvento(${evento.id})"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirEvento(${evento.id})"
                    >
                        Excluir
                    </button>

                </div>
            `;

            listaEventos.appendChild(div);

        });

    } catch (erro) {

        console.error("Erro ao listar eventos:", erro);

    }

}


// ==============================
// LISTAR CATEGORIAS
// ==============================

async function listarCategorias() {

    try {

        const resposta = await fetch(CATEGORIAS_URL);
        const categorias = await resposta.json();

        listaCategorias.innerHTML = "";

        categorias.forEach(categoria => {

            const label = document.createElement("label");

            label.classList.add("opcao");

            label.innerHTML = `
                <input
                    type="checkbox"
                    name="categorias"
                    value="${categoria.id}"
                >

                <span>${categoria.nome}</span>
            `;

            listaCategorias.appendChild(label);

        });

    } catch (erro) {

        console.error("Erro ao listar categorias:", erro);

    }

}


// ==============================
// ADICIONAR ARTISTA
// ==============================

function adicionarArtista(
    nome = "",
    imagem = ""
) {

    const div = document.createElement("div");

    div.classList.add("artista");

    div.innerHTML = `

        <div class="campo">

            <label>Nome do artista</label>

            <input
                type="text"
                class="nome-artista"
                maxlength="250"
                value="${nome}"
                required
            >

        </div>


        <div class="campo imagem-artista">

            <label>URL da imagem</label>

            <input
                type="url"
                class="url-artista"
                maxlength="500"
                value="${imagem}"
                required
            >

        </div>


        <button
            type="button"
            class="btn-remover-artista"
        >
            Remover
        </button>

    `;


    const botaoRemover =
        div.querySelector(".btn-remover-artista");


    botaoRemover.addEventListener("click", () => {

        div.remove();

        verificarArtistas();

    });


    listaArtistas.appendChild(div);

    verificarArtistas();

}


// ==============================
// VERIFICAR ARTISTAS
// ==============================

function verificarArtistas() {

    const artistas =
        listaArtistas.querySelectorAll(".artista");

    const mensagem =
        listaArtistas.querySelector(".sem-artistas");


    if (artistas.length === 0) {

        if (!mensagem) {

            const div = document.createElement("div");

            div.classList.add("sem-artistas");

            div.textContent =
                "Nenhum artista adicionado.";

            listaArtistas.appendChild(div);

        }

    } else {

        if (mensagem) {
            mensagem.remove();
        }

    }

}


// ==============================
// ADICIONAR INGRESSO
// ==============================

function adicionarIngresso(
    nome = "",
    preco = "",
    status = "Disponível"
) {

    const div = document.createElement("div");

    div.classList.add("ingresso");

    div.innerHTML = `

        <div class="campo">

            <label>Nome do ingresso</label>

            <input
                type="text"
                class="nome-ingresso"
                maxlength="200"
                value="${nome}"
                required
            >

        </div>


        <div class="campo preco">

            <label>Preço</label>

            <input
                type="number"
                class="preco-ingresso"
                min="0"
                step="0.01"
                value="${preco}"
                required
            >

        </div>


        <div class="campo status">

            <label>Status</label>

            <select class="status-ingresso">

                <option value="Disponível"
                    ${status === "Disponível" ? "selected" : ""}>
                    Disponível
                </option>

                <option value="Esgotado"
                    ${status === "Esgotado" ? "selected" : ""}>
                    Esgotado
                </option>

                <option value="Encerrado"
                    ${status === "Encerrado" ? "selected" : ""}>
                    Encerrado
                </option>

            </select>

        </div>


        <button
            type="button"
            class="btn-remover-ingresso"
        >
            Remover
        </button>

    `;


    const botaoRemover =
        div.querySelector(".btn-remover-ingresso");


    botaoRemover.addEventListener("click", () => {

        div.remove();

        verificarIngressos();

    });


    listaIngressos.appendChild(div);

    verificarIngressos();

}


// ==============================
// VERIFICAR INGRESSOS
// ==============================

function verificarIngressos() {

    const ingressos =
        listaIngressos.querySelectorAll(".ingresso");

    const mensagem =
        listaIngressos.querySelector(".sem-ingressos");


    if (ingressos.length === 0) {

        if (!mensagem) {

            const div = document.createElement("div");

            div.classList.add("sem-ingressos");

            div.textContent =
                "Nenhum ingresso adicionado.";

            listaIngressos.appendChild(div);

        }

    } else {

        if (mensagem) {
            mensagem.remove();
        }

    }

}


// ==============================
// PEGAR ARTISTAS
// ==============================

function pegarArtistas() {

    const artistas =
        listaArtistas.querySelectorAll(".artista");

    return Array.from(artistas).map(artista => {

        const nome =
            artista.querySelector(".nome-artista").value;

        const imagem =
            artista.querySelector(".url-artista").value;

        return {
            nome: nome,
            imagem: imagem
        };

    });

}


// ==============================
// PEGAR CATEGORIAS
// ==============================

function pegarCategoriasSelecionadas() {

    const selecionadas =
        document.querySelectorAll(
            'input[name="categorias"]:checked'
        );

    return Array.from(selecionadas).map(
        checkbox => Number(checkbox.value)
    );

}


// ==============================
// PEGAR INGRESSOS
// ==============================

function pegarIngressos() {

    const ingressos =
        listaIngressos.querySelectorAll(".ingresso");

    return Array.from(ingressos).map(ingresso => {

        const nome =
            ingresso.querySelector(".nome-ingresso").value;

        const preco =
            Number(
                ingresso.querySelector(".preco-ingresso").value
            );

        const status =
            ingresso.querySelector(".status-ingresso").value;

        return {
            nome_ingresso: nome,
            preco: preco,
            status: status
        };

    });

}


// ==============================
// LIMPAR FORMULÁRIO
// ==============================

function limparFormulario() {

    formEvento.reset();

    document.getElementById("eventoId").value = "";


    document
        .querySelectorAll('input[name="categorias"]')
        .forEach(checkbox => {
            checkbox.checked = false;
        });


    listaArtistas.innerHTML = "";

    listaIngressos.innerHTML = "";


    verificarArtistas();

    verificarIngressos();

}


// ==============================
// NOVO EVENTO
// ==============================

btnNovoEvento.addEventListener("click", () => {

    tituloModal.textContent = "Novo Evento";

    limparFormulario();

    modal.style.display = "block";

});


// ==============================
// FECHAR MODAL
// ==============================

function fecharModal() {

    modal.style.display = "none";

}


btnFecharModal.addEventListener(
    "click",
    fecharModal
);


btnCancelar.addEventListener(
    "click",
    fecharModal
);


// ==============================
// FECHAR CLICANDO FORA
// ==============================

window.addEventListener("click", event => {

    if (event.target === modal) {

        fecharModal();

    }

});


// ==============================
// BOTÃO ADICIONAR ARTISTA
// ==============================

function criarBotaoAdicionarArtista() {

    const botao =
        document.getElementById("btnAdicionarArtista");

    if (!botao) {
        return;
    }

    botao.addEventListener(
        "click",
        () => adicionarArtista()
    );

}


// ==============================
// BOTÃO ADICIONAR INGRESSO
// ==============================

btnAdicionarIngresso.addEventListener(
    "click",
    () => adicionarIngresso()
);


// ==============================
// SALVAR EVENTO
// ==============================

formEvento.addEventListener("submit", async event => {

    event.preventDefault();


    const eventoId =
        document.getElementById("eventoId").value;


    const dados = {

        nome_evento:
            document.getElementById("nome_evento").value,

        descricao:
            document.getElementById("descricao").value,

        data:
            document.getElementById("data").value,

        hora_inicio:
            document.getElementById("hora_inicio").value,

        hora_fim:
            document.getElementById("hora_fim").value,

        logradouro:
            document.getElementById("logradouro").value,

        numero_local:
            Number(
                document.getElementById("numero_local").value
            ),

        cidade:
            document.getElementById("cidade").value,

        estado:
            document.getElementById("estado").value,

        capacidade:
            Number(
                document.getElementById("capacidade").value
            ),

        classificacao_etaria:
            Number(
                document.getElementById(
                    "classificacao_etaria"
                ).value
            ),

        destaque_evento:
            document.getElementById(
                "destaque_evento"
            ).value,

        imagem:
            document.getElementById("imagem").value,

        link_compra:
            document.getElementById(
                "link_compra"
            ).value,

        categorias:
            pegarCategoriasSelecionadas(),

        artistas:
            pegarArtistas(),

        ingressos:
            pegarIngressos()

    };


    try {

        let resposta;


        if (eventoId) {

            resposta = await fetch(
                `${API_URL}/${eventoId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(dados)
                }
            );

        } else {

            resposta = await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(dados)
                }
            );

        }


        if (!resposta.ok) {

            const erro =
                await resposta.json();

            console.error(erro);

            alert("Erro ao salvar evento.");

            return;

        }


        alert(
            eventoId
                ? "Evento atualizado com sucesso!"
                : "Evento cadastrado com sucesso!"
        );


        fecharModal();

        listarEventos();


    } catch (erro) {

        console.error(
            "Erro ao salvar evento:",
            erro
        );

        alert(
            "Não foi possível conectar com o servidor."
        );

    }

});


// ==============================
// EDITAR EVENTO
// ==============================

async function editarEvento(id) {

    try {

        const resposta =
            await fetch(`${API_URL}/${id}`);


        if (!resposta.ok) {

            alert(
                "Não foi possível carregar o evento."
            );

            return;

        }


        const evento =
            await resposta.json();


        tituloModal.textContent =
            "Editar Evento";


        document.getElementById("eventoId").value =
            evento.id;


        document.getElementById("nome_evento").value =
            evento.nome_evento;

        document.getElementById("descricao").value =
            evento.descricao;

        document.getElementById("data").value =
            formatarDataInput(evento.data);

        document.getElementById("hora_inicio").value =
            evento.hora_inicio.substring(0, 5);

        document.getElementById("hora_fim").value =
            evento.hora_fim.substring(0, 5);

        document.getElementById("logradouro").value =
            evento.logradouro;

        document.getElementById("numero_local").value =
            evento.numero_local;

        document.getElementById("cidade").value =
            evento.cidade;

        document.getElementById("estado").value =
            evento.estado;

        document.getElementById("capacidade").value =
            evento.capacidade;

        document.getElementById(
            "classificacao_etaria"
        ).value =
            evento.classificacao_etaria;

        document.getElementById(
            "destaque_evento"
        ).value =
            evento.destaque_evento;

        document.getElementById("imagem").value =
            evento.imagem;

        document.getElementById("link_compra").value =
            evento.link_compra;


        // ==========================
        // CATEGORIAS
        // ==========================

        document
            .querySelectorAll('input[name="categorias"]')
            .forEach(checkbox => {

                const categoriaId =
                    Number(checkbox.value);

                checkbox.checked =
                    evento.categorias.some(
                        categoria =>
                            Number(categoria.id) === categoriaId
                    );

            });


        // ==========================
        // ARTISTAS
        // ==========================

        listaArtistas.innerHTML = "";

        if (evento.artistas) {

            evento.artistas.forEach(artista => {

                adicionarArtista(
                    artista.nome,
                    artista.imagem
                );

            });

        } else {

            verificarArtistas();

        }


        // ==========================
        // INGRESSOS
        // ==========================

        listaIngressos.innerHTML = "";

        if (evento.ingressos) {

            evento.ingressos.forEach(ingresso => {

                adicionarIngresso(
                    ingresso.nome_ingresso,
                    ingresso.preco,
                    ingresso.status
                );

            });

        } else {

            verificarIngressos();

        }


        modal.style.display = "block";


    } catch (erro) {

        console.error(
            "Erro ao buscar evento:",
            erro
        );

        alert(
            "Não foi possível carregar o evento."
        );

    }

}


// ==============================
// EXCLUIR EVENTO
// ==============================

async function excluirEvento(id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir este evento?"
        );


    if (!confirmar) {
        return;
    }


    try {

        const resposta =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!resposta.ok) {

            alert(
                "Erro ao excluir evento."
            );

            return;

        }


        alert(
            "Evento excluído com sucesso!"
        );


        listarEventos();


    } catch (erro) {

        console.error(
            "Erro ao excluir evento:",
            erro
        );

        alert(
            "Não foi possível conectar com o servidor."
        );

    }

}


// ==============================
// FORMATAR DATA
// ==============================

function formatarData(data) {

    if (!data) {
        return "";
    }


    const partes =
        data.split("T")[0].split("-");


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


// ==============================
// FORMATAR DATA PARA INPUT
// ==============================

function formatarDataInput(data) {

    if (!data) {
        return "";
    }


    return data.split("T")[0];

}


// ==============================
// INICIAR
// ==============================

listarCategorias();

listarEventos();

criarBotaoAdicionarArtista();

verificarArtistas();

verificarIngressos();