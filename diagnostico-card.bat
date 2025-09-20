@echo off
echo ========================================
echo    DIAGNOSTICO DO CARD PRINCIPAL
echo ========================================

echo.
echo [1/5] Verificando se o build existe...
if exist "frontend\build" (
    echo ✅ Pasta build existe
) else (
    echo ❌ Pasta build NAO existe - precisa fazer build
    echo.
    echo Execute: cd frontend ^&^& npm run build
    pause
    exit /b 1
)

echo.
echo [2/5] Verificando arquivos de midia no build...
if exist "frontend\build\img\MainImage.webp" (
    echo ✅ MainImage.webp no build
) else (
    echo ❌ MainImage.webp NAO encontrado no build
)

echo.
echo [3/5] Verificando se o servidor esta rodando...
netstat -an | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo ✅ Servidor rodando na porta 3000
) else (
    echo ❌ Servidor NAO esta rodando na porta 3000
    echo.
    echo Para testar localmente:
    echo cd frontend
    echo npm start
)

echo.
echo [4/5] Verificando cache do navegador...
echo.
echo POSSIVEIS CAUSAS:
echo 1. Cache do navegador - pressione Ctrl+F5
echo 2. Build nao foi executado - execute npm run build
echo 3. Servidor nao foi reiniciado - reinicie o servidor
echo 4. CSS nao foi aplicado - verifique se Tailwind esta funcionando

echo.
echo [5/5] Testando com estilos inline...
echo.
echo Implementei estilos inline para forcar a altura:
echo style={{ height: '256px', minHeight: '256px' }}
echo.
echo Se ainda nao funcionar, pode ser:
echo - Cache do navegador
echo - Build nao aplicado
echo - Servidor nao reiniciado

echo.
echo ========================================
echo    DIAGNOSTICO CONCLUIDO
echo ========================================
pause
