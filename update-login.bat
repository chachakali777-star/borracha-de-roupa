@echo off
echo 🚀 Atualizando páginas (Login + Dashboard) na VPS...

echo 📦 Fazendo build do frontend...
cd frontend
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Erro no build do frontend
    pause
    exit /b 1
)

echo ✅ Build concluído com sucesso!

echo 📤 Enviando arquivos para VPS...
echo.
echo INSTRUÇÕES PARA ENVIO MANUAL:
echo.
echo 1. Copie a pasta 'frontend/build' para sua VPS
echo 2. Substitua os arquivos em /var/www/borracha-de-roupa/frontend/build/
echo 3. Execute na VPS: pm2 restart borracha-backend
echo.
echo MUDANÇAS APLICADAS:
echo ✅ Página de Login - Design rosa minimalista
echo ✅ Dashboard - Layout mobile com categorias
echo ✅ Badge VIP no topo
echo ✅ Navegação inferior
echo ✅ Mantidas funcionalidades de tokens e histórico
echo.
echo Ou use um cliente FTP como FileZilla para enviar os arquivos.
echo.

pause
cd ..
