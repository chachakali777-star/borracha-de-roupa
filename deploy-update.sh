#!/bin/bash

# Script para atualizar o projeto na VPS
# Execute este script na sua VPS

echo "🚀 Atualizando projeto Borracha de Roupa na VPS..."

# Ir para o diretório do projeto
cd /var/www/borracha-de-roupa

# Fazer backup do estado atual (opcional)
echo "💾 Fazendo backup do estado atual..."
cp -r . ../backup-$(date +%Y%m%d-%H%M%S)

# Atualizar código do repositório
echo "📥 Baixando atualizações do repositório..."
git pull origin main

# Instalar/atualizar dependências do backend
echo "📦 Atualizando dependências do backend..."
cd backend
npm install --production

# Voltar para o diretório raiz
cd ..

# Instalar/atualizar dependências do frontend
echo "📦 Atualizando dependências do frontend..."
cd frontend
npm install

# Fazer build do frontend
echo "🔨 Fazendo build do frontend..."
npm run build

# Voltar para o diretório raiz
cd ..

# Reiniciar aplicação com PM2
echo "🔄 Reiniciando aplicação..."
pm2 restart borracha-backend

# Verificar status
echo "✅ Verificando status da aplicação..."
pm2 status

echo "🎉 Deploy concluído com sucesso!"
echo "📊 Para ver os logs em tempo real: pm2 logs borracha-backend"

