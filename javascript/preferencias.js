
let finalizarCadastro = document.querySelector(".btn-finalizar")
finalizarCadastro.addEventListener("click", verificarInpunts)
    
function verificarInpunts(event){

    /*DATA DE NASCIMENTO*/
    event.preventDefault()
    let anoAtual = new Date().getFullYear()
    let anoIdade = parseInt(document.getElementById("ano").value)
    let mesIdade = parseInt(document.getElementById("mes").value)
    let diaIdade = parseInt(document.getElementById('dia').value)
    let labelDataNascimento = document.getElementById("labelDataNascimento")
    let idadeDoUsuario = anoAtual - anoIdade
    let orcamento =Number(document.getElementById("preco").value)

    let inputDataNascimento = document.querySelector("#input-label-dataNascimento .barra_input")

    if(anoIdade > anoAtual || idadeDoUsuario < 6 || mesIdade > 12 || diaIdade > 31 || idadeDoUsuario > 112  || isNaN(diaIdade) || isNaN(mesIdade)|| isNaN(anoIdade) ){/*isNaN verifica se é um numero*/
        labelDataNascimento.style.color = 'red'
        labelDataNascimento.innerHTML = 'Data inválida'
        inputDataNascimento.classList.add("barra_input-erro")
    }else{
        labelDataNascimento.innerText = 'Tudo Ok!'
        labelDataNascimento.style.color = 'green'
        inputDataNascimento.classList.remove("barra_input-erro")
    }
    /*VERBA*/
    let verba = parseFloat(document.getElementById("preco").value)
    let inputVerba = document.querySelector("#input-label-preco .barra_input")
    let labelPreco = document.getElementById("labelPreco")
    if(isNaN(verba)){
        inputVerba.classList.add("barra_input-erro")
        labelPreco.style.display = 'block'
    }else{
        inputVerba.classList.remove("barra_input-erro")
        labelPreco.style.display = 'none'
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