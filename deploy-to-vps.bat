@echo off
echo ========================================
echo   DEPLOY BORRACHA DE ROUPA PARA VPS
echo ========================================
echo.

echo 🚀 Iniciando deploy para a VPS...
echo.

echo 📤 Enviando script de atualização para a VPS...
scp deploy-update.sh root@31.97.162.251:/var/www/borracha-de-roupa/

echo.
echo 🔧 Executando atualização na VPS...
ssh root@31.97.162.251 "cd /var/www/borracha-de-roupa && chmod +x deploy-update.sh && ./deploy-update.sh"

echo.
echo ✅ Deploy concluído!
echo.
echo 📊 Para verificar o status da aplicação:
echo ssh root@31.97.162.251 "pm2 status"
echo.
echo 📋 Para ver os logs em tempo real:
echo ssh root@31.97.162.251 "pm2 logs borracha-backend"
echo.
pause

