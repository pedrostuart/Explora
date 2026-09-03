let email = document.getElementById('email') 
email.addEventListener("invalid", ()=>{ 
   
    let barraInput = email.parentElement

        if(email.value.trim() === ""){
            email.classList.add('placeholder-erro')
            barraInput.style.border = '1px solid red'
        }else{
            email.classList.remove('placeholder-erro')
            barraInput.style.border = '1px solid #1A824D'
            window.location.href = `inserir-token.html`
            const valorParaUrl = encodeURIComponent(email.value) 
            window.location.href = `inserir-token.html?email=${valorParaUrl}`
        }
    
    
     // passando o valor do email pra url  //armazenando esse valor dentro de 'email' 
})