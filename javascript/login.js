const btnLogin = document.getElementById("btn-login");
const formLogin = document.querySelector("form");

formLogin.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = document.getElementById("email");
    const senha = document.getElementById("senha");

    const inputs = [email, senha];

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
        return;
    }


    const dadosLogin = {

        email: email.value,
        senha: senha.value

    };


    try {

        const resposta = await fetch(
            "http://localhost:3000/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(dadosLogin)
            }
        );


        const resultado = await resposta.json();


        if (!resposta.ok) {

            alert(
                resultado.message ||
                "E-mail ou senha inválidos."
            );

            return;

        }


        console.log("Login realizado:", resultado);


        /*
         * Guarda o token para utilizar
         * nas próximas requisições protegidas.
         */

        localStorage.setItem(
            "token",
            resultado.token
        );


        /*
         * Guarda os dados básicos do usuário.
         */

        localStorage.setItem(
            "usuario",
            JSON.stringify(resultado.usuario)
        );


        


        window.location.href = "perfil.html";


    } catch (erro) {

        console.error(
            "Erro ao realizar login:",
            erro
        );

        alert(
            "Não foi possível conectar com o servidor."
        );

    }

});