document.addEventListener("DOMContentLoaded", () => {
  // Seletores Desktop
  const visitanteDesktop = document.getElementById("auth-visitante-desktop");
  const usuarioDesktop = document.getElementById("auth-usuario-desktop");
  
  // Seletores Mobile (Barra Lateral)
  const visitanteMobile = document.getElementById("auth-visitante-mobile");
  const usuarioMobile = document.getElementById("auth-usuario-mobile");

  // Captura os campos onde colocaremos o nome do perfil
  const nomesPerfil = document.querySelectorAll(".nome-perfil");
  // Captura todos os botões de logout
  const botoesSair = document.querySelectorAll(".btn-sair");

  // 1. TENTA LER A SESSÃO DO LOCAL STORAGE
  const dadosSessao = localStorage.getItem("usuario_logado");

  if (dadosSessao) {
    try {
      const usuario = JSON.parse(dadosSessao);

      // Altera elementos da visualização de Desktop
      if (visitanteDesktop) visitanteDesktop.style.display = "none";
      if (usuarioDesktop) usuarioDesktop.style.display = "flex";

      // Altera elementos da visualização de Celular (Mobile)
      if (visitanteMobile) visitanteMobile.style.display = "none";
      if (usuarioMobile) usuarioMobile.style.display = "flex";

      // Injeta o nome do usuário cadastrado em todos os blocos de saudação
      nomesPerfil.forEach((span) => {
        span.textContent = `Olá, ${usuario.nome || "Usuário"}`;
      });

    } catch (e) {
      console.error("Erro ao ler dados da sessão:", e);
      localStorage.removeItem("usuario_logado");
    }
  }

  // 2. CONFIGURA A LÓGICA DE LOGOUT PARA AMBOS OS BOTÕES (MOBILE E DESKTOP)
  botoesSair.forEach((botao) => {
    botao.addEventListener("click", () => {
      localStorage.removeItem("usuario_logado");
      alert("Sessão encerrada com sucesso!");
      location.reload(); // Recarrega a página para voltar ao estado original de visitante
    });
  });
});
