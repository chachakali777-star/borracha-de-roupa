@echo off
echo ==========================================
echo    TESTE DEBUG RAPIDO
echo ==========================================

echo.
echo Fazendo build com debug...
cd frontend
call npm run build

echo.
echo ==========================================
echo    AGORA TESTE:
echo ==========================================
echo.
echo 1. Abra localhost:3000
echo 2. Pressione F12 (abrir DevTools)
echo 3. Va na aba "Console"
echo 4. Clique em categoria bloqueada
echo 5. Clique "Comprar VIP"
echo 6. VEJA OS LOGS [DEBUG] no console
echo.
echo OS LOGS VAO MOSTRAR:
echo - Se a requisicao esta sendo feita
echo - Para qual URL exata
echo - Qual erro especifico acontece
echo - Tempo de resposta
echo - Dados enviados
echo.
echo COPIE E COLE AQUI OS LOGS [DEBUG] QUE APARECEREM!
echo.
pause

