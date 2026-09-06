let form = document.querySelector("form")
let email = document.getElementById('email')
let btnEnviar = document.getElementById('enviar_codigo')

email.addEventListener("invalid", ()=>{
    let barraInput = email.parentElement
    email.classList.add('placeholder-erro')
    barraInput.style.border = '1px solid red'
})

email.addEventListener("input", ()=>{
    let barraInput = email.parentElement
    email.classList.remove('placeholder-erro')
    barraInput.style.border = '1px solid #1A824D'
})

form.addEventListener("submit", async (evento) => {
    evento.preventDefault()

    if (!email.checkValidity()) {
        email.reportValidity()
        return
    }

    const textoOriginal = btnEnviar.textContent
    btnEnviar.textContent = "Enviando..."
    btnEnviar.disabled = true

    try {
        const resposta = await fetch("/api/auth/esqueceu-senha", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.value.trim() }),
        })
        const dados = await resposta.json()

        if (!resposta.ok) {
            throw new Error(dados.erro || "Não foi possível enviar o código.")
        }

        const valorParaUrl = encodeURIComponent(email.value.trim())
        window.location.href = `inserir-token.html?email=${valorParaUrl}`
    } catch (erro) {
        btnEnviar.textContent = textoOriginal
        btnEnviar.disabled = false
        alert(erro.message || "Não foi possível enviar o código. Tente novamente.")
    }
})
