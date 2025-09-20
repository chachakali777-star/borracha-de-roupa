@echo off
echo ========================================
echo    VIP COMO PAGINA DE TOKENS!
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
echo 1. Copie os arquivos atualizados para a VPS:
echo    - backend/routes/payment.js
echo    - frontend/build/* (todos os arquivos)
echo.
echo 2. Na VPS, execute:
echo    pm2 restart borracha-backend
echo.
echo ========================================
echo    IMPLEMENTACAO IDENTICA AO /TOKENS:
echo ========================================
echo.
echo ✅ Estados identicos ao PaymentModal
echo ✅ Funcao generateVipQRCode identica
echo ✅ Estrutura de dados identica
echo ✅ Modal visual identico ao PaymentModal
echo ✅ Tratamento de resposta identico
echo ✅ Layout e styling identicos
echo.
echo ========================================
echo    AGORA DEVERIA FUNCIONAR!
echo ========================================
echo.
echo O pagamento VIP agora usa EXATAMENTE a mesma
echo logica e estrutura da pagina /tokens que
echo sabemos que funciona.
echo.
echo ========================================
pause
