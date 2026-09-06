const formLogin = document.querySelector("form") || document.getElementById("btn-login")?.closest("form")

if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault()

        const emailInput = document.getElementById("email")
        const senhaInput = document.getElementById("senha")

        const email = emailInput ? emailInput.value.trim() : ""
        const senha = senhaInput ? senhaInput.value : ""

        const btnLogin = document.getElementById("btn-login")
        if (btnLogin) {
            btnLogin.textContent = "Entrando..."
            btnLogin.disabled = true
        }

        try {
            const resposta = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha })
            })

            // Se o status for 403 (Forbidden) ou qualquer erro, redireciona imediatamente
            if (resposta.status === 403 || !resposta.ok) {
                window.location.href = `verificar-conta.html?email=${encodeURIComponent(email)}`
                return
            }

            const dados = await resposta.json()

            if (dados.requer2fa) {
                const caixa2fa = document.getElementById("caixa-2fa")
                if (caixa2fa) {
                    caixa2fa.style.display = "block"
                    formLogin.style.display = "none"
                    return
                }
            }

            window.location.href = "index.html"
        } catch (erro) {
            window.location.href = `verificar-conta.html?email=${encodeURIComponent(email)}`
        }
    })
}