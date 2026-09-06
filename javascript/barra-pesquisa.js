/*
  Barra de pesquisa compartilhada por index.html, eventos.html e
  favoritos_eventos.html.

  Só a página "Descobrir Eventos" (eventos.html) tem a busca ligada de
  verdade à API (o container .itens-pesquisa lá tem o atributo
  data-pesquisa-eventos="true"). Nas outras páginas este script apenas
  mantém o filtro instantâneo (client-side) que já existia, sem chamar o
  backend nem interceptar o link/ícone de pesquisar — assim a home continua
  navegando normalmente para eventos.html ao clicar em "Pesquisar".
*/

let boxPesquisa = document.querySelector(".itens-pesquisa")
let inputCarrosel = document.querySelector(".input-pesquisa")
let btnPesquisarEventos = document.querySelector(".btn_pesquisar")
let btnLimparPesquisa = document.querySelector(".btn_limpar")
let statusBusca = document.getElementById("status-busca")

// Só é "true" em eventos.html (única página com busca real via API)
let paginaComBuscaReal = !!(boxPesquisa && boxPesquisa.dataset.pesquisaEventos === "true")

/*formatar o texto*/

function formatText(valorText){
    return valorText.toLowerCase().trim()
}

function mostrarStatusBusca(mensagem, tipo) {
    if (!statusBusca) return
    statusBusca.textContent = mensagem || ""
    statusBusca.classList.toggle("status-busca--erro", tipo === "erro")
    statusBusca.style.display = mensagem ? "block" : "none"
}

function mostrarConfirmacaoBusca(mensagem) {
    const atual = document.querySelector('.confirmacao-busca')
    if (atual) atual.remove()

    const confirmacao = document.createElement('div')
    confirmacao.className = 'confirmacao-busca'
    confirmacao.textContent = mensagem
    document.body.appendChild(confirmacao)

    window.setTimeout(() => confirmacao.remove(), 2500)
}

// Raio de busca (km) selecionado no menu de filtros lateral (filtros-eventos.js),
// usado quando a pesquisa localiza eventos próximos a um CEP/cidade. Se nada foi
// selecionado, usa 10km como padrão.
function raioKmSelecionadoEventos() {
    const valor = typeof valorRadio !== "undefined" ? Number(valorRadio) : NaN
    return Number.isFinite(valor) && valor > 0 ? valor : 10
}

async function carregarEventosIniciais() {
    try {
        const resultado = await ApiExplora.buscarEventos({})
        renderizarListaEventos(boxPesquisa, resultado.eventos, "Nenhum evento encontrado.")
    } catch (erro) {
        renderizarListaEventos(boxPesquisa, [], "Não foi possível carregar os eventos agora. Tente novamente em instantes.")
    }

    // RN-063 — depois que os cards terminaram de carregar, restaura (se
    // houver) os filtros salvos na URL, e já aplica na tela.
    if (typeof restaurarFiltrosDaUrl === "function" && restaurarFiltrosDaUrl()) {
        aplicarFiltros()
    }
}

async function atualizarEventosPorDistancia() {
    const raioKm = Number(valorRadio);
    if (!Number.isFinite(raioKm) || raioKm <= 0) {
        aplicarFiltros();
        return;
    }

    if (!navigator.geolocation) {
        mostrarStatusBusca('Seu navegador não permite obter sua localização para filtrar por distância.', 'erro');
        aplicarFiltros();
        return;
    }

    mostrarStatusBusca('Obtendo sua localização...');

    try {
        const posicao = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000,
            });
        });

        const resultado = await ApiExplora.buscarEventos({
            lat: posicao.coords.latitude,
            lng: posicao.coords.longitude,
            raioKm,
        });
        renderizarListaEventos(boxPesquisa, resultado.eventos, `Nenhum evento encontrado em até ${raioKm}km.`);
        aplicarFiltros();
        mostrarStatusBusca('');
        if (resultado.eventos && resultado.eventos.length > 0) {
            mostrarConfirmacaoBusca(`${resultado.eventos.length} evento(s) encontrado(s).`);
        }
    } catch (erro) {
        mostrarStatusBusca('Não foi possível obter sua localização. Permita o acesso para filtrar por distância.', 'erro');
        aplicarFiltros();
    }
}

async function pesquisarEventosPorTexto(valorPesquisado) {
    mostrarStatusBusca("Buscando...")

    // 1) Parece um CEP -> geocodifica e busca eventos próximos por raio
    if (ApiExplora.ehCep(valorPesquisado)) {
        try {
            const endereco = await ApiExplora.buscarCoordenadasPorCep(valorPesquisado)
            const raioKm = raioKmSelecionadoEventos()
            const resultado = await ApiExplora.buscarEventos({
                lat: endereco.latitude,
                lng: endereco.longitude,
                raioKm,
            })
            renderizarListaEventos(
                boxPesquisa,
                resultado.eventos,
                `Nenhum evento encontrado em até ${raioKm}km do CEP informado.`
            )
            if (resultado.eventos && resultado.eventos.length > 0) {
                mostrarConfirmacaoBusca(`${resultado.eventos.length} evento(s) encontrado(s).`)
            }
            mostrarStatusBusca('')
        } catch (erro) {
            renderizarListaEventos(boxPesquisa, [], "Não foi possível localizar esse CEP.")
            mostrarStatusBusca(erro.message || "CEP inválido ou não encontrado.", "erro")
        }
        return
    }

    if (ApiExplora.pareceCep(valorPesquisado)) {
        renderizarListaEventos(boxPesquisa, [], "Informe um CEP válido.")
        mostrarStatusBusca("Formato de CEP inválido. Use 00000-000 ou 00000000.", "erro")
        return
    }

    // 2) Busca por nome/descrição/categoria do evento
    try {
        const resultado = await ApiExplora.buscarEventos({ q: valorPesquisado })
        if (resultado.eventos && resultado.eventos.length > 0) {
            renderizarListaEventos(boxPesquisa, resultado.eventos)
            mostrarStatusBusca('')
            mostrarConfirmacaoBusca(`${resultado.eventos.length} evento(s) encontrado(s).`)
            return
        }

        // 3) Nenhum evento com esse nome: tenta como cidade/local e mostra eventos próximos
        const local = await ApiExplora.buscarLocalizacaoPorCidade(valorPesquisado)
        const raioKm = raioKmSelecionadoEventos()
        const proximos = await ApiExplora.buscarEventos({
            lat: local.latitude,
            lng: local.longitude,
            raioKm,
        })
        renderizarListaEventos(boxPesquisa, proximos.eventos, `Nenhum evento encontrado perto de ${local.cidade}.`)
        if (proximos.eventos && proximos.eventos.length > 0) {
            mostrarStatusBusca('')
            mostrarConfirmacaoBusca(`${proximos.eventos.length} evento(s) encontrado(s).`)
        } else {
            mostrarStatusBusca('')
        }
    } catch (erro) {
        // RN-062 — não achou nada por nome nem como cidade/local: em vez de
        // deixar a tela totalmente vazia, sugere alguns eventos em alta
        // (melhor avaliados) para o usuário continuar navegando.
        await mostrarEventosEmAltaComoSugestao(valorPesquisado)
    }
}

async function mostrarEventosEmAltaComoSugestao(valorPesquisado) {
    try {
        const emAlta = await ApiExplora.buscarEventos({ ordenar: "avaliacao", limite: 3 })
        if (emAlta.eventos && emAlta.eventos.length > 0) {
            renderizarListaEventos(boxPesquisa, emAlta.eventos)
            mostrarStatusBusca('')
            mostrarConfirmacaoBusca(`${emAlta.eventos.length} evento(s) encontrado(s).`)
            return
        }
    } catch (erroSecundario) {
        // segue para a mensagem de vazio normal abaixo
    }
    renderizarListaEventos(boxPesquisa, [], `Nenhum evento encontrado para "${valorPesquisado}".`)
    mostrarStatusBusca('')
}

function executarPesquisa() {
    const valor = (inputCarrosel.value || "").trim()
    if (valor === "") {
        mostrarStatusBusca("")
        carregarEventosIniciais()
        return
    }
    pesquisarEventosPorTexto(valor)
}

if (paginaComBuscaReal) {
    document.addEventListener("DOMContentLoaded", carregarEventosIniciais)

    /*BOTÃO PESQUISAR (busca real via API)*/
    if (btnPesquisarEventos) {
        btnPesquisarEventos.addEventListener("click", (evento) => {
            evento.preventDefault()
            executarPesquisa()
        })
    }

    /*ENTER NO CAMPO DE PESQUISA*/
    inputCarrosel.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter") {
            evento.preventDefault()
            executarPesquisa()
        }
    })
}

/*BOTÃO LIMPAR PESQUISA (se existir na página)*/
if (btnLimparPesquisa && inputCarrosel) {
    btnLimparPesquisa.addEventListener("click", (evento) => {
        evento.preventDefault()
        inputCarrosel.value = ""
        mostrarStatusBusca("")

        if (paginaComBuscaReal) {
            carregarEventosIniciais()
        } else {
            inputCarrosel.dispatchEvent(new Event("input", { bubbles: true }))
        }

        inputCarrosel.focus()
    })
}

/* ==========================================
   RN-060 — sugestões automáticas a partir do 3º caractere digitado
   ========================================== */
if (paginaComBuscaReal) {
    const listaSugestoes = document.getElementById("sugestoes-busca")
    let temporizadorSugestoes = null

    function esconderSugestoes() {
        if (!listaSugestoes) return
        listaSugestoes.style.display = "none"
        listaSugestoes.innerHTML = ""
    }

    function mostrarSugestoes(nomes) {
        if (!listaSugestoes) return
        listaSugestoes.innerHTML = ""

        if (!nomes || nomes.length === 0) {
            esconderSugestoes()
            return
        }

        nomes.forEach((nome) => {
            const item = document.createElement("li")
            item.innerHTML = `<i class="bi bi-search"></i>${nome}`
            item.addEventListener("click", () => {
                inputCarrosel.value = nome
                esconderSugestoes()
                pesquisarEventosPorTexto(nome)
            })
            listaSugestoes.appendChild(item)
        })

        listaSugestoes.style.display = "block"
    }

    inputCarrosel.addEventListener("input", (evento) => {
        const valor = evento.target.value.trim()

        clearTimeout(temporizadorSugestoes)

        if (valor.length < 3) {
            esconderSugestoes()
            return
        }

        // debounce leve para não disparar uma requisição a cada tecla
        temporizadorSugestoes = setTimeout(async () => {
            try {
                const resultado = await ApiExplora.buscarSugestoes(valor)
                mostrarSugestoes(resultado.sugestoes)
            } catch (erro) {
                esconderSugestoes()
            }
        }, 250)
    })

    // esconde a lista ao clicar fora dela ou do campo de busca
    document.addEventListener("click", (evento) => {
        const dentroDaBarra = evento.target.closest("#wrapper-barra-pesquisa")
        if (!dentroDaBarra) esconderSugestoes()
    })

    // esconde ao pesquisar de fato (Enter ou clique no botão)
    inputCarrosel.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter") esconderSugestoes()
    })
    if (btnPesquisarEventos) {
        btnPesquisarEventos.addEventListener("click", esconderSugestoes)
    }
}

/*filtro instantâneo (client-side) sobre os itens já carregados, enquanto digita*/
inputCarrosel.addEventListener("input", (evento)=>{ /*ouvi quando eu digito algo no input*/ /*oque eu digitei no input
    /*receber valor do input*/
    let valorInput = formatText(evento.target.value) /*trasncrevendo o valor digitado e formatando com a função*/
    /*target lê o que eu digito e value pega o valor final*/

    let itens = document.querySelectorAll(".itens-pesquisa a")


    let txtSemResultados = document.getElementById("txt-pesquisas")
    let vermaisEventos = document.getElementById("txt-vermais-eventos")
    let todosResultados


    itens.forEach(item =>{/*Editando todos ITENS*/
        if(formatText(item.textContent).indexOf(valorInput) == -1){/*se todos os caracteres que tem dentro de ITEM não bater com VALORINPUT, o item ira sumir*/
            item.style.display = 'none'
        }else{
            item.style.display = 'flex'
            todosResultados = true /*apenas para definir um valor que eu possa usar em outro if/else*/
        }



    })




    if(todosResultados){
        if(txtSemResultados){txtSemResultados.style.display = 'none'}/*se txtSemResultados existir no html ele faz a ação*/
        if(vermaisEventos){vermaisEventos.style.display = 'block'}/*se vermaisEventos existir no html ele faz a ação*/
    }else{
        if(txtSemResultados){txtSemResultados.style.display = 'block'}
        if(vermaisEventos){vermaisEventos.style.display = 'none'}
    }

    /*abrir caixa quando clicar no input*/

    boxPesquisa.style.display = 'flex'


}
)
