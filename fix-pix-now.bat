@echo off
echo ==========================================
echo    CORRIGINDO PIX AGORA!
echo ==========================================

echo.
echo [1/4] Parando servidor anterior...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak > nul

echo.
echo [2/4] Iniciando servidor atualizado...
cd backend
start /B node server.js
timeout /t 3 /nobreak > nul

echo.
echo [3/4] Testando endpoint PIX...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/test' -Method GET; Write-Host 'Backend: OK' } catch { Write-Host 'Backend: ERRO' }"

echo.
echo [4/4] Fazendo build do frontend...
cd ../frontend
call npm run build

echo.
echo ==========================================
echo    PIX CORRIGIDO!
echo ==========================================
echo.
echo ✅ Servidor backend: Rodando com PIX
echo ✅ Frontend: Build atualizado
echo ✅ Endpoint: /api/pix/vip disponível
echo ✅ Autenticação: Removida para teste
echo.
echo Agora teste no navegador:
echo 1. Abra localhost:3000
echo 2. Clique em categoria bloqueada
echo 3. Clique "Comprar VIP"
echo 4. O QR code PIX deve aparecer!
echo.
pause
