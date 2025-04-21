// Adicionar mensagem inicial quando a página carregar
window.onload = function() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        addMessage('Olá ' + userData.nome + '! Eu sou o assistente virtual da Zapia. Como posso ajudar você hoje?', 'ai-message');
    } else {
        addMessage('Olá! Eu sou o assistente virtual da Zapia. Como posso ajudar você hoje?', 'ai-message');
    }
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message) {
        // Recupera os dados do usuário do localStorage
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        addMessage(message, 'user-message');
        
        try {
            // Prepara os dados para enviar
            const data = {
                message: message,
                user: {
                    name: userData.nome,
                    email: userData.email,
                    phone: userData.telefone
                },
                timestamp: new Date().toISOString()  // Adicionando timestamp
            };

            console.log('Enviando dados:', data); // Log para debug

            // Faz a requisição para o webhook
            const response = await fetch('http://bot.zapiabr.com.br/webhook-test/zapiaFarma', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(data)
            });

            console.log('Status da resposta:', response.status); // Log para debug

            if (!response.ok) {
                throw new Error(`Erro na resposta da API: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('Resposta recebida:', responseData); // Log para debug

            addMessage(responseData.message || responseData.response || 'Desculpe, não entendi sua mensagem.', 'ai-message');
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            addMessage('Desculpe, ocorreu um erro ao processar sua mensagem.', 'ai-message');
        }
        
        input.value = '';
    }
}

function addMessage(text, className) {
    const chatMessages = document.getElementById('chatMessages');
    const messageContainer = document.createElement('div');
    messageContainer.className = `message ${className}`;
    messageContainer.textContent = text;
    chatMessages.appendChild(messageContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Permitir envio com Enter
document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
}); 