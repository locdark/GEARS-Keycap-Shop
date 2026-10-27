@echo off
chcp 65001 >nul
title GEARS Keycap Shop - Full 48 Test Cases Runner
echo ======================================================================
echo           GEARS KEYCAP SHOP - BO KIEM THU TU DONG 48 TEST CASES
echo      Do An Mon Hoc: Phan Tich Thiet Ke Huong Doi Tuong (PTTKHDT)
echo             Truong Dai Hoc Sai Gon (SGU) - Khoa CNTT
echo ======================================================================
echo.

set "JAVA_CMD=java"
if exist "C:\Program Files\Java\jdk-21\bin\java.exe" (
    set "JAVA_CMD=C:\Program Files\Java\jdk-21\bin\java.exe"
)

echo [*] Dang khoi chay toan bo 48 Test Cases tu com.gears.test.GearsFullTestSuite...
echo ======================================================================

"%JAVA_CMD%" -cp "GEARS-Keycap-Shop.jar;bin" com.gears.test.GearsFullTestSuite

echo.
echo ======================================================================
echo Hoan tat kiem thu. Nhan phim bat ky de thoat.
pause
