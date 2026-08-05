let btnCadastrar = document.getElementById("pegarValores")
let nome = document.getElementById("nome").value
let sobrenome = document.getElementById("sobrenome").value
let email = document.getElementById("email").value
let telefone = document.getElementById("telefone").value
let senha = document.getElementById("senha").value
let confirmarSenha = document.getElementById("confirmar_senha").value
    
btnCadastrar.addEventListener("click", ()=>{
    let inputs = document.querySelectorAll(".barra_input input")
    inputs.forEach((input)=>{
        let barraInput = input.parentElement
        let alertaErro = document.getElementById("alerta-erro")
        if(input.value === ''){
            alertaErro.style.color = 'red'
            alertaErro.style.display = 'block'
            alertaErro.style.fontSize = '14px'
            barraInput.style.border = '1px solid red'    
        }else if(input.value !== ''){
            barraInput.style.border = '1px solid #1A824D'   
            alertaErro.style.display = 'none'
            location.href = 'preferencias.html'
        }
    })
})