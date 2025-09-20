@echo off
echo ========================================
echo    ATUALIZANDO BACKEND PARA VIP
echo ========================================

echo.
echo [1/3] Copiando arquivo de pagamento atualizado...
echo.
echo Arquivo: backend/routes/payment.js
echo.
echo Mudancas implementadas:
echo ✅ Mapeamento para R$ 49,90 (4990 centavos)
echo ✅ Offer hash: nitroConfig.offers['1000']
echo ✅ Logs detalhados para debug
echo ✅ Melhor tratamento de resposta da Nitro Pay
echo ✅ Verificacao de QR code/URL
echo.
echo [2/3] Instrucoes para deploy na VPS:
echo.
echo 1. Copie o arquivo backend/routes/payment.js para:
echo    /var/www/borracha-de-roupa/backend/routes/payment.js
echo.
echo 2. Na VPS, execute:
echo    pm2 restart borracha-backend
echo.
echo 3. Verifique os logs:
echo    pm2 logs borracha-backend
echo.
echo [3/3] Teste o pagamento VIP novamente
echo.
echo ========================================
echo    BACKEND ATUALIZADO PARA VIP!
echo ========================================
echo.
echo O backend agora suporta:
echo - Valor R$ 49,90 (4990 centavos)
echo - Offer hash correto da Nitro Pay
echo - Logs detalhados para debug
echo - Melhor tratamento de erros
echo.
echo ========================================
pause
