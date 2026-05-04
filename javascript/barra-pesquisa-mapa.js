
let btnPesquisar = document.querySelector(".barra_pesquisa .btn_pesquisar")

btnPesquisar.addEventListener('click', ()=>{
    
    let valorPesquisaLocal = document.querySelector(".input-pesquisa").value
    let eventos = `${valorPesquisaLocal.trim()}`
    let formatText = eventos.replaceAll(" ", "+")
    let mapa = document.querySelector(".mapa iframe")
    mapa.src = `https://www.google.com/maps?q=${formatText}&z=13&output=embed`
})
let btnFiltrarMapa = document.querySelector(".btn-filtrar .btn-preferencia-mapa")
let labelsDatas = document.querySelectorAll(".filtrar-distancia radios");
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
btnFiltrarMapa.addEventListener("click", ()=>{
    console.log(valorData)
})


