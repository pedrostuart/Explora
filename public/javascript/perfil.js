
/* =========================================
   AUTENTICAÇÃO
========================================= */

const token = localStorage.getItem("token");

const btnEntrar =
    document.querySelectorAll("#entrar");

const btnCadastrar =
    document.querySelectorAll("#cadastrar");

const btnLogout =
    document.getElementById("btn-logout");


function atualizarMenu() {

    if (token) {

        btnEntrar.forEach(botao => {
            botao.style.display = "none";
        });

        btnCadastrar.forEach(botao => {
            botao.style.display = "none";
        });

        if (btnLogout) {
            btnLogout.style.display = "block";
        }

    } else {

        btnEntrar.forEach(botao => {
            botao.style.display = "block";
        });

        btnCadastrar.forEach(botao => {
            botao.style.display = "block";
        });

        if (btnLogout) {
            btnLogout.style.display = "none";
        }

    }

}


atualizarMenu();


/* =========================================
SAIR
========================================= */

if (btnLogout) {

    btnLogout.addEventListener("click", () => {
        let confirmacao = confirm('Tem certeza que quer sair da conta')
        if(confirmacao){
            localStorage.removeItem("token");

            localStorage.removeItem("usuario");

            window.location.href = "index.html";
        }
        

    });

}


/* =========================================
   ELEMENTOS DO PERFIL
========================================= */

const nomePerfil =
    document.querySelector(".info-usuario h1");

const descricaoPerfil =
    document.querySelector(".info-usuario p");

const inputNome =
    document.getElementById("nome-usuario");

const inputEmail =
    document.getElementById("email-usuario");

const inputTelefone =
    document.getElementById("telefone-usuario");

const selectEstado =
    document.getElementById("local");

const btnSalvar =
    document.querySelector(".salvar");

const modalSalvar =
    document.querySelector(".modal-salvar");


/* =========================================
   ESTADOS
========================================= */

function transformarEstado(estado) {

    const estados = {

        "Acre": "acre",
        "Alagoas": "alagoas",
        "Amapá": "amapa",
        "Amazonas": "amazonas",
        "Bahia": "bahia",
        "Ceará": "ceara",
        "Distrito Federal": "distrito-federal",
        "Espírito Santo": "espirito-santo",
        "Goiás": "goias",
        "Maranhão": "maranhao",
        "Mato Grosso": "mato-grosso",
        "Mato Grosso do Sul": "mato-grosso-do-sul",
        "Minas Gerais": "minas-gerais",
        "Pará": "para",
        "Paraíba": "paraiba",
        "Paraná": "parana",
        "Pernambuco": "pernambuco",
        "Piauí": "piaui",
        "Rio de Janeiro": "rio-de-janeiro",
        "Rio Grande do Norte": "rio-grande-do-norte",
        "Rio Grande do Sul": "rio-grande-do-sul",
        "Rondônia": "rondonia",
        "Roraima": "roraima",
        "Santa Catarina": "santa-catarina",
        "São Paulo": "sao-paulo",
        "Sergipe": "sergipe",
        "Tocantins": "tocantins"

    };

    return estados[estado] || "";

}


function nomeEstado(value) {

    const option =
        selectEstado.querySelector(
            `option[value="${value}"]`
        );

    return option
        ? option.textContent
        : value;

}


/* =========================================
   CARREGAR PERFIL
========================================= */

async function carregarPerfil() {

    if (!token) {

        window.location.href = "login.html";

        return;

    }


    try {

        const resposta = await fetch(
            "http://localhost:3000/usuarios/perfil",
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            if (resposta.status === 401) {

                localStorage.removeItem("token");

                localStorage.removeItem("usuario");

                window.location.href = "login.html";

                return;

            }


            alert(
                resultado.message ||
                "Não foi possível carregar o perfil."
            );

            return;

        }


        const usuario =
            resultado.usuario;


        /* CABEÇALHO */

        nomePerfil.textContent =
            `${usuario.nome} ${usuario.sobrenome}`;


        descricaoPerfil.textContent =
            `Explorador de eventos - ${usuario.estado}`;


        /* CAMPOS */

        inputNome.value =
            usuario.nome;


        inputEmail.value =
            usuario.email;


        inputTelefone.value =
            usuario.telefone;


        selectEstado.value =
            transformarEstado(usuario.estado);


        /* NOTIFICAÇÕES */

        const notificacaoEmail =
            document.querySelector(
                'input[name="not-email"]'
            );

        const alertasEventos =
            document.querySelector(
                'input[name="not-eventos"]'
            );

        const notificacoesOfertas =
            document.querySelector(
                'input[name="not-ofertas"]'
            );


        if (notificacaoEmail) {

            notificacaoEmail.checked =
                Boolean(usuario.notificacoes_email);

        }


        if (alertasEventos) {

            alertasEventos.checked =
                Boolean(usuario.alertas_eventos);

        }


        if (notificacoesOfertas) {

            notificacoesOfertas.checked =
                Boolean(usuario.notificacoes_ofertas);

        }


        /* LOCAL STORAGE */

        localStorage.setItem(
            "usuario",
            JSON.stringify(usuario)
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar perfil:",
            erro
        );

        alert(
            "Não foi possível conectar com o servidor."
        );

    }

}


carregarPerfil();


/* =========================================
   SALVAR ALTERAÇÕES
========================================= */

if (btnSalvar) {

    btnSalvar.addEventListener(
        "click",
        async function(event) {

            event.preventDefault();


            const nomeCompleto =
                inputNome.value.trim();


            if (!nomeCompleto) {

                alert("Digite seu nome.");

                return;

            }


            const partesNome =
                nomeCompleto.split(/\s+/);


            const nome =
                partesNome.shift();


            const sobrenome =
                partesNome.join(" ");


            if (!sobrenome) {

                alert("Digite seu sobrenome.");

                return;

            }


            const estado =
                nomeEstado(selectEstado.value);


            const dados = {

                nome: nome,

                sobrenome: sobrenome,

                email: inputEmail.value.trim(),

                telefone: inputTelefone.value.trim(),

                estado: estado

            };


            try {

                const resposta =
                    await fetch(
                        "http://localhost:3000/usuarios/perfil",
                        {
                            method: "PATCH",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`
                            },

                            body:
                                JSON.stringify(dados)
                        }
                    );


                const resultado =
                    await resposta.json();


                if (!resposta.ok) {

                    alert(
                        resultado.message ||
                        "Não foi possível salvar as alterações."
                    );

                    return;

                }


                /* ATUALIZA CABEÇALHO */

                nomePerfil.textContent =
                    `${dados.nome} ${dados.sobrenome}`;


                descricaoPerfil.textContent =
                    `Explorador de eventos - ${dados.estado}`;


                /* ATUALIZA LOCAL STORAGE */

                const usuarioAtual =
                    JSON.parse(
                        localStorage.getItem("usuario")
                    ) || {};


                const usuarioAtualizado = {

                    ...usuarioAtual,

                    nome: dados.nome,

                    sobrenome: dados.sobrenome,

                    email: dados.email,

                    telefone: dados.telefone,

                    estado: dados.estado

                };


                localStorage.setItem(
                    "usuario",
                    JSON.stringify(usuarioAtualizado)
                );


                /* MODAL */

                modalSalvar.style.display =
                    "flex";


                setTimeout(() => {

                    modalSalvar.style.display =
                        "none";

                }, 1000);


            } catch (erro) {

                console.error(
                    "Erro ao salvar perfil:",
                    erro
                );

                alert(
                    "Não foi possível conectar com o servidor."
                );

            }

        }
    );

}


/* =========================================
   ABRIR E FECHAR CAIXAS
========================================= */

const botoes =
    document.querySelectorAll(
        ".btn-atividade, .btn-favoritos, .btn-config"
    );


const caixas =
    document.querySelectorAll(
        ".box-historico, .box-favoritos, .box-dados"
    );


function corTexto() {

    botoes.forEach(btn => {

        btn.style.color = "black";

    });

}


function boxSome() {

    caixas.forEach(box => {

        box.style.display = "none";

    });

}


/* ATIVIDADE */

botoes[0].addEventListener(
    "click",
    () => {

        corTexto();

        botoes[0].style.color =
            "#1A824D";

        boxSome();

        caixas[0].style.display =
            "flex";

    }
);


/* FAVORITOS */

botoes[1].addEventListener(
    "click",
    () => {

        corTexto();

        botoes[1].style.color =
            "#1A824D";

        boxSome();

        caixas[1].style.display =
            "flex";

    }
);


/* CONFIGURAÇÕES */

botoes[2].addEventListener(
    "click",
    () => {

        corTexto();

        botoes[2].style.color =
            "#1A824D";

        boxSome();

        caixas[2].style.display =
            "flex";

    }
);


/* =========================================
   MODAL DE PREFERÊNCIAS
========================================= */

const btnEscolherPreferencias =
    document.querySelector(
        ".aplicar-preferencias"
    );


const modal =
    document.querySelector(".modal");


if (btnEscolherPreferencias) {

    btnEscolherPreferencias.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            modal.style.display =
                "flex";

        }
    );

}


const btnAplicarModal =
    document.querySelector(".aplicar");


if (btnAplicarModal) {

    btnAplicarModal.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            modal.style.display =
                "none";

        }
    );

}

