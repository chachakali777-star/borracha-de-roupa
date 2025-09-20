@echo off
echo ========================================
echo    CARD PRINCIPAL AINDA MAIOR!
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
echo    CARD PRINCIPAL AUMENTADO!
echo ========================================
echo.
echo Altura: 320px (2.5x o tamanho original)
echo Icone: 24x24px (50%% maior)
echo Texto: 5xl (maior)
echo Badge: text-base (maior)
echo.
echo ========================================
pause
