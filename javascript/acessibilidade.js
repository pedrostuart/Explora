/*
 * Widget de Acessibilidade — Explora+
 * Injeta um botão flutuante com um painel de ajustes (tamanho de fonte,
 * alto contraste, sublinhar links, fonte para leitura facilitada,
 * reduzir animações e cursor ampliado). As preferências ficam salvas em
 * localStorage e são reaplicadas automaticamente em qualquer página que
 * carregue este script.
 */

;(function () {
    const CHAVE_ARMAZENAMENTO = "explora_acessibilidade"

    const PADRAO = {
        fonte: 0,              // -2 a +4 passos de 6% cada
        altoContraste: false,
        sublinharLinks: false,
        fonteLegivel: false,
        reduzirMovimento: false,
        cursorGrande: false
    }

    function carregarPreferencias() {
        try {
            const salvo = localStorage.getItem(CHAVE_ARMAZENAMENTO)
            if (!salvo) return { ...PADRAO }
            return { ...PADRAO, ...JSON.parse(salvo) }
        } catch (erro) {
            return { ...PADRAO }
        }
    }

    function salvarPreferencias(prefs) {
        try {
            localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(prefs))
        } catch (erro) {
            // localStorage indisponível (ex: modo privado) — segue sem persistir
        }
    }

    let prefs = carregarPreferencias()

    function injetarEstilos() {
        const estilo = document.createElement("style")
        estilo.id = "explora-acessibilidade-estilos"
        estilo.textContent = `
            :root {
                --a11y-verde: #1A824D;
                --a11y-azul: #2678BF;
            }

            html.a11y-fonte-1 { font-size: 106% !important; }
            html.a11y-fonte-2 { font-size: 112% !important; }
            html.a11y-fonte-3 { font-size: 118% !important; }
            html.a11y-fonte-4 { font-size: 124% !important; }
            html.a11y-fonte--1 { font-size: 94% !important; }
            html.a11y-fonte--2 { font-size: 88% !important; }

            html.a11y-alto-contraste,
            html.a11y-alto-contraste body {
                background: #000000 !important;
                color: #FFFF00 !important;
            }
            html.a11y-alto-contraste * {
                background-color: #000000 !important;
                color: #FFFF00 !important;
                border-color: #FFFF00 !important;
                box-shadow: none !important;
                text-shadow: none !important;
            }
            html.a11y-alto-contraste a,
            html.a11y-alto-contraste a * {
                color: #66D9FF !important;
                text-decoration: underline !important;
            }
            html.a11y-alto-contraste img,
            html.a11y-alto-contraste svg {
                filter: grayscale(1) contrast(1.2);
                opacity: 0.9;
            }
            html.a11y-alto-contraste button,
            html.a11y-alto-contraste input,
            html.a11y-alto-contraste select,
            html.a11y-alto-contraste textarea {
                background-color: #000000 !important;
                color: #FFFF00 !important;
                border: 2px solid #FFFF00 !important;
            }

            html.a11y-links-sublinhados a {
                text-decoration: underline !important;
                text-underline-offset: 3px;
            }

            html.a11y-fonte-legivel body,
            html.a11y-fonte-legivel input,
            html.a11y-fonte-legivel textarea,
            html.a11y-fonte-legivel button {
                font-family: Verdana, "Comic Sans MS", Arial, sans-serif !important;
                letter-spacing: 0.04em !important;
                word-spacing: 0.12em !important;
                line-height: 1.6 !important;
            }

            html.a11y-reduzir-movimento *,
            html.a11y-reduzir-movimento *::before,
            html.a11y-reduzir-movimento *::after {
                animation-duration: 0.001ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.001ms !important;
                scroll-behavior: auto !important;
            }

            html.a11y-cursor-grande,
            html.a11y-cursor-grande * {
                cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="%231A824D" stroke="%23ffffff" stroke-width="1" d="M4 2l14 8-6 1.5L15 18l-3 1.5-3-6.5L4 16z"/></svg>') 4 4, auto !important;
            }

            #a11y-botao {
                position: fixed;
                top: 50%;
                right: 18px;
                transform: translateY(-50%);
                z-index: 10000;
                width: 52px;
                height: 52px;
                border-radius: 50%;
                background: var(--a11y-verde);
                color: #fff;
                border: none;
                box-shadow: 0px 2px 8px rgba(0,0,0,0.35);
                font-size: 26px;
                line-height: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
            #a11y-botao:hover,
            #a11y-botao:focus {
                background: var(--a11y-azul);
                outline: 3px solid #fff;
                outline-offset: 2px;
            }

            #a11y-painel {
                position: fixed;
                top: 50%;
                right: 80px;
                transform: translateY(-50%);
                z-index: 10000;
                width: 300px;
                max-width: calc(100vw - 32px);
                max-height: 80vh;
                overflow-y: auto;
                background: #ffffff;
                color: #1a1a1a;
                border-radius: 10px;
                box-shadow: 0px 4px 18px rgba(0,0,0,0.3);
                font-family: Arial, Helvetica, sans-serif;
                padding: 16px;
                display: none;
            }
            #a11y-painel.aberto { display: block; }

            #a11y-painel h2 {
                font-size: 16px;
                margin: 0 0 12px 0;
                color: var(--a11y-verde);
            }
            #a11y-painel .a11y-linha {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                margin-bottom: 10px;
            }
            #a11y-painel .a11y-linha span {
                font-size: 14px;
            }
            #a11y-painel .a11y-grupo-fonte {
                display: flex;
                gap: 6px;
            }
            #a11y-painel button.a11y-acao {
                font-size: 13px;
                border: 1px solid #ccc;
                background: #f4f4f4;
                border-radius: 6px;
                padding: 6px 10px;
                cursor: pointer;
            }
            #a11y-painel button.a11y-acao:hover {
                background: #e6e6e6;
            }
            #a11y-painel button.a11y-toggle {
                font-size: 13px;
                border: 1px solid #ccc;
                background: #f4f4f4;
                border-radius: 6px;
                padding: 6px 10px;
                cursor: pointer;
                min-width: 56px;
            }
            #a11y-painel button.a11y-toggle[aria-pressed="true"] {
                background: var(--a11y-verde);
                color: #fff;
                border-color: var(--a11y-verde);
            }
            #a11y-painel button.a11y-resetar {
                width: 100%;
                margin-top: 6px;
                font-size: 13px;
                border: 1px solid var(--a11y-azul);
                background: #fff;
                color: var(--a11y-azul);
                border-radius: 6px;
                padding: 8px 10px;
                cursor: pointer;
            }
            #a11y-painel button.a11y-resetar:hover {
                background: var(--a11y-azul);
                color: #fff;
            }
            #a11y-painel .a11y-fechar {
                position: absolute;
                top: 10px;
                right: 10px;
                background: transparent;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #555;
            }

            @media (max-width: 480px) {
                #a11y-painel {
                    right: 8px;
                    top: auto;
                    bottom: 90px;
                    transform: none;
                }
                #a11y-botao {
                    top: auto;
                    bottom: 20px;
                    right: 14px;
                    transform: none;
                }
            }
        `
        document.head.appendChild(estilo)
    }

    function aplicarPreferencias() {
        const raiz = document.documentElement

        raiz.classList.remove(
            "a11y-fonte-1", "a11y-fonte-2", "a11y-fonte-3", "a11y-fonte-4",
            "a11y-fonte--1", "a11y-fonte--2"
        )
        if (prefs.fonte !== 0) {
            raiz.classList.add(`a11y-fonte-${prefs.fonte}`)
        }

        raiz.classList.toggle("a11y-alto-contraste", !!prefs.altoContraste)
        raiz.classList.toggle("a11y-links-sublinhados", !!prefs.sublinharLinks)
        raiz.classList.toggle("a11y-fonte-legivel", !!prefs.fonteLegivel)
        raiz.classList.toggle("a11y-reduzir-movimento", !!prefs.reduzirMovimento)
        raiz.classList.toggle("a11y-cursor-grande", !!prefs.cursorGrande)
    }

    function atualizarPainel(painel) {
        const rotuloFonte = painel.querySelector("#a11y-fonte-valor")
        if (rotuloFonte) rotuloFonte.textContent = `${100 + prefs.fonte * 6}%`

        const botoesToggle = {
            "a11y-toggle-contraste": prefs.altoContraste,
            "a11y-toggle-sublinhar": prefs.sublinharLinks,
            "a11y-toggle-fonte-legivel": prefs.fonteLegivel,
            "a11y-toggle-movimento": prefs.reduzirMovimento,
            "a11y-toggle-cursor": prefs.cursorGrande
        }
        Object.entries(botoesToggle).forEach(([id, ativo]) => {
            const botao = painel.querySelector(`#${id}`)
            if (!botao) return
            botao.setAttribute("aria-pressed", ativo ? "true" : "false")
            botao.textContent = ativo ? "Ativado" : "Desativado"
        })
    }

    function alterarFonte(delta, painel) {
        const novo = prefs.fonte + delta
        if (novo < -2 || novo > 4) return
        prefs.fonte = novo
        salvarPreferencias(prefs)
        aplicarPreferencias()
        atualizarPainel(painel)
    }

    function alternar(chave, painel) {
        prefs[chave] = !prefs[chave]
        salvarPreferencias(prefs)
        aplicarPreferencias()
        atualizarPainel(painel)
    }

    function resetar(painel) {
        prefs = { ...PADRAO }
        salvarPreferencias(prefs)
        aplicarPreferencias()
        atualizarPainel(painel)
    }

    function criarWidget() {
        const botao = document.createElement("button")
        botao.id = "a11y-botao"
        botao.type = "button"
        botao.setAttribute("aria-label", "Abrir menu de acessibilidade")
        botao.setAttribute("aria-haspopup", "dialog")
        botao.setAttribute("aria-expanded", "false")
        botao.innerHTML = "♿"

        const painel = document.createElement("div")
        painel.id = "a11y-painel"
        painel.setAttribute("role", "dialog")
        painel.setAttribute("aria-label", "Opções de acessibilidade")
        painel.innerHTML = `
            <button type="button" class="a11y-fechar" aria-label="Fechar menu de acessibilidade">✕</button>
            <h2>Acessibilidade</h2>

            <div class="a11y-linha">
                <span>Tamanho do texto (<span id="a11y-fonte-valor">100%</span>)</span>
                <div class="a11y-grupo-fonte">
                    <button type="button" class="a11y-acao" id="a11y-fonte-menos" aria-label="Diminuir tamanho do texto">A-</button>
                    <button type="button" class="a11y-acao" id="a11y-fonte-mais" aria-label="Aumentar tamanho do texto">A+</button>
                </div>
            </div>

            <div class="a11y-linha">
                <span>Alto contraste</span>
                <button type="button" class="a11y-toggle" id="a11y-toggle-contraste" aria-pressed="false">Desativado</button>
            </div>

            <div class="a11y-linha">
                <span>Sublinhar links</span>
                <button type="button" class="a11y-toggle" id="a11y-toggle-sublinhar" aria-pressed="false">Desativado</button>
            </div>

            <div class="a11y-linha">
                <span>Fonte para leitura facilitada</span>
                <button type="button" class="a11y-toggle" id="a11y-toggle-fonte-legivel" aria-pressed="false">Desativado</button>
            </div>

            <div class="a11y-linha">
                <span>Reduzir animações</span>
                <button type="button" class="a11y-toggle" id="a11y-toggle-movimento" aria-pressed="false">Desativado</button>
            </div>

            <div class="a11y-linha">
                <span>Cursor ampliado</span>
                <button type="button" class="a11y-toggle" id="a11y-toggle-cursor" aria-pressed="false">Desativado</button>
            </div>

            <button type="button" class="a11y-resetar" id="a11y-resetar">Restaurar padrão</button>
        `

        document.body.appendChild(botao)
        document.body.appendChild(painel)

        function abrirPainel() {
            painel.classList.add("aberto")
            botao.setAttribute("aria-expanded", "true")
            const fechar = painel.querySelector(".a11y-fechar")
            if (fechar) fechar.focus()
        }

        function fecharPainel() {
            painel.classList.remove("aberto")
            botao.setAttribute("aria-expanded", "false")
            botao.focus()
        }

        botao.addEventListener("click", () => {
            const estaAberto = painel.classList.contains("aberto")
            if (estaAberto) {
                fecharPainel()
            } else {
                abrirPainel()
            }
        })

        painel.querySelector(".a11y-fechar").addEventListener("click", fecharPainel)

        document.addEventListener("keydown", (evento) => {
            if (evento.key === "Escape" && painel.classList.contains("aberto")) {
                fecharPainel()
            }
        })

        document.addEventListener("click", (evento) => {
            const cliqueForaDoPainel = !painel.contains(evento.target) && !botao.contains(evento.target)
            if (cliqueForaDoPainel && painel.classList.contains("aberto")) {
                fecharPainel()
            }
        })

        painel.querySelector("#a11y-fonte-mais").addEventListener("click", () => alterarFonte(1, painel))
        painel.querySelector("#a11y-fonte-menos").addEventListener("click", () => alterarFonte(-1, painel))
        painel.querySelector("#a11y-toggle-contraste").addEventListener("click", () => alternar("altoContraste", painel))
        painel.querySelector("#a11y-toggle-sublinhar").addEventListener("click", () => alternar("sublinharLinks", painel))
        painel.querySelector("#a11y-toggle-fonte-legivel").addEventListener("click", () => alternar("fonteLegivel", painel))
        painel.querySelector("#a11y-toggle-movimento").addEventListener("click", () => alternar("reduzirMovimento", painel))
        painel.querySelector("#a11y-toggle-cursor").addEventListener("click", () => alternar("cursorGrande", painel))
        painel.querySelector("#a11y-resetar").addEventListener("click", () => resetar(painel))

        atualizarPainel(painel)
    }

    function iniciar() {
        injetarEstilos()
        aplicarPreferencias()
        criarWidget()
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar)
    } else {
        iniciar()
    }
})()
