@echo off
echo ========================================
echo    TESTANDO BUILD E MIDIAS
echo ========================================

echo.
echo [1/4] Verificando arquivos de midia...
if exist "frontend\public\img\MainImage.webp" (
    echo ✅ MainImage.webp encontrado
) else (
    echo ❌ MainImage.webp NAO encontrado
)

if exist "frontend\public\img\1.jpeg" (
    echo ✅ 1.jpeg encontrado
) else (
    echo ❌ 1.jpeg NAO encontrado
)

if exist "frontend\public\img\2.jpeg" (
    echo ✅ 2.jpeg encontrado
) else (
    echo ❌ 2.jpeg NAO encontrado
)

if exist "frontend\public\img\3.mp4" (
    echo ✅ 3.mp4 encontrado
) else (
    echo ❌ 3.mp4 NAO encontrado
)

if exist "frontend\public\img\4.mp4" (
    echo ✅ 4.mp4 encontrado
) else (
    echo ❌ 4.mp4 NAO encontrado
)

echo.
echo [2/4] Fazendo build do frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo ❌ ERRO: Falha no build do frontend
    pause
    exit /b 1
)

echo.
echo [3/4] Verificando arquivos no build...
cd ..
if exist "frontend\build\img\MainImage.webp" (
    echo ✅ MainImage.webp no build
) else (
    echo ❌ MainImage.webp NAO encontrado no build
)

if exist "frontend\build\img\1.jpeg" (
    echo ✅ 1.jpeg no build
) else (
    echo ❌ 1.jpeg NAO encontrado no build
)

if exist "frontend\build\img\2.jpeg" (
    echo ✅ 2.jpeg no build
) else (
    echo ❌ 2.jpeg NAO encontrado no build
)

echo.
echo [4/4] Teste concluido!
echo.
echo Para testar as imagens, abra o arquivo test-images.html no navegador
echo.
echo ========================================
pause
