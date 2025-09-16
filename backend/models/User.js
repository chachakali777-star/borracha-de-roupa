const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, '../data/database.json');

class User {
  static readData() {
    try {
      const data = fs.readFileSync(dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return { usuarios: [], historico: [] };
    }
  }

  static writeData(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  }

  static async create(userData) {
    const data = this.readData();
    const { nome, email, senha, role = 'user' } = userData;

    // Verificar se email já existe
    const existingUser = data.usuarios.find(user => user.email === email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = {
      id: uuidv4(),
      nome,
      email,
      senha: hashedPassword,
      tokens: 10, // Tokens iniciais
      role,
      createdAt: new Date().toISOString()
    };

    data.usuarios.push(newUser);
    this.writeData(data);

    // Adicionar ao histórico
    this.addToHistory(newUser.id, 'user_created', 'Usuário criado');

    return {
      id: newUser.id,
      nome: newUser.nome,
      email: newUser.email,
      tokens: newUser.tokens,
      role: newUser.role,
      createdAt: newUser.createdAt
    };
  }

  static findByEmail(email) {
    const data = this.readData();
    return data.usuarios.find(user => user.email === email);
  }

  static findById(id) {
    const data = this.readData();
    return data.usuarios.find(user => user.id === id);
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static updateTokens(userId, newTokenCount) {
    const data = this.readData();
    const userIndex = data.usuarios.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    data.usuarios[userIndex].tokens = newTokenCount;
    this.writeData(data);

    this.addToHistory(userId, 'tokens_updated', `Tokens atualizados para ${newTokenCount}`);
    
    return data.usuarios[userIndex];
  }

  static consumeToken(userId) {
    const data = this.readData();
    const userIndex = data.usuarios.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    const tokensNeeded = 25; // 25 tokens por imagem
    if (data.usuarios[userIndex].tokens < tokensNeeded) {
      throw new Error(`Tokens insuficientes. Necessário: ${tokensNeeded} tokens. Disponível: ${data.usuarios[userIndex].tokens} tokens`);
    }

    data.usuarios[userIndex].tokens -= tokensNeeded;
    this.writeData(data);

    this.addToHistory(userId, 'token_consumed', `${tokensNeeded} tokens consumidos para geração de imagem`);
    
    return data.usuarios[userIndex];
  }

  static getAll() {
    const data = this.readData();
    return data.usuarios.map(user => ({
      id: user.id,
      nome: user.nome,
      email: user.email,
      tokens: user.tokens,
      role: user.role,
      createdAt: user.createdAt
    }));
  }

  static delete(userId) {
    const data = this.readData();
    const userIndex = data.usuarios.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    const deletedUser = data.usuarios.splice(userIndex, 1)[0];
    this.writeData(data);

    this.addToHistory(userId, 'user_deleted', 'Usuário excluído');
    
    return deletedUser;
  }

  static addToHistory(userId, action, description) {
    const data = this.readData();
    const historyEntry = {
      id: uuidv4(),
      usuario_id: userId,
      data: new Date().toISOString(),
      tipo_acao: action,
      descricao: description
    };

    data.historico.push(historyEntry);
    this.writeData(data);
  }

  static getHistory(userId) {
    const data = this.readData();
    return data.historico.filter(entry => entry.usuario_id === userId);
  }
}

module.exports = User;
