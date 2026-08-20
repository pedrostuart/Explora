// public/javascript/perfil.js

/* ============================================
   ABRIR E FECHAR CAIXAS (lógica visual original, preservada)
   ============================================ */
const botoes = document.querySelectorAll(".btn-atividade, .btn-favoritos, .btn-config");
const caixas = document.querySelectorAll(".box-historico, .box-favoritos, .box-dados");

function corTexto() {
  botoes.forEach((btn) => (btn.style.color = "black"));
}
function boxSome() {
  caixas.forEach((box) => (box.style.display = "none"));
}
botoes[0]?.addEventListener("click", () => {
  corTexto();
  botoes[0].style.color = "#1A824D";
  boxSome();
  caixas[0].style.display = "flex";
});
botoes[1]?.addEventListener("click", () => {
  corTexto();
  botoes[1].style.color = "#1A824D";
  boxSome();
  caixas[1].style.display = "flex";
});
botoes[2]?.addEventListener("click", () => {
  corTexto();
  botoes[2].style.color = "#1A824D";
  boxSome();
  caixas[2].style.display = "flex";
});

/* ============================================
   MODAL DE SALVAR (flash visual original, preservado)
   ============================================ */
const modalSalvar = document.querySelector(".modal-salvar");
function mostrarModalSalvo() {
  if (!modalSalvar) return;
  modalSalvar.style.display = "flex";
  setTimeout(() => {
    modalSalvar.style.display = "none";
  }, 1200);
}

/* ============================================
   Carregar dados reais do usuário logado (RN011/012)
   ============================================ */
let categoriasSelecionadas = [];

async function carregarPerfil() {
  try {
    const resposta = await fetch("/api/usuarios/me", { credentials: "include" });

    if (!resposta.ok) {
      location.href = "login.html";
      return;
    }

    const { usuario } = await resposta.json();

    document.getElementById("nome-cabecalho").textContent = usuario.nome;
    document.getElementById("subtitulo-cabecalho").textContent = usuario.cidade
      ? `Exploradora de eventos - ${usuario.cidade}`
      : "Exploradora de eventos";

    document.getElementById("nome-usuario").value = usuario.nome || "";
    document.getElementById("email-usuario").value = usuario.email || "";
    document.getElementById("tel-usuario").value = usuario.telefone || "";

    if (usuario.foto) {
      document.getElementById("foto-perfil").src = usuario.foto;
    }

    const selectLocal = document.getElementById("local");
    if (usuario.cidade && selectLocal) {
      const opcao = Array.from(selectLocal.options).find(
        (o) => o.text.toLowerCase() === usuario.cidade.toLowerCase()
      );
      if (opcao) selectLocal.value = opcao.value;
    }

    carregarPreferenciasAtuais();
  } catch (erro) {
    console.error("Não foi possível carregar o perfil:", erro);
  }
}

/* ============================================
   Preferências (RN026-029) — categorias reais do banco
   ============================================ */
async function carregarPreferenciasAtuais() {
  try {
    const [respCategorias, respPreferencias] = await Promise.all([
      fetch("/api/categorias"),
      fetch("/api/preferencias", { credentials: "include" })
    ]);

    const { categorias } = await respCategorias.json();
    const { preferencias } = await respPreferencias.json();
    categoriasSelecionadas = preferencias.map((p) => p.id);

    const container = document.querySelector("main > dialog.modal .label-preferencias");
    if (!container) return;
    container.innerHTML = "";

    categorias.forEach((categoria) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = categoria.id;
      input.className = "btn-preferencia";
      if (categoriasSelecionadas.includes(categoria.id)) input.checked = true;

      input.addEventListener("change", () => {
        const id = Number(input.value);
        if (input.checked) {
          if (!categoriasSelecionadas.includes(id)) categoriasSelecionadas.push(id);
        } else {
          categoriasSelecionadas = categoriasSelecionadas.filter((c) => c !== id);
        }
      });

      label.appendChild(input);
      label.appendChild(document.createTextNode(" " + categoria.nome));
      container.appendChild(label);
    });
  } catch (erro) {
    console.error("Não foi possível carregar categorias:", erro);
  }
}

/* MODAL de preferências (abrir/fechar, igual ao original, mas com <dialog> nativo) */
const modalPreferencias = document.querySelector("main > dialog.modal");
document.querySelector(".aplicar-preferencias")?.addEventListener("click", (e) => {
  e.preventDefault();
  modalPreferencias?.showModal();
});

document.querySelector("main > dialog.modal .aplicar")?.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await fetch("/api/preferencias", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ categorias: categoriasSelecionadas })
    });
    modalPreferencias?.close();
  } catch (erro) {
    alert("Não foi possível salvar as preferências.");
  }
});

/* ============================================
   Salvar dados do perfil (RN012/013/014/021/025)
   ============================================ */
document.querySelector(".salvar")?.addEventListener("click", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome-usuario").value.trim();
  const telefone = document.getElementById("tel-usuario").value.trim();
  const selectLocal = document.getElementById("local");
  const cidade = selectLocal.options[selectLocal.selectedIndex]?.text || "";

  try {
    const resposta = await fetch("/api/usuarios/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ nome, telefone: telefone || undefined, cidade: cidade || undefined })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      const msg = dados.erros ? dados.erros.map((e) => e.msg).join(" ") : dados.erro;
      alert(msg || "Não foi possível salvar.");
      return;
    }

    mostrarModalSalvo();
    carregarPerfil();
  } catch (erro) {
    alert("Não foi possível conectar ao servidor.");
  }
});

/* ============================================
   Foto de perfil (RN015/016/023)
   ============================================ */
document.getElementById("foto-perfil")?.addEventListener("click", () => {
  document.getElementById("input-foto-perfil")?.click();
});

document.getElementById("input-foto-perfil")?.addEventListener("change", async (e) => {
  const arquivo = e.target.files[0];
  if (!arquivo) return;

  const formData = new FormData();
  formData.append("foto", arquivo);

  try {
    const resposta = await fetch("/api/usuarios/me/foto", {
      method: "POST",
      credentials: "include",
      body: formData
    });
    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.erro || "Não foi possível enviar a foto.");
      return;
    }

    document.getElementById("foto-perfil").src = dados.foto;
  } catch (erro) {
    alert("Não foi possível conectar ao servidor.");
  }
});

/* ============================================
   Desativar conta (RN020)
   ============================================ */
document.querySelector(".btn-desativar-conta")?.addEventListener("click", async () => {
  if (!confirm("Tem certeza que deseja desativar sua conta?")) return;
  await fetch("/api/usuarios/me/desativar", { method: "PUT", credentials: "include" });
  location.href = "index.html";
});

/* ============================================
   Excluir conta (RN017/018, LGPD)
   ============================================ */
document.querySelector(".btn-excluir-conta")?.addEventListener("click", async () => {
  if (!confirm("Esta ação é permanente e removerá seus dados pessoais. Deseja continuar?")) return;
  await fetch("/api/usuarios/me", { method: "DELETE", credentials: "include" });
  location.href = "index.html";
});

carregarPerfil();
