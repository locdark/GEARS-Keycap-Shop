package com.gears.ui;

import com.gears.model.NhanVien;
import com.gears.patterns.facade.GearsShopFacade;
import com.gears.ui.components.ModernButton;
import com.gears.ui.components.ModernTextField;
import com.gears.ui.theme.UITheme;

import java.awt.*;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import javax.swing.*;
import javax.swing.border.EmptyBorder;

/**
 * LoginFrame (Boundary): Cổng Đăng Nhập & Xác Thực Hệ Thống.
 * Phân hệ Module 1 trong sơ đồ BFD & Class Diagram.
 * - Kiểm tra mật khẩu chuẩn an toàn (>=8 ký tự, chữ hoa, ký tự đặc biệt)
 * - Nút đăng nhập nhanh tài khoản mẫu Admin và Cashier
 * - Giao diện Obsidian Dark ERP chuyên nghiệp
 */
public class LoginFrame extends JFrame {
    private final GearsShopFacade facade = GearsShopFacade.getInstance();

    private ModernTextField txtUsername;
    private JPasswordField txtPassword;
    private JCheckBox chkShowPassword;
    private JLabel lblError;

    public LoginFrame() {
        setTitle("ĐĂNG NHẬP - GEARS KEYCAP SHOP (PTTKHDT SGU)");
        setSize(460, 560);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);
        getContentPane().setBackground(UITheme.BG_MAIN);
        setLayout(new BorderLayout());

        initUI();
    }

    private void initUI() {
        JPanel pnlMain = new JPanel();
        pnlMain.setLayout(new BoxLayout(pnlMain, BoxLayout.Y_AXIS));
        pnlMain.setBackground(UITheme.BG_MAIN);
        pnlMain.setBorder(new EmptyBorder(30, 40, 30, 40));

        // Logo & Brand Header
        JLabel lblBrand = new JLabel("GEARS KEYCAP SHOP");
        lblBrand.setFont(new Font("Segoe UI", Font.BOLD, 22));
        lblBrand.setForeground(UITheme.PRIMARY_RED);
        lblBrand.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel lblSub = new JLabel("HỆ THỐNG BÁN LẺ & QUẢN TRỊ POS");
        lblSub.setFont(new Font("Segoe UI", Font.BOLD, 12));
        lblSub.setForeground(UITheme.TEXT_SECONDARY);
        lblSub.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel lblSchool = new JLabel("Đồ án môn học: PTTKHDT - ĐH Sài Gòn (SGU)");
        lblSchool.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        lblSchool.setForeground(UITheme.TEXT_MUTED);
        lblSchool.setAlignmentX(Component.CENTER_ALIGNMENT);

        pnlMain.add(lblBrand);
        pnlMain.add(Box.createVerticalStrut(4));
        pnlMain.add(lblSub);
        pnlMain.add(Box.createVerticalStrut(2));
        pnlMain.add(lblSchool);
        pnlMain.add(Box.createVerticalStrut(24));

        // Form Fields
        JLabel lblUserTitle = new JLabel("TÊN ĐĂNG NHẬP:");
        lblUserTitle.setFont(UITheme.FONT_BOLD);
        lblUserTitle.setForeground(UITheme.TEXT_SECONDARY);
        lblUserTitle.setAlignmentX(Component.LEFT_ALIGNMENT);

        txtUsername = new ModernTextField("Nhập admin hoặc cashier...");
        txtUsername.setMaximumSize(new Dimension(Integer.MAX_VALUE, 40));
        txtUsername.setAlignmentX(Component.LEFT_ALIGNMENT);

        JLabel lblPassTitle = new JLabel("MẬT KHẨU BẢO MẬT:");
        lblPassTitle.setFont(UITheme.FONT_BOLD);
        lblPassTitle.setForeground(UITheme.TEXT_SECONDARY);
        lblPassTitle.setAlignmentX(Component.LEFT_ALIGNMENT);

        txtPassword = new JPasswordField();
        txtPassword.setFont(UITheme.FONT_REGULAR);
        txtPassword.setBackground(UITheme.BG_INPUT);
        txtPassword.setForeground(UITheme.TEXT_PRIMARY);
        txtPassword.setCaretColor(Color.WHITE);
        txtPassword.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(UITheme.BORDER_COLOR, 1, true),
            new EmptyBorder(8, 12, 8, 12)
        ));
        txtPassword.setMaximumSize(new Dimension(Integer.MAX_VALUE, 40));
        txtPassword.setAlignmentX(Component.LEFT_ALIGNMENT);

        chkShowPassword = new JCheckBox("Hiển thị mật khẩu");
        chkShowPassword.setOpaque(false);
        chkShowPassword.setFont(UITheme.FONT_SMALL);
        chkShowPassword.setForeground(UITheme.TEXT_SECONDARY);
        chkShowPassword.setAlignmentX(Component.LEFT_ALIGNMENT);
        chkShowPassword.addActionListener(e -> {
            txtPassword.setEchoChar(chkShowPassword.isSelected() ? (char) 0 : '•');
        });

        lblError = new JLabel(" ");
        lblError.setFont(UITheme.FONT_SMALL);
        lblError.setForeground(UITheme.STATUS_DANGER);
        lblError.setAlignmentX(Component.LEFT_ALIGNMENT);

        // Enter key to login
        KeyAdapter enterListener = new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                if (e.getKeyCode() == KeyEvent.VK_ENTER) performLogin();
            }
        };
        txtUsername.addKeyListener(enterListener);
        txtPassword.addKeyListener(enterListener);

        pnlMain.add(lblUserTitle);
        pnlMain.add(Box.createVerticalStrut(6));
        pnlMain.add(txtUsername);
        pnlMain.add(Box.createVerticalStrut(14));
        pnlMain.add(lblPassTitle);
        pnlMain.add(Box.createVerticalStrut(6));
        pnlMain.add(txtPassword);
        pnlMain.add(Box.createVerticalStrut(6));
        pnlMain.add(chkShowPassword);
        pnlMain.add(Box.createVerticalStrut(4));
        pnlMain.add(lblError);
        pnlMain.add(Box.createVerticalStrut(14));

        // Submit Button
        ModernButton btnLogin = new ModernButton("ĐĂNG NHẬP HỆ THỐNG", UITheme.PRIMARY_RED, UITheme.PRIMARY_RED_HOVER, Color.WHITE);
        btnLogin.setMaximumSize(new Dimension(Integer.MAX_VALUE, 44));
        btnLogin.setAlignmentX(Component.LEFT_ALIGNMENT);
        btnLogin.addActionListener(e -> performLogin());
        pnlMain.add(btnLogin);
        pnlMain.add(Box.createVerticalStrut(18));

        // Quick login demo buttons
        JLabel lblQuick = new JLabel("CHỌN NHANH TÀI KHOẢN MẪU:");
        lblQuick.setFont(new Font("Segoe UI", Font.BOLD, 10));
        lblQuick.setForeground(UITheme.TEXT_MUTED);
        lblQuick.setAlignmentX(Component.CENTER_ALIGNMENT);
        pnlMain.add(lblQuick);
        pnlMain.add(Box.createVerticalStrut(8));

        JPanel pnlQuickBtns = new JPanel(new GridLayout(1, 2, 8, 0));
        pnlQuickBtns.setOpaque(false);
        pnlQuickBtns.setMaximumSize(new Dimension(Integer.MAX_VALUE, 34));

        ModernButton btnQuickAdmin = new ModernButton("Quản Trị (Admin)", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_PRIMARY);
        btnQuickAdmin.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        btnQuickAdmin.addActionListener(e -> {
            txtUsername.setText("admin");
            txtPassword.setText("Admin@123");
            lblError.setText(" ");
        });

        ModernButton btnQuickCashier = new ModernButton("Thu Ngân (Cashier)", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_PRIMARY);
        btnQuickCashier.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        btnQuickCashier.addActionListener(e -> {
            txtUsername.setText("cashier");
            txtPassword.setText("Cashier@123");
            lblError.setText(" ");
        });

        pnlQuickBtns.add(btnQuickAdmin);
        pnlQuickBtns.add(btnQuickCashier);
        pnlMain.add(pnlQuickBtns);

        add(pnlMain, BorderLayout.CENTER);
    }

    private void performLogin() {
        String username = txtUsername.getText().trim();
        String password = new String(txtPassword.getPassword()).trim();

        StringBuilder errorMsg = new StringBuilder();
        NhanVien user = facade.login(username, password, errorMsg);

        if (user != null) {
            lblError.setText(" ");
            // Open MainFrame
            SwingUtilities.invokeLater(() -> {
                MainFrame mainFrame = new MainFrame();
                mainFrame.setVisible(true);
                dispose();
            });
        } else {
            lblError.setText(errorMsg.toString());
        }
    }
}
