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
        console.log(valorPreferencia)
    })
})