let labelsGostos= document.querySelectorAll(".label-preferencias button")
let valorPreferencia = []
labelsGostos.forEach(btns =>{
    btns.addEventListener("click", ()=>{
        if(btns.className == ""){
            btns.classList.add("selecionado")
            valorPreferencia.push(btns.value)
        }else{
            btns.classList.remove("selecionado")
            let posicao = valorPreferencia.indexOf(btns.value)
            valorPreferencia.splice(posicao, 1)
        }
        console.log(valorPreferencia)
    })
})
