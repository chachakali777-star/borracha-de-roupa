@echo off
echo ========================================
echo    BLOQUEIO VIP IMPLEMENTADO!
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
echo ✅ Badge VIP removido do header
echo ✅ Cards bloqueados com ícone de cadeado
echo ✅ Modal VIP com preço R$ 29,90
echo ✅ Overlay escuro nos cards bloqueados
echo ✅ Botão "Comprar VIP" leva para /tokens
echo.
echo ========================================
pause
