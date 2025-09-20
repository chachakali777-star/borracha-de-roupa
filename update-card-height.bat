@echo off
echo ========================================
echo    AUMENTANDO CARD PRINCIPAL
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
echo    Altura: h-32 → h-48 (50%% maior)
echo    Icone: 16x16 → 20x20 (25%% maior)
echo    Badge: text-xs → text-sm (maior)
echo ========================================
pause
