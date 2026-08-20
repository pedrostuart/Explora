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


/*valores radios*/

let radiosKm = document.querySelectorAll(".radio")
let valorRadio     
    radiosKm.forEach(radios =>{
    radios.addEventListener("click", ()=>{
        valorRadio = radios.value
    })
})

let btnFiltrar = document.querySelector(".btn-filtrar .btn-preferencia-mapa")
let btnPesquisar = document.querySelector(".barra_pesquisa .btn_pesquisar")

btnPesquisar.addEventListener("click", ()=>{
    let valorPesquisaLocal = document.querySelector(".input-pesquisa").value
    let eventos = `${valorPesquisaLocal.trim()}`
    let formatText = eventos.replaceAll(" ", "+")
    let mapa = document.querySelector(".mapa iframe")

    if(valorPesquisaLocal.value === ''){
        mapa.src = `https://www.google.com/maps?q=eventos&z=${valorRadio}&output=embed`     
    }else{
        mapa.src = `https://www.google.com/maps?q=${formatText}&z=${valorRadio}&output=embed`
    }
})



