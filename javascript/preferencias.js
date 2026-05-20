
let finalizarCadastro = document.querySelector(".btn-finalizar")
finalizarCadastro.addEventListener("click", CalcularIdade)
    
function CalcularIdade(event){
    event.preventDefault()

    let anoAtual = new Date().getFullYear()
    let anoIdade = parseInt(document.getElementById("ano").value)
    let mesIdade = parseInt(document.getElementById("mes").value)
    let diaIdade = parseInt(document.getElementById('dia').value)
    let label = document.querySelector("label")

    let idadeDoUsuario = anoAtual - anoIdade
    let orcamento =Number(document.getElementById("preco").value)


    if(anoIdade > anoAtual || idadeDoUsuario < 6 || mesIdade > 12 || diaIdade > 31 || idadeDoUsuario > 112  || isNaN(diaIdade) || isNaN(mesIdade)|| isNaN(anoIdade) ||isNaN(orcamento)){/*isNaN verifica se é um numero*/
        label.style.color = 'red'
        label.innerHTML = 'Data inválida'
    }else{
        label.innerText = 'Tudo Ok!'
        label.style.color = 'green'
        location.href = 'perfil.html'

        
    }
    
}
/*DIALOG*/
let btnEscolherPreferencias = document.querySelector(".aplicar-preferencias")
let modal = document.querySelector(".modal")
btnEscolherPreferencias.addEventListener("click", abriModal)

function abriModal(e){
    e.preventDefault()
    modal.style.display = 'block'
}
let btnAplicarModal = document.querySelector(".aplicar")
btnAplicarModal.addEventListener("click", fecharModal)

function fecharModal(e){
    e.preventDefault()
    modal.style.display = 'none'
}