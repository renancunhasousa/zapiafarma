async function handleLogin(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, telefone })
        });

        if (!response.ok) {
            throw new Error('Erro ao registrar usuário');
        }

        localStorage.setItem('userData', JSON.stringify({
            nome,
            email,
            telefone
        }));

        window.location.href = 'chat.html';
        
    } catch (error) {
        console.error('Erro ao processar dados:', error);
        alert('Ocorreu um erro ao processar seus dados. Por favor, tente novamente.');
    }
}

// Máscara para o telefone
document.getElementById('telefone').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        value = '(' + value;
        if (value.length > 3) {
            value = value.slice(0, 3) + ') ' + value.slice(3);
        }
        if (value.length > 10) {
            value = value.slice(0, 10) + '-' + value.slice(10);
        }
        if (value.length > 15) {
            value = value.slice(0, 15);
        }
    }
    e.target.value = value;
}); 