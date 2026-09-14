let boxPesquisa = document.querySelector(".itens-pesquisa");
let inputCarrosel = document.querySelector(".input-pesquisa");


// ==============================
// FORMATAR TEXTO
// ==============================

function formatText(valorText) {
    return valorText.toLowerCase().trim();
}


// ==============================
// FILTRO DA BARRA DE PESQUISA
// ==============================

inputCarrosel.addEventListener("input", (evento) => {

    // Valor digitado, já formatado
    let valorInput = formatText(evento.target.value);

    let itens = document.querySelectorAll(
        ".itens-pesquisa a:not(#txt-vermais-eventos)"
    );

    let txtSemResultados = document.getElementById("txt-pesquisas");
    let vermaisEventos = document.getElementById("txt-vermais-eventos");

    let todosResultados = false;

    // Filtra cada item
    itens.forEach(item => {

        if (formatText(item.textContent).indexOf(valorInput) === -1) {
            item.style.display = 'none';
        } else {
            item.style.display = 'flex';
            todosResultados = true;
        }

    });

    // Mostra mensagem de "sem resultados" ou "ver mais"
    if (todosResultados) {
        if (txtSemResultados) txtSemResultados.style.display = 'none';
        if (vermaisEventos) vermaisEventos.style.display = 'block';
    } else {
        if (txtSemResultados) txtSemResultados.style.display = 'block';
        if (vermaisEventos) vermaisEventos.style.display = 'none';
    }

    // Abre a caixa de pesquisa
    boxPesquisa.style.display = 'flex';

});