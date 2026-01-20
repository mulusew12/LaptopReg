@echo off
title Create Desktop App with Icon
color 0A
cls

echo ╔══════════════════════════════════╗
echo ║  CREATE DESKTOP APP WITH ICON   ║
echo ╚══════════════════════════════════╝
echo.

REM Check if icon exists
if not exist "icon.ico" (
    echo ❌ No icon.ico file found in this folder!
    echo.
    echo 1. Create or download an icon.ico file
    echo 2. Place it in: %cd%
    echo 3. Run this script again
    echo.
    pause
    exit
)

echo ✅ Found icon.ico
echo Creating desktop shortcut with your icon...
echo.

REM Create the shortcut with PowerShell
powershell -Command "
    \$WshShell = New-Object -comObject WScript.Shell
    \$Shortcut = \$WshShell.CreateShortcut([Environment]::GetFolderPath('Desktop') + '\Laptop Registration.lnk')
    \$Shortcut.TargetPath = 'chrome.exe'
    \$Shortcut.Arguments = '--app=http://localhost:5173 --window-size=1300,800'
    \$Shortcut.WorkingDirectory = '%cd%'
    \$Shortcut.IconLocation = '%cd%\icon.ico,0'
    \$Shortcut.Description = 'Laptop Registration System'
    \$Shortcut.Save()
    Write-Host '✅ Shortcut created on Desktop!'
"

echo.
echo ╔══════════════════════════════════╗
echo ║        NEXT STEPS:               ║
echo ╚══════════════════════════════════╝
echo.
echo 1. Double-click the new shortcut on your Desktop
echo 2. Run your backend and React first
echo 3. Or use the launcher below
echo.
pause