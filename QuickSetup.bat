@echo off
title One-Click Setup for Presentation
cls

echo Setting up everything for your presentation...
echo.

REM Step 1: Create shortcut
echo 1. Creating desktop shortcut...
powershell -Command "
    \$shortcut = (New-Object -COM WScript.Shell).CreateShortcut([Environment]::GetFolderPath('Desktop')+'\Laptop App.lnk')
    \$shortcut.TargetPath = 'chrome.exe'
    \$shortcut.Arguments = '--app=http://localhost:5173 --window-size=1300,800 --user-data-dir=\"%TEMP%\LaptopApp\"'
    if (Test-Path 'icon.ico') {
        \$shortcut.IconLocation = (Get-Item 'icon.ico').FullName
    }
    \$shortcut.Save()
"

REM Step 2: Start services
echo 2. Starting services...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do taskkill /PID %%a /F 2>nul
start /min javaw -jar backend\target\laptop-registration-0.0.1-SNAPSHOT.jar
timeout /t 12
cd client && start /min npm run dev && cd ..
timeout /t 10

REM Step 3: Open app
echo 3. Opening application...
start chrome --app=http://localhost:5173 --window-size=1300,800 --user-data-dir="%TEMP%\LaptopApp"

echo.
echo ✅ DONE! Your app is running.
echo 📌 Use the shortcut on Desktop next time.
echo 🔑 Login: admin@gmail.com / 123458
echo.
pause