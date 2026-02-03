
let btnPesquisar = document.querySelector(".barra_pesquisa .btn_pesquisar")

btnPesquisar.addEventListener('click', ()=>{
    let valorPesquisaLocal = document.querySelector(".input-pesquisa").value
    let eventos = `${valorPesquisaLocal.trim()}`
    let formatText = eventos.replaceAll(" ", "+")
    let mapa = document.querySelector(".mapa iframe")

    mapa.src = `https://www.google.com/maps?q=${formatText}&z=13&output=embed`
})


