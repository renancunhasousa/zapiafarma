async function handleLogin(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    
    try {
        const baserowUrl = 'https://api.baserow.io/api/database/rows/table/512004/';
        
        // Verifica se o usuário já existe
        const checkResponse = await fetch(`${baserowUrl}?user_field_names=true&filter__field_email__equal=${email}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token lGwDUVu3xSXdIC116oQR9uMKjcjWinra',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

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

            const response = await fetch(`${baserowUrl}?user_field_names=true`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Token lGwDUVu3xSXdIC116oQR9uMKjcjWinra',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(baserowData)
            });

            if (!response.ok) {
                throw new Error('Erro ao registrar usuário');
            }
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