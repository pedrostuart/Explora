const finalizarCadastro =
    document.querySelector(".btn-finalizar");

const btnEscolherPreferencias =
    document.querySelector(".aplicar-preferencias");

const btnAplicarModal =
    document.querySelector(".aplicar");

const modal =
    document.querySelector(".modal");


/* =========================
   VERIFICAR DADOS DA PRIMEIRA TELA
========================= */

const dadosCadastro =
    JSON.parse(
        sessionStorage.getItem("dadosCadastro")
    );


if (!dadosCadastro) {

    alert("Não foi possível encontrar os dados do cadastro.");

    window.location.href = "cadastro.html";

}


/* =========================
   DIALOG
========================= */

btnEscolherPreferencias.addEventListener(
    "click",
    abriModal
);


function abriModal(event) {

    event.preventDefault();

    modal.style.display = "block";

}


btnAplicarModal.addEventListener(
    "click",
    fecharModal
);


function fecharModal(event) {

    event.preventDefault();

    modal.style.display = "none";

}


/* =========================
   FINALIZAR CADASTRO
========================= */

finalizarCadastro.addEventListener(
    "click",
    finalizar
);


async function finalizar(event) {

    event.preventDefault();


    /* =========================
       ESTADO
    ========================= */

    const estado =
        document.getElementById("local").value;


    const inputLocal =
        document.querySelector(
            "#input-label-local .barra_input"
        );

    const labelLocal =
        document.getElementById("labelLocal");


    if (estado === "") {

        labelLocal.style.display = "block";

        inputLocal.classList.add(
            "barra_input-erro"
        );

        return;

    }


    labelLocal.style.display = "none";

    inputLocal.classList.remove(
        "barra_input-erro"
    );


    /* =========================
       ORÇAMENTO
    ========================= */

    const orcamento =
        Number(
            document.getElementById("preco").value
        );


    const inputOrcamento =
        document.querySelector(
            "#input-label-preco .barra_input"
        );

    const labelPreco =
        document.getElementById("labelPreco");


    if (isNaN(orcamento)) {

        inputOrcamento.classList.add(
            "barra_input-erro"
        );

        labelPreco.style.display = "block";

        return;

    }


    inputOrcamento.classList.remove(
        "barra_input-erro"
    );

    labelPreco.style.display = "none";


    /* =========================
       DATA DE NASCIMENTO
    ========================= */

    const dia =
        Number(
            document.getElementById("dia").value
        );

    const mes =
        Number(
            document.getElementById("mes").value
        );

    const ano =
        Number(
            document.getElementById("ano").value
        );


    const dataNascimento =
        `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;


    const anoAtual =
        new Date().getFullYear();


    const idade =
        anoAtual - ano;


    const labelDataNascimento =
        document.getElementById(
            "labelDataNascimento"
        );

    const inputDataNascimento =
        document.querySelector(
            "#input-label-dataNascimento .barra_input"
        );


    if (
        isNaN(dia) ||
        isNaN(mes) ||
        isNaN(ano) ||
        dia < 1 ||
        dia > 31 ||
        mes < 1 ||
        mes > 12 ||
        ano > anoAtual ||
        idade < 6 ||
        idade > 112
    ) {

        labelDataNascimento.innerText =
            "Data inválida";

        labelDataNascimento.style.color =
            "red";

        inputDataNascimento.classList.add(
            "barra_input-erro"
        );

        return;

    }


    labelDataNascimento.innerText =
        "Tudo Ok!";

    labelDataNascimento.style.color =
        "green";

    inputDataNascimento.classList.remove(
        "barra_input-erro"
    );


    /* =========================
    PREFERÊNCIAS
    ========================= */

    const preferenciasSelecionadas =
        document.querySelectorAll(
            'input[name="preferencias[]"]:checked'
        );


    const categorias =
        Array.from(
            preferenciasSelecionadas
        ).map(preferencia => {

            const categorias = {

                cinema: 1,
                arte: 2,
                festivais: 3,
                esportes: 4,
                gastronomia: 5,
                teatro: 6,
                musica: 7

            };

            return categorias[
                preferencia.value
            ];

        });


    /* =========================
    DADOS COMPLETOS
    ========================= */

    const dadosUsuario = {

        nome:
            dadosCadastro.nome,

        sobrenome:
            dadosCadastro.sobrenome,

        email:
            dadosCadastro.email,

        telefone:
            dadosCadastro.telefone,

        senha:
            dadosCadastro.senha,

        estado:
            estado,

        data_nascimento:
            dataNascimento,

        orcamento:
            orcamento,

        notificacoes_email:
            true,

        alertas_eventos:
            true,

        notificacoes_ofertas:
            false

    };


    try {

        const resposta =
            await fetch(
                "http://localhost:3000/usuarios",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            dadosUsuario
                        )
                }
            );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            console.error(resultado);

            alert(
                resultado.message ||
                "Erro ao realizar cadastro."
            );

            return;

        }


        /* =========================
        CADASTRO CONCLUÍDO
        ========================= */

        sessionStorage.removeItem(
            "dadosCadastro"
        );

        window.location.href =
            "login.html";
    } catch (erro) {
        console.error(
            "Erro ao cadastrar usuário:",
            erro
        );
        alert(
            "Não foi possível conectar com o servidor."
        );
    }
}