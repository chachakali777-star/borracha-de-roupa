@echo off
echo ========================================
echo    CORRIGINDO EXTRACAO DE QR CODE
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
echo    CORRECOES IMPLEMENTADAS:
echo ========================================
echo.
echo ✅ Extracao de QR code melhorada
echo ✅ Busca em response.data.qr_code
echo ✅ Busca em response.data.transaction.qr_code
echo ✅ Busca em response.data.payment_url
echo ✅ Fallback para boleto simulado
echo ✅ Logs detalhados para debug
echo ✅ QR code com hash da transacao
echo.
echo ========================================
echo    PROBLEMA IDENTIFICADO:
echo ========================================
echo.
echo O QR code nao estava sendo extraido corretamente
echo da resposta da API. Agora busca em multiplos
echo locais e tem fallback para boleto.
echo.
echo ========================================
pause
