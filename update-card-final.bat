@echo off
echo ========================================
echo    CARD PRINCIPAL ATUALIZADO!
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
echo    CARD PRINCIPAL CONFIGURADO!
echo ========================================
echo.
echo Altura: 256px (dobro do tamanho original)
echo Estilo: Limpo e profissional
echo Imagem: Exibe completamente
echo.
echo ========================================
pause
