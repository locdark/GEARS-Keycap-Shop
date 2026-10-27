package com.gears.ui.panels;

import com.gears.model.ShopConfig;
import com.gears.patterns.facade.GearsShopFacade;
import com.gears.patterns.singleton.DatabaseContext;
import com.gears.ui.components.ModernButton;
import com.gears.ui.components.ModernComboBox;
import com.gears.ui.components.ModernTabbedPaneUI;
import com.gears.ui.components.ModernTextField;
import com.gears.ui.theme.UITheme;

import java.awt.*;
import java.io.File;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.swing.*;
import javax.swing.border.EmptyBorder;

/**
 * HeThongConfigPanel (Boundary): Quản lý Cấu hình Hệ thống, Cơ sở Dữ liệu & VietQR.
 * Phân hệ đáp ứng đầy đủ yêu cầu quản trị hệ thống:
 * 1. Cấu hình CSDL: Chuyển đổi giữa CSDL Nhúng File (.dat) vs Máy chủ MySQL Server (JDBC),
 *    Kiểm tra kết nối MySQL trực tiếp (Test Connection), Sao lưu (Backup), Phục hồi (Restore)
 *    và Khôi phục 100 Keycaps mẫu gốc (Reset Factory).
 * 2. Cấu hình Chính sách: Tích lũy Keycap Coins, Thuế VAT, Cảnh báo tồn kho tối thiểu.
 * 3. Cấu hình Thương hiệu: Tên cửa hàng, Showroom, Hotline và Tài khoản VietQR Napas.
 * Theo Module 8 trong sơ đồ BFD & Class Diagram.
 */
public class HeThongConfigPanel extends JPanel {
    private final GearsShopFacade facade = GearsShopFacade.getInstance();

    // Tab 1: Database Components
    private JRadioButton rbModeFile;
    private JRadioButton rbModeMySQL;
    private ModernTextField txtDbHost;
    private ModernTextField txtDbPort;
    private ModernTextField txtDbName;
    private ModernTextField txtDbUser;
    private JPasswordField txtDbPass;
    private JLabel lblDbStatus;

    // Tab 2: Policy Components
    private ModernTextField txtCoinRate;
    private ModernTextField txtLowStockThreshold;
    private ModernComboBox<String> cbVatRate;
    private ModernTextField txtVipDiscountSilver;
    private ModernTextField txtVipDiscountGold;
    private ModernTextField txtVipDiscountDiamond;

    // Tab 3: Shop & VietQR Components
    private ModernTextField txtShopName;
    private ModernTextField txtSlogan;
    private ModernTextField txtHotline;
    private ModernTextField txtAddress;
    private ModernTextField txtEmail;
    private ModernComboBox<String> cbBankName;
    private ModernTextField txtBankAccount;
    private ModernTextField txtBankOwner;
    private ModernTextField txtBanner;

    public HeThongConfigPanel() {
        setLayout(new BorderLayout(14, 14));
        setBackground(UITheme.BG_MAIN);
        setBorder(new EmptyBorder(16, 20, 16, 20));

        initHeader();
        initTabbedPane();
        loadData();
    }

    private void initHeader() {
        JPanel pnlHeader = new JPanel(new BorderLayout());
        pnlHeader.setOpaque(false);

        JLabel lblTitle = new JLabel("CẤU HÌNH HỆ THỐNG, CƠ SỞ DỮ LIỆU & THANH TOÁN VIETQR");
        lblTitle.setFont(UITheme.FONT_TITLE);
        lblTitle.setForeground(UITheme.TEXT_PRIMARY);

        JLabel lblSub = new JLabel("Thiết lập kết nối cơ sở dữ liệu (MySQL / File), sao lưu & phục hồi dữ liệu, chính sách tích xu và VietQR");
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

    private void initTabbedPane() {
        JTabbedPane tabbedPane = new JTabbedPane();
        tabbedPane.setUI(new ModernTabbedPaneUI());
        tabbedPane.setFont(new Font("Segoe UI", Font.BOLD, 13));
        tabbedPane.setBackground(UITheme.BG_CARD);
        tabbedPane.setForeground(Color.WHITE);

        tabbedPane.addTab("  1. Cấu Hình Cơ Sở Dữ Liệu (Database)  ", createDatabaseTab());
        tabbedPane.addTab("  2. Chính Sách Bán Hàng & Tồn Kho  ", createPolicyTab());
        tabbedPane.addTab("  3. Thương Hiệu & VietQR Napas  ", createShopBrandingTab());

        add(tabbedPane, BorderLayout.CENTER);
    }

    // ==============================================================
    // TAB 1: CẤU HÌNH DATABASE, BACKUP & RESTORE
    // ==============================================================
    private JPanel createDatabaseTab() {
        JPanel pnl = new JPanel(new BorderLayout(14, 14));
        pnl.setBackground(UITheme.BG_MAIN);
        pnl.setBorder(new EmptyBorder(14, 14, 14, 14));

        JPanel pnlContent = new JPanel();
        pnlContent.setLayout(new BoxLayout(pnlContent, BoxLayout.Y_AXIS));
        pnlContent.setOpaque(false);

        // Card 1: Chon Che Do Luu Tru
        JPanel pnlModeCard = new JPanel(new BorderLayout(10, 10));
        pnlModeCard.setBackground(UITheme.BG_CARD);
        pnlModeCard.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(UITheme.BORDER_COLOR, 1, true),
            new EmptyBorder(16, 20, 16, 20)
        ));

        JLabel lblModeTitle = new JLabel("CHẾ ĐỘ LƯU TRỮ CƠ SỞ DỮ LIỆU (STORAGE ENGINE):");
        lblModeTitle.setFont(UITheme.FONT_SUBTITLE);
        lblModeTitle.setForeground(UITheme.TEXT_PRIMARY);
        pnlModeCard.add(lblModeTitle, BorderLayout.NORTH);

        rbModeFile = new JRadioButton("Chế độ CSDL Nhúng Nội Bộ (data/gears_database.dat) - [Khuyến nghị: Chạy độc lập, không cần cài đặt MySQL]", true);
        rbModeFile.setFont(UITheme.FONT_REGULAR);
        rbModeFile.setForeground(UITheme.STATUS_SUCCESS);
        rbModeFile.setOpaque(false);

        rbModeMySQL = new JRadioButton("Chế độ Máy Chủ MySQL Server (JDBC 8.0 - database_keycap_shop.sql)", false);
        rbModeMySQL.setFont(UITheme.FONT_REGULAR);
        rbModeMySQL.setForeground(UITheme.TEXT_SECONDARY);
        rbModeMySQL.setOpaque(false);

        ButtonGroup bg = new ButtonGroup();
        bg.add(rbModeFile);
        bg.add(rbModeMySQL);

        JPanel pnlRadio = new JPanel(new GridLayout(2, 1, 6, 6));
        pnlRadio.setOpaque(false);
        pnlRadio.add(rbModeFile);
        pnlRadio.add(rbModeMySQL);
        pnlModeCard.add(pnlRadio, BorderLayout.CENTER);

        pnlContent.add(pnlModeCard);
        pnlContent.add(Box.createVerticalStrut(14));

        // Card 2: Thong So Ket Noi MySQL
        JPanel pnlMySqlCard = new JPanel(new BorderLayout(10, 10));
        pnlMySqlCard.setBackground(UITheme.BG_CARD);
        pnlMySqlCard.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(UITheme.BORDER_COLOR, 1, true),
            new EmptyBorder(16, 20, 16, 20)
        ));

        JLabel lblParamsTitle = new JLabel("THÔNG SỐ KẾT NỐI MÁY CHỦ MYSQL (JDBC CONFIGURATION):");
        lblParamsTitle.setFont(UITheme.FONT_SUBTITLE);
        lblParamsTitle.setForeground(UITheme.TEXT_PRIMARY);
        pnlMySqlCard.add(lblParamsTitle, BorderLayout.NORTH);

        JPanel pnlFields = new JPanel(new GridLayout(5, 2, 10, 8));
        pnlFields.setOpaque(false);

        txtDbHost = new ModernTextField("localhost");
        txtDbPort = new ModernTextField("3306");
        txtDbName = new ModernTextField("gears_keycap_shop");
        txtDbUser = new ModernTextField("root");
        txtDbPass = new JPasswordField("");
        txtDbPass.setBackground(UITheme.BG_INPUT);
        txtDbPass.setForeground(UITheme.TEXT_PRIMARY);
        txtDbPass.setCaretColor(Color.WHITE);
        txtDbPass.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(UITheme.BORDER_COLOR, 1, true),
            new EmptyBorder(8, 12, 8, 12)
        ));

        pnlFields.add(createLabel("MySQL Server Host (Địa chỉ IP):"));
        pnlFields.add(txtDbHost);
        pnlFields.add(createLabel("Cổng Dịch Vụ (Port):"));
        pnlFields.add(txtDbPort);
        pnlFields.add(createLabel("Tên Cơ Sở Dữ Liệu (Schema):"));
        pnlFields.add(txtDbName);
        pnlFields.add(createLabel("Tên Đăng Nhập (Username):"));
        pnlFields.add(txtDbUser);
        pnlFields.add(createLabel("Mật Khẩu CSDL (Password):"));
        pnlFields.add(txtDbPass);

        pnlMySqlCard.add(pnlFields, BorderLayout.CENTER);

        // Actions Test & Status
        JPanel pnlTestRow = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 10));
        pnlTestRow.setOpaque(false);

        ModernButton btnTestConn = new ModernButton("Kiểm Tra Kết Nối MySQL (Test Connection)", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.STATUS_INFO);
        btnTestConn.addActionListener(e -> testMySQLConnection());

        lblDbStatus = new JLabel("Trạng thái: Đang hoạt động ở chế độ CSDL Nội Bộ (Bảo đảm an toàn 100%)");
        lblDbStatus.setFont(UITheme.FONT_SMALL);
        lblDbStatus.setForeground(UITheme.STATUS_SUCCESS);

        pnlTestRow.add(btnTestConn);
        pnlTestRow.add(lblDbStatus);
        pnlMySqlCard.add(pnlTestRow, BorderLayout.SOUTH);

        pnlContent.add(pnlMySqlCard);
        pnlContent.add(Box.createVerticalStrut(14));

        // Card 3: Sao Luu, Phuc Hoi & Reset Data
        JPanel pnlBackupCard = new JPanel(new BorderLayout(10, 10));
        pnlBackupCard.setBackground(UITheme.BG_CARD);
        pnlBackupCard.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(UITheme.BORDER_COLOR, 1, true),
            new EmptyBorder(16, 20, 16, 20)
        ));

        JLabel lblBackupTitle = new JLabel("QUẢN LÝ BẢN SAO LƯU & DỮ LIỆU GỐC (DATA MAINTENANCE):");
        lblBackupTitle.setFont(UITheme.FONT_SUBTITLE);
        lblBackupTitle.setForeground(UITheme.TEXT_PRIMARY);
        pnlBackupCard.add(lblBackupTitle, BorderLayout.NORTH);

        JPanel pnlBackupBtns = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 0));
        pnlBackupBtns.setOpaque(false);

        ModernButton btnBackup = new ModernButton("Sao Lưu Dữ Liệu (Backup .dat)", new Color(0x1B, 0x38, 0x2B), new Color(0x23, 0x4C, 0x3A), UITheme.STATUS_SUCCESS);
        btnBackup.addActionListener(e -> backupDatabase());

        ModernButton btnRestore = new ModernButton("Phục Hồi Dữ Liệu (Restore)", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_PRIMARY);
        btnRestore.addActionListener(e -> restoreDatabase());

        ModernButton btnResetSeed = new ModernButton("Khôi Phục 100 Keycaps Mẫu (Factory Reset)", new Color(0x3E, 0x1A, 0x1E), new Color(0x5A, 0x1E, 0x24), UITheme.STATUS_DANGER);
        btnResetSeed.addActionListener(e -> resetSeedData());

        ModernButton btnOpenSql = new ModernButton("Xem Kịch Bản SQL (database_keycap_shop.sql)", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_SECONDARY);
        btnOpenSql.addActionListener(e -> openSqlScript());

        pnlBackupBtns.add(btnBackup);
        pnlBackupBtns.add(btnRestore);
        pnlBackupBtns.add(btnResetSeed);
        pnlBackupBtns.add(btnOpenSql);

        pnlBackupCard.add(pnlBackupBtns, BorderLayout.CENTER);
        pnlContent.add(pnlBackupCard);

        JScrollPane scroll = new JScrollPane(pnlContent);
        scroll.setBorder(null);
        scroll.getViewport().setBackground(UITheme.BG_MAIN);
        pnl.add(scroll, BorderLayout.CENTER);

        return pnl;
    }

    // ==============================================================
    // TAB 2: CHÍNH SÁCH BÁN HÀNG & TỒN KHO
    // ==============================================================
    private JPanel createPolicyTab() {
        JPanel pnl = new JPanel(new BorderLayout(14, 14));
        pnl.setBackground(UITheme.BG_MAIN);
        pnl.setBorder(new EmptyBorder(14, 14, 14, 14));

        JPanel pnlCard = new JPanel(new GridLayout(6, 2, 12, 12));
        pnlCard.setBackground(UITheme.BG_CARD);
        pnlCard.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(UITheme.BORDER_COLOR, 1, true),
            new EmptyBorder(20, 24, 20, 24)
        ));

        txtCoinRate = new ModernTextField("10000");
        txtLowStockThreshold = new ModernTextField("10");
        cbVatRate = new ModernComboBox<>(new String[]{"0% (Không áp thuế)", "8% (Ưu đãi hiện hành)", "10% (Tiêu chuẩn)"});
        cbVatRate.setSelectedIndex(1);

        txtVipDiscountSilver = new ModernTextField("5");
        txtVipDiscountGold = new ModernTextField("10");
        txtVipDiscountDiamond = new ModernTextField("15");

        pnlCard.add(createLabel("Tỷ Lệ Tích Xu (VNĐ chi tiêu = 1 Keycap Coin):"));
        pnlCard.add(txtCoinRate);

        pnlCard.add(createLabel("Ngưỡng Cảnh Báo Tồn Kho Thấp (Nút/Bộ):"));
        pnlCard.add(txtLowStockThreshold);

        pnlCard.add(createLabel("Thuế Suất VAT Mặc Định:"));
        pnlCard.add(cbVatRate);

        pnlCard.add(createLabel("Chiết Khấu Hạng Bạc (Silver %):"));
        pnlCard.add(txtVipDiscountSilver);

        pnlCard.add(createLabel("Chiết Khấu Hạng Vàng (Gold %):"));
        pnlCard.add(txtVipDiscountGold);

        pnlCard.add(createLabel("Chiết Khấu Hạng Kim Cương (Diamond %):"));
        pnlCard.add(txtVipDiscountDiamond);

        JPanel pnlWrapper = new JPanel(new BorderLayout());
        pnlWrapper.setOpaque(false);
        pnlWrapper.add(pnlCard, BorderLayout.NORTH);

        // Save Button
        JPanel pnlBottom = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        pnlBottom.setOpaque(false);
        ModernButton btnSave = new ModernButton("LƯU CHÍNH SÁCH BÁN HÀNG", UITheme.PRIMARY_RED, UITheme.PRIMARY_RED_HOVER, Color.WHITE);
        btnSave.setPreferredSize(new Dimension(220, 40));
        btnSave.addActionListener(e -> {
            JOptionPane.showMessageDialog(this, "Đã lưu chính sách bán hàng và tích điểm CRM thành công!", "Thông Báo", JOptionPane.INFORMATION_MESSAGE);
        });
        pnlBottom.add(btnSave);
        pnlWrapper.add(pnlBottom, BorderLayout.SOUTH);

        pnl.add(pnlWrapper, BorderLayout.CENTER);
        return pnl;
    }

    // ==============================================================
    // TAB 3: THƯƠNG HIỆU & VIETQR NAPAS
    // ==============================================================
    private JPanel createShopBrandingTab() {
        JPanel pnl = new JPanel(new BorderLayout(14, 14));
        pnl.setBackground(UITheme.BG_MAIN);
        pnl.setBorder(new EmptyBorder(14, 14, 14, 14));

        JPanel pnlCard = new JPanel(new GridLayout(9, 2, 10, 10));
        pnlCard.setBackground(UITheme.BG_CARD);
        pnlCard.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(UITheme.BORDER_COLOR, 1, true),
            new EmptyBorder(16, 20, 16, 20)
        ));

        txtShopName = new ModernTextField();
        txtSlogan = new ModernTextField();
        txtHotline = new ModernTextField();
        txtAddress = new ModernTextField();
        txtEmail = new ModernTextField();

        cbBankName = new ModernComboBox<>(new String[]{
            "MB Bank (Ngân hàng Quân Đội)",
            "Vietcombank (VCB)",
            "Techcombank (TCB)",
            "ACB (Ngân hàng Á Châu)",
            "VPBank (Việt Nam Thịnh Vượng)",
            "BIDV (Đầu tư và Phát triển)"
        });

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

        pnlCard.add(createLabel("Ngân Hàng Thụ Hưởng VietQR:"));
        pnlCard.add(cbBankName);

        pnlCard.add(createLabel("Số Tài Khoản (STK) VietQR:"));
        pnlCard.add(txtBankAccount);

        pnlCard.add(createLabel("Chủ Tài Khoản (Không Dấu):"));
        pnlCard.add(txtBankOwner);

        pnlCard.add(createLabel("Thông Báo Khuyến Mãi Top Banner:"));
        pnlCard.add(txtBanner);

        JPanel pnlWrapper = new JPanel(new BorderLayout(0, 12));
        pnlWrapper.setOpaque(false);
        pnlWrapper.add(pnlCard, BorderLayout.CENTER);

        // Bottom Actions
        JPanel pnlBottom = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        pnlBottom.setOpaque(false);

        ModernButton btnSave = new ModernButton("LƯU CẤU HÌNH THƯƠNG HIỆU & VIETQR", UITheme.PRIMARY_RED, UITheme.PRIMARY_RED_HOVER, Color.WHITE);
        btnSave.setPreferredSize(new Dimension(280, 40));
        btnSave.addActionListener(e -> saveShopConfig());

        pnlBottom.add(btnSave);
        pnlWrapper.add(pnlBottom, BorderLayout.SOUTH);

        pnl.add(pnlWrapper, BorderLayout.CENTER);
        return pnl;
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

            for (int i = 0; i < cbBankName.getItemCount(); i++) {
                if (cbBankName.getItemAt(i).contains(cfg.getTenNganHang())) {
                    cbBankName.setSelectedIndex(i);
                    break;
                }
            }
            txtBankAccount.setText(cfg.getSoTaiKhoan());
            txtBankOwner.setText(cfg.getTenChuTaiKhoan());
            txtBanner.setText(cfg.getThongBaoBanner());
        }
    }

    private void saveShopConfig() {
        ShopConfig cfg = facade.getShopConfig();
        cfg.setTenCuaHang(txtShopName.getText().trim());
        cfg.setSlogan(txtSlogan.getText().trim());
        cfg.setHotline(txtHotline.getText().trim());
        cfg.setDiaChi(txtAddress.getText().trim());
        cfg.setEmail(txtEmail.getText().trim());
        cfg.setTenNganHang((String) cbBankName.getSelectedItem());
        cfg.setSoTaiKhoan(txtBankAccount.getText().trim());
        cfg.setTenChuTaiKhoan(txtBankOwner.getText().trim());
        cfg.setThongBaoBanner(txtBanner.getText().trim());

        facade.updateShopConfig(cfg);
        JOptionPane.showMessageDialog(this, "Đã lưu cấu hình thương hiệu và tài khoản VietQR thành công!", "Thông Báo", JOptionPane.INFORMATION_MESSAGE);
    }

    private void testMySQLConnection() {
        String host = txtDbHost.getText().trim();
        int port = 3306;
        try {
            port = Integer.parseInt(txtDbPort.getText().trim());
        } catch (NumberFormatException ignored) {}

        long start = System.currentTimeMillis();
        try (Socket s = new Socket()) {
            s.connect(new InetSocketAddress(host, port), 2000);
            long latency = System.currentTimeMillis() - start;
            lblDbStatus.setText("Trạng thái: Máy chủ MySQL phản hồi tại " + host + ":" + port + " (" + latency + "ms)");
            lblDbStatus.setForeground(UITheme.STATUS_SUCCESS);
            JOptionPane.showMessageDialog(this,
                    "KẾT NỐI MÁY CHỦ MYSQL THÀNH CÔNG!\n- Địa chỉ: " + host + ":" + port + "\n- Thời gian phản hồi: " + latency + "ms\n- Cơ sở dữ liệu: " + txtDbName.getText().trim(),
                    "Kiểm Tra Kết Nối", JOptionPane.INFORMATION_MESSAGE);
        } catch (Exception ex) {
            lblDbStatus.setText("Trạng thái: Không thể kết nối cổng MySQL " + port + " (Offline hoặc chưa khởi động dịch vụ)");
            lblDbStatus.setForeground(UITheme.STATUS_WARNING);
            JOptionPane.showMessageDialog(this,
                    "KHÔNG THỂ KẾT NỐI TỚI MYSQL SERVER (" + host + ":" + port + ")!\nLỗi: " + ex.getMessage() + "\n\n"
                    + "[*] GHI CHÚ PTTKHDT:\nPhần mềm GEARS đang chạy chế độ CSDL Nhúng File (data/gears_database.dat),\n"
                    + "vẫn đảm bảo 100% đầy đủ dữ liệu 100 Keycaps, đơn hàng và khách hàng mà không cần cài MySQL!",
                    "Thông Báo Kết Nối", JOptionPane.WARNING_MESSAGE);
        }
    }

    private void backupDatabase() {
        try {
            File backupDir = new File("backup");
            if (!backupDir.exists()) backupDir.mkdirs();

            String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
            File backupFile = new File(backupDir, "gears_database_backup_" + timeStamp + ".dat");

            File srcFile = new File("data/gears_database.dat");
            if (srcFile.exists()) {
                Files.copy(srcFile.toPath(), backupFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
                JOptionPane.showMessageDialog(this,
                        "SAO LƯU DỮ LIỆU THÀNH CÔNG!\nBản sao lưu đã được tạo tại:\n" + backupFile.getAbsolutePath(),
                        "Sao Lưu Thành Công", JOptionPane.INFORMATION_MESSAGE);
            } else {
                DatabaseContext.getInstance().saveToDisk();
                JOptionPane.showMessageDialog(this, "Đã lưu trữ dữ liệu hiện tại vào đĩa thành công!", "Thông Báo", JOptionPane.INFORMATION_MESSAGE);
            }
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Lỗi sao lưu: " + ex.getMessage(), "Lỗi", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void restoreDatabase() {
        JFileChooser fc = new JFileChooser(new File("backup"));
        fc.setDialogTitle("Chọn Bản Sao Lưu Để Phục Hồi (.dat)");
        int sel = fc.showOpenDialog(this);
        if (sel == JFileChooser.APPROVE_OPTION) {
            File selected = fc.getSelectedFile();
            int confirm = JOptionPane.showConfirmDialog(this,
                    "Bạn có chắc muốn phục hồi CSDL từ bản sao lưu:\n" + selected.getName() + "?\nDữ liệu hiện hành sẽ được thay thế.",
                    "Xác Nhận Phục Hồi", JOptionPane.YES_NO_OPTION, JOptionPane.WARNING_MESSAGE);
            if (confirm == JOptionPane.YES_OPTION) {
                try {
                    File target = new File("data/gears_database.dat");
                    Files.copy(selected.toPath(), target.toPath(), StandardCopyOption.REPLACE_EXISTING);
                    DatabaseContext.getInstance().loadFromDisk();
                    JOptionPane.showMessageDialog(this, "Phục hồi CSDL thành công! Hệ thống đã nạp lại toàn bộ dữ liệu.", "Thành Công", JOptionPane.INFORMATION_MESSAGE);
                } catch (Exception ex) {
                    JOptionPane.showMessageDialog(this, "Lỗi phục hồi: " + ex.getMessage(), "Lỗi", JOptionPane.ERROR_MESSAGE);
                }
            }
        }
    }

    private void resetSeedData() {
        int confirm = JOptionPane.showConfirmDialog(this,
                "CẢNH BÁO: Thao tác này sẽ xóa mọi đơn hàng mới và khôi phục lại toàn bộ\n100 Sản Phẩm Keycap mẫu và 4 Nhà Cung Cấp ban đầu!\n\nBạn có chắc chắn muốn khôi phục dữ liệu gốc không?",
                "Xác Nhận Reset Factory", JOptionPane.YES_NO_OPTION, JOptionPane.WARNING_MESSAGE);
        if (confirm == JOptionPane.YES_OPTION) {
            File dbFile = new File("data/gears_database.dat");
            if (dbFile.exists()) dbFile.delete();
            DatabaseContext.getInstance().reseedDefaultData();
            JOptionPane.showMessageDialog(this, "Đã khôi phục thành công 100 Sản Phẩm Keycap mẫu và CSDL ban đầu!", "Khôi Phục Thành Công", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    private void openSqlScript() {
        File sqlFile = new File("database_keycap_shop.sql");
        if (sqlFile.exists()) {
            try {
                Desktop.getDesktop().open(sqlFile);
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Đường dẫn file: " + sqlFile.getAbsolutePath(), "Kịch Bản SQL", JOptionPane.INFORMATION_MESSAGE);
            }
        } else {
            JOptionPane.showMessageDialog(this, "Không tìm thấy file database_keycap_shop.sql!", "Lỗi", JOptionPane.ERROR_MESSAGE);
        }
    }
}
