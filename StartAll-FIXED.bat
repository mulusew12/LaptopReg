@echo off
title Start Laptop Registration System
cls

echo ╔══════════════════════════════════╗
echo ║    STARTING ALL SERVICES        ║
echo ╚══════════════════════════════════╝
echo.

REM Kill port 8080
echo Stopping anything on port 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
    echo Killing process PID: %%a
    taskkill /PID %%a /F >nul 2>&1
)

REM Start Java backend
echo Starting Java Backend...
start /min javaw -jar backend\target\laptop-registration-0.0.1-SNAPSHOT.jar
echo Waiting for backend (10 seconds)...
timeout /t 10 >nul

REM Start React
echo Starting React Frontend...
cd client
start /min cmd /c "npm run dev"
cd ..
echo Waiting for React (8 seconds)...
timeout /t 8 >nul

echo.
echo ✅ ALL SERVICES RUNNING!
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo ╔══════════════════════════════════╗
echo ║    NEXT STEP:                    ║
echo ╚══════════════════════════════════╝
echo.
echo Now double-click "Laptop Registration" shortcut on Desktop
echo OR press Enter to open browser directly...
pause >nul

REM Open directly as fallback
start chrome --app="http://localhost:5173" --window-size=1300,800
echo.
echo Login: admin@gmail.com / 123458
echo.
echo Press any key to stop all services...
pause >nul

taskkill /F /IM javaw.exe 2>nul
taskkill /F /IM node.exe 2>nul
echo Services stopped.