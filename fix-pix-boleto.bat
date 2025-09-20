@echo off
echo ========================================
echo    CORRIGINDO PIX COM BOLETO FALLBACK
echo ========================================

echo.
echo [1/4] Fazendo build do frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo ERRO: Falha no build do frontend
    pause
    exit /b 1
)

echo.
echo [2/4] Build concluido com sucesso!
echo.
echo [3/4] Instrucoes para deploy na VPS:
echo.
echo 1. Copie os arquivos atualizados para a VPS:
echo    - backend/routes/payment.js
echo    - frontend/build/* (todos os arquivos)
echo.
echo 2. Na VPS, execute:
echo    pm2 restart borracha-backend
echo.
echo [4/4] Teste o pagamento VIP novamente
echo.
echo ========================================
echo    CORRECOES IMPLEMENTADAS:
echo ========================================
echo.
echo ✅ PIX nao funciona na Nitro Pay
echo ✅ Implementado fallback para boleto bancario
echo ✅ Backend extrai billet_url e billet_barcode
echo ✅ Frontend gera QR code com URL do boleto
echo ✅ Instrucoes atualizadas para PIX e boleto
echo ✅ Logs detalhados para debug
echo.
echo ========================================
echo    PROBLEMA IDENTIFICADO:
echo ========================================
echo.
echo A Nitro Pay nao esta configurada para PIX.
echo Todas as transacoes PIX retornam status 'failed'.
echo.
echo Solucao: Usar boleto bancario como fallback.
echo O QR code agora contem a URL do boleto.
echo.
echo ========================================
pause
