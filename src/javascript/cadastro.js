

let inputs = document.querySelectorAll(".barra_input input")

inputs.forEach(input => {
    input.addEventListener("invalid", () => {
        let barraInput = input.parentElement

        if(input.value.trim() === ""){
            input.classList.add('placeholder-erro')
            barraInput.style.border = '1px solid red'
        }else{
            input.classList.remove('placeholder-erro')
            barraInput.style.border = '1px solid #1A824D'
            window.location.href = `preferencias.html`
        }
    })
})