@echo off
echo ========================================
echo    CRIANDO OFERTA VIP NA NITRO PAY
echo ========================================

echo.
echo [1/3] Executando script de criacao...
cd backend
node create-vip-offer.js
if %errorlevel% neq 0 (
    echo ERRO: Falha ao criar oferta VIP
    pause
    exit /b 1
)

echo.
echo [2/3] Oferta VIP criada com sucesso!
echo.
echo [3/3] Instrucoes para deploy na VPS:
echo.
echo 1. Copie os arquivos atualizados para a VPS:
echo    - backend/routes/payment.js
echo    - backend/nitro-config.json
echo    - backend/create-vip-offer.js
echo.
echo 2. Na VPS, execute:
echo    pm2 restart borracha-backend
echo.
echo 3. Teste o pagamento VIP
echo.
echo ========================================
echo    OFERTA VIP CRIADA!
echo ========================================
echo.
echo A oferta VIP (R$ 49,90) foi criada na Nitro Pay
echo e o arquivo nitro-config.json foi atualizado.
echo.
echo ========================================
pause
