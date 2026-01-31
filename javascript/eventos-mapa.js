/*ABRIR MENU FILTROS*/
let btnFiltrar = document.querySelector(".btn-preferencia-resposivo")
let menuFiltrar = document.querySelector(".menu-lateral")

btnFiltrar.addEventListener("click", (e) =>{
    e.preventDefault()
    menuFiltrar.style.display = 'flex'
})
let filtrarFechar = document.querySelector(".btn-filtrar .btn-preferencia")

filtrarFechar.addEventListener("click", (e)=>{
    menuFiltrar.style.display = ''
})
/*FECHAR MENU FILTROS*/
let fecharMenuFiltros = document.querySelector(".fechar-link .fechar-menu")
fecharMenuFiltros.addEventListener("click", ()=>{
    
    menuFiltrar.style.display = ''
})
