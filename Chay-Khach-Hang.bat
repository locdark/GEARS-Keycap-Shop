@echo off
chcp 65001 >nul
title GEARS Keycap Shop - Cong Mua Sam Khach Hang (Customer Portal)

set "JAVA_CMD=java"
if exist "C:\Program Files\Java\jdk-21\bin\java.exe" (
    set "JAVA_CMD=C:\Program Files\Java\jdk-21\bin\java.exe"
)

echo [*] Dang khoi chay Cong Mua Sam Khach Hang (Customer Portal)...
echo [*] Tai khoan mau: Nguyen Van Hai (KH02 - Hang Bac)
if exist "GEARS-Keycap-Shop.jar" (
    "%JAVA_CMD%" -cp GEARS-Keycap-Shop.jar com.gears.Main customer
) else (
    "%JAVA_CMD%" -cp bin com.gears.Main customer
)
