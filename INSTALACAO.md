# 🚀 Guia de Instalação - Sistema Fashn.ai

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Navegador web moderno

## 🛠️ Instalação Rápida

### Windows
1. Execute o arquivo `start.bat` como administrador
2. Aguarde a instalação das dependências
3. O sistema será iniciado automaticamente

### Linux/Mac
1. Execute no terminal:
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

## 🔧 Instalação Manual

### 1. Backend

```bash
cd backend
npm install
```

### 2. Frontend

```bash
cd frontend
npm install
```

### 3. Configuração

Edite o arquivo `backend/config.env`:

```env
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
API_KEY_FASHN=your_fashn_api_key_here
PORT=5000
```

### 4. Criar Usuário Admin

```bash
cd backend
npm run create-admin
```

### 5. Executar

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

## 🌐 Acessos

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **API:** http://localhost:5000/api

## 👤 Usuário Admin Padrão

Após executar `npm run create-admin`:

- **Email:** admin@fashn.ai
- **Senha:** admin123
- **Tokens:** 100

## 🔧 Configuração para VPS (Hostinger)

### 1. Upload dos Arquivos
- Faça upload de toda a pasta do projeto para sua VPS
- Certifique-se de que o Node.js está instalado

### 2. Instalação na VPS
```bash
cd backend
npm install --production
cd ../frontend
npm install
npm run build
```

### 3. Configuração do Frontend
Edite `frontend/src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: 'https://sua-vps.com/api', // URL da sua VPS
  timeout: 30000,
});
```

### 4. Executar na VPS
```bash
cd backend
npm start
```

### 5. Servir Frontend
Você pode usar nginx, apache ou simplesmente servir a pasta `frontend/build`:

```bash
# Usando serve (instalar: npm install -g serve)
cd frontend
serve -s build -l 3000
```

## 🐛 Solução de Problemas

### Erro: "Cannot find module"
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro de CORS
- Verifique se o backend está rodando na porta 5000
- Confirme se o CORS está habilitado

### Erro de Upload
- Verifique se a pasta `backend/uploads` existe
- Confirme as permissões de escrita

### Porta já em uso
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

## 📝 Notas Importantes

1. **Primeira execução:** Execute `npm run create-admin` para criar o usuário administrador
2. **Desenvolvimento:** Use `npm run dev` no backend para auto-reload
3. **Produção:** Use `npm start` e `npm run build` no frontend
4. **Banco de dados:** Os dados são salvos em `backend/data/database.json`
5. **Uploads:** As imagens são salvas em `backend/uploads/`

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs no console
2. Confirme se todas as dependências foram instaladas
3. Verifique se as portas 3000 e 5000 estão livres
4. Confirme se o arquivo `config.env` está configurado

---

**Sistema pronto para uso! 🎉**
