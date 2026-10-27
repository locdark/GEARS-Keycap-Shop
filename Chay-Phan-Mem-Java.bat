@echo off
chcp 65001 >nul
title GEARS Keycap Shop - Phan Mem Quan Ly Ban Le Java Desktop
echo ======================================================================
echo           GEARS KEYCAP SHOP - PHAN MEM QUAN LY BAN LE VA POS (JAVA)
echo      Do An Mon Hoc: Phan Tich Thiet Ke Huong Doi Tuong (PTTKHDT)
echo             Truong Dai Hoc Sai Gon (SGU) - Khoa CNTT
echo ======================================================================
echo.

set "JAVA_CMD=java"
if exist "C:\Program Files\Java\jdk-21\bin\java.exe" (
    set "JAVA_CMD=C:\Program Files\Java\jdk-21\bin\java.exe"
)

echo [*] Dang khoi chay Phan Mem Quan Ly Ban Le Java Swing...
echo [*] Tai khoan Quan tri: admin / Admin@123
echo [*] Tai khoan Thu ngan: cashier / Cashier@123
echo ======================================================================

if exist "GEARS-Keycap-Shop.jar" (
    "%JAVA_CMD%" -jar GEARS-Keycap-Shop.jar
) else (
    "%JAVA_CMD%" -cp bin com.gears.Main
)

pause
