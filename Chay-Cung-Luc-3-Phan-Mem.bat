@echo off
chcp 65001 >nul
title GEARS Keycap Shop - Khoi Dong Cung Luc 3 Phan Mem (Admin, Thu Ngan, Khach Hang)

echo ======================================================================
echo           GEARS KEYCAP SHOP - KHOI DONG DONG THOI 3 PHAN MEM
echo      Do An Mon Hoc: Phan Tich Thiet Ke Huong Doi Tuong (PTTKHDT)
echo             Truong Dai Hoc Sai Gon (SGU) - Khoa CNTT
echo ======================================================================
echo.
echo [*] Dang khoi dong:
echo     [1] Cua so Trai:       QUAN TRI VIEN (ADMIN) - Full 10 Phan He va CSDL
echo     [2] Cua so Phai-Tren:  THU NGAN (CASHIER POS) - Ban Hang va In Hoa Don
echo     [3] Cua so Phai-Duoi:  CONG KHACH HANG - Dat Hang Online va Tich Xu
echo.

set "JAVA_CMD=java"
if exist "C:\Program Files\Java\jdk-21\bin\java.exe" (
    set "JAVA_CMD=C:\Program Files\Java\jdk-21\bin\java.exe"
)

if exist "GEARS-Keycap-Shop.jar" (
    "%JAVA_CMD%" -cp GEARS-Keycap-Shop.jar com.gears.Main all
) else (
    "%JAVA_CMD%" -cp bin com.gears.Main all
)
