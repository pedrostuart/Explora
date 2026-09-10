const btnCadastrar = document.getElementById("cadastrar");
const formCadastro = document.querySelector("form");

formCadastro.addEventListener("submit", function(event) {

    event.preventDefault();

    const inputs = document.querySelectorAll(".barra_input input");

    let tudoPreenchido = true;

    inputs.forEach(input => {

        const barraInput = input.parentElement;

        if (input.value.trim() === "") {

            input.classList.add("placeholder-erro");
            barraInput.style.border = "1px solid red";

            tudoPreenchido = false;

        } else {

            input.classList.remove("placeholder-erro");
            barraInput.style.border = "1px solid #1A824D";

        }

    });


    if (!tudoPreenchido) {

        document.getElementById("alerta-erro").style.display = "block";

        return;

    }


    const senha = document.getElementById("senha").value;
    const confirmarSenha =
        document.getElementById("confirmar_senha").value;


    if (senha !== confirmarSenha) {

        document.getElementById("alerta-erro").textContent =
            "As senhas não são iguais";

        document.getElementById("alerta-erro").style.display =
            "block";

        return;

    }


    document.getElementById("alerta-erro").style.display =
        "none";


    const dadosCadastro = {

        nome:
            document.getElementById("nome").value,

        sobrenome:
            document.getElementById("sobrenome").value,

        email:
            document.getElementById("email").value,

        telefone:
            document.getElementById("telefone").value,

        senha:
            senha

    };


    sessionStorage.setItem(
        "dadosCadastro",
        JSON.stringify(dadosCadastro)
    );


    window.location.href = "preferencias.html";

});