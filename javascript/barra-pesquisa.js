let boxPesquisa = document.querySelector(".itens-pesquisa")
let inputCarrosel = document.querySelector(".input-pesquisa")

/*formatar o texto*/
function formatText(valorText){
    return valorText.toLowerCase().trim()
}

inputCarrosel.addEventListener("input", (evento)=>{ /*ouvi quando eu digito algo no input*/
    /*receber valor do input*/
    let valorInput = formatText(evento.target.value) /*pegando valor digitado e formatando com a função*/


    let itens = document.querySelectorAll(".itens-pesquisa a")
    let txtSemResultados = document.getElementById("txt-pesquisas")
    let vermaisEventos = document.getElementById("txt-vermais-eventos")
    let todosResultados
    
    itens.forEach(item =>{/*Editando todos ITENS*/
        if(formatText(item.textContent).indexOf(valorInput) == -1){/*se todos os caracteres que tem dentro de ITEM não bater com VALORINPUT, o item ira sumir*/
            item.style.display = 'none'
        }else{
            item.style.display = 'flex'
            todosResultados = true /*apenas para definir um valor que eu possa usar em outro if/else*/
        }
        
    })  
    
    if(todosResultados == true){
        if(txtSemResultados){txtSemResultados.style.display = 'none'}/*se txtSemResultados existir no html ele faz a ação*/
        if(vermaisEventos){vermaisEventos.style.display = 'block'}/*se vermaisEventos existir no html ele faz a ação*/
    }else{
        if(txtSemResultados){txtSemResultados.style.display = 'block'}
        if(vermaisEventos){vermaisEventos.style.display = 'none'}
    }

    /*abrir caixa quando clicar no input*/
    
    boxPesquisa.style.display = 'flex'

    /*fechar caixa quando clica fora dela*/
    document.addEventListener("click", (event)=>{
    let documentoClick = event.target

    if (documentoClick !== inputCarrosel && documentoClick !== boxPesquisa){
        boxPesquisa.style.display = 'none'
    }
    })

}
)


