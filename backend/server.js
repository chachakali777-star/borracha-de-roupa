const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: './config.env' });

// Verificar se as variáveis foram carregadas
console.log('API_KEY_FASHN:', process.env.API_KEY_FASHN ? 'Carregada' : 'NÃO CARREGADA');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Carregado' : 'NÃO CARREGADO');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/upload');
const adminRoutes = require('./routes/admin');
const tokenRoutes = require('./routes/tokens');
const paymentRoutes = require('./routes/payment');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/payment', paymentRoutes);

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo deu errado!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
