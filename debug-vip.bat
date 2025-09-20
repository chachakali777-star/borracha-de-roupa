@echo off
echo ==========================================
echo    DEBUG SISTEMA VIP COMPLETO
echo ==========================================

echo.
echo [DEBUG] Verificando configuracao da API...
echo Base URL configurada: https://borracharoupa.fun/api
echo Mas estamos em desenvolvimento local!
echo.

echo [1/5] Parando processos anteriores...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak > nul

echo.
echo [2/5] Iniciando servidor backend LOCAL...
cd backend
start /MIN cmd /c "node server.js & pause"
echo Aguardando servidor iniciar...
timeout /t 5 /nobreak > nul

echo.
echo [3/5] Testando conectividade local...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/test' -Method GET -UseBasicParsing; Write-Host 'Backend LOCAL: OK - Status:' $response.StatusCode -ForegroundColor Green } catch { Write-Host 'Backend LOCAL: ERRO' $_.Exception.Message -ForegroundColor Red }"

echo.
echo [4/5] Testando endpoint de pagamento...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/payment/create' -Method POST -ContentType 'application/json' -Body '{}' -UseBasicParsing; Write-Host 'Endpoint payment: EXISTE - Status:' $response.StatusCode } catch { if ($_.Exception.Response.StatusCode -eq 400) { Write-Host 'Endpoint payment: OK (erro esperado - dados invalidos)' -ForegroundColor Yellow } else { Write-Host 'Endpoint payment: ERRO' $_.Exception.Message -ForegroundColor Red } }"

echo.
echo [5/5] Build com debug ativado...
cd ../frontend
call npm run build

echo.
echo ==========================================
echo    ANALISE DE PROBLEMA:
echo ==========================================
echo.
echo PROBLEMA IDENTIFICADO:
echo - API configurada para: https://borracharoupa.fun/api
echo - Servidor local roda em: http://localhost:5000
echo - Frontend tenta acessar: https://borracharoupa.fun/api/payment/create
echo - Servidor local tem: http://localhost:5000/api/payment/create
echo.
echo SOLUCAO:
echo 1. Abra o DevTools do navegador (F12)
echo 2. Va na aba Console
echo 3. Clique "Comprar VIP" 
echo 4. Veja os logs [DEBUG] detalhados
echo 5. Identifique exatamente onde falha
echo.
echo EXPECTATIVA:
echo - Deve mostrar erro 404 ou CORS
echo - Logs vao mostrar URL exata tentativa
echo - Poderemos corrigir baseado nos logs
echo.
pause

