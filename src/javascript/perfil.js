/*ABRIR E FECHAR CAIXAS*/
const botoes = document.querySelectorAll(".btn-atividade, .btn-favoritos, .btn-config")
const caixas = document.querySelectorAll(".box-historico, .box-favoritos, .box-dados")

function corTexto(){
    botoes.forEach(btn => btn.style.color = 'black')
}
function boxSome(){
    caixas.forEach(box => box.style.display = 'none')
}
/*CAIXA E BOTÃO (ATIVIDADE)*/
botoes[0].addEventListener("click", () =>{
    corTexto() 
    botoes[0].style.color = '#1A824D'
    boxSome()
    caixas[0].style.display = 'flex'
})
/*CAIXA E BOTÃO (FAVORITOS)*/
botoes[1].addEventListener("click", () =>{
    corTexto() 
    botoes[1].style.color = '#1A824D'
    boxSome()
    caixas[1].style.display = 'flex'
})
/*CAIXA E BOTÃO (DADOS)*/
botoes[2].addEventListener("click", () =>{
    corTexto() 
    botoes[2].style.color = '#1A824D'
    boxSome()
    caixas[2].style.display = 'flex'
})


/*MODAL*/
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




/*CEHECKBOX*/

// let btnPreferencia = document.querySelectorAll(".btn-preferencia")


// btnPreferencia.forEach(btn =>{
//     btn.addEventListener('click', mudarCor)
    
// })
// function mudarCor(){
//     let labels = document.querySelectorAll(".label-preferencias label")
//     labels.forEach(label=>{
//         label.style.backgroundColor ='red'
//     })
// }


/*MODAL SALVAR*/
let btnSalvar = document.querySelector(".salvar")
let modalSalvar = document.querySelector(".modal-salvar")

btnSalvar.addEventListener("click", modalSave)

function modalSave(){
    modalSalvar.style.display = 'flex'
    setTimeout(()=>{
        modalSalvar.style.display = 'none'
    }, 1000)
}