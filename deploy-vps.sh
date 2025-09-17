#!/bin/bash

# Script de Deploy para Borracha de Roupa - VPS Kodee
# Execute este script na sua VPS

echo "🚀 Iniciando deploy da Borracha de Roupa na VPS..."

# Atualizar sistema
echo "📦 Atualizando sistema..."
dnf update -y

# Instalar Node.js 18
echo "📦 Instalando Node.js 18..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
dnf install -y nodejs

# Instalar PM2 para gerenciar processos
echo "📦 Instalando PM2..."
npm install -g pm2

# Instalar Nginx
echo "📦 Instalando Nginx..."
dnf install -y nginx

# Instalar Certbot para SSL
echo "📦 Instalando Certbot..."
dnf install -y certbot python3-certbot-nginx

# Habilitar e iniciar Nginx
echo "📦 Configurando Nginx..."
systemctl enable nginx
systemctl start nginx

# Configurar firewall
echo "🔥 Configurando firewall..."
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-service=ssh
firewall-cmd --reload

# Criar usuário para a aplicação
echo "👤 Criando usuário da aplicação..."
useradd -m -s /bin/bash borracha-app
usermod -aG wheel borracha-app

# Criar diretório da aplicação
echo "📁 Criando diretório da aplicação..."
mkdir -p /var/www/borracha-de-roupa
chown borracha-app:borracha-app /var/www/borracha-de-roupa

# Criar diretório de logs do PM2
echo "📁 Criando diretório de logs..."
mkdir -p /var/log/pm2
chown borracha-app:borracha-app /var/log/pm2

echo "✅ Deploy básico concluído!"
echo "📋 Próximos passos:"
echo "1. Faça upload dos arquivos da aplicação para /var/www/borracha-de-roupa"
echo "2. Configure as variáveis de ambiente"
echo "3. Execute npm install nos diretórios frontend e backend"
echo "4. Configure o Nginx"
echo "5. Configure o domínio borracharoupa.fun"
echo "6. Inicie a aplicação com PM2"
