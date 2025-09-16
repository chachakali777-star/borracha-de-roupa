const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Simular compra de tokens
router.post('/purchase', authenticateToken, async (req, res) => {
  try {
    const { packageId } = req.body;
    
    // Mapear pacotes de tokens
    const packages = {
      1: { tokens: 30, price: 10.00 },
      2: { tokens: 230, price: 30.00 },
      3: { tokens: 470, price: 60.00 },
      4: { tokens: 1000, price: 100.00 }
    };

    const selectedPackage = packages[packageId];
    if (!selectedPackage) {
      return res.status(400).json({ message: 'Pacote inválido' });
    }

    // Verificar se usuário existe
    const user = User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Adicionar tokens ao usuário
    const newTokenCount = user.tokens + selectedPackage.tokens;
    const updatedUser = User.updateTokens(req.user.id, newTokenCount);

    res.json({
      message: 'Tokens adicionados com sucesso!',
      tokensAdded: selectedPackage.tokens,
      totalTokens: updatedUser.tokens,
      package: selectedPackage
    });

  } catch (error) {
    console.error('Erro ao comprar tokens:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Obter histórico de compras (simulado)
router.get('/history', authenticateToken, (req, res) => {
  try {
    // Simular histórico de compras
    const history = [
      {
        id: 1,
        date: new Date().toISOString(),
        package: '30 tokens',
        price: 10.00,
        status: 'completed'
      }
    ];

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;

