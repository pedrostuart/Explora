// public/javascript/preferencias.js

let categoriasSelecionadas = [];

// ============================================
// Carrega as categorias reais do banco (RN026) e marca as que
// o usuário já tinha escolhido antes (RN027 — pode alterar a qualquer momento)
// ============================================
async function carregarCategorias() {
  const containerBotoes = document.querySelector(".label-preferencias");
  containerBotoes.innerHTML = "<p>Carregando categorias...</p>";

  try {
    const [respCategorias, respPreferencias] = await Promise.all([
      fetch("/api/categorias"),
      fetch("/api/preferencias", { credentials: "include" })
    ]);

    const { categorias } = await respCategorias.json();
    const dadosPreferencias = respPreferencias.ok ? await respPreferencias.json() : { preferencias: [] };
    categoriasSelecionadas = dadosPreferencias.preferencias.map((p) => p.id);

    containerBotoes.innerHTML = "";
    categorias.forEach((categoria) => {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.textContent = categoria.nome;
      botao.dataset.id = categoria.id;
      if (categoriasSelecionadas.includes(categoria.id)) {
        botao.classList.add("selecionado");
      }
      botao.addEventListener("click", () => alternarCategoria(categoria.id, botao));
      containerBotoes.appendChild(botao);
    });
  } catch (erro) {
    containerBotoes.innerHTML = "<p>Não foi possível carregar as categorias. Verifique se o servidor está rodando.</p>";
  }
}

function alternarCategoria(id, botao) {
  const posicao = categoriasSelecionadas.indexOf(id);
  if (posicao === -1) {
    categoriasSelecionadas.push(id);
    botao.classList.add("selecionado");
  } else {
    categoriasSelecionadas.splice(posicao, 1);
    botao.classList.remove("selecionado");
  }
}

carregarCategorias();

// ============================================
// Finalizar cadastro: valida visualmente data de nascimento/orçamento
// (comportamento original preservado) e salva cidade (RN022) +
// preferências (RN026-029) de verdade na API
// ============================================
let finalizarCadastro = document.querySelector(".btn-finalizar");
finalizarCadastro.addEventListener("click", verificarInputs);

async function verificarInputs(event) {
  event.preventDefault();

  /* DATA DE NASCIMENTO — validação visual original, preservada */
  const anoAtual = new Date().getFullYear();
  const anoIdade = parseInt(document.getElementById("ano").value);
  const mesIdade = parseInt(document.getElementById("mes").value);
  const diaIdade = parseInt(document.getElementById("dia").value);
  const labelDataNascimento = document.getElementById("labelDataNascimento");
  const idadeDoUsuario = anoAtual - anoIdade;
  const inputDataNascimento = document.querySelector("#input-label-dataNascimento .barra_input");

  if (
    anoIdade > anoAtual ||
    idadeDoUsuario < 6 ||
    mesIdade > 12 ||
    diaIdade > 31 ||
    idadeDoUsuario > 112 ||
    isNaN(diaIdade) ||
    isNaN(mesIdade) ||
    isNaN(anoIdade)
  ) {
    labelDataNascimento.style.color = "red";
    labelDataNascimento.innerHTML = "Data inválida";
    inputDataNascimento.classList.add("barra_input-erro");
  } else {
    labelDataNascimento.innerText = "Tudo Ok!";
    labelDataNascimento.style.color = "green";
    inputDataNascimento.classList.remove("barra_input-erro");
  }

  /* ORÇAMENTO — validação visual original, preservada */
  const verba = parseFloat(document.getElementById("preco").value);
  const inputVerba = document.querySelector("#input-label-preco .barra_input");
  const labelPreco = document.getElementById("labelPreco");
  if (isNaN(verba)) {
    inputVerba.classList.add("barra_input-erro");
    labelPreco.style.display = "block";
  } else {
    inputVerba.classList.remove("barra_input-erro");
    labelPreco.style.display = "none";
  }

  /* LOCAL — aqui é onde a regra de verdade (RN022) entra */
  const localSelect = document.querySelector("#input-label-local .barra_input #local");
  const local = localSelect.value;
  const localTexto = localSelect.options[localSelect.selectedIndex]?.text || "";
  const labelLocal = document.querySelector("#labelLocal");
  const barraLocal = document.querySelector("#input-label-local .barra_input");

  if (local === "") {
    labelLocal.style.display = "block";
    barraLocal.classList.add("barra_input-erro");
    return; // sem cidade não seguimos — RN022 depende dela
  } else {
    labelLocal.style.display = "none";
    barraLocal.classList.remove("barra_input-erro");
  }

  finalizarCadastro.disabled = true;
  finalizarCadastro.textContent = "Salvando...";

  try {
    // RN022 — cidade cadastrada, usada depois nas recomendações
    await fetch("/api/usuarios/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ cidade: localTexto })
    });

    // RN026/027/029 — preferências (categorias) do usuário
    await fetch("/api/preferencias", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ categorias: categoriasSelecionadas })
    });

    location.href = "perfil.html";
  } catch (erro) {
    alert("Não foi possível salvar. Verifique se o servidor está rodando.");
    finalizarCadastro.disabled = false;
    finalizarCadastro.textContent = "Finalizar Cadastro";
  }
}

/* DIALOG — abrir/fechar modal, igual ao original */
let btnEscolherPreferencias = document.querySelector(".aplicar-preferencias");
let modal = document.querySelector(".modal");
btnEscolherPreferencias.addEventListener("click", abrirModal);

function abrirModal(e) {
  e.preventDefault();
  modal.showModal ? modal.showModal() : (modal.style.display = "block");
}
let btnAplicarModal = document.querySelector(".aplicar");
btnAplicarModal.addEventListener("click", fecharModal);

function fecharModal(e) {
  e.preventDefault();
  modal.close ? modal.close() : (modal.style.display = "none");
}
