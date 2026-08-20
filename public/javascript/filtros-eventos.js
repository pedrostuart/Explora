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

/*Datas*/
let labelsDatas = document.querySelectorAll(".label-preferencias input.datas");
let valorData;
let ultimoRadioDataClicado = null;

labelsDatas.forEach(radio => {
    radio.addEventListener("click", () => {
        // Esta lógica permite desmarcar o botão de rádio clicando nele novamente
        if (ultimoRadioDataClicado === radio) {
            radio.checked = false;
            valorData = undefined;
            ultimoRadioDataClicado = null;
        } else {
            valorData = radio.value;
            ultimoRadioDataClicado = radio;
        }
    })
})


/*Preferencias*/

let labelsGostos= document.querySelectorAll(".label-preferencias button")

let valorPreferencia = []
labelsGostos.forEach(btns =>{
    btns.addEventListener("click", ()=>{
        
        if(btns.className == ""){
            btns.classList.add("selecionado")
            valorPreferencia.push(btns.value)
        }else{
            
            btns.classList.remove("selecionado")
            let posicao = valorPreferencia.indexOf(btns.value)/*indexOf olha o que ta dentro do array e compara com valor do btns*/ 
            valorPreferencia.splice(posicao, 1)
            
        }
    })
})

/*valores radios*/

let radiosKm = document.querySelectorAll(".radio")
let valorRadio     
    radiosKm.forEach(radios =>{
    radios.addEventListener("click", ()=>{
        valorRadio = radios.value
    })
})

/*valor input*/

let btnFiltrar = document.querySelector(".btn-filtrar .btn-preferencia")

// Função auxiliar para interpretar as datas do HTML (ex: "HOJE", "15/10")
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
        const month = parseInt(parts[1], 10) - 1; // Mês no JS é baseado em 0 (0-11)
        let year = today.getFullYear();

        const eventDate = new Date(year, month, day);
        eventDate.setHours(0, 0, 0, 0);

        // Se a data do evento já passou este ano (ex: hoje é Maio, evento é de Janeiro),
        // assume que o evento é para o próximo ano.
        if (eventDate < today) {
            eventDate.setFullYear(year + 1);
        }
        
        return eventDate;
    }

    return null; // Retorna nulo para formatos de data inválidos
}

// ============================================
// RN-063 — mantém o estado dos filtros (e a posição de rolagem) ao navegar
// para o detalhe de um evento e voltar pelo cabeçalho/botão "voltar" do
// navegador. Guardamos tudo em sessionStorage (dura só a aba/sessão atual,
// que é exatamente o comportamento esperado aqui).
// ============================================
const CHAVE_ESTADO_FILTROS = "explora_estado_filtros_eventos";

function salvarEstadoFiltros() {
    const estado = {
        valorData,
        valorPreferencia,
        valorRadio,
        orcamento: document.getElementById("preco")?.value || "",
        scrollY: window.scrollY
    };
    sessionStorage.setItem(CHAVE_ESTADO_FILTROS, JSON.stringify(estado));
}

function restaurarEstadoFiltros() {
    const bruto = sessionStorage.getItem(CHAVE_ESTADO_FILTROS);
    if (!bruto) return;

    let estado;
    try {
        estado = JSON.parse(bruto);
    } catch {
        return;
    }

    // Restaura a data selecionada
    if (estado.valorData) {
        const radioCorrespondente = Array.from(labelsDatas).find((r) => r.value === estado.valorData);
        if (radioCorrespondente) {
            radioCorrespondente.checked = true;
            valorData = estado.valorData;
            ultimoRadioDataClicado = radioCorrespondente;
        }
    }

    // Restaura as preferências (categorias) selecionadas
    if (Array.isArray(estado.valorPreferencia) && estado.valorPreferencia.length > 0) {
        valorPreferencia = [...estado.valorPreferencia];
        labelsGostos.forEach((btn) => {
            if (valorPreferencia.includes(btn.value)) {
                btn.classList.add("selecionado");
            }
        });
    }

    // Restaura o raio (km) selecionado
    if (estado.valorRadio) {
        valorRadio = estado.valorRadio;
        const radioCorrespondente = Array.from(radiosKm).find((r) => r.value === estado.valorRadio);
        if (radioCorrespondente) radioCorrespondente.checked = true;
    }

    // Restaura o orçamento digitado
    const campoPreco = document.getElementById("preco");
    if (campoPreco && estado.orcamento) {
        campoPreco.value = estado.orcamento;
    }

    // Reaplica o filtro com os valores restaurados e volta pra posição de rolagem salva
    aplicarFiltros();
    if (typeof estado.scrollY === "number") {
        window.scrollTo(0, estado.scrollY);
    }
}

// Extraída do listener de clique para poder ser chamada tanto no clique em
// "Filtrar" quanto na restauração automática ao voltar de outra página.
function aplicarFiltros() {
    let orcamento = Number(document.getElementById("preco").value)

    // Seleciona todos os itens de evento
    let todosItensDeEvento = document.querySelectorAll(".itens-pesquisa a")

    todosItensDeEvento.forEach(item => {
        let exibirItem = true;

        // Lógica de filtragem por data (se valorData estiver definido)
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
                            const dayOfWeek = today.getDay(); // 0=Dom, 1=Seg, ...
                            const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Ajusta para Segunda como início da semana
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
            // Se a data do item não corresponde ao filtro, ele não deve ser exibido
            if (!matchesDate) {
                exibirItem = false;
            }
        }

        // Lógica de filtragem por preferências (se valorPreferencia não estiver vazio)
        if (valorPreferencia.length > 0) {
            // Só esconde o evento se ele tiver a configuração no HTML
            if (item.hasAttribute('data-preferencias')) {
                const preferenciasDoItem = item.dataset.preferencias.split(',');
                const temPreferenciaComum = valorPreferencia.some(pref => preferenciasDoItem.includes(pref));
                if (!temPreferenciaComum) {
                    exibirItem = false;
                }
            } else {
                console.warn("O evento não possui o atributo 'data-preferencias' no HTML e não será escondido.");
            }
        }

        // Lógica de filtragem por orçamento e rádio (km)
        if (orcamento > 0) {
            if (item.hasAttribute('data-preco')) {
                const precoItem = Number(item.dataset.preco);
                if (precoItem > orcamento) {
                    exibirItem = false; // Esconde se o preço for maior que o orçamento
                }
            }
        }

        // Lógica de filtragem por distância (km)
        if (valorRadio) {
            const distanciaElement = item.querySelector(".distancia_show");
            if (distanciaElement) {
                // Pega o texto e extrai apenas o número antes do "km"
                const match = distanciaElement.textContent.match(/(\d+)km/);
                if (match) {
                    const distanciaItem = Number(match[1]);
                    const limiteDistancia = Number(valorRadio);

                    // O value "50" é o botão de "Mais de 30km"
                    if (limiteDistancia === 50) { 
                        if (distanciaItem <= 30) {
                            exibirItem = false; // Esconde os que forem menores ou iguais a 30
                        }
                    } else { 
                        // Regra normal para "Até 5km", "Até 10km", etc.
                        if (distanciaItem > limiteDistancia) {
                            exibirItem = false; // Esconde se for maior que o limite selecionado
                        }
                    }
                }
            }
        }
        item.style.display = exibirItem ? 'flex' : 'none';
    });
}

btnFiltrar.addEventListener("click", ()=>{
    // Fecha o menu lateral (principalmente para a visão responsiva)
    menuFiltrar.style.display = '';
    aplicarFiltros();
    salvarEstadoFiltros(); // RN-063
})

// RN-063 — ao clicar em qualquer evento da lista, salva o estado ANTES de
// navegar para o detalhe (garante que "voltar" encontre tudo como estava,
// mesmo que o usuário não tenha clicado em "Filtrar" depois do último ajuste).
document.querySelectorAll(".itens-pesquisa a").forEach((link) => {
    link.addEventListener("click", salvarEstadoFiltros);
});

// Também salva ao sair da página por qualquer outro motivo (fechar aba, etc.)
window.addEventListener("pagehide", salvarEstadoFiltros);

// RN-063 — ao carregar a página (ex.: clicou em "voltar"), restaura tudo
document.addEventListener("DOMContentLoaded", restaurarEstadoFiltros);
// Se o script já carregou depois do DOMContentLoaded (cache do navegador nas
// navegações de "voltar"), roda imediatamente também.
if (document.readyState !== "loading") {
    restaurarEstadoFiltros();
}
