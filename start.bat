@echo off
echo Iniciando sistema Fashn.ai...
echo.

echo Instalando dependencias do backend...
cd backend
call npm install
echo.

echo Instalando dependencias do frontend...
cd ../frontend
call npm install
echo.

echo Iniciando backend...
start "Backend" cmd /k "cd /d %cd%\..\backend && npm start"
timeout /t 3 /nobreak > nul

echo Iniciando frontend...
start "Frontend" cmd /k "cd /d %cd% && npm start"
echo.

echo Sistema iniciado!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
