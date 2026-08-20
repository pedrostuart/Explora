document.addEventListener("DOMContentLoaded", () => {
  // Mapeia os inputs usando os IDs reais do seu HTML
  const inputs = [
    document.getElementById("cod1"),
    document.getElementById("cod2"),
    document.getElementById("cod3"),
    document.getElementById("cod4"),
    document.getElementById("cod5"),
    document.getElementById("cod6")
  ];
  
  const btnConfirmar = document.getElementById("btn-confirmar-codigo");
  const btnReenviar = document.getElementById("btn-reenviar-codigo");
  const alertaErro = document.getElementById("alerta-erro");

  const emailUsuario = sessionStorage.getItem("email_pendente_confirmacao");
  const tokenDev = sessionStorage.getItem("token_teste_confirmacao");

  // PREENCHE AUTOMATICAMENTE SE O TOKEN EXISTIR NA SESSÃO
  if (tokenDev && tokenDev.length === 6) {
    inputs.forEach((input, index) => {
      if (input) input.value = tokenDev[index];
    });
  }

  if (!emailUsuario) {
    mostrarErro("E-mail não encontrado. Por favor, refaça o cadastro.");
  }

  function mostrarErro(mensagem, cor = "red") {
    alertaErro.textContent = mensagem;
    alertaErro.style.color = cor;
    alertaErro.style.display = "block";
    alertaErro.style.textAlign = "center";
  }

  function limparErro() {
    alertaErro.style.display = "none";
  }

  // Comportamento de pular para o próximo quadradinho ao digitar
  inputs.forEach((input, index) => {
    if (!input) return;

    input.addEventListener("input", (e) => {
      const valor = e.target.value;
      if (valor.length === 1 && index < inputs.length - 1 && inputs[index + 1]) {
        inputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !e.target.value && index > 0 && inputs[index - 1]) {
        inputs[index - 1].focus();
      }
    });
  });

  // Ação de clique do botão confirmar
  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", async () => {
      limparErro();

      if (!emailUsuario) {
        mostrarErro("Erro: Sessão expirada. Volte para a página de cadastro.");
        return;
      }

      let tokenCompleto = "";
      inputs.forEach((input) => {
        if (input) tokenCompleto += input.value.trim();
      });

      if (tokenCompleto.length < 6) {
        mostrarErro("Por favor, digite o código completo de 6 dígitos.");
        return;
      }

      btnConfirmar.disabled = true;
      btnConfirmar.textContent = "Verificando...";

      try {
        const resposta = await fetch("/api/auth/confirmar-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailUsuario,
            token: tokenCompleto,
          }),
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
          mostrarErro(dados.erro || "Código inválido ou expirado.");
          return;
        }

        mostrarErro(dados.mensagem, "green");
        
        sessionStorage.removeItem("email_pendente_confirmacao");
        sessionStorage.removeItem("token_teste_confirmacao");
        setTimeout(() => {
          location.href = "login.html";
        }, 2000);

      } catch (erro) {
        mostrarErro("Não foi possível conectar ao servidor.");
      } finally {
        btnConfirmar.disabled = false;
        btnConfirmar.textContent = "Confirmar e-mail";
      }
    });
  }

  // Ação de clique do botão reenviar código
  if (btnReenviar) {
    btnReenviar.addEventListener("click", async () => {
      limparErro();

      if (!emailUsuario) {
        mostrarErro("Erro: E-mail de destino desconhecido.");
        return;
      }

      btnReenviar.disabled = true;
      btnReenviar.textContent = "Enviando...";

      try {
        const resposta = await fetch("/api/auth/reenviar-confirmacao", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailUsuario }),
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
          mostrarErro(dados.erro || "Não foi possível reenviar o código.");
          return;
        }

        // Se o reenvio gerou um novo token de teste, preenche na hora
        if (dados.token_dev) {
          sessionStorage.setItem("token_teste_confirmacao", dados.token_dev);
          inputs.forEach((input, index) => {
            if (input) input.value = dados.token_dev[index];
          });
        }

        mostrarErro("Um novo código de 6 dígitos foi gerado.", "green");
      } catch (erro) {
        mostrarErro("Erro ao conectar com o servidor.");
      } finally {
        btnReenviar.disabled = false;
        btnReenviar.textContent = "Reenviar código";
      }
    });
  }
});
