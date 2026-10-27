package com.gears.ui;

import com.gears.patterns.facade.GearsShopFacade;
import com.gears.ui.customer.CustomerFrame;
import com.gears.ui.theme.UITheme;

import java.awt.*;
import javax.swing.*;
import javax.swing.border.EmptyBorder;

/**
 * MultiAppLauncher: Bộ khởi chạy đồng thời 3 phân hệ độc lập:
 * 1. Admin Window: Quản trị viên toàn quyền (Dashboard, Kho 100 Keycaps, Duyệt đơn, Báo cáo, Cấu hình CSDL)
 * 2. Cashier Window: Điểm bán lẻ POS thu ngân (Thanh toán tại quầy, giỏ hàng, in hóa đơn)
 * 3. Customer Window: Cổng mua sắm khách hàng (Duyệt catalog, giỏ hàng, tích xu, đặt hàng trực tuyến)
 * 
 * Cả 3 cửa sổ chia sẻ cùng Singleton DatabaseContext và liên lạc Real-time qua Observer Pattern!
 */
public class MultiAppLauncher {

    public static void launchAll3Apps() {
        UITheme.applyGlobalDarkTheme();
        SwingUtilities.invokeLater(() -> {
            Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
            int screenW = screenSize.width;
            int screenH = screenSize.height - 50; // Trừ thanh Taskbar Windows

            int halfW = screenW / 2;
            int halfH = screenH / 2;

            // 1. CỬA SỔ QUẢN TRỊ VIÊN (ADMIN) - Nằm bên trái toàn màn hình
            GearsShopFacade.getInstance().login("admin", "Admin@123", new StringBuilder());
            MainFrame adminFrame = new MainFrame(false);
            adminFrame.setBounds(10, 10, halfW - 15, screenH);
            adminFrame.setVisible(true);

            // 2. CỬA SỔ THU NGÂN (CASHIER POS) - Nằm góc trên bên phải
            MainFrame cashierFrame = new MainFrame(true);
            cashierFrame.setBounds(halfW + 10, 10, halfW - 25, halfH - 10);
            cashierFrame.setVisible(true);

            // 3. CỬA SỔ KHÁCH HÀNG (CUSTOMER PORTAL) - Nằm góc dưới bên phải
            CustomerFrame customerFrame = new CustomerFrame();
            customerFrame.setBounds(halfW + 10, halfH + 10, halfW - 25, halfH - 10);
            customerFrame.setVisible(true);

            JOptionPane.showMessageDialog(adminFrame,
                    "ĐÃ KHỞI CHẠY THÀNH CÔNG ĐỒNG THỜI CẢ 3 PHẦN MỀM TRÊN MÀN HÌNH:\n\n"
                    + "1. Cửa sổ Trái: [QUẢN TRỊ VIÊN ADMIN] - Giám sát Dashboard, Kho 100 SP, Báo cáo & CSDL\n"
                    + "2. Cửa sổ Phải-Trên: [THU NGÂN CASHIER] - Bán hàng POS tại quầy & In hóa đơn\n"
                    + "3. Cửa sổ Phải-Dưới: [KHÁCH HÀNG STOREFRONT] - Đặt mua keycap Online & Tích lũy xu\n\n"
                    + "[*] TÍNH NĂNG ĐẶC BIỆT:\n"
                    + "Khi bạn đặt hàng ở Cửa sổ Khách Hàng hoặc Thu Ngân, dữ liệu sẽ NGAY LẬP TỨC\n"
                    + "nhảy lên Dashboard của Quản Trị Viên theo thời gian thực (Observer Pattern)!",
                    "Khởi Động 3 Phần Mềm Thành Công", JOptionPane.INFORMATION_MESSAGE);
        });
    }

    public static void launchAdminOnly() {
        UITheme.applyGlobalDarkTheme();
        SwingUtilities.invokeLater(() -> {
            GearsShopFacade.getInstance().login("admin", "Admin@123", new StringBuilder());
            MainFrame f = new MainFrame(false);
            f.setVisible(true);
        });
    }

    public static void launchCashierOnly() {
        UITheme.applyGlobalDarkTheme();
        SwingUtilities.invokeLater(() -> {
            GearsShopFacade.getInstance().login("cashier", "Cashier@123", new StringBuilder());
            MainFrame f = new MainFrame(true);
            f.setVisible(true);
        });
    }

    public static void launchCustomerOnly() {
        UITheme.applyGlobalDarkTheme();
        SwingUtilities.invokeLater(() -> {
            CustomerFrame f = new CustomerFrame();
            f.setVisible(true);
        });
    }

    public static void showLauncherDialog() {
        UITheme.applyGlobalDarkTheme();
        SwingUtilities.invokeLater(() -> {
            JDialog dlg = new JDialog((Frame) null, "GEARS Keycap Shop - Bộ Khởi Chạy Hệ Thống (Launcher)", true);
            dlg.setSize(620, 480);
            dlg.setLocationRelativeTo(null);
            dlg.getContentPane().setBackground(UITheme.BG_MAIN);
            dlg.setLayout(new BorderLayout(14, 14));

            // Header
            JPanel pnlHeader = new JPanel();
            pnlHeader.setLayout(new BoxLayout(pnlHeader, BoxLayout.Y_AXIS));
            pnlHeader.setOpaque(false);
            pnlHeader.setBorder(new EmptyBorder(20, 24, 10, 24));

            JLabel lblTitle = new JLabel("HỆ THỐNG QUẢN LÝ CỬA HÀNG KEYCAP & BÀN PHÍM CƠ");
            lblTitle.setFont(UITheme.FONT_TITLE);
            lblTitle.setForeground(UITheme.TEXT_PRIMARY);

            JLabel lblSub = new JLabel("Đồ án môn: Phân Tích Thiết Kế Hướng Đối Tượng (PTTKHDT) - ĐH Sài Gòn (SGU)");
            lblSub.setFont(UITheme.FONT_REGULAR);
            lblSub.setForeground(UITheme.TEXT_SECONDARY);

            pnlHeader.add(lblTitle);
            pnlHeader.add(Box.createVerticalStrut(4));
            pnlHeader.add(lblSub);
            dlg.add(pnlHeader, BorderLayout.NORTH);

            // Center Option Buttons
            JPanel pnlBtns = new JPanel(new GridLayout(4, 1, 10, 10));
            pnlBtns.setOpaque(false);
            pnlBtns.setBorder(new EmptyBorder(10, 24, 14, 24));

            JButton btnAll = createBigButton(
                "  1. [KHUYÊN DÙNG CHẤM ĐIỂM] KHỞI ĐỘNG CÙNG LÚC 3 CỬA SỔ (Admin + Thu Ngân + Khách Hàng)",
                UITheme.PRIMARY_RED, Color.WHITE
            );
            btnAll.addActionListener(e -> {
                dlg.dispose();
                launchAll3Apps();
            });

            JButton btnAdmin = createBigButton(
                "  2. Khởi Động Phần Mềm Quản Trị Viên (Admin - Full 10 Phân Hệ & CSDL)",
                UITheme.BG_CARD, UITheme.TEXT_PRIMARY
            );
            btnAdmin.addActionListener(e -> {
                dlg.dispose();
                launchAdminOnly();
            });

            JButton btnCashier = createBigButton(
                "  3. Khởi Động Điểm Bán Hàng Thu Ngân (Cashier POS & In Hóa Đơn)",
                UITheme.BG_CARD, UITheme.TEXT_PRIMARY
            );
            btnCashier.addActionListener(e -> {
                dlg.dispose();
                launchCashierOnly();
            });

            JButton btnCustomer = createBigButton(
                "  4. Khởi Động Cổng Mua Sắm Khách Hàng (Customer Storefront & Tích Xu)",
                UITheme.BG_CARD, UITheme.TEXT_PRIMARY
            );
            btnCustomer.addActionListener(e -> {
                dlg.dispose();
                launchCustomerOnly();
            });

            pnlBtns.add(btnAll);
            pnlBtns.add(btnAdmin);
            pnlBtns.add(btnCashier);
            pnlBtns.add(btnCustomer);
            dlg.add(pnlBtns, BorderLayout.CENTER);

            // Bottom Traditional Login
            JPanel pnlBottom = new JPanel(new FlowLayout(FlowLayout.RIGHT, 14, 12));
            pnlBottom.setOpaque(false);

            JButton btnLogin = new JButton("Màn Hình Đăng Nhập Form ->");
            btnLogin.setFont(UITheme.FONT_SMALL);
            btnLogin.setForeground(UITheme.TEXT_MUTED);
            btnLogin.setOpaque(false);
            btnLogin.setContentAreaFilled(false);
            btnLogin.setBorderPainted(false);
            btnLogin.setCursor(new Cursor(Cursor.HAND_CURSOR));
            btnLogin.addActionListener(e -> {
                dlg.dispose();
                new LoginFrame().setVisible(true);
            });
            pnlBottom.add(btnLogin);
            dlg.add(pnlBottom, BorderLayout.SOUTH);

            dlg.setVisible(true);
        });
    }

    private static JButton createBigButton(String text, Color bg, Color fg) {
        JButton btn = new JButton(text);
        btn.setFont(new Font("Segoe UI", Font.BOLD, 13));
        btn.setBackground(bg);
        btn.setForeground(fg);
        btn.setFocusPainted(false);
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        btn.setHorizontalAlignment(SwingConstants.LEFT);
        btn.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(UITheme.BORDER_COLOR, 1, true),
            new EmptyBorder(12, 16, 12, 16)
        ));
        return btn;
    }
}
