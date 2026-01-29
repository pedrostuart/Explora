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

