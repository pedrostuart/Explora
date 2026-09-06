/*
  Gerenciamento de autenticação em duas etapas (2FA) na página de perfil.
  Verifica o status atual (GET /api/usuarios/me), e mostra o painel de
  ativação (QR code + código de confirmação) ou o de desativação (senha
  atual), conforme o caso.
*/

const statusTexto = document.getElementById("status-2fa")
const btnAtivar = document.getElementById("btn-ativar-2fa")
const painelAtivar = document.getElementById("painel-ativar-2fa")
const painelDesativar = document.getElementById("painel-desativar-2fa")
const imgQrCode = document.getElementById("qrcode-2fa")
const segredoTexto = document.getElementById("segredo-2fa")
const campoCodigoConfirmar = document.getElementById("codigo-confirmar-2fa")
const btnConfirmarAtivacao = document.getElementById("btn-confirmar-ativacao-2fa")
const campoSenhaDesativar = document.getElementById("senha-desativar-2fa")
const btnDesativar = document.getElementById("btn-desativar-2fa")

async function carregarStatus2fa() {
    try {
        const resposta = await fetch("/api/usuarios/me")
        if (!resposta.ok) {
            statusTexto.textContent = "Faça login para gerenciar a segurança da sua conta."
            return
        }
        const dados = await resposta.json()
        const ativo = dados.usuario && dados.usuario.totp_ativo === 1

        if (ativo) {
            statusTexto.textContent = "✅ A autenticação em duas etapas está ativa na sua conta."
            painelDesativar.style.display = "flex"
            btnAtivar.style.display = "none"
            painelAtivar.style.display = "none"
        } else {
            statusTexto.textContent = "A autenticação em duas etapas está desativada."
            btnAtivar.style.display = "inline-block"
            painelDesativar.style.display = "none"
        }
    } catch (erro) {
        statusTexto.textContent = "Não foi possível verificar o status agora."
    }
}

if (btnAtivar) {
    btnAtivar.addEventListener("click", async () => {
        btnAtivar.disabled = true
        try {
            const resposta = await fetch("/api/auth/2fa/habilitar", { method: "POST" })
            const dados = await resposta.json()
            if (!resposta.ok) throw new Error(dados.erro || "Não foi possível iniciar a ativação.")

            imgQrCode.src = dados.qr_code
            segredoTexto.textContent = dados.segredo
            painelAtivar.style.display = "flex"
            btnAtivar.style.display = "none"
        } catch (erro) {
            alert(erro.message || "Não foi possível iniciar a ativação do 2FA.")
        } finally {
            btnAtivar.disabled = false
        }
    })
}

if (btnConfirmarAtivacao) {
    btnConfirmarAtivacao.addEventListener("click", async () => {
        const codigo = campoCodigoConfirmar.value.trim()
        if (codigo.length !== 6) {
            alert("Digite o código de 6 dígitos gerado pelo app.")
            return
        }

        const textoOriginal = btnConfirmarAtivacao.textContent
        btnConfirmarAtivacao.textContent = "Confirmando..."
        btnConfirmarAtivacao.disabled = true

        try {
            const resposta = await fetch("/api/auth/2fa/confirmar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ codigo }),
            })
            const dados = await resposta.json()
            if (!resposta.ok) throw new Error(dados.erro || "Código inválido.")

            alert(dados.mensagem || "2FA ativado com sucesso!")
            campoCodigoConfirmar.value = ""
            carregarStatus2fa()
        } catch (erro) {
            alert(erro.message || "Não foi possível confirmar o código.")
        } finally {
            btnConfirmarAtivacao.textContent = textoOriginal
            btnConfirmarAtivacao.disabled = false
        }
    })
}

if (btnDesativar) {
    btnDesativar.addEventListener("click", async () => {
        const senhaAtual = campoSenhaDesativar.value
        if (!senhaAtual) {
            alert("Digite sua senha atual para desativar o 2FA.")
            return
        }

        const textoOriginal = btnDesativar.textContent
        btnDesativar.textContent = "Desativando..."
        btnDesativar.disabled = true

        try {
            const resposta = await fetch("/api/auth/2fa/desativar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ senha_atual: senhaAtual }),
            })
            const dados = await resposta.json()
            if (!resposta.ok) throw new Error(dados.erro || "Não foi possível desativar o 2FA.")

            alert(dados.mensagem || "2FA desativado.")
            campoSenhaDesativar.value = ""
            carregarStatus2fa()
        } catch (erro) {
            alert(erro.message || "Não foi possível desativar o 2FA.")
        } finally {
            btnDesativar.textContent = textoOriginal
            btnDesativar.disabled = false
        }
    })
}

document.addEventListener("DOMContentLoaded", carregarStatus2fa)
