/*
  Barra de pesquisa da página de Mapa (mapa.html), integrada com a API real:
  - Digitar um nome de evento -> localiza o evento e centraliza o mapa nele.
  - Digitar um nome de cidade/local -> geocodifica e mostra eventos próximos.
  - Digitar um CEP -> geocodifica o CEP e mostra eventos próximos por raio.
  O raio de busca (km) vem do menu "Distância do mapa" (filtros-mapa.js).
*/

let inputPesquisaMapa = document.querySelector(".mapa .input-pesquisa")
let btnPesquisarMapa = document.querySelector(".mapa .btn_pesquisar")
let iframeMapa = document.querySelector(".mapa iframe")
let painelResultadosMapa = document.getElementById("painel-resultados-mapa")
let statusBuscaMapa = document.getElementById("status-busca-mapa")

// Última localização buscada (usada para refazer a busca quando o raio, no
// menu lateral de filtros, é alterado depois de uma pesquisa).
let ultimaLocalizacaoBuscadaNoMapa = null

// Cache: nome da categoria (sem acento, minúsculo) -> id da categoria no banco.
// Usado para traduzir a preferência escolhida no menu lateral (ex: "Música")
// para o categoria_id que a API /api/eventos espera.
let mapaCategoriasPorNome = null

function normalizarNomeCategoria(texto) {
    return (texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
}

async function obterMapaCategorias() {
    if (mapaCategoriasPorNome) return mapaCategoriasPorNome
    try {
        const categorias = await ApiExplora.buscarCategorias()
        mapaCategoriasPorNome = {}
        categorias.forEach((cat) => {
            mapaCategoriasPorNome[normalizarNomeCategoria(cat.nome)] = cat.id
        })
    } catch (erro) {
        mapaCategoriasPorNome = {}
    }
    return mapaCategoriasPorNome
}

// Resolve a preferência selecionada no menu lateral (variável global `valorGosto`,
// definida em filtros-mapa.js) para o id de categoria correspondente na API.
async function categoriaIdSelecionada() {
    if (typeof valorGosto === "undefined" || !valorGosto) return undefined
    const mapa = await obterMapaCategorias()
    return mapa[normalizarNomeCategoria(valorGosto)]
}

function kmParaZoomGoogleMaps(km) {
    if (!km) return 15
    if (km <= 5) return 14
    if (km <= 10) return 13
    if (km <= 20) return 12
    if (km <= 30) return 11
    return 10
}

function mostrarStatusMapa(mensagem, tipo) {
    if (!statusBuscaMapa) return
    statusBuscaMapa.textContent = mensagem || ""
    statusBuscaMapa.classList.toggle("status-busca-mapa--erro", tipo === "erro")
    statusBuscaMapa.style.display = mensagem ? "block" : "none"
}

function centralizarMapa(latitude, longitude, km) {
    if (!iframeMapa) return
    const zoom = kmParaZoomGoogleMaps(km)
    iframeMapa.src = `https://www.google.com/maps?q=${latitude},${longitude}&z=${zoom}&output=embed`
}

function renderizarResultadosMapa(eventos) {
    if (!painelResultadosMapa) return
    painelResultadosMapa.innerHTML = ""

    if (!eventos || eventos.length === 0) {
        painelResultadosMapa.style.display = "none"
        return
    }

    eventos.slice(0, 8).forEach((evento) => {
        const item = document.createElement("a")
        item.className = "resultado-evento-mapa"
        item.href = `informacoes_evento.html?id=${evento.id}`

        const nome = document.createElement("p")
        nome.className = "resultado-evento-mapa__nome"
        nome.textContent = evento.nome

        const detalhe = document.createElement("p")
        detalhe.className = "resultado-evento-mapa__detalhe"
        const distanciaTexto = evento.distancia_km != null ? `${evento.distancia_km}km de distância` : ""
        detalhe.textContent = [evento.bairro || evento.cidade, distanciaTexto].filter(Boolean).join(" · ")

        item.appendChild(nome)
        item.appendChild(detalhe)
        painelResultadosMapa.appendChild(item)
    })

    painelResultadosMapa.style.display = "flex"
}

// Raio de busca (km) selecionado no menu lateral "Distância do mapa"
// (valorRadio vem de filtros-mapa.js). Usa 10km como padrão se nada selecionado.
function raioKmSelecionadoMapa() {
    const valor = typeof valorRadio !== "undefined" ? Number(valorRadio) : NaN
    return Number.isFinite(valor) && valor > 0 ? valor : 10
}

async function localizarEventosProximosNoMapa(latitude, longitude) {
    ultimaLocalizacaoBuscadaNoMapa = { latitude, longitude }
    const raioKm = raioKmSelecionadoMapa()
    centralizarMapa(latitude, longitude, raioKm)

    try {
        const categoria = await categoriaIdSelecionada()
        const resultado = await ApiExplora.buscarEventos({ lat: latitude, lng: longitude, raioKm, categoria })
        renderizarResultadosMapa(resultado.eventos)
        const sufixoCategoria = (typeof valorGosto !== "undefined" && valorGosto) ? ` em "${valorGosto}"` : ""
        if (!resultado.eventos || resultado.eventos.length === 0) {
            mostrarStatusMapa(`Nenhum evento encontrado${sufixoCategoria} em até ${raioKm}km.`)
        } else {
            mostrarStatusMapa(`${resultado.eventos.length} evento(s) encontrado(s)${sufixoCategoria} em até ${raioKm}km.`)
        }
    } catch (erro) {
        renderizarResultadosMapa([])
        mostrarStatusMapa("Não foi possível buscar eventos próximos agora. Tente novamente.", "erro")
    }
}

// Chamada pelo filtros-mapa.js quando o raio de distância é alterado, para
// refazer a busca de eventos próximos com a localização já pesquisada.
async function atualizarRaioDeBuscaNoMapa() {
    if (!ultimaLocalizacaoBuscadaNoMapa) return
    await localizarEventosProximosNoMapa(
        ultimaLocalizacaoBuscadaNoMapa.latitude,
        ultimaLocalizacaoBuscadaNoMapa.longitude
    )
}

async function pesquisarNoMapa() {
    const valorPesquisado = (inputPesquisaMapa.value || "").trim()

    if (valorPesquisado === "") {
        mostrarStatusMapa("")
        renderizarResultadosMapa([])
        ultimaLocalizacaoBuscadaNoMapa = null
        if (iframeMapa) iframeMapa.src = `https://www.google.com/maps?q=eventos&z=13&output=embed`
        return
    }

    mostrarStatusMapa("Buscando...")

    // 1) Parece um CEP -> geocodifica e busca eventos próximos por raio
    if (ApiExplora.ehCep(valorPesquisado)) {
        try {
            const endereco = await ApiExplora.buscarCoordenadasPorCep(valorPesquisado)
            mostrarStatusMapa(`Buscando eventos perto de ${endereco.bairro || endereco.cidade}...`)
            await localizarEventosProximosNoMapa(endereco.latitude, endereco.longitude)
        } catch (erro) {
            renderizarResultadosMapa([])
            ultimaLocalizacaoBuscadaNoMapa = null
            mostrarStatusMapa(erro.message || "CEP não encontrado.", "erro")
        }
        return
    }

    // 2) Tenta encontrar eventos pelo nome digitado
    try {
        const categoria = await categoriaIdSelecionada()
        const resultadoPorNome = await ApiExplora.buscarEventos({ q: valorPesquisado, categoria })
        if (resultadoPorNome.eventos && resultadoPorNome.eventos.length > 0) {
            const primeiro = resultadoPorNome.eventos[0]
            renderizarResultadosMapa(resultadoPorNome.eventos)
            mostrarStatusMapa(`${resultadoPorNome.eventos.length} evento(s) encontrado(s) para "${valorPesquisado}".`)
            if (primeiro.latitude && primeiro.longitude) {
                ultimaLocalizacaoBuscadaNoMapa = { latitude: primeiro.latitude, longitude: primeiro.longitude }
                centralizarMapa(primeiro.latitude, primeiro.longitude, raioKmSelecionadoMapa())
            }
            return
        }
    } catch (erro) {
        // segue para tentar como nome de cidade/local
    }

    // 3) Tenta como nome de cidade/local -> centraliza o mapa e busca eventos próximos
    try {
        const local = await ApiExplora.buscarLocalizacaoPorCidade(valorPesquisado)
        mostrarStatusMapa(`Buscando eventos perto de ${local.cidade}...`)
        await localizarEventosProximosNoMapa(local.latitude, local.longitude)
    } catch (erro) {
        renderizarResultadosMapa([])
        ultimaLocalizacaoBuscadaNoMapa = null
        mostrarStatusMapa(`Não encontramos nada para "${valorPesquisado}".`, "erro")
        if (iframeMapa) {
            iframeMapa.src = `https://www.google.com/maps?q=${encodeURIComponent(valorPesquisado)}&z=13&output=embed`
        }
    }
}

if (btnPesquisarMapa) {
    btnPesquisarMapa.addEventListener("click", (evento) => {
        evento.preventDefault()
        pesquisarNoMapa()
    })
}

if (inputPesquisaMapa) {
    inputPesquisaMapa.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter") {
            evento.preventDefault()
            pesquisarNoMapa()
        }
    })
}
