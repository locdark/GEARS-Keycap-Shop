@echo off
chcp 65001 >nul
title GEARS Keycap Shop - He Thong Quan Ly Cua Hang Keycap (PTTKHDT SGU)

echo ======================================================================
echo           GEARS KEYCAP SHOP - HE THONG BAN LE VA QUAN TRI
echo      Do An Mon Hoc: Phan Tich Thiet Ke Huong Doi Tuong (PTTKHDT)
echo             Truong Dai Hoc Sai Gon (SGU) - Khoa CNTT
echo ======================================================================
echo.
echo [1] KHOI DONG DONG THOI CA 3 PHAN MEM (Admin + Nhan Vien + Khach Hang)
echo [2] Khoi chay Phan Mem Quan Tri Vien (Admin - 10 Phan He va CSDL)
echo [3] Khoi chay Phan Mem Thu Ngan (Nhan Vien POS Ban Le)
echo [4] Khoi chay Cong Mua Sam Khach Hang (Customer Storefront)
echo [5] CHAY FULL 48 TEST CASES KIEM THU HE THONG PTTKHDT
echo [6] Bien Dich Lai Ma Nguon Java (Recompile src/ va tao JAR)
echo [7] Mo Ban Web Storefront (Tham khao cu)
echo.

set "opt=1"
set /p opt="Nhap lua chon cua ban [1, 2, 3, 4, 5, 6 hoac 7, mac dinh la 1]: "

if "%opt%"=="2" goto run_admin
if "%opt%"=="3" goto run_pos
if "%opt%"=="4" goto run_customer
if "%opt%"=="5" goto run_tests
if "%opt%"=="6" goto compile_java
if "%opt%"=="7" goto run_web
goto run_all

:run_all
echo.
echo [*] Dang khoi chay DONG THOI ca 3 phan mem: Admin, Thu Ngan, Khach Hang...
call Chay-Cung-Luc-3-Phan-Mem.bat
goto end

:run_admin
echo.
echo [*] Dang khoi chay Phan Mem Quan Tri Vien (Admin)...
call Chay-Admin.bat
goto end

:run_pos
echo.
echo [*] Dang khoi chay Phan Mem Thu Ngan (Cashier POS)...
call Chay-Thu-Ngan-POS.bat
goto end

:run_customer
echo.
echo [*] Dang khoi chay Cong Mua Sam Khach Hang (Customer Portal)...
call Chay-Khach-Hang.bat
goto end

:run_tests
echo.
echo [*] Dang chay toan bo 48 Test Cases kiem thu he thong...
call Chay-Kiem-Thu-TestCases.bat
goto end

:compile_java
echo.
call Bien-Dich-Java.bat
goto end

:run_web
echo.
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo [*] Phat hien Node.js tren may tinh.
    echo [*] Dang khoi dong Local Server tai http://localhost:3333/ ...
    start http://localhost:3333/
    node server.js
) else (
    echo [*] Mo truc tiep index.html tren trinh duyet...
    start index.html
)
goto end

:end
