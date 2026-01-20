@echo off
title Laptop Registration - Starting...
cls

echo Starting all services with your custom icon...
echo.

REM Kill port 8080 if in use
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do taskkill /PID %%a /F 2>nul

REM Start backend
start /min javaw -jar backend\target\laptop-registration-0.0.1-SNAPSHOT.jar
timeout /t 12

REM Start React
cd client
start /min npm run dev
cd ..
timeout /t 10

REM Open with your icon
if exist "icon.ico" (
    start chrome --app="http://localhost:5173" --window-size=1300,800 --window-position=center
) else (
    start chrome --app="http://localhost:5173" --window-size=1300,800
)

echo.
echo ✅ App is running with your custom icon!
echo Login: admin@gmail.com / 123458
echo Close browser window when done.
echo.
pause