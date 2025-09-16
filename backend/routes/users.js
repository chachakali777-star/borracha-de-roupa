const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Obter perfil do usuário
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const user = User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      tokens: user.tokens,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Obter dados atualizados do usuário (para sincronização)
router.get('/refresh', authenticateToken, (req, res) => {
  try {
    const user = User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      tokens: user.tokens,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Obter histórico do usuário
router.get('/history', authenticateToken, (req, res) => {
  try {
    const history = User.getHistory(req.user.id);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
