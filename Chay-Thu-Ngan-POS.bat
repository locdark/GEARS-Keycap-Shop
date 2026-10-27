@echo off
chcp 65001 >nul
title GEARS Keycap Shop - Phan Mem Thu Ngan (Cashier POS)

set "JAVA_CMD=java"
if exist "C:\Program Files\Java\jdk-21\bin\java.exe" (
    set "JAVA_CMD=C:\Program Files\Java\jdk-21\bin\java.exe"
)

echo [*] Dang khoi chay Phan Mem Thu Ngan (Cashier POS)...
echo [*] Tai khoan: cashier / Cashier@123
if exist "GEARS-Keycap-Shop.jar" (
    "%JAVA_CMD%" -cp GEARS-Keycap-Shop.jar com.gears.Main cashier
) else (
    "%JAVA_CMD%" -cp bin com.gears.Main cashier
)
