async function atualizarHeaderDaIndex() {
    const pagina = document.body.classList
    try {
        const resposta = await fetch('/api/usuarios/me')
        if (resposta.ok) {
            pagina.remove('pagina-index--visitante')
        }
    } catch {
        // Sem sessão ou sem API: a index continua pública como visitante.
    }
}

atualizarHeaderDaIndex()

/* Fecha a barra de pesquisa quando clica fora dela. */
document.addEventListener('click', (event) => {
    const link = event.target.closest('.caixa_eventos a, .itens-pesquisa a')
    if (!link || link.id === 'txt-vermais-eventos' || link.href.includes('informacoes_evento.html?id=')) return

    const card = link.closest('.caixa_eventos, .carrosel-eventos, .itens-pesquisa a')
    const nome = card?.querySelector('.nome_show')?.textContent.trim()
    if (!nome) return

    event.preventDefault()
    window.location.href = `informacoes_evento.html?evento=${encodeURIComponent(nome)}`
})

document.addEventListener("click", (event)=>{
    let documentoClick = event.target
    if (documentoClick !== inputCarrosel && documentoClick !== boxPesquisa){
        boxPesquisa.style.display = 'none'
    }
    })
