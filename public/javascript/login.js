document.addEventListener("DOMContentLoaded", () => {
  // Busca o botão de login de forma inteligente
  let btnLogin = document.getElementById("pegarValores") || 
                 document.querySelector("button.btn-preferencia") || 
                 document.querySelector("button");

  if (!btnLogin || btnLogin.textContent.trim() !== "Login") {
    const botoes = document.querySelectorAll("button");
    botoes.forEach((btn) => {
      if (btn.textContent.trim() === "Login") {
        btnLogin = btn;
      }
    });
  }

  const alertaErro = document.getElementById("alerta-erro");
  const campoSenha = document.getElementById("senha");

  function mostrarErro(mensagem) {
    if (alertaErro) {
      alertaErro.textContent = mensagem;
      alertaErro.style.color = "red";
      alertaErro.style.display = "block";
      alertaErro.style.fontSize = "14px";
      alertaErro.style.textAlign = "center";
      alertaErro.style.marginTop = "10px";
    }
  }

  if (btnLogin) {
    btnLogin.addEventListener("click", async (evento) => {
      evento.preventDefault();

      const emailInput = document.getElementById("email");
      const senhaInput = document.getElementById("senha");

      if (!emailInput || !senhaInput) return;

      const email = emailInput.value.trim();
      const senha = senhaInput.value;

      if (!email || !senha) {
        mostrarErro("Por favor, preencha todos os campos.");
        return;
      }

      btnLogin.disabled = true;
      btnLogin.textContent = "Entrando...";

      try {
        const resposta = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha })
        });

        // 1. SE A RESPOSTA NÃO FOR OK, PEGA O ERRO E EXIBE NA TELA
        if (!resposta.ok) {
          const dadosErro = await resposta.json();
          mostrarErro(dadosErro.erro || "E-mail ou senha incorretos.");
          return;
        }

        // 2. SE CHEGOU AQUI, O LOGIN DEU CERTO NO NESTJS!
        // Tentamos ler o corpo da resposta de forma segura
        let nomeExibicao = "Usuário";
        try {
          const dadosUsuario = await resposta.json();
          nomeExibicao = dadosUsuario.nome_usuario || dadosUsuario.nome || email.split('@')[0];
        } catch (e) {
          // Caso o NestJS responda algo vazio, usamos o prefixo do e-mail como nome
          nomeExibicao = email.split('@')[0];
        }

        // 3. SALVA DE FORMA GARANTIDA NO LOCALSTORAGE
        localStorage.setItem("usuario_logado", JSON.stringify({
          nome: nomeExibicao,
          email: email
        }));

        alert("Login realizado com sucesso!");
        location.href = "index.html"; 

      } catch (erro) {
        console.error("Erro na requisição de login:", erro);
        mostrarErro("Não foi possível conectar ao servidor.");
      } finally {
        btnLogin.disabled = false;
        btnLogin.textContent = "Login";
      }
    });
  }
});
