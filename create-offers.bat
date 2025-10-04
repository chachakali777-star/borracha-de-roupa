@echo off
echo ========================================
echo   CRIAR OFERTAS NA NITRO PAY
echo ========================================
echo.

echo 📦 Criando ofertas de tokens na Nitro Pay...
echo.

cd backend
node scripts/create-token-offers.js

echo.
echo ✅ Concluído!
pause

