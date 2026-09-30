@echo off
chcp 65001 >nul
title GEARS Keycap Shop - He Thong Quan Ly Cua Hang Keycap
echo ======================================================================
echo           GEARS KEYCAP SHOP - HE THONG BAN LE VA QUAN TRI
echo      Do An Mon Hoc: Phan Tich Thiet Ke Huong Doi Tuong (PTTKHDT)
echo ======================================================================
echo.

where node >nul 2>nul
if %errorlevel% equ 0 (
    echo [*] Phat hien Node.js da duoc cai dat tren may tinh.
    echo [*] Dang khoi dong Local Server tai http://localhost:3333/ ...
    echo.
    echo  - Trang chu Cua hang : http://localhost:3333/
    echo  - Trang Quan tri Admin: http://localhost:3333/assets/Admin/login.html
    echo  - Diem Ban Le POS    : http://localhost:3333/assets/Admin/pos.html
    echo.
    echo Nhan Ctrl+C de dung server khi muon thoat.
    echo ======================================================================
    start http://localhost:3333/
    node server.js
) else (
    echo [*] Khong tim thay Node.js tren he thong.
    echo [*] He thong se tu dong mo truc tiep bang trinh duyet mac dinh...
    echo.
    start index.html
    pause
)
