let btnFiltrarResponsivo = document.querySelector(".btn-preferencia-resposivo")
let menuFiltrar = document.querySelector(".menu-lateral")

btnFiltrarResponsivo.addEventListener("click", (e) =>{
    e.preventDefault()
    menuFiltrar.style.display = 'flex'
})
let fecharMenuFiltros = document.querySelector(".fechar-link .fechar-menu")
fecharMenuFiltros.addEventListener("click", ()=>{
    
    menuFiltrar.style.display = ''
})

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
            ultimaPreferenciaClicada = radio;
        }
    })
})



let labelsGostos= document.querySelectorAll(".label-preferencias button")

let valorPreferencia = []
labelsGostos.forEach(btns =>{
    btns.addEventListener("click", ()=>{
        
        if(btns.className == ""){
            btns.classList.add("selecionado")
            valorPreferencia.push(btns.value)
        }else{
            
            btns.classList.remove("selecionado")
            let posicao = valorPreferencia.indexOf(btns.value)
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

btnFiltrar.addEventListener("click", ()=>{
  
    menuFiltrar.style.display = '';
    
    let orcamento = Number(document.getElementById("preco").value)

    let todosItensDeEvento = document.querySelectorAll(".itens-pesquisa a")

    todosItensDeEvento.forEach(item => {
        let exibirItem = true;

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
        if (valorPreferencia.length > 0) {
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

        if (orcamento > 0) {
            if (item.hasAttribute('data-preco')) {
                const precoItem = Number(item.dataset.preco);
                if (precoItem > orcamento) {
                    exibirItem = false;
                }
            }
        }

        if (valorRadio) {
            const distanciaElement = item.querySelector(".distancia_show");
            if (distanciaElement) {
                const match = distanciaElement.textContent.match(/(\d+)km/);
                if (match) {
                    const distanciaItem = Number(match[1]);
                    const limiteDistancia = Number(valorRadio);

                    if (limiteDistancia === 50) { 
                        if (distanciaItem <= 30) {
                            exibirItem = false; 
                        }
                    } else { 
                        if (distanciaItem > limiteDistancia) {
                            exibirItem = false; 
                        }
                    }
                }
            }
        }
        item.style.display = exibirItem ? 'flex' : 'none';
    });
})
