let boxPesquisa = document.querySelector(".itens-pesquisa");
let inputCarrosel = document.querySelector(".input-pesquisa");


function formatText(valorText) {
    return valorText.toLowerCase().trim();
}

inputCarrosel.addEventListener("input", (evento) => {

   
    let valorInput = formatText(evento.target.value);

    let itens = document.querySelectorAll(
        ".itens-pesquisa a:not(#txt-vermais-eventos)"
    );

    let txtSemResultados = document.getElementById("txt-pesquisas");
    let vermaisEventos = document.getElementById("txt-vermais-eventos");

    let todosResultados = false;

   
    itens.forEach(item => {

        if (formatText(item.textContent).indexOf(valorInput) === -1) {
            item.style.display = 'none';
        } else {
            item.style.display = 'flex';
            todosResultados = true;
        }

    });

   
    if (todosResultados) {
        if (txtSemResultados) txtSemResultados.style.display = 'none';
        if (vermaisEventos) vermaisEventos.style.display = 'block';
    } else {
        if (txtSemResultados) txtSemResultados.style.display = 'block';
        if (vermaisEventos) vermaisEventos.style.display = 'none';
    }

    
    boxPesquisa.style.display = 'flex';

});
