const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const user = await User.create({ nome, email, senha });
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user,
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    const user = User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const isValidPassword = await User.validatePassword(senha, user.senha);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tokens: user.tokens,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Verificar token
router.get('/verify', authenticateToken, (req, res) => {
  try {
    const user = User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ valid: false, message: 'Usuário não encontrado' });
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tokens: user.tokens,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ valid: false, message: 'Erro interno do servidor' });
  }
});

// Perfil do usuário
router.get('/profile', authenticateToken, async (req, res) => {
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

module.exports = router;
