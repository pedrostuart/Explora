/*fechar BARRA DE PESQUISA quando clica fora dela*/ 
    
    document.addEventListener("click", (event)=>{
    let documentoClick = event.target
    if (documentoClick !== inputCarrosel && documentoClick !== boxPesquisa){
        boxPesquisa.style.display = 'none'
    }
    })
