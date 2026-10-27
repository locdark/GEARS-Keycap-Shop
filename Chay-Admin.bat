@echo off
chcp 65001 >nul
title GEARS Keycap Shop - Phan Mem Quan Tri Vien (Admin)

set "JAVA_CMD=java"
if exist "C:\Program Files\Java\jdk-21\bin\java.exe" (
    set "JAVA_CMD=C:\Program Files\Java\jdk-21\bin\java.exe"
)

echo [*] Dang khoi chay Phan Mem Quan Tri Vien (Admin)...
echo [*] Tai khoan: admin / Admin@123
if exist "GEARS-Keycap-Shop.jar" (
    "%JAVA_CMD%" -cp GEARS-Keycap-Shop.jar com.gears.Main admin
) else (
    "%JAVA_CMD%" -cp bin com.gears.Main admin
)
