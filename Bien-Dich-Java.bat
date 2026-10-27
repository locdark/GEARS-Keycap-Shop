@echo off
title Bien Dich Du An Java - GEARS Keycap Shop
echo ======================================================================
echo            BIEN DICH DU AN JAVA GEARS KEYCAP SHOP (PTTKHDT)
echo ======================================================================
echo.

set "JAVAC_CMD=javac"
set "JAR_CMD=jar"

if exist "C:\Program Files\Java\jdk-21\bin\javac.exe" (
    set "JAVAC_CMD=C:\Program Files\Java\jdk-21\bin\javac.exe"
    set "JAR_CMD=C:\Program Files\Java\jdk-21\bin\jar.exe"
)

if not exist "bin" mkdir bin

echo [*] Dang bien dich ma nguon Java tu thu muc src/...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$files = (Get-ChildItem -Path src -Filter *.java -Recurse).FullName; & '%JAVAC_CMD%' -encoding UTF-8 -d bin $files"

if %errorlevel% neq 0 (
    echo [!] Bien dich THAT BAI. Vui long kiem tra lai ma nguon.
    pause
    exit /b %errorlevel%
)

echo [*] Dong goi thanh tep GEARS-Keycap-Shop.jar...
"%JAR_CMD%" --create --file GEARS-Keycap-Shop.jar --main-class com.gears.Main -C bin .

echo.
echo ======================================================================
echo [OK] BIEN DICH VA DONG GOI THANH CONG 100%!
echo [*] Ban co the khoi chay bang cach nhap dup: Chay-Phan-Mem-Java.bat
echo ======================================================================
pause
