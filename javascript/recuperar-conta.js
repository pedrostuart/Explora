document.addEventListener('DOMContentLoaded', () => {
    const page = window.location.pathname.split('/').pop();
    let barra_input = document.querySelector('.barra_input')
    
    const emailInput = document.getElementById('email-recuperacao');
    const enviarCodigoBtn = document.getElementById('enviarCodigoBtn');

    if (emailInput && enviarCodigoBtn) {
        enviarCodigoBtn.addEventListener('click', (event) => {
            event.preventDefault();

            const email = emailInput.value.trim();

            if (!email) {
                barra_input.style.border = '1px solid red';
                emailInput.classList.add('erro')     
                return;
            }

            sessionStorage.setItem('emailRecuperacao', email);
            window.location.href = 'inserir-token.html';
        });
    }

    if (page === 'inserir-token.html') {
        const emailTokenInput = document.getElementById('email-token');
        const atualizarEmailBtn = document.getElementById('atualizarEmailBtn');
        const emailInfo = document.getElementById('email-recuperacao-info');

        const emailSalvo = sessionStorage.getItem('emailRecuperacao') || '';

        if (emailTokenInput) {
            emailTokenInput.value = emailSalvo;
        }

        if (emailInfo && emailSalvo) {
            emailInfo.textContent = `E-mail atual: ${emailSalvo}`;
        }

        if (atualizarEmailBtn && emailTokenInput) {
            atualizarEmailBtn.addEventListener('click', (event) => {
                event.preventDefault();

                const novoEmail = emailTokenInput.value.trim();

                if (!novoEmail) {
                    alert('Digite um e-mail para atualizar o cadastro.');
                    return;
                }

                sessionStorage.setItem('emailRecuperacao', novoEmail);
                window.location.href = 'cadastro.html';
            });
        }
    }

    if (page === 'cadastro.html') {
        const cadastroEmailInput = document.getElementById('email');
        const emailSalvo = sessionStorage.getItem('emailRecuperacao') || '';

        if (cadastroEmailInput && emailSalvo) {
            cadastroEmailInput.value = emailSalvo;
            cadastroEmailInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
});
