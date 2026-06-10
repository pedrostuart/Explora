let email = document.getElementById("email").value
let senha = document.getElementById("senha").value

let btnLogin = document.getElementById("btn-login")

btnLogin.addEventListener("click", ()=>{
    let inputs = document.querySelectorAll(".barra_input input")
    inputs.forEach(input =>{
        let barraInput = input.parentElement
        if(input.value === ''){
            barraInput.style.border = '1px solid red'  
        }else if(input.value !== ''){
            barraInput.style.border = '1px solid #1A824D'  
            location.href = 'perfil.html'
        }
    })
})