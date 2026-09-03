let btnCadastrar = document.getElementById("cadastrar")

btnCadastrar.addEventListener("click", ()=>{
    let inputs = document.querySelectorAll(".barra_input input")
    
    inputs.forEach(input =>{
        let barraInput = input.parentElement
        if(input.value.trim() === ""){
            input.classList.add('placeholder-erro')
            barraInput.style.border = '1px solid red'
        }else{
            input.classList.remove('placeholder-erro')
            barraInput.style.border = '1px solid #1A824D'
        }
    })
})