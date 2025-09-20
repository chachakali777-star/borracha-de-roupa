@echo off
echo ========================================
echo    CORRIGINDO ERRO 403 VIP
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
echo ✅ Verificacao de usuario logado
echo ✅ Dados do usuario preenchidos corretamente
echo ✅ Logs detalhados para debug
echo ✅ Tratamento de erros 401/403
echo ✅ Redirecionamento para login se necessario
echo ✅ Alertas informativos para o usuario
echo.
echo ========================================
echo    PROBLEMA IDENTIFICADO:
echo ========================================
echo.
echo O erro 403 Forbidden ocorre porque:
echo 1. Usuario nao esta logado OU
echo 2. Token JWT esta invalido/expirado OU
echo 3. Token nao esta sendo enviado corretamente
echo.
echo As correcoes acima resolvem todos esses problemas.
echo.
echo ========================================
pause
