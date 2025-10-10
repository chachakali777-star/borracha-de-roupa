# 🎭 Borracha de Roupa - IA Fashion Revolution

Sistema revolucionário de experimentação virtual de roupas com Inteligência Artificial. Experimente qualquer peça de roupa virtualmente antes de comprar!

## ✨ O que é o Borracha de Roupa?

O **Borracha de Roupa** é uma plataforma inovadora que utiliza IA avançada para permitir que você experimente roupas virtualmente. Simplesmente faça upload de sua foto e de uma peça de roupa, e nossa IA mostrará como você ficaria usando-a!

### 🚀 Funcionalidades Principais

- **Experimentação Virtual**: Veja como você ficaria com qualquer roupa
- **IA Avançada**: Tecnologia de ponta para resultados realistas
- **Interface Moderna**: Design futurístico e intuitivo
- **Sistema de Tokens**: Criptomoeda para experimentar roupas
- **Resultados Instantâneos**: Processamento rápido e eficiente

## 🛠️ Funcionalidades Técnicas

### Backend (Node.js + Express)
- ✅ **Autenticação JWT** com bcrypt para segurança máxima
- ✅ **Sistema de Tokens** - Criptomoeda para experimentar roupas
- ✅ **API de IA** - Integração com Fashn.ai para processamento
- ✅ **Upload Inteligente** - Processamento de imagens otimizado
- ✅ **Painel Admin** - Gerenciamento completo da plataforma
- ✅ **Persistência JSON** - Sem necessidade de MySQL
- ✅ **CORS Configurado** - Acesso seguro entre frontend/backend

### Frontend (React + TailwindCSS)
- ✅ **Interface Futurística** - Design moderno e tecnológico
- ✅ **Dashboard Interativo** - Experiência imersiva do usuário
- ✅ **Upload Drag & Drop** - Interface intuitiva para imagens
- ✅ **Preview em Tempo Real** - Veja suas fotos antes de processar
- ✅ **Sistema de Tokens** - Visualização clara dos créditos
- ✅ **Responsivo** - Funciona perfeitamente em qualquer dispositivo
- ✅ **Animações Suaves** - Transições e efeitos visuais incríveis

## 📁 Estrutura do Projeto

```
├── backend/
│   ├── data/
│   │   └── database.json          # Banco de dados JSON
│   ├── middleware/
│   │   └── auth.js               # Middleware de autenticação
│   ├── models/
│   │   └── User.js               # Modelo de usuário
│   ├── routes/
│   │   ├── auth.js               # Rotas de autenticação
│   │   ├── users.js              # Rotas de usuário
│   │   ├── upload.js             # Rotas de upload
│   │   └── admin.js              # Rotas administrativas
│   ├── uploads/                  # Pasta para imagens
│   ├── config.env               # Variáveis de ambiente
│   ├── package.json
│   └── server.js                # Servidor principal
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/          # Componentes reutilizáveis
│   │   ├── contexts/            # Context API
│   │   ├── pages/               # Páginas da aplicação
│   │   ├── services/            # Serviços de API
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas
- **multer** - Upload de arquivos
- **axios** - Cliente HTTP
- **cors** - Cross-Origin Resource Sharing

### Frontend
- **React** - Biblioteca de interface
- **React Router** - Roteamento
- **TailwindCSS** - Framework CSS
- **Axios** - Cliente HTTP
- **Context API** - Gerenciamento de estado

## 🚀 Como Usar o Borracha de Roupa

### 1. 📱 Cadastre-se
- Crie sua conta na plataforma
- Receba tokens gratuitos para começar a experimentar

### 2. 📸 Faça Upload
- **Sua Foto**: Upload de uma foto sua clara
- **Roupa**: Upload da peça que deseja experimentar

### 3. ✨ Experimente
- Nossa IA processa as imagens
- Veja como você ficaria com a roupa
- Resultado em poucos minutos!

### 4. 💎 Sistema de Tokens
- Cada experimento custa 26 tokens
- Compre mais tokens quando necessário
- Experimente quantas roupas quiser!

## 🛠️ Instalação Técnica

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### 1. Configurar Backend

```bash
cd backend
npm install
```

Edite o arquivo `config.env` com suas configurações:
```env
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
API_KEY_FASHN=your_fashn_api_key_here
PORT=5000
```

Execute o servidor:
```bash
npm start
# ou para desenvolvimento
npm run dev
```

### 2. Configurar Frontend

```bash
cd frontend
npm install
```

Execute o frontend:
```bash
npm start
```

## 📋 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verificar token
- `GET /api/auth/profile` - Perfil do usuário

### Usuários
- `GET /api/users/profile` - Perfil do usuário
- `GET /api/users/history` - Histórico do usuário

### Upload
- `POST /api/upload/process` - Processar imagem (API real)
- `POST /api/upload/process-mock` - Processar imagem (simulação)

### Admin
- `GET /api/admin/users` - Listar usuários
- `GET /api/admin/users/:id` - Obter usuário
- `PUT /api/admin/users/:id/tokens` - Atualizar tokens
- `DELETE /api/admin/users/:id` - Excluir usuário
- `GET /api/admin/stats` - Estatísticas
- `GET /api/admin/history` - Histórico geral

## 👤 Usuários Padrão

O sistema não possui usuários pré-cadastrados. Você pode:
1. Registrar um novo usuário através da interface
2. O primeiro usuário registrado pode ser promovido a admin editando o arquivo `database.json`

## 🔧 Configuração para Produção

### VPS (Hostinger)

1. **Upload dos arquivos** para sua VPS
2. **Instalar Node.js** na VPS
3. **Configurar variáveis de ambiente** no arquivo `config.env`
4. **Instalar dependências**:
   ```bash
   cd backend && npm install --production
   cd ../frontend && npm install && npm run build
   ```
5. **Executar o servidor**:
   ```bash
   cd backend && npm start
   ```

### Configuração do Frontend para Produção

Edite o arquivo `frontend/src/services/api.js` e altere a URL base:
```javascript
const api = axios.create({
  baseURL: 'https://sua-vps.com/api', // URL da sua VPS
  timeout: 30000,
});
```

## 🔐 Segurança

- Senhas são criptografadas com bcrypt
- Tokens JWT com expiração de 24h
- Validação de tipos de arquivo para upload
- Middleware de autenticação em rotas protegidas
- Verificação de permissões de admin

## 💡 Como Funciona a IA

O **Borracha de Roupa** utiliza tecnologia de ponta para:

1. **Análise de Imagem**: Detecta automaticamente o corpo da pessoa
2. **Mapeamento 3D**: Cria um modelo virtual do seu corpo
3. **Aplicação de Roupa**: Superpõe a roupa de forma realista
4. **Ajuste Automático**: Adapta tamanho, posição e iluminação
5. **Resultado Final**: Gera uma imagem realista de você usando a roupa

## 📝 Informações Técnicas

1. **Sem MySQL**: Sistema usa arquivo JSON, ideal para VPS simples
2. **IA Real**: Integração com Fashn.ai para processamento avançado
3. **Upload Otimizado**: Suporte a imagens até 10MB
4. **Tokens Iniciais**: 10 tokens gratuitos para novos usuários
5. **Admin Panel**: Gerenciamento completo da plataforma

## 🎯 Casos de Uso

- **E-commerce**: Experimente roupas antes de comprar
- **Fashionistas**: Teste looks sem sair de casa
- **Influencers**: Crie conteúdo visual incrível
- **Lojas Online**: Reduza devoluções e aumente vendas
- **Designers**: Visualize suas criações em pessoas reais

## 🐛 Solução de Problemas

### Erro de Upload
- Verifique se as imagens são claras e bem iluminadas
- Confirme se os arquivos são JPG, PNG ou GIF
- Tamanho máximo: 10MB por arquivo

### Erro de Processamento
- Aguarde alguns minutos para o processamento
- Verifique se você tem tokens suficientes
- Tente com imagens de melhor qualidade

### Problemas de Tokens
- Cada experimento custa 26 tokens
- Compre mais tokens na seção "Tokens"
- Verifique seu saldo no dashboard

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console do navegador
2. Confirme se você tem tokens suficientes
3. Teste com imagens de melhor qualidade
4. Entre em contato através do painel admin

---

**🎭 Borracha de Roupa - O futuro da moda virtual está aqui!** ✨

*Desenvolvido com tecnologia de ponta para revolucionar a experiência de compra de roupas online.*
