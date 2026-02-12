/*ABRIR MENU FILTROS*/
let btnFiltrarResponsivo = document.querySelector(".btn-preferencia-resposivo")
let menuFiltrar = document.querySelector(".menu-lateral")

btnFiltrarResponsivo.addEventListener("click", (e) =>{
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


let btnFiltrar = document.querySelector(".btn-filtrar .btn-preferencia")
/*Datas*/
let labelsDatas = document.querySelectorAll(".label-preferencias input")
let valorData

        
labelsDatas.forEach(btns =>{
    btns.addEventListener("click", ()=>{
        valorData = btns.value
        
        
        
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

btnFiltrar.addEventListener("click", ()=>{
    
    let dataEvento = document.querySelectorAll(".itens-pesquisa a .data_evento")

        dataEvento.forEach(data =>{
            let mesAtual = new Date().getMonth() 
            mesAtual + 1 
            
            let itens = document.querySelectorAll(".itens-pesquisa a")
            itens.forEach(item =>{
                if(data.textContent == mesAtual){
                    
                }
            })
            
        })
    console.log(valorRadio)
    let orcamento = Number(document.getElementById("preco").value)
    console.log(orcamento)
    console.log(valorPreferencia)
})