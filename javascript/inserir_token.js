const urlParams = new URLSearchParams(window.location.search)
const emailParam = urlParams.get('email')

const caixaEmail = document.getElementById('caixaEmail')
if (caixaEmail && emailParam) {
    caixaEmail.textContent = emailParam
}

const tokenInputs = [
    document.getElementById('cod1'),
    document.getElementById('cod2'),
    document.getElementById('cod3'),
    document.getElementById('cod4'),
    document.getElementById('cod5'),
    document.getElementById('cod6')
]

if (tokenInputs.every(input => input !== null)) {
    tokenInputs.forEach((input, index) => {
        input.addEventListener("input", (e) => {
            const value = e.target.value
            if (value && index < tokenInputs.length - 1) {
                tokenInputs[index + 1].focus()
            }
        })

        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !input.value && index > 0) {
                tokenInputs[index - 1].focus()
            }
        })
    })
}

const btnConfirmar = document.getElementById('confirmar_codigo')

if (btnConfirmar) {
    btnConfirmar.addEventListener("click", async (e) => {
        e.preventDefault()

        const email = emailParam || ""
        let token = ""
        tokenInputs.forEach(input => {
            if (input) token += input.value
        })

        if (token.length < 6) {
            alert("Por favor, preencha todos os dígitos do código.")
            return
        }

        try {
            const resposta = await fetch("/api/auth/validar-token-senha", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, token })
            })

            const dados = await resposta.json()

            if (!resposta.ok) {
                throw new Error(dados.erro || "Código inválido ou expirado.")
            }

            window.location.href = `redefinir-senha.html?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`
        } catch (erro) {
            alert(erro.message || "Não foi possível validar o token.")
        }
    })
}