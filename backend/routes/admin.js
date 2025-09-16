const express = require('express');
const User = require('../models/User');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de autenticação e admin em todas as rotas
router.use(authenticateToken);
router.use(requireAdmin);

// Listar todos os usuários
router.get('/users', (req, res) => {
  try {
    const users = User.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Obter usuário específico
router.get('/users/:id', (req, res) => {
  try {
    const user = User.findById(req.params.id);
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

// Atualizar tokens de um usuário
router.put('/users/:id/tokens', (req, res) => {
  try {
    const { tokens } = req.body;
    
    if (typeof tokens !== 'number' || tokens < 0) {
      return res.status(400).json({ message: 'Número de tokens inválido' });
    }

    const updatedUser = User.updateTokens(req.params.id, tokens);
    
    res.json({
      message: 'Tokens atualizados com sucesso',
      user: {
        id: updatedUser.id,
        nome: updatedUser.nome,
        email: updatedUser.email,
        tokens: updatedUser.tokens,
        role: updatedUser.role
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Excluir usuário
router.delete('/users/:id', (req, res) => {
  try {
    const deletedUser = User.delete(req.params.id);
    
    res.json({
      message: 'Usuário excluído com sucesso',
      user: {
        id: deletedUser.id,
        nome: deletedUser.nome,
        email: deletedUser.email
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obter estatísticas gerais
router.get('/stats', (req, res) => {
  try {
    const users = User.getAll();
    const totalUsers = users.length;
    const totalTokens = users.reduce((sum, user) => sum + user.tokens, 0);
    const adminUsers = users.filter(user => user.role === 'admin').length;
    const regularUsers = users.filter(user => user.role === 'user').length;

    res.json({
      totalUsers,
      totalTokens,
      adminUsers,
      regularUsers,
      averageTokensPerUser: totalUsers > 0 ? Math.round(totalTokens / totalUsers) : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Obter histórico de todos os usuários
router.get('/history', (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const dataPath = path.join(__dirname, '../data/database.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    res.json(data.historico);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
