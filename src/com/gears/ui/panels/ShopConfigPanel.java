package com.gears.ui.panels;

import com.gears.model.ShopConfig;
import com.gears.patterns.facade.GearsShopFacade;
import com.gears.ui.components.ModernButton;
import com.gears.ui.components.ModernTextField;
import com.gears.ui.theme.UITheme;

import java.awt.*;
import javax.swing.*;
import javax.swing.border.EmptyBorder;

/**
 * ShopConfigPanel (Boundary): Quan ly Thong tin thuong hieu, Hotline, Dia chi va Tai khoan VietQR Napas.
 * Theo Module 8 trong so do BFD & Class Diagram.
 */
public class ShopConfigPanel extends JPanel {
    private final GearsShopFacade facade = GearsShopFacade.getInstance();

    private ModernTextField txtShopName;
    private ModernTextField txtSlogan;
    private ModernTextField txtHotline;
    private ModernTextField txtAddress;
    private ModernTextField txtEmail;
    private ModernTextField txtBankName;
    private ModernTextField txtBankAccount;
    private ModernTextField txtBankOwner;
    private ModernTextField txtBanner;

    public ShopConfigPanel() {
        setLayout(new BorderLayout(14, 14));
        setBackground(UITheme.BG_MAIN);
        setBorder(new EmptyBorder(16, 20, 16, 20));

        initHeader();
        initForm();
        loadData();
    }

    private void initHeader() {
        JPanel pnlHeader = new JPanel(new BorderLayout());
        pnlHeader.setOpaque(false);

        JLabel lblTitle = new JLabel("CẤU HÌNH THƯƠNG HIỆU & TÀI KHOẢN THANH TOÁN VIETQR");
        lblTitle.setFont(UITheme.FONT_TITLE);
        lblTitle.setForeground(UITheme.TEXT_PRIMARY);

        JLabel lblSub = new JLabel("Quản lý thông tin hiển thị trên hóa đơn và tài khoản nhận tiền SePay VietQR");
        lblSub.setFont(UITheme.FONT_REGULAR);
        lblSub.setForeground(UITheme.TEXT_SECONDARY);

        JPanel pnlTitles = new JPanel();
        pnlTitles.setOpaque(false);
        pnlTitles.setLayout(new BoxLayout(pnlTitles, BoxLayout.Y_AXIS));
        pnlTitles.add(lblTitle);
        pnlTitles.add(Box.createVerticalStrut(4));
        pnlTitles.add(lblSub);

        pnlHeader.add(pnlTitles, BorderLayout.WEST);
        add(pnlHeader, BorderLayout.NORTH);
    }

    private void initForm() {
        JPanel pnlCard = new JPanel(new GridLayout(9, 2, 12, 12));
        pnlCard.setBackground(UITheme.BG_CARD);
        pnlCard.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(UITheme.BORDER_COLOR, 1, true),
            new EmptyBorder(20, 24, 20, 24)
        ));

        txtShopName = new ModernTextField();
        txtSlogan = new ModernTextField();
        txtHotline = new ModernTextField();
        txtAddress = new ModernTextField();
        txtEmail = new ModernTextField();
        txtBankName = new ModernTextField();
        txtBankAccount = new ModernTextField();
        txtBankOwner = new ModernTextField();
        txtBanner = new ModernTextField();

        pnlCard.add(createLabel("Tên Cửa Hàng / Thương Hiệu:"));
        pnlCard.add(txtShopName);

        pnlCard.add(createLabel("Khẩu Hiệu (Slogan):"));
        pnlCard.add(txtSlogan);

        pnlCard.add(createLabel("Hotline Chăm Sóc Khách Hàng:"));
        pnlCard.add(txtHotline);

        pnlCard.add(createLabel("Địa Chỉ Showroom Chính:"));
        pnlCard.add(txtAddress);

        pnlCard.add(createLabel("Email Liên Hệ:"));
        pnlCard.add(txtEmail);

        pnlCard.add(createLabel("Tên Ngân Hàng Nhận Tiền:"));
        pnlCard.add(txtBankName);

        pnlCard.add(createLabel("Số Tài Khoản (STK) VietQR:"));
        pnlCard.add(txtBankAccount);

        pnlCard.add(createLabel("Chủ Tài Khoản (Không Dấu):"));
        pnlCard.add(txtBankOwner);

        pnlCard.add(createLabel("Thông Báo Khuyến Mãi Top Banner:"));
        pnlCard.add(txtBanner);

        JPanel pnlCenterWrapper = new JPanel(new BorderLayout());
        pnlCenterWrapper.setOpaque(false);
        pnlCenterWrapper.add(pnlCard, BorderLayout.NORTH);

        add(pnlCenterWrapper, BorderLayout.CENTER);

        // Bottom Actions
        JPanel pnlBottom = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        pnlBottom.setOpaque(false);

        ModernButton btnSave = new ModernButton("LƯU CẤU HÌNH CỬA HÀNG", UITheme.PRIMARY_RED, UITheme.PRIMARY_RED_HOVER, Color.WHITE);
        btnSave.setPreferredSize(new Dimension(220, 40));
        btnSave.addActionListener(e -> saveConfig());

        ModernButton btnReset = new ModernButton("Khôi Phục Mặc Định", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_SECONDARY);
        btnReset.setPreferredSize(new Dimension(160, 40));
        btnReset.addActionListener(e -> resetDefault());

        pnlBottom.add(btnReset);
        pnlBottom.add(btnSave);
        add(pnlBottom, BorderLayout.SOUTH);
    }

    private JLabel createLabel(String text) {
        JLabel lbl = new JLabel(text);
        lbl.setFont(UITheme.FONT_BOLD);
        lbl.setForeground(UITheme.TEXT_PRIMARY);
        return lbl;
    }

    private void loadData() {
        ShopConfig cfg = facade.getShopConfig();
        if (cfg != null) {
            txtShopName.setText(cfg.getTenCuaHang());
            txtSlogan.setText(cfg.getSlogan());
            txtHotline.setText(cfg.getHotline());
            txtAddress.setText(cfg.getDiaChi());
            txtEmail.setText(cfg.getEmail());
            txtBankName.setText(cfg.getTenNganHang());
            txtBankAccount.setText(cfg.getSoTaiKhoan());
            txtBankOwner.setText(cfg.getTenChuTaiKhoan());
            txtBanner.setText(cfg.getThongBaoBanner());
        }
    }

    private void saveConfig() {
        ShopConfig cfg = facade.getShopConfig();
        cfg.setTenCuaHang(txtShopName.getText().trim());
        cfg.setSlogan(txtSlogan.getText().trim());
        cfg.setHotline(txtHotline.getText().trim());
        cfg.setDiaChi(txtAddress.getText().trim());
        cfg.setEmail(txtEmail.getText().trim());
        cfg.setTenNganHang(txtBankName.getText().trim());
        cfg.setSoTaiKhoan(txtBankAccount.getText().trim());
        cfg.setTenChuTaiKhoan(txtBankOwner.getText().trim());
        cfg.setThongBaoBanner(txtBanner.getText().trim());

        facade.updateShopConfig(cfg);
        JOptionPane.showMessageDialog(this, "Đã lưu cấu hình cửa hàng thành công!", "Thông Báo", JOptionPane.INFORMATION_MESSAGE);
    }

    private void resetDefault() {
        int confirm = JOptionPane.showConfirmDialog(this, "Bạn có muốn khôi phục lại cấu hình mặc định?", "Xác Nhận", JOptionPane.YES_NO_OPTION);
        if (confirm == JOptionPane.YES_OPTION) {
            facade.updateShopConfig(new ShopConfig());
            loadData();
            JOptionPane.showMessageDialog(this, "Đã khôi phục cài đặt mặc định!", "Thông Báo", JOptionPane.INFORMATION_MESSAGE);
        }
    }
}
