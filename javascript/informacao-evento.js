let btnAbrirIngressos = document.querySelector(".btn-preferencia")
let boxIngressos = document.getElementById("ingressos")
btnAbrirIngressos.addEventListener("click", ()=>{
    boxIngressos.style.display = 'flex'
})

let fecharBox = document.querySelector("#ingressos .fechar-menu")
fecharBox.addEventListener("click", ()=>{
    boxIngressos.style.display = 'none'
})

let lerMais = document.querySelector(".ler-mais")
let extraTexto = document.getElementById("extras")
lerMais.addEventListener("click", ()=>{
    if(lerMais.textContent == 'Ler mais'){
        extraTexto.style.display = 'flex'
        lerMais.textContent = 'Ler menos'
    }else{
        extraTexto.style.display = 'none'
        lerMais.textContent = 'Ler mais'
    }
        
})

let btnVisitado = document.querySelector(".btns-ingressos").children[2]
btnVisitado.addEventListener("click", ()=>{
    
    if(btnVisitado.classList == 'btn-comprar'){
        btnVisitado.classList.add("btn-ativo")
        btnVisitado.classList.remove("btn-comprar")
    }else{
        btnVisitado.classList.add("btn-comprar")
        btnVisitado.classList.remove("btn-ativo")
    }
    
})
let btnSalvar = document.querySelector(".btns-ingressos").children[0]
btnSalvar.addEventListener("click", ()=>{
    if(btnSalvar.classList == 'btn-comprar'){
        btnSalvar.classList.add("btn-ativo")
        btnSalvar.classList.remove("btn-comprar")
    }else{
        btnSalvar.classList.add("btn-comprar")
        btnSalvar.classList.remove("btn-ativo")
    }
})
