/*ABRIR MENU FILTROS*/
let btnFiltrarResponsivo = document.querySelector(".btn-preferencia-resposivo")
let menuFiltrar = document.querySelector(".menu-lateral")

btnFiltrarResponsivo.addEventListener("click", (e) =>{
    e.preventDefault()
    menuFiltrar.style.display = 'flex'
})

/*FECHAR MENU FILTROS*/
let fecharMenuFiltros = document.querySelector(".fechar-link .fechar-menu")
fecharMenuFiltros.addEventListener("click", ()=>{
    menuFiltrar.style.display = ''
})

/*Datas / Preferências de Data*/
let labelsDatas = document.querySelectorAll(".label-preferencias input.datas");
let valorData;
let ultimoRadioDataClicado = null;

labelsDatas.forEach(radio => {
    radio.addEventListener("click", () => {
        if (ultimoRadioDataClicado === radio) {
            radio.checked = false;
            valorData = undefined;
            ultimoRadioDataClicado = null;
        } else {
            valorData = radio.value;
            ultimoRadioDataClicado = radio;
        }
        aplicarFiltros()
    })
})

/*Preferências (Botões de categoria: Cinema, Arte, etc.)*/
let labelsGostos = document.querySelectorAll(".preferencias .label-preferencias button");
let valorPreferencia = [];

labelsGostos.forEach(btns => {
    btns.addEventListener("click", () => {
        const estavaSelecionado = btns.classList.contains("selecionado");

        labelsGostos.forEach(outroBotao => outroBotao.classList.remove("selecionado"));
        valorPreferencia = [];

        if (!estavaSelecionado) {
            btns.classList.add("selecionado");
            valorPreferencia = [btns.value];
        }
        aplicarFiltros()
    });
})

/*valores radios (raio de busca, em km)*/
let radiosKm = document.querySelectorAll(".radio")
let valorRadio

radiosKm.forEach(radios => {
    radios.addEventListener("click", async () => {
        valorRadio = radios.value;
        if (typeof atualizarEventosPorDistancia === "function") {
            await atualizarEventosPorDistancia();
        } else {
            aplicarFiltros();
        }
    })
})

/*orçamento (filtra também enquanto o usuário digita)*/
let inputOrcamento = document.getElementById("preco")
if (inputOrcamento) {
    inputOrcamento.addEventListener("input", () => {
        aplicarFiltros()
    })
}

/* Botão Filtrar Principal */
let btnFiltrar = document.querySelector(".btn-filtrar .btn-preferencia")

function parseEventDate(dateString) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    dateString = dateString.trim().toUpperCase();

    if (dateString === 'HOJE') {
        return today;
    }

    const parts = dateString.split('/');
    if (parts.length === 2) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        let year = today.getFullYear();

        const eventDate = new Date(year, month, day);
        eventDate.setHours(0, 0, 0, 0);

        if (eventDate < today) {
            eventDate.setFullYear(year + 1);
        }

        return eventDate;
    }

    return null;
}

// Aplica todos os filtros selecionados (data, preferências, orçamento e distância)
// sobre os itens já carregados na tela. É chamada automaticamente sempre que
// qualquer filtro é clicado/alterado (data, categoria, distância, orçamento),
// e também ao clicar em "Filtrar".
function aplicarFiltros() {
    let orcamento = document.getElementById("preco") ? Number(document.getElementById("preco").value) : 0;
    let todosItensDeEvento = document.querySelectorAll(".itens-pesquisa a.caixa_eventos");
    let algumVisivel = false;

    todosItensDeEvento.forEach(item => {
        let exibirItem = true;

        // Filtro por Data
        if (valorData) {
            let matchesDate = false;
            const dataDoEventoElement = item.querySelector(".data_evento");

            if (dataDoEventoElement) {
                const dataTexto = dataDoEventoElement.textContent.trim();
                const eventDate = parseEventDate(dataTexto);

                if (eventDate) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    switch (valorData) {
                        case 'Hoje':
                            matchesDate = (eventDate.getTime() === today.getTime());
                            break;
                        case 'Amanhã':
                            const tomorrow = new Date(today);
                            tomorrow.setDate(today.getDate() + 1);
                            matchesDate = (eventDate.getTime() === tomorrow.getTime());
                            break;
                        case 'Esta semana':
                            const startOfWeek = new Date(today);
                            const dayOfWeek = today.getDay();
                            const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                            startOfWeek.setDate(diff);

                            const endOfWeek = new Date(startOfWeek);
                            endOfWeek.setDate(startOfWeek.getDate() + 6);

                            matchesDate = (eventDate >= startOfWeek && eventDate <= endOfWeek);
                            break;
                        case 'Este mês':
                            matchesDate = (eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear());
                            break;
                        case 'Este ano':
                            matchesDate = (eventDate.getFullYear() === today.getFullYear());
                            break;
                    }
                }
            }
            if (!matchesDate) {
                exibirItem = false;
            }
        }

        // Filtro por Preferências (botões)
        if (valorPreferencia.length > 0) {
            if (item.hasAttribute('data-preferencias')) {
                const preferenciasDoItem = item.dataset.preferencias.split(',').map(normalizarTextoBusca);
                const temPreferenciaComum = valorPreferencia.some(pref =>
                    preferenciasDoItem.includes(normalizarTextoBusca(pref))
                );
                if (!temPreferenciaComum) {
                    exibirItem = false;
                }
            } else {
                exibirItem = false;
            }
        }

        // Filtro por Preço/Orçamento
        if (orcamento > 0) {
            if (item.hasAttribute('data-preco')) {
                const precoItem = Number(item.dataset.preco);
                if (precoItem > orcamento) {
                    exibirItem = false;
                }
            }
        }

        // Filtro por Distância (km)
        if (valorRadio) {
            const distanciaItem = Number(item.dataset.distanciaKm);
            if (Number.isFinite(distanciaItem)) {
                const limiteDistancia = Number(valorRadio);

                if (limiteDistancia === 50) {
                    if (distanciaItem <= 30) {
                        exibirItem = false;
                    }
                } else if (distanciaItem > limiteDistancia) {
                    exibirItem = false;
                }
            } else {
                exibirItem = false;
            }
        }

        item.style.display = exibirItem ? 'flex' : 'none';
        if (exibirItem) algumVisivel = true;
    });

    // Mostra/esconde a mensagem de "nenhum resultado" quando os filtros escondem tudo
    const txtSemResultados = document.getElementById("txt-pesquisas");
    if (txtSemResultados && todosItensDeEvento.length > 0) {
        txtSemResultados.style.display = algumVisivel ? 'none' : 'block';
    }

    // RN-063 — grava o estado atual dos filtros na URL, para que ela
    // sobreviva a um "voltar" do navegador (ex: ao sair da página de
    // detalhe de um evento) e também possa ser compartilhada por link.
    atualizarUrlComFiltros();
}

// Constrói a query string a partir do estado atual dos filtros e substitui a
// URL sem recarregar a página (history.replaceState não gera nova entrada
// no histórico, então o botão "voltar" continua funcionando normalmente).
function atualizarUrlComFiltros() {
    const params = new URLSearchParams(window.location.search);

    if (valorData) params.set('data', valorData); else params.delete('data');
    if (valorPreferencia.length > 0) params.set('categoria', valorPreferencia.join(',')); else params.delete('categoria');
    if (valorRadio) params.set('distancia', valorRadio); else params.delete('distancia');

    const orcamentoValor = inputOrcamento ? inputOrcamento.value.trim() : '';
    if (orcamentoValor) params.set('orcamento', orcamentoValor); else params.delete('orcamento');

    const query = params.toString();
    const novaUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState(null, '', novaUrl);
}

// RN-063 — lê os filtros salvos na URL (se houver) e re-seleciona os
// controles correspondentes na tela, sem disparar aplicarFiltros() ainda
// (isso é feito à parte, depois que os cards já estiverem carregados —
// veja carregarEventosIniciais() em barra-pesquisa.js).
function restaurarFiltrosDaUrl() {
    const params = new URLSearchParams(window.location.search);

    const dataUrl = params.get('data');
    if (dataUrl) {
        const radio = [...labelsDatas].find(r => r.value === dataUrl);
        if (radio) {
            radio.checked = true;
            valorData = dataUrl;
            ultimoRadioDataClicado = radio;
        }
    }

    const categoriasUrl = params.get('categoria');
    if (categoriasUrl) {
        const valorCategoria = categoriasUrl.split(',')[0];
        labelsGostos.forEach(btn => {
            if (btn.value === valorCategoria) {
                btn.classList.add('selecionado');
                valorPreferencia = [btn.value];
            }
        });
    }

    const distanciaUrl = params.get('distancia');
    if (distanciaUrl) {
        const radio = [...radiosKm].find(r => r.value === distanciaUrl);
        if (radio) {
            radio.checked = true;
            valorRadio = distanciaUrl;
        }
    }

    const orcamentoUrl = params.get('orcamento');
    if (orcamentoUrl && inputOrcamento) {
        inputOrcamento.value = orcamentoUrl;
    }

    return !!(dataUrl || categoriasUrl || distanciaUrl || orcamentoUrl);
}

if (btnFiltrar) {
    btnFiltrar.addEventListener("click", () => {
        menuFiltrar.style.display = '';
        aplicarFiltros();
    });
}

/* ==========================================
   FUNÇÃO DE LIMPAR DISTÂNCIA
   ========================================== */
let btnLimparDistancia = document.querySelector("#limpar-distancia");

if (btnLimparDistancia) {
    btnLimparDistancia.addEventListener("click", () => {
        valorRadio = undefined;
        radiosKm.forEach(radios => {
            radios.checked = false;
        });
        aplicarFiltros();
    });
}

/* ==========================================
   FUNÇÃO DE LIMPAR FILTROS GERAL
   ========================================== */
let btnLimparFiltros = document.querySelector("#btn-limpar-filtros");

if (btnLimparFiltros) {
    btnLimparFiltros.addEventListener("click", () => {
        valorData = undefined;
        ultimoRadioDataClicado = null;
        valorPreferencia = [];
        valorRadio = undefined;

        labelsDatas.forEach(radio => {
            radio.checked = false;
        });

        labelsGostos.forEach(btns => {
            btns.classList.remove("selecionado");
        });

        radiosKm.forEach(radios => {
            radios.checked = false;
        });

        let inputPreco = document.getElementById("preco");
        if (inputPreco) {
            inputPreco.value = "";
        }

        aplicarFiltros();

        menuFiltrar.style.display = '';
    });
}
