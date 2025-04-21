// Adicionar mensagem inicial quando a página carregar
window.onload = function() {
    addMessage('Olá! Eu sou o assistente virtual da ANVISA. Como posso ajudar você hoje?', 'ai-message');
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message) {
        // Recupera os dados do usuário
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        addMessage(message, 'user-message');
        
        try {
            // Prepara os dados para enviar
            const data = {
                message: message,
                user: {
                    nome: userData.nome,
                    email: userData.email,
                    telefone: userData.telefone
                }
            };

            // Faz a requisição para o webhook
            const response = await fetch('http://bot.zapiabr.com.br/webhook-test/zapiaFarma', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Erro na resposta da API');
            }

            const responseData = await response.json();
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