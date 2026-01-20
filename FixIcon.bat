@echo off
echo Using Edge for better icon support...
echo.

REM Create Edge shortcut
powershell "$s=(New-Object -COM WScript.Shell).CreateShortcut([Environment]::GetFolderPath('Desktop')+'\\Laptop App.lnk');$s.TargetPath='msedge.exe';$s.Arguments='--app=http://localhost:5173 --window-size=1300,800 --user-data-dir=%TEMP%\\LaptopEdge';$s.IconLocation='icon.ico';$s.Save()"

REM Start services
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do taskkill /PID %%a /F 2>nul
start /min javaw -jar backend\target\laptop-registration-0.0.1-SNAPSHOT.jar
timeout /t 10
cd client && start /min npm run dev && cd ..
timeout /t 8

REM Open with Edge
start msedge --app=http://localhost:5173 --window-size=1300,800 --user-data-dir="%TEMP%\LaptopEdge"

echo Edge shows custom icons better than Chrome!
pause