async function handleLogin(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    
    try {
        // Adicionando proxy para desenvolvimento local
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const baserowUrl = 'https://api.baserow.io/api/database/rows/table/512004/';
        
        // Verifica se o usuário já existe
        const checkResponse = await fetch(`${proxyUrl}${baserowUrl}?user_field_names=true&filter__field_email__equal=${email}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token lGwDUVu3xSXdIC116oQR9uMKjcjWinra',
                'Origin': 'http://localhost:8000'
            }
        });

        console.log('Resposta da verificação:', await checkResponse.clone().json());

        const existingData = await checkResponse.json();

        if (!existingData.results || existingData.results.length === 0) {
            const baserowData = {
                fields: {
                    'Name': nome,
                    'email': email,
                    'phone': telefone,
                    'Data de Cadastro': new Date().toISOString()
                }
            };

            console.log('Enviando dados:', baserowData);

            const response = await fetch(`${proxyUrl}${baserowUrl}?user_field_names=true`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Token lGwDUVu3xSXdIC116oQR9uMKjcjWinra',
                    'Content-Type': 'application/json',
                    'Origin': 'http://localhost:8000'
                },
                body: JSON.stringify(baserowData)
            });

            console.log('Resposta do cadastro:', await response.clone().json());

            if (!response.ok) {
                throw new Error('Erro ao registrar usuário');
            }
        }

        localStorage.setItem('userData', JSON.stringify({
            nome,
            email,
            telefone
        }));

        // Redireciona para a página do chat
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