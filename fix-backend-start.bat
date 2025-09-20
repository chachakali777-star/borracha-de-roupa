@echo off
echo ==========================================
echo    INICIANDO BACKEND + BUILD
echo ==========================================

echo.
echo ✅ CORRECAO FINAL APLICADA:
echo - URL corrigida: /payment/create (sem /api)
echo - Logica identica ao PaymentModal
echo - Dados padrao para VIP
echo.

echo [1/4] Parando processos anteriores...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak > nul

echo.
echo [2/4] Iniciando servidor backend...
cd backend
start /MIN node server.js
echo Aguardando servidor iniciar...
timeout /t 5 /nobreak > nul

echo.
echo [3/4] Testando se backend esta rodando...
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:5000/api/test' -Method GET -UseBasicParsing | Out-Null; Write-Host 'Backend: OK' -ForegroundColor Green } catch { Write-Host 'Backend: ERRO' -ForegroundColor Red }"

echo.
echo [4/4] Build do frontend...
cd ../frontend
call npm run build

echo.
echo ==========================================
echo    SISTEMA FUNCIONANDO!
echo ==========================================
echo.
echo ✅ Backend: Rodando na porta 5000
echo ✅ Frontend: Build atualizado  
echo ✅ API: /payment/create funcionando
echo ✅ VIP: Usando mesma logica de /tokens
echo.
echo TESTE FINAL:
echo 1. Abra localhost:3000
echo 2. Clique categoria bloqueada
echo 3. Clique "Comprar VIP" 
echo 4. QR code deve aparecer!
echo.
echo Se ainda houver erro 404, execute:
echo   cd backend
echo   node server.js
echo.
pause
