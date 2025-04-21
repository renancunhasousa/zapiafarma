export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await fetch('https://bot.zapiabr.com.br/webhook-test/zapiaFarma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
      });

      const data = await response.json();
      
      // Verifica se a resposta tem o formato do n8n (output)
      if (data && data.output) {
        res.status(200).json({
          message: data.output,
          status: 'success'
        });
      } else if (data && data.message) {
        // Mantém compatibilidade com o formato anterior
        res.status(200).json({
          message: data.message,
          status: data.status || 'success'
        });
      } else {
        // Caso a resposta não venha no formato esperado
        res.status(200).json({
          message: 'Desculpe, não consegui processar sua mensagem.',
          status: 'error'
        });
      }
    } catch (error) {
      console.error('Erro no webhook:', error);
      res.status(500).json({ 
        message: 'Desculpe, ocorreu um erro ao processar sua mensagem.',
        status: 'error'
      });
    }
  } else {
    res.status(405).json({ 
      message: 'Método não permitido',
      status: 'error'
    });
  }
} 