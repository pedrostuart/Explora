const urlParametro = new URLSearchParams(window.location.search)
const emailRecebido = urlParametro.get('email')
const tokenRecebido = urlParametro.get('token')

let inputs = document.querySelectorAll(".barra_input input")

inputs.forEach(input => {
    input.addEventListener("invalid", () => {
        let barraInput = input.parentElement
        input.classList.add('placeholder-erro')
        barraInput.style.border = '1px solid red'
    })
    input.addEventListener("input", () => {
        let barraInput = input.parentElement
        input.classList.remove('placeholder-erro')
        barraInput.style.border = '1px solid #1A824D'
    })
})

let form = document.querySelector("form")
let btnConcluir = document.getElementById("concluirTroca")
let senhaNova = document.getElementById("senha_nova")
let confirmarSenhaNova = document.getElementById("confirmar_senha_nova")

form.addEventListener("submit", async (evento) => {
    evento.preventDefault()

    if (!emailRecebido || !tokenRecebido) {
        alert("Link inválido. Refaça o processo de recuperação de senha.")
        window.location.href = "esqueceu-senha.html"
        return
    }

    if (!senhaNova.checkValidity() || !confirmarSenhaNova.checkValidity()) {
        senhaNova.reportValidity()
        return
    }

    if (senhaNova.value !== confirmarSenhaNova.value) {
        confirmarSenhaNova.classList.add('placeholder-erro')
        confirmarSenhaNova.parentElement.style.border = '1px solid red'
        alert("As senhas não coincidem.")
        return
    }

    const textoOriginal = btnConcluir.textContent
    btnConcluir.textContent = "Salvando..."
    btnConcluir.disabled = true

    try {
        const resposta = await fetch("/api/auth/redefinir-senha", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: emailRecebido,
                token: tokenRecebido,
                novaSenha: senhaNova.value,
            }),
        })
        const dados = await resposta.json()

        if (!resposta.ok) {
            throw new Error(dados.erro || (dados.erros && dados.erros.map(e => e.msg).join(', ')) || "Não foi possível redefinir a senha.")
        }

        alert("Senha redefinida com sucesso! Faça login com a nova senha.")
        window.location.href = "login.html"
    } catch (erro) {
        btnConcluir.textContent = textoOriginal
        btnConcluir.disabled = false
        alert(erro.message || "Não foi possível redefinir a senha. Tente novamente.")
    }
})
