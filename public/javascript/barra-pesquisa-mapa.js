/*ABRIR MENU FILTROS*/


/*valores radios*/


let btnFiltrar = document.querySelector(".btn-filtrar .btn-preferencia-mapa")
let btnPesquisar = document.querySelector(".btn_pesquisar")

btnPesquisar.addEventListener("click", ()=>{
    
    let valorPesquisaLocal = document.querySelector(".input-pesquisa").value
    let eventos = `${valorPesquisaLocal.trim()}`
    let formatText = eventos.replaceAll(" ", "+")
    let mapa = document.querySelector(".mapa iframe")
    if(valorPesquisaLocal === ''){
        mapa.src = `https://www.google.com/maps?q=${valorGosto}&z=${valorRadio || 15}&output=embed`   
    }else{
        mapa.src = `https://www.google.com/maps?q=${formatText}&z=${valorRadio || 15}&output=embed` 
    }
      
    
})



