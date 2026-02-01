/*fechar BARRA DE PESQUISA quando clica fora dela*/ 
    
    document.addEventListener("click", (event)=>{
    let documentoClick = event.target
        console.log(documentoClick)
    if (documentoClick !== inputCarrosel && documentoClick !== boxPesquisa){
        boxPesquisa.style.display = 'none'
    }
    })
