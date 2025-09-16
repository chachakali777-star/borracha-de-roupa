#!/bin/bash

# Script de Deploy para Borracha de Roupa - VPS
# Execute este script na sua VPS

echo "🚀 Iniciando deploy da Borracha de Roupa..."

# Atualizar sistema
echo "📦 Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
echo "📦 Instalando Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 para gerenciar processos
echo "📦 Instalando PM2..."
sudo npm install -g pm2

# Instalar Nginx
echo "📦 Instalando Nginx..."
sudo apt install nginx -y

# Instalar Certbot para SSL
echo "📦 Instalando Certbot..."
sudo apt install certbot python3-certbot-nginx -y

# Criar usuário para a aplicação
echo "👤 Criando usuário da aplicação..."
sudo useradd -m -s /bin/bash borracha-app
sudo usermod -aG sudo borracha-app

# Criar diretório da aplicação
echo "📁 Criando diretório da aplicação..."
sudo mkdir -p /var/www/borracha-de-roupa
sudo chown borracha-app:borracha-app /var/www/borracha-de-roupa

echo "✅ Deploy básico concluído!"
echo "📋 Próximos passos:"
echo "1. Faça upload dos arquivos da aplicação para /var/www/borracha-de-roupa"
echo "2. Configure as variáveis de ambiente"
echo "3. Execute npm install nos diretórios frontend e backend"
echo "4. Configure o Nginx"
echo "5. Inicie a aplicação com PM2"

