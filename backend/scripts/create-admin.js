const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    // Verificar se já existe um admin
    const existingAdmin = User.findByEmail('admin@fashn.ai');
    if (existingAdmin) {
      console.log('Admin já existe!');
      return;
    }

    // Criar usuário admin
    const adminData = {
      nome: 'Administrador',
      email: 'admin@fashn.ai',
      senha: 'admin123',
      role: 'admin'
    };

    const admin = await User.create(adminData);
    console.log('Admin criado com sucesso!');
    console.log('Email: admin@fashn.ai');
    console.log('Senha: admin123');
    console.log('Tokens: 100');
  } catch (error) {
    console.error('Erro ao criar admin:', error.message);
  }
}

createAdmin();
