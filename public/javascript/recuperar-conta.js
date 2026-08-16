// public/javascript/recuperar-conta.js
// Fluxo real de recuperação de senha (RN009), nas 3 telas:
// esqueceu-senha.html -> inserir-token.html -> mudar-senha.html

function mostrarErro(mensagem) {
  const el = document.getElementById("alerta-erro");
  if (!el) return;
  el.textContent = mensagem;
  el.style.display = "block";
}

function limparErro() {
  const el = document.getElementById("alerta-erro");
  if (el) el.style.display = "none";
}

const pagina = window.location.pathname.split("/").pop();

// ============================================
// Tela 1: esqueceu-senha.html — pede o código
// ============================================
if (pagina === "esqueceu-senha.html") {
  const btnEnviar = document.getElementById("btn-enviar-codigo");

  btnEnviar?.addEventListener("click", async () => {
    const email = document.getElementById("preco").value.trim(); // id herdado do HTML original

    if (!email) {
      mostrarErro("Digite seu e-mail.");
      return;
    }

    limparErro();
    btnEnviar.disabled = true;
    btnEnviar.textContent = "Enviando...";

    try {
      const resposta = await fetch("/api/auth/recuperar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const dados = await resposta.json();

      sessionStorage.setItem("emailRecuperacao", email);

      // Ainda não há envio de e-mail real configurado no servidor — por isso,
      // em ambiente de desenvolvimento, o próprio backend devolve o código
      // na resposta (campo "token_dev") só para permitir testar o fluxo.
      if (dados.token_dev) {
        alert(
          `Como o envio de e-mail ainda não está configurado neste projeto, aqui está seu código de teste: ${dados.token_dev}`
        );
      }

      window.location.href = "inserir-token.html";
    } catch (erro) {
      mostrarErro("Não foi possível conectar ao servidor.");
    } finally {
      btnEnviar.disabled = false;
      btnEnviar.textContent = "Enviar Código";
    }
  });
}

// ============================================
// Tela 2: inserir-token.html — digita o código de 4 dígitos
// ============================================
if (pagina === "inserir-token.html") {
  const campos = ["cod1", "cod2", "cod3", "cod4"].map((id) => document.getElementById(id));

  // Move o foco automaticamente pro próximo campo ao digitar
  campos.forEach((campo, indice) => {
    campo.addEventListener("input", () => {
      if (campo.value && indice < campos.length - 1) {
        campos[indice + 1].focus();
      }
    });
  });

  document.getElementById("btn-reenviar-codigo")?.addEventListener("click", async () => {
    const email = sessionStorage.getItem("emailRecuperacao");
    if (!email) {
      mostrarErro("Sessão expirada. Volte e informe seu e-mail novamente.");
      return;
    }

    try {
      const resposta = await fetch("/api/auth/recuperar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const dados = await resposta.json();
      if (dados.token_dev) {
        alert(`Novo código de teste: ${dados.token_dev}`);
      }
    } catch (erro) {
      mostrarErro("Não foi possível reenviar o código.");
    }
  });

  document.getElementById("btn-confirmar-codigo")?.addEventListener("click", () => {
    const token = campos.map((c) => c.value).join("");

    if (token.length !== 4) {
      mostrarErro("Digite os 4 dígitos do código.");
      return;
    }

    // A validação de verdade do token acontece no próximo passo (junto com a nova senha),
    // porque a rota /api/auth/redefinir-senha exige os dois juntos.
    sessionStorage.setItem("tokenRecuperacao", token);
    window.location.href = "mudar-senha.html";
  });
}

// ============================================
// Tela 3: mudar-senha.html — define a nova senha (RN004 aplicada aqui também)
// ============================================
if (pagina === "mudar-senha.html") {
  document.getElementById("btn-concluir")?.addEventListener("click", async () => {
    const email = sessionStorage.getItem("emailRecuperacao");
    const token = sessionStorage.getItem("tokenRecuperacao");
    const novaSenha = document.getElementById("senha_nova").value;
    const confirmar = document.getElementById("confirmar_senha_nova").value;

    if (!email || !token) {
      mostrarErro("Sessão expirada. Reinicie o processo de recuperação de senha.");
      return;
    }
    if (!novaSenha || !confirmar) {
      mostrarErro("Preencha a nova senha nos dois campos.");
      return;
    }
    if (novaSenha !== confirmar) {
      mostrarErro("As senhas não coincidem.");
      return;
    }

    const btn = document.getElementById("btn-concluir");
    btn.disabled = true;
    btn.textContent = "Salvando...";
    limparErro();

    try {
      const resposta = await fetch("/api/auth/redefinir-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, novaSenha })
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        mostrarErro(dados.erro || "Não foi possível redefinir a senha.");
        return;
      }

      sessionStorage.removeItem("emailRecuperacao");
      sessionStorage.removeItem("tokenRecuperacao");
      alert("Senha redefinida com sucesso! Faça login com a nova senha.");
      window.location.href = "login.html";
    } catch (erro) {
      mostrarErro("Não foi possível conectar ao servidor.");
    } finally {
      btn.disabled = false;
      btn.textContent = "Concluir";
    }
  });
}
