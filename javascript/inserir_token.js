const urlParametro = new URLSearchParams(window.location.search)//Pega os paremotros da url

const emailRecebido = urlParametro.get('email')

document.getElementById('caixaEmail').textContent = emailRecebido

