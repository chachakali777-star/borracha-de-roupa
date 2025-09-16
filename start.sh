#!/bin/bash

echo "Iniciando sistema Fashn.ai..."
echo

echo "Instalando dependências do backend..."
cd backend
npm install
echo

echo "Instalando dependências do frontend..."
cd ../frontend
npm install
echo

echo "Iniciando backend..."
cd ../backend
npm start &
BACKEND_PID=$!

echo "Aguardando backend inicializar..."
sleep 5

echo "Iniciando frontend..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo
echo "Sistema iniciado!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo
echo "Pressione Ctrl+C para parar os serviços"

# Função para parar os processos quando o script for interrompido
cleanup() {
    echo "Parando serviços..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Manter o script rodando
wait
