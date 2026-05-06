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

let btnFiltrar = document.querySelector(".btn-filtrar .btn-preferencia-mapa")

btnFiltrar.addEventListener("click", ()=>{
    console.log(valorRadio)
    console.log(valorPreferencia)
})