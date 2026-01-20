@echo off
title Create Desktop App with Custom Icon
cls

echo ╔══════════════════════════════════════╗
echo ║    CREATE DESKTOP APP WITH ICON     ║
echo ╚══════════════════════════════════════╝
echo.

REM Check for icon
if not exist "icon.ico" (
    echo ⚠️  No icon.ico found! Creating one...
    
    REM Download a sample laptop icon
    powershell -Command "Invoke-WebRequest -Uri 'https://cdn-icons-png.flaticon.com/512/428/428001.png' -OutFile 'laptop.png'"
    
    REM Convert to ICO (simple method)
    echo ^<html^>^<body^>^</body^>^</html^> > icon.html
    echo.
    echo Place your own icon.ico file in this folder for better quality.
    echo Using temporary icon for now...
)

echo Creating shortcut that forces custom icon...
echo.

REM Create shortcut with special method to force icon
powershell -Command "
    # Create shortcut
    \$WshShell = New-Object -comObject WScript.Shell
    \$Desktop = [Environment]::GetFolderPath('Desktop')
    \$Shortcut = \$WshShell.CreateShortcut(\$Desktop + '\Laptop Registration.lnk')
    
    # Create a launcher batch file
    \$LauncherContent = '@echo off
cd /d \"%~dp0\"
start \"\" \"C:\Program Files\Google\Chrome\Application\chrome.exe\" --app=http://localhost:5173 --window-size=1300,800 --name=\"LaptopRegistration\"
'
    
    # Save launcher
    \$LauncherContent | Out-File -FilePath 'launch-app.bat' -Encoding ASCII
    
    # Point shortcut to launcher
    \$Shortcut.TargetPath = '%~dp0launch-app.bat'
    \$Shortcut.WorkingDirectory = '%~dp0'
    
    # Set custom icon
    if (Test-Path 'icon.ico') {
        \$Shortcut.IconLocation = '%~dp0icon.ico'
    } elseif (Test-Path 'laptop.png') {
        \$Shortcut.IconLocation = '%~dp0laptop.png'
    }
    
    \$Shortcut.Description = 'Laptop Registration System - Desktop App'
    \$Shortcut.Save()
    
    # Force Windows to use shortcut icon
    \$bytes = [System.IO.File]::ReadAllBytes(\$Shortcut.FullName)
    \$bytes[0x15] = \$bytes[0x15] -bor 0x20
    [System.IO.File]::WriteAllBytes(\$Shortcut.FullName, \$bytes)
    
    Write-Host '✅ Shortcut created: ' \$Shortcut.FullName
"

echo.
echo ╔══════════════════════════════════╗
echo ║        IMPORTANT:                ║
echo ╚══════════════════════════════════╝
echo.
echo 1. Shortcut created on Desktop
echo 2. FIRST run StartAll.bat (below) to start services
echo 3. THEN double-click the shortcut
echo.
pause