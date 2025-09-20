#!/bin/bash

# Script para atualizar apenas a página de login na VPS
# Uso: ./update-login.sh

echo "🚀 Atualizando página de login na VPS..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configurações da VPS
VPS_IP="31.97.162.251"
VPS_USER="root"
VPS_PATH="/var/www/borracha-de-roupa"

echo -e "${BLUE}📦 Fazendo build do frontend...${NC}"
cd frontend
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build concluído com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro no build do frontend${NC}"
    exit 1
fi

echo -e "${BLUE}📤 Enviando arquivos para VPS...${NC}"

# Enviar apenas os arquivos do build
scp -r build/* ${VPS_USER}@${VPS_IP}:${VPS_PATH}/frontend/build/

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Arquivos enviados com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro ao enviar arquivos${NC}"
    exit 1
fi

echo -e "${BLUE}🔄 Reiniciando aplicação na VPS...${NC}"

# Reiniciar aplicação
ssh ${VPS_USER}@${VPS_IP} "cd ${VPS_PATH} && pm2 restart borracha-backend"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Aplicação reiniciada com sucesso!${NC}"
    echo -e "${GREEN}🎉 Atualização concluída! Acesse: https://borracharoupa.fun${NC}"
else
    echo -e "${RED}❌ Erro ao reiniciar aplicação${NC}"
    exit 1
fi

cd ..
echo -e "${GREEN}✨ Processo finalizado!${NC}"


