package com.gears;

import com.gears.ui.MultiAppLauncher;
import com.gears.ui.theme.UITheme;

import javax.swing.*;

/**
 * MAIN ENTRY POINT: GEARS Keycap Shop
 * Hệ Thống Quản Lý Cửa Hàng Bán Keycap & Bàn Phím Cơ
 * 
 * ĐỒ ÁN MÔN HỌC: PHÂN TÍCH THIẾT KẾ HƯỚNG ĐỐI TƯỢNG (PTTKHDT)
 * TRƯỜNG ĐẠI HỌC SÀI GÒN (SGU) - KHOA CÔNG NGHỆ THÔNG TIN - NHÓM 19
 * - Nguyễn Công Danh (3124410032)
 * - Trần Nhật Quang  (3124410293)
 * - Lê Hoài Lộc      (3122560041)
 * 
 * Tham số dòng lệnh (CLI Arguments):
 * - "all"     : Khởi động cùng lúc cả 3 phần mềm (Admin + Thu Ngân + Khách Hàng)
 * - "admin"   : Khởi động giao diện Quản Trị Viên (Admin)
 * - "cashier" : Khởi động giao diện Thu Ngân Bán Lẻ (Cashier POS)
 * - "customer": Khởi động giao diện Cổng Mua Sắm Khách Hàng (Customer Portal)
 * - (Không có): Mở Hộp thoại Khởi chạy GEARS Launcher
 */
public class Main {
    public static void main(String[] args) {
        // Text antialiasing for crisp high-DPI rendering
        System.setProperty("awt.useSystemAAFontSettings", "on");
        System.setProperty("swing.aatext", "true");

        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception ignored) {}

        UITheme.applyGlobalDarkTheme();

        String mode = (args.length > 0) ? args[0].toLowerCase().trim() : "";

        SwingUtilities.invokeLater(() -> {
            switch (mode) {
                case "all":
                case "3":
                    MultiAppLauncher.launchAll3Apps();
                    break;
                case "admin":
                case "1":
                    MultiAppLauncher.launchAdminOnly();
                    break;
                case "cashier":
                case "pos":
                case "2":
                    MultiAppLauncher.launchCashierOnly();
                    break;
                case "customer":
                case "khach":
                case "store":
                    MultiAppLauncher.launchCustomerOnly();
                    break;
                default:
                    MultiAppLauncher.showLauncherDialog();
                    break;
            }
        });
    }
}
