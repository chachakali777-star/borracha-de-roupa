@echo off
echo ========================================
echo    QR CODE VIP IMPLEMENTADO!
echo ========================================

echo.
echo [1/3] Fazendo build do frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo ERRO: Falha no build do frontend
    pause
    exit /b 1
)

echo.
echo [2/3] Build concluido com sucesso!
echo.
echo [3/3] Instrucoes para deploy na VPS:
echo.
echo 1. Copie os arquivos da pasta frontend/build/* para:
echo    /var/www/borracha-de-roupa/frontend/build/
echo.
echo 2. Na VPS, execute:
echo    pm2 restart borracha-backend
echo.
echo ========================================
echo    FUNCIONALIDADES IMPLEMENTADAS:
echo ========================================
echo.
echo ✅ QR Code real usando biblioteca qrcode
echo ✅ Integração com API de pagamento
echo ✅ Mesma estrutura do PaymentModal
echo ✅ Geração automática de QR Code PIX
echo ✅ Dados do cliente preenchidos
echo ✅ Product hash: vip_upgrade
echo.
echo ========================================
pause
