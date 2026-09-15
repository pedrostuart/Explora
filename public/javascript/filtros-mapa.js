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



let labelsGostos = document.querySelectorAll(".label-preferencias input.preferencias");
let valorGosto;
let ultimaPreferenciaClicada = null;

labelsGostos.forEach(radio => {
    radio.addEventListener("click", () => {
        if (ultimaPreferenciaClicada === radio) {
            radio.checked = false;
            valorGosto = undefined;
            ultimaPreferenciaClicada = null;
            
        } else {
            valorGosto = radio.value;
            ultimoRadioDataClicado = radio;
        }   
    })
})

let radiosKm = document.querySelectorAll(".radio")
let valorRadio     
    radiosKm.forEach(radios =>{
    radios.addEventListener("click", ()=>{
        valorRadio = radios.value
    })
})
