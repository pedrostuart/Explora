/*
  Banner de consentimento de cookies (RN-016).
  Script único, incluído em todas as páginas — ele mesmo injeta seu CSS e
  HTML, então nenhuma página precisa de markup extra além da tag <script>.
  A escolha do usuário fica salva em localStorage e o banner não aparece
  de novo depois da primeira decisão (aceitar ou recusar).
*/

const CHAVE_CONSENTIMENTO = "explora_cookie_consent"

function consentimentoSalvo() {
    try {
        const bruto = localStorage.getItem(CHAVE_CONSENTIMENTO)
        return bruto ? JSON.parse(bruto) : null
    } catch (erro) {
        return null
    }
}

function salvarConsentimento(escolha) {
    try {
        localStorage.setItem(
            CHAVE_CONSENTIMENTO,
            JSON.stringify({ escolha, data: new Date().toISOString() })
        )
    } catch (erro) {
        // localStorage indisponível (modo privado, etc.) — segue sem persistir
    }
}

function injetarEstilos() {
    if (document.getElementById("estilos-cookie-consent")) return

    const estilo = document.createElement("style")
    estilo.id = "estilos-cookie-consent"
    estilo.textContent = `
        .banner-cookies{
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            background-color: #ffffff;
            border-top: 1px solid #8e8e8e;
            box-shadow: 0px -2px 10px rgba(0,0,0,0.12);
            padding: 18px 30px;
            font-family: "Inter", sans-serif;
            animation: banner-cookies-subir 0.35s ease-out;
        }
        @keyframes banner-cookies-subir{
            from{ transform: translateY(100%); }
            to{ transform: translateY(0); }
        }
        .banner-cookies__texto{
            flex: 1 1 380px;
            color: #2b2b2b;
            font-size: 0.9rem;
            line-height: 1.5;
            margin: 0;
        }
        .banner-cookies__texto a{
            color: #2678BF;
            font-weight: bold;
            text-decoration: underline;
        }
        .banner-cookies__botoes{
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            flex-shrink: 0;
        }
        .banner-cookies__botoes button{
            border: 0;
            border-radius: 35px;
            padding: 10px 20px;
            font-weight: bold;
            font-size: 0.9rem;
            cursor: pointer;
            font-family: "Inter", sans-serif;
            white-space: nowrap;
        }
        .banner-cookies__aceitar{
            background-color: #1A824D;
            color: white;
        }
        .banner-cookies__recusar{
            background-color: #f1f1f1;
            color: #2b2b2b;
        }
        @media screen and (max-width: 660px){
            .banner-cookies{
                padding: 16px 20px;
                flex-direction: column;
                align-items: stretch;
            }
            .banner-cookies__botoes{
                justify-content: stretch;
            }
            .banner-cookies__botoes button{
                flex: 1;
            }
        }
    `
    document.head.appendChild(estilo)
}

function removerBanner() {
    const banner = document.getElementById("banner-cookies")
    if (banner) banner.remove()
}

function mostrarBannerCookies() {
    if (document.getElementById("banner-cookies")) return
    injetarEstilos()

    const banner = document.createElement("div")
    banner.id = "banner-cookies"
    banner.className = "banner-cookies"
    banner.setAttribute("role", "dialog")
    banner.setAttribute("aria-label", "Aviso de cookies")

    banner.innerHTML = `
        <p class="banner-cookies__texto">
            Usamos cookies essenciais para manter você conectado à sua conta.
            Ao continuar navegando, você concorda com nossa
            <a href="privacidade.html">Política de Privacidade e Cookies</a>.
        </p>
        <div class="banner-cookies__botoes">
            <button type="button" class="banner-cookies__recusar" id="btn-recusar-cookies">Somente essenciais</button>
            <button type="button" class="banner-cookies__aceitar" id="btn-aceitar-cookies">Aceitar todos</button>
        </div>
    `

    document.body.appendChild(banner)

    document.getElementById("btn-aceitar-cookies").addEventListener("click", () => {
        salvarConsentimento("aceitou_todos")
        removerBanner()
    })

    document.getElementById("btn-recusar-cookies").addEventListener("click", () => {
        salvarConsentimento("somente_essenciais")
        removerBanner()
    })
}

// Exposta globalmente para que a página de Política de Privacidade tenha um
// botão "Gerenciar preferências de cookies" que reabre o banner a qualquer momento.
window.abrirPreferenciasCookies = function () {
    removerBanner()
    mostrarBannerCookies()
}

document.addEventListener("DOMContentLoaded", () => {
    if (!consentimentoSalvo()) {
        mostrarBannerCookies()
    }
})
