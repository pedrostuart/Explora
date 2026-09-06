let form = document.querySelector(".inserir-dados form")
let inputs = document.querySelectorAll(".barra_input input")
let checkboxTermos = document.getElementById("aceitou_termos")
let btnCadastrar = document.getElementById("cadastrar")
let inputDataNascimento = document.getElementById("data_nascimento")

if (inputDataNascimento) {
    const hoje = new Date().toISOString().split("T")[0]
    inputDataNascimento.setAttribute("max", hoje)
}

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

form.addEventListener("submit", async (evento) => {
    evento.preventDefault()

    if (!form.checkValidity()) {
        form.reportValidity()
        return
    }

    if (!checkboxTermos.checked) {
        document.querySelector(".aceite-termos").classList.add("placeholder-erro")
        alert("É necessário aceitar os Termos de Uso e a Política de Privacidade para continuar.")
        return
    }
    document.querySelector(".aceite-termos").classList.remove("placeholder-erro")

    const nome = document.getElementById("nome").value.trim()
    const sobrenome = document.getElementById("sobrenome").value.trim()
    const email = document.getElementById("email").value.trim()
    const telefone = document.getElementById("telefone").value.trim()
    const dataNascimento = document.getElementById("data_nascimento").value
    const senha = document.getElementById("senha").value
    const confirmarSenha = document.getElementById("confirmar_senha").value

    if (senha !== confirmarSenha) {
        let barraConfirmar = document.getElementById("confirmar_senha").parentElement
        document.getElementById("confirmar_senha").classList.add('placeholder-erro')
        barraConfirmar.style.border = '1px solid red'
        alert("As senhas não coincidem.")
        return
    }

    const textoOriginal = btnCadastrar.textContent
    btnCadastrar.textContent = "Cadastrando..."
    btnCadastrar.disabled = true

    try {
        const resposta = await fetch("/api/auth/cadastro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome: `${nome} ${sobrenome}`.trim(),
                email,
                telefone,
                data_nascimento: dataNascimento,
                senha,
                aceitou_termos: checkboxTermos.checked,
            }),
        })
        const dados = await resposta.json()

        if (!resposta.ok) {
            const mensagem = dados.erro || (dados.erros && dados.erros.map(e => e.msg).join(', ')) || "Não foi possível concluir o cadastro."
            throw new Error(mensagem)
        }

        window.location.href = `verificar-conta.html?email=${encodeURIComponent(email)}`
    } catch (erro) {
        btnCadastrar.textContent = textoOriginal
        btnCadastrar.disabled = false
        alert(erro.message || "Não foi possível concluir o cadastro. Tente novamente.")
    }
})