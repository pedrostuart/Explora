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

/*Preferências (radio de categoria: Cinema, Arte, etc.)*/

let labelsGostos = document.querySelectorAll(".label-preferencias input.preferencias");
let valorGosto;
let ultimaPreferenciaClicada = null;

labelsGostos.forEach(radio => {
    radio.addEventListener("click", () => {
        // Esta lógica permite desmarcar o botão de rádio clicando nele novamente
        if (ultimaPreferenciaClicada === radio) {
            radio.checked = false;
            valorGosto = undefined;
            ultimaPreferenciaClicada = null;
        } else {
            valorGosto = radio.value;
            ultimaPreferenciaClicada = radio;
        }

        // Se já existe uma localização buscada no mapa, refaz a busca de
        // eventos próximos já considerando a categoria selecionada.
        if (typeof atualizarRaioDeBuscaNoMapa === "function") {
            atualizarRaioDeBuscaNoMapa()
        }
    })
})


/*valores radios (raio de busca, em km)*/

let radiosKm = document.querySelectorAll(".radio")
let valorRadio     
    radiosKm.forEach(radios =>{
    radios.addEventListener("click", ()=>{
        valorRadio = radios.value
        // Se já existe uma localização buscada no mapa, refaz a busca de
        // eventos próximos usando o novo raio selecionado.
        if (typeof atualizarRaioDeBuscaNoMapa === "function") {
            atualizarRaioDeBuscaNoMapa()
        }
    })
})

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
        if (typeof atualizarRaioDeBuscaNoMapa === "function") {
            atualizarRaioDeBuscaNoMapa();
        }
    });
}
