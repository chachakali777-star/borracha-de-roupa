@echo off
echo ========================================
echo    PAGAMENTO VIP R$ 49,90 IMPLEMENTADO!
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
echo ✅ Preço alterado para R$ 49,90
echo ✅ Modal de pagamento com QR Code
echo ✅ Geração automática de QR Code
echo ✅ Instruções de pagamento
echo ✅ Botão "Já Paguei" para confirmação
echo ✅ Loading state durante geração
echo.
echo ========================================
pause
