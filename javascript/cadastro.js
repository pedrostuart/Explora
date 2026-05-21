
let btnCadastrar = document.getElementById("pegarValores")
    let nome = document.getElementById("nome").value
    let sobrenome = document.getElementById("sobrenome").value
    let email = document.getElementById("email").value
    let telefone = document.getElementById("telefone").value
    let senha = document.getElementById("senha").value
    let confirmarSenha = document.getElementById("confirmar_senha").value
btnCadastrar.addEventListener("click", ()=>{
    let dados = [
        {
        nome: nome,
        sobrenome: sobrenome,
        email: email,
        telefone: telefone,
        senha: senha,
        confirmarSenha: confirmarSenha
        }
    ]
    const verificar = dados.filter(campo => campo)
})