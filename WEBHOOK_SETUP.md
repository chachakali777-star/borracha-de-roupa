# 🔧 Configuração do Webhook - Nitro Pay

## ❌ **Problema Atual**

O webhook está configurado para `http://localhost:5000/api/payment/webhook`, mas a Nitro Pay não consegue acessar URLs locais.

## ✅ **Soluções Possíveis**

### **Opção 1: Usar ngrok (Recomendado para desenvolvimento)**

1. **Instalar ngrok:**
   - Baixe em: https://ngrok.com/download
   - Extraia o arquivo `ngrok.exe` em uma pasta
   - Adicione a pasta ao PATH do Windows

2. **Expor o backend:**
   ```bash
   ngrok http 5000
   ```

3. **Copiar a URL pública:**
   - O ngrok gerará uma URL como: `https://abc123.ngrok.io`
   - Use: `https://abc123.ngrok.io/api/payment/webhook`

4. **Atualizar a configuração:**
   - Edite `backend/routes/payment.js` linha 84
   - Substitua por: `postback_url: postback_url || 'https://SUA_URL_NGROK.ngrok.io/api/payment/webhook'`

### **Opção 2: Deploy em servidor público**

1. **Deploy do backend:**
   - Heroku, Railway, Vercel, etc.
   - Exemplo: `https://seu-app.herokuapp.com/api/payment/webhook`

2. **Atualizar configuração:**
   - Edite `backend/routes/payment.js` linha 84
   - Substitua pela URL do seu servidor

### **Opção 3: Usar serviço de webhook (Temporário)**

1. **Usar webhook.site:**
   - Acesse: https://webhook.site
   - Copie a URL única gerada
   - Use para testar se a Nitro Pay está enviando webhooks

## 🔍 **Como Testar**

1. **Inicie o backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Exponha com ngrok:**
   ```bash
   ngrok http 5000
   ```

3. **Atualize a URL no código:**
   - Substitua `localhost:5000` pela URL do ngrok

4. **Teste um pagamento:**
   - Faça uma compra de R$ 5,00
   - Verifique os logs do backend
   - Verifique se o webhook foi chamado

## 📋 **Estrutura do Webhook**

A Nitro Pay enviará um POST para o webhook com:

```json
{
  "hash": "hash_da_transacao",
  "payment_status": "approved",
  "amount": 500,
  "customer": {
    "email": "usuario@email.com",
    "name": "Nome do Usuário"
  }
}
```

## ⚠️ **Importante**

- O webhook DEVE ser acessível publicamente
- Use HTTPS em produção
- Teste sempre antes de colocar em produção
- Mantenha logs para debug

## 🚀 **Para Produção**

1. **Configure um domínio próprio**
2. **Use HTTPS**
3. **Configure SSL/TLS**
4. **Monitore os logs**
5. **Implemente retry em caso de falha**
