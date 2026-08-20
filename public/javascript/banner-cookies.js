// public/javascript/banner-cookies.js
// RN-016 — banner de consentimento de cookies, exibido em todas as páginas
// até o usuário aceitar (ou apenas fechar) uma vez.

(function () {
  const CHAVE = "explora_consentimento_cookies";

  if (localStorage.getItem(CHAVE) === "aceito") {
    return; // já consentiu antes, não mostra de novo
  }

  const banner = document.createElement("div");
  banner.id = "banner-cookies";
  banner.style.cssText = [
    "position:fixed", "left:0", "right:0", "bottom:0", "z-index:9999",
    "background:#1f1f1f", "color:#fff", "padding:16px 20px",
    "display:flex", "flex-wrap:wrap", "align-items:center", "justify-content:center",
    "gap:12px", "font-family:sans-serif", "font-size:14px",
    "box-shadow:0 -2px 10px rgba(0,0,0,0.25)"
  ].join(";");

  banner.innerHTML = `
    <span style="max-width:640px;">
      Usamos cookies para manter você conectado e melhorar sua experiência no Explora+.
      Ao continuar navegando, você concorda com o uso de cookies.
    </span>
    <button id="btn-aceitar-cookies" style="
      background:#6c3cf2;color:#fff;border:none;border-radius:6px;
      padding:8px 18px;cursor:pointer;font-size:14px;white-space:nowrap;
    ">Entendi</button>
  `;

  document.body.appendChild(banner);

  document.getElementById("btn-aceitar-cookies").addEventListener("click", () => {
    localStorage.setItem(CHAVE, "aceito");
    banner.remove();
  });
})();
