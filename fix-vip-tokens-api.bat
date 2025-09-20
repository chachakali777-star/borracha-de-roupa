@echo off
echo ==========================================
echo    USANDO API DA PAGINA /TOKENS
echo ==========================================

echo.
echo ✅ CORRECAO APLICADA:
echo - Dashboard agora usa /api/payment/create
echo - Mesma logica da pagina /tokens
echo - Mesma extracao de QR code
echo - Fallback para boleto se necessario
echo.

echo [1/2] Fazendo build do frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo ERRO: Falha no build
    pause
    exit /b 1
)

echo.
echo [2/2] Testando...
echo.
echo ==========================================
echo    TESTE AGORA:
echo ==========================================
echo.
echo 1. Abra localhost:3000
echo 2. Faca login (se necessario)
echo 3. Clique em categoria bloqueada
echo 4. Clique "Comprar VIP"
echo 5. QR code deve aparecer igual /tokens!
echo.
echo ✅ Agora usa a MESMA API que funciona!
echo.
pause
