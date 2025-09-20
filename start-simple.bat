@echo off
echo ==========================================
echo    INICIANDO SISTEMA SIMPLIFICADO
echo ==========================================

echo.
echo ✅ MUDANCAS APLICADAS:
echo - VIP nao precisa de login
echo - Usa dados padrao (sem CPF/nome)
echo - Modal mais simples
echo - Mesma API da pagina /tokens
echo.

echo [1/3] Parando servidores anteriores...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak > nul

echo.
echo [2/3] Iniciando servidor backend...
cd backend
start /B node server.js
timeout /t 3 /nobreak > nul

echo.
echo [3/3] Fazendo build do frontend...
cd ../frontend
call npm run build

echo.
echo ==========================================
echo    SISTEMA PRONTO!
echo ==========================================
echo.
echo ✅ Backend: Rodando na porta 5000
echo ✅ Frontend: Build atualizado
echo ✅ VIP: Simplificado sem CPF/nome
echo.
echo TESTE AGORA:
echo 1. Abra localhost:3000
echo 2. Clique categoria bloqueada
echo 3. Clique "Comprar VIP"
echo 4. QR code aparece instantaneamente!
echo.
echo Nao precisa mais de login ou dados pessoais!
echo.
pause
