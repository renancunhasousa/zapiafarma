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
      res.status(response.status).json(data);
    } catch (error) {
      console.error('Erro no webhook:', error);
      res.status(500).json({ error: 'Erro ao processar mensagem' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
} 