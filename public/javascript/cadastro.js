document.addEventListener("DOMContentLoaded", () => {
  const campoData = document.getElementById("data_nascimento");
  
  // Lógica dos olhos da senha na tela de cadastro
  const oSenha = document.getElementById("olho-senha");
  const cSenha = document.getElementById("senha");
  const oConfirmar = document.getElementById("olho-confirmar");
  const cConfirmar = document.getElementById("confirmar_senha");

  // Ativa a funcionalidade do primeiro olho (Senha)
  if (oSenha && cSenha) {
    oSenha.addEventListener("click", () => {
      if (cSenha.type === "password") {
        cSenha.type = "text";
        oSenha.classList.remove("bi-eye-slash");
        oSenha.classList.add("bi-eye"); // Ícone de olho aberto
      } else {
        cSenha.type = "password";
        oSenha.classList.remove("bi-eye");
        oSenha.classList.add("bi-eye-slash"); // Ícone de olho fechado
      }
    });
  }

  // Ativa a funcionalidade do segundo olho (Confirmar Senha)
  if (oConfirmar && cConfirmar) {
    oConfirmar.addEventListener("click", () => {
      if (cConfirmar.type === "password") {
        cConfirmar.type = "text";
        oConfirmar.classList.remove("bi-eye-slash");
        oConfirmar.classList.add("bi-eye"); // Ícone de olho aberto
      } else {
        cConfirmar.type = "password";
        oConfirmar.classList.remove("bi-eye");
        oConfirmar.classList.add("bi-eye-slash"); // Ícone de olho fechado
      }
    });
  }

  // Trava o calendário para não permitir a escolha de datas futuras
  if (campoData) {
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = String(hoje.getMonth() + 1).padStart(2, "0");
    const diaAtual = String(hoje.getDate()).padStart(2, "0");
    const dataDeHojeFormatada = `${anoAtual}-${mesAtual}-${diaAtual}`;
    campoData.max = dataDeHojeFormatada;
  }
});

const btnCadastrar = document.getElementById("pegarValores");
const alertaErro = document.getElementById("alerta-erro");

function mostrarErro(mensagem) {
  alertaErro.textContent = mensagem;
  alertaErro.style.color = "red";
  alertaErro.style.display = "block";
  alertaErro.style.fontSize = "14px";
  alertaErro.style.textAlign = "center";
}

function limparErro() {
  alertaErro.style.display = "none";
}

function calcularIdade(dataNascimento) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const diferencaMeses = hoje.getMonth() - nascimento.getMonth();
  if (diferencaMeses < 0 || (diferencaMeses === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

btnCadastrar.addEventListener("click", async (evento) => {
  evento.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const sobrenome = document.getElementById("sobrenome").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const dataNascimento = document.getElementById("data_nascimento").value;
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmar_senha").value;

  if (!nome || !email || !senha || !confirmarSenha || !dataNascimento) {
    mostrarErro("Preencha todos os campos obrigatórios, incluindo a data de nascimento.");
    return;
  }

  const idadeUsuario = calcularIdade(dataNascimento);
  if (idadeUsuario < 18) {
    mostrarErro("Você deve ter pelo menos 18 anos para se cadastrar.");
    return;
  }

  const dataPreenchida = new Date(dataNascimento);
  if (dataPreenchida > new Date()) {
    mostrarErro("A data de nascimento não pode ser uma data futura.");
    return;
  }

  if (senha !== confirmarSenha) {
    mostrarErro("As senhas não coincidem.");
    return;
  }

  limparErro();
  btnCadastrar.disabled = true;
  btnCadastrar.textContent = "Cadastrando...";

  try {
    const nomeCompleto = sobrenome ? `${nome} ${sobrenome}` : nome;

    const respostaCadastro = await fetch("/api/auth/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        nome: nomeCompleto,
        nome_usuario: nome.toLowerCase().replace(/[^a-z0-9]/g, ""),
        email,
        senha,
        telefone: telefone || undefined,
        data_nascimento: dataNascimento
      })
    });

    const dadosCadastro = await respostaCadastro.json();

    if (!respostaCadastro.ok) {
      if (dadosCadastro.erros && dadosCadastro.erros.length > 0) {
        mostrarErro(dadosCadastro.erros.map((e) => e.msg).join(" "));
      } else {
        mostrarErro(dadosCadastro.erro || "Não foi possível concluir o cadastro.");
      }
      return;
    }

    if (dadosCadastro.token_dev) {
      sessionStorage.setItem("token_teste_confirmacao", dadosCadastro.token_dev);
    }

    sessionStorage.setItem("email_pendente_confirmacao", email);
    location.href = "confirmar-email.html";
  } catch (erro) {
    mostrarErro("Não foi possível conectar ao servidor. Verifique se ele está rodando.");
  } finally {
    btnCadastrar.disabled = false;
    btnCadastrar.textContent = "Cadastre-se";
  }
});
