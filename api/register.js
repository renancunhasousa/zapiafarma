export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nome, email, telefone } = req.body;
    
    const baserowUrl = 'https://api.baserow.io/api/database/rows/table/512004/';
    
    try {
      // Verifica se usuário existe
      const checkResponse = await fetch(`${baserowUrl}?user_field_names=true&filter__field_email__equal=${email}`, {
        headers: {
          'Authorization': 'Token lGwDUVu3xSXdIC116oQR9uMKjcjWinra'
        }
      });

      const existingData = await checkResponse.json();

      // Se não existe, cadastra
      if (!existingData.results || existingData.results.length === 0) {
        const response = await fetch(`${baserowUrl}?user_field_names=true`, {
          method: 'POST',
          headers: {
            'Authorization': 'Token lGwDUVu3xSXdIC116oQR9uMKjcjWinra',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: {
              'Name': nome,
              'email': email,
              'phone': telefone,
              'Data de Cadastro': new Date().toISOString()
            }
          })
        });

        if (!response.ok) {
          throw new Error('Erro ao cadastrar usuário');
        }
      }

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao processar requisição' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
} 