# 🚀 Guia de Deploy - Borracha de Roupa

Este guia te ajudará a colocar sua aplicação "Borracha de Roupa" na VPS.

## 📋 Pré-requisitos

- VPS com Ubuntu 20.04+ ou Debian 11+
- Domínio apontando para o IP da VPS
- Acesso SSH à VPS
- Conhecimento básico de Linux

## 🔧 Passo 1: Preparação da VPS

### 1.1 Conectar via SSH
```bash
ssh root@SEU_IP_VPS
```

### 1.2 Executar script de preparação
```bash
# Faça upload do arquivo deploy.sh para a VPS
chmod +x deploy.sh
./deploy.sh
```

## 📁 Passo 2: Upload dos Arquivos

### 2.1 Opção A: Via SCP/SFTP
```bash
# Do seu computador local
scp -r . root@SEU_IP_VPS:/var/www/borracha-de-roupa/
```

### 2.2 Opção B: Via Git (Recomendado)
```bash
# Na VPS
cd /var/www/borracha-de-roupa
git clone https://github.com/SEU_USUARIO/borracha-de-roupa.git .
```

## ⚙️ Passo 3: Configuração

### 3.1 Instalar dependências
```bash
# Backend
cd /var/www/borracha-de-roupa/backend
npm install --production

# Frontend
cd /var/www/borracha-de-roupa/frontend
npm install
npm run build
```

### 3.2 Configurar variáveis de ambiente
```bash
# Copiar arquivo de exemplo
cp env.production /var/www/borracha-de-roupa/backend/.env

# Editar com suas configurações
nano /var/www/borracha-de-roupa/backend/.env
```

**Configure estas variáveis importantes:**
```env
JWT_SECRET=sua_chave_jwt_super_segura_aqui
FRONTEND_URL=https://SEU_DOMINIO.com
WEBHOOK_URL=https://SEU_DOMINIO.com/api/payment/webhook
```

### 3.3 Configurar Nginx
```bash
# Copiar configuração
cp nginx.conf /etc/nginx/sites-available/borracha-de-roupa

# Editar domínio
nano /etc/nginx/sites-available/borracha-de-roupa
# Substitua SEU_DOMINIO_AQUI pelo seu domínio real

# Ativar site
ln -s /etc/nginx/sites-available/borracha-de-roupa /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Testar configuração
nginx -t

# Reiniciar Nginx
systemctl restart nginx
```

## 🔒 Passo 4: SSL/HTTPS

### 4.1 Gerar certificado SSL
```bash
# Substitua SEU_DOMINIO pelo seu domínio real
certbot --nginx -d SEU_DOMINIO.com -d www.SEU_DOMINIO.com
```

### 4.2 Configurar renovação automática
```bash
# Adicionar ao crontab
crontab -e

# Adicionar esta linha:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🚀 Passo 5: Iniciar Aplicação

### 5.1 Configurar PM2
```bash
# Copiar configuração
cp ecosystem.config.js /var/www/borracha-de-roupa/

# Editar configurações
nano /var/www/borracha-de-roupa/ecosystem.config.js
# Substitua SEU_DOMINIO_AQUI e SEU_IP_VPS_AQUI

# Iniciar aplicação
cd /var/www/borracha-de-roupa
pm2 start ecosystem.config.js
```

### 5.2 Configurar PM2 para iniciar automaticamente
```bash
pm2 startup
pm2 save
```

## 🔧 Passo 6: Configurar Webhook da Nitro Pay

### 6.1 Acessar painel da Nitro Pay
1. Faça login no painel da Nitro Pay
2. Vá em "Configurações" > "Webhooks"
3. Adicione a URL: `https://SEU_DOMINIO.com/api/payment/webhook`

### 6.2 Testar webhook
```bash
# Testar se o webhook está funcionando
curl -X POST https://SEU_DOMINIO.com/api/payment/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "webhook"}'
```

## 📊 Passo 7: Monitoramento

### 7.1 Verificar status da aplicação
```bash
pm2 status
pm2 logs borracha-backend
```

### 7.2 Verificar logs do Nginx
```bash
tail -f /var/log/nginx/borracha-de-roupa.access.log
tail -f /var/log/nginx/borracha-de-roupa.error.log
```

## 🔄 Passo 8: Atualizações

### 8.1 Atualizar aplicação
```bash
cd /var/www/borracha-de-roupa
git pull origin main
cd frontend && npm run build
pm2 restart borracha-backend
```

## 🛠️ Comandos Úteis

### Gerenciar aplicação
```bash
pm2 restart borracha-backend    # Reiniciar
pm2 stop borracha-backend       # Parar
pm2 delete borracha-backend     # Remover
pm2 logs borracha-backend       # Ver logs
```

### Gerenciar Nginx
```bash
systemctl restart nginx         # Reiniciar Nginx
systemctl status nginx          # Status do Nginx
nginx -t                        # Testar configuração
```

### Verificar portas
```bash
netstat -tlnp | grep :5000     # Verificar se backend está rodando
netstat -tlnp | grep :80        # Verificar se Nginx está rodando
netstat -tlnp | grep :443       # Verificar se HTTPS está funcionando
```

## 🚨 Troubleshooting

### Problema: Aplicação não inicia
```bash
# Verificar logs
pm2 logs borracha-backend
journalctl -u nginx -f
```

### Problema: SSL não funciona
```bash
# Verificar certificado
certbot certificates
# Renovar se necessário
certbot renew --force-renewal
```

### Problema: Webhook não funciona
```bash
# Testar conectividade
curl -I https://SEU_DOMINIO.com/api/payment/webhook
# Verificar logs
tail -f /var/log/nginx/borracha-de-roupa.error.log
```

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs: `pm2 logs borracha-backend`
2. Verifique o status: `pm2 status`
3. Teste a conectividade: `curl -I https://SEU_DOMINIO.com`

---

🎉 **Parabéns!** Sua aplicação "Borracha de Roupa" está rodando na VPS!
