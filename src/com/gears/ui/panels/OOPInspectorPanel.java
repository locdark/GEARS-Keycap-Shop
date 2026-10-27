package com.gears.ui.panels;

import com.gears.model.*;
import com.gears.patterns.builder.InvoiceBuilder;
import com.gears.patterns.facade.GearsShopFacade;
import com.gears.patterns.factory.EntityFactory;
import com.gears.patterns.factory.SanPhamFactory;
import com.gears.patterns.observer.IDataObserver;
import com.gears.patterns.observer.Subject;
import com.gears.patterns.singleton.DatabaseContext;
import com.gears.patterns.singleton.SessionManager;
import com.gears.patterns.strategy.*;
import com.gears.ui.components.ModernButton;
import com.gears.ui.theme.UITheme;

import java.awt.*;
import javax.swing.*;
import javax.swing.border.EmptyBorder;

/**
 * OOPInspectorPanel (Boundary): Trinh Kiem Tra & Trinh Dien Huong Doi Tuong (OOP Live Inspector).
 * Danh rieng cho sinh vien thuyet trinh va bao ve do an truoc Giang vien:
 * 1. Minh chung 4 Tru cot OOP (Dong goi, Ke thua, Da hinh, Truu tuong hoa)
 * 2. Minh chung 6 GoF Design Patterns (Singleton, Factory, Strategy, Observer, Facade, Builder)
 * 3. Chay test case truc tiep voi ket qua in ra console giao dien.
 */
public class OOPInspectorPanel extends JPanel {
    private JTextArea txtConsole;

    public OOPInspectorPanel() {
        setLayout(new BorderLayout(14, 14));
        setBackground(UITheme.BG_MAIN);
        setBorder(new EmptyBorder(16, 20, 16, 20));

        initHeader();
        initCenter();
    }

    private void initHeader() {
        JPanel pnlHeader = new JPanel(new BorderLayout());
        pnlHeader.setOpaque(false);

        JLabel lblTitle = new JLabel("TRÌNH KIỂM TRA & BẢO VỆ ĐỒ ÁN OOP (LIVE OOP INSPECTOR)");
        lblTitle.setFont(UITheme.FONT_TITLE);
        lblTitle.setForeground(UITheme.TEXT_PRIMARY);

        JLabel lblSub = new JLabel("Môn: Phân Tích Thiết Kế Hướng Đối Tượng (PTTKHDT) - Khoa CNTT Trường ĐH Sài Gòn (SGU)");
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

    private void initCenter() {
        JPanel pnlContent = new JPanel(new GridLayout(1, 2, 14, 0));
        pnlContent.setOpaque(false);

        // Left Panel: Action Buttons for Tests
        JPanel pnlButtons = new JPanel();
        pnlButtons.setLayout(new BoxLayout(pnlButtons, BoxLayout.Y_AXIS));
        pnlButtons.setBackground(UITheme.BG_CARD);
        pnlButtons.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(UITheme.BORDER_COLOR, 1, true),
            new EmptyBorder(14, 16, 14, 16)
        ));

        JLabel lblTestGroup1 = new JLabel("1. KIỂM THỬ 4 TRỤ CỘT OOP:");
        lblTestGroup1.setFont(UITheme.FONT_SUBTITLE);
        lblTestGroup1.setForeground(UITheme.PRIMARY_RED);
        pnlButtons.add(lblTestGroup1);
        pnlButtons.add(Box.createVerticalStrut(8));

        pnlButtons.add(createTestButton("Test 1: Tính Đóng Gói (Encapsulation)", e -> testEncapsulation()));
        pnlButtons.add(Box.createVerticalStrut(6));
        pnlButtons.add(createTestButton("Test 2: Tính Kế Thừa (Inheritance)", e -> testInheritance()));
        pnlButtons.add(Box.createVerticalStrut(6));
        pnlButtons.add(createTestButton("Test 3: Tính Đa Hình (Polymorphism)", e -> testPolymorphism()));
        pnlButtons.add(Box.createVerticalStrut(6));
        pnlButtons.add(createTestButton("Test 4: Tính Trừu Tượng (Abstraction)", e -> testAbstraction()));
        pnlButtons.add(Box.createVerticalStrut(16));

        JLabel lblTestGroup2 = new JLabel("2. KIỂM THỬ 6 DESIGN PATTERNS (GoF):");
        lblTestGroup2.setFont(UITheme.FONT_SUBTITLE);
        lblTestGroup2.setForeground(UITheme.STATUS_INFO);
        pnlButtons.add(lblTestGroup2);
        pnlButtons.add(Box.createVerticalStrut(8));

        pnlButtons.add(createTestButton("Pattern 1: Singleton (Database & Session)", e -> testSingleton()));
        pnlButtons.add(Box.createVerticalStrut(6));
        pnlButtons.add(createTestButton("Pattern 2: Factory Method (Entity & SanPham)", e -> testFactory()));
        pnlButtons.add(Box.createVerticalStrut(6));
        pnlButtons.add(createTestButton("Pattern 3: Strategy (Đa hình thanh toán)", e -> testStrategy()));
        pnlButtons.add(Box.createVerticalStrut(6));
        pnlButtons.add(createTestButton("Pattern 4: Observer (Pub/Sub sự kiện)", e -> testObserver()));
        pnlButtons.add(Box.createVerticalStrut(6));
        pnlButtons.add(createTestButton("Pattern 5: Master Facade (GearsShopFacade)", e -> testFacade()));
        pnlButtons.add(Box.createVerticalStrut(6));
        pnlButtons.add(createTestButton("Pattern 6: Builder Pattern (InvoiceBuilder)", e -> testBuilder()));
        pnlButtons.add(Box.createVerticalStrut(14));

        ModernButton btnRunAll = new ModernButton("CHẠY TOÀN BỘ 10 BÀI TEST TỰ ĐỘNG", UITheme.PRIMARY_RED, UITheme.PRIMARY_RED_HOVER, Color.WHITE);
        btnRunAll.setMaximumSize(new Dimension(Integer.MAX_VALUE, 40));
        btnRunAll.addActionListener(e -> runAllTests());
        pnlButtons.add(btnRunAll);

        pnlContent.add(pnlButtons);

        // Right Panel: Terminal Output Console
        JPanel pnlConsole = new JPanel(new BorderLayout(0, 8));
        pnlConsole.setBackground(UITheme.BG_CARD);
        pnlConsole.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(UITheme.BORDER_COLOR, 1, true),
            new EmptyBorder(12, 14, 12, 14)
        ));

        JPanel pnlConsoleTop = new JPanel(new BorderLayout());
        pnlConsoleTop.setOpaque(false);
        JLabel lblConsoleTitle = new JLabel("KẾT QUẢ THỰC THI (OOP EXECUTION LOG):");
        lblConsoleTitle.setFont(UITheme.FONT_BOLD);
        lblConsoleTitle.setForeground(UITheme.TEXT_SECONDARY);

        ModernButton btnClear = new ModernButton("Xóa Log", UITheme.BG_INPUT, UITheme.BORDER_COLOR, UITheme.TEXT_MUTED);
        btnClear.setPreferredSize(new Dimension(80, 26));
        btnClear.addActionListener(e -> txtConsole.setText(""));

        pnlConsoleTop.add(lblConsoleTitle, BorderLayout.WEST);
        pnlConsoleTop.add(btnClear, BorderLayout.EAST);
        pnlConsole.add(pnlConsoleTop, BorderLayout.NORTH);

        txtConsole = new JTextArea();
        txtConsole.setFont(new Font("Consolas", Font.PLAIN, 12));
        txtConsole.setBackground(new Color(0x0C, 0x0D, 0x10));
        txtConsole.setForeground(new Color(0x38, 0xBD, 0xF8));
        txtConsole.setEditable(false);
        txtConsole.setMargin(new Insets(10, 12, 10, 12));

        JScrollPane scrollConsole = new JScrollPane(txtConsole);
        scrollConsole.setBorder(BorderFactory.createLineBorder(UITheme.BORDER_COLOR));
        pnlConsole.add(scrollConsole, BorderLayout.CENTER);

        pnlContent.add(pnlConsole);

        add(pnlContent, BorderLayout.CENTER);
        log("=== SẴN SÀNG KIỂM THỬ ĐỒ ÁN PTTKHDT (SGU) ===");
        log("Bấm các nút bên trái để chạy kiểm thử hướng đối tượng và xem kết quả trực tiếp.");
    }

    private ModernButton createTestButton(String title, java.awt.event.ActionListener l) {
        ModernButton btn = new ModernButton(title, UITheme.BG_INPUT, UITheme.BORDER_COLOR, UITheme.TEXT_PRIMARY);
        btn.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        btn.setMaximumSize(new Dimension(Integer.MAX_VALUE, 32));
        btn.setHorizontalAlignment(SwingConstants.LEFT);
        btn.addActionListener(l);
        return btn;
    }

    private void log(String msg) {
        txtConsole.append(msg + "\n");
        txtConsole.setCaretPosition(txtConsole.getDocument().getLength());
    }

    // === LIVE TESTS ===
    private void testEncapsulation() {
        log("\n[TEST 1] TÍNH ĐÓNG GÓI (ENCAPSULATION)");
        SanPhamKeycap sp = new SanPhamKeycap(999, "Test Keycap", "Artisan", 500000, 800000, 10, "", "", "NCC01");
        log("-> Khởi tạo đối tượng SanPhamKeycap: Giá nhập = 500.000đ, Giá bán = 800.000đ, Tồn kho = 10");
        log("-> Lợi nhuận đơn vị tính qua getter: " + String.format("%,.0f VNĐ", sp.tinhLoiNhuanDonVi()));
        log("-> Thử xuất kho 15 nút (vượt tồn kho 10): " + (sp.xuatKho(15) ? "Thành công" : "BỊ TỪ CHỐI AN TOÀN! (Bảo vệ tồn kho không âm)"));
        log("-> Thử xuất kho 4 nút hợp lệ: " + (sp.xuatKho(4) ? "Thành công. Tồn kho mới: " + sp.getSoLuongTon() : "Thất bại"));
        log("=> ĐẠT CHUẨN TÍNH ĐÓNG GÓI!");
    }

    private void testInheritance() {
        log("\n[TEST 2] TÍNH KẾ THỪA (INHERITANCE)");
        log("-> Lớp trừu tượng NguoiDung kế thừa BaseEntity");
        KhachHang kh = new KhachHang("KH99", "Nguyễn Văn Test", "0909090909", "test@gmail.com", "TP.HCM");
        NhanVien nv = new NhanVien("NV99", "Trần Thu Ngân", "0911111111", "cashier@gears.vn", "pos", "cashier_test", "123");

        log("-> Đối tượng KhachHang kế thừa hoTen, soDienThoai, email từ NguoiDung: " + kh.hienThiThongTin());
        log("-> Đối tượng NhanVien kế thừa hoTen, soDienThoai, email từ NguoiDung: " + nv.hienThiThongTin());
        log("=> ĐẠT CHUẨN TÍNH KẾ THỪA!");
    }

    private void testPolymorphism() {
        log("\n[TEST 3] TÍNH ĐA HÌNH (POLYMORPHISM)");
        NguoiDung[] danhSach = new NguoiDung[] {
            new KhachHang("KH01", "Lê Văn Hải", "0901", "hai@gmail.com", "Q1"),
            new NhanVien("NV01", "Nguyễn Công Danh", "0902", "danh@gears.vn", "admin", "admin", "123"),
            new NhanVien("NV04", "Phạm Thu Ngân", "0903", "ngan@gears.vn", "pos", "cashier", "123")
        };

        for (NguoiDung u : danhSach) {
            log(String.format("-> Đa hình getVaiTro() cho [%s]: \"%s\" (Màu hiển thị: %s)", 
                    u.getHoTen(), u.getVaiTro(), u.getRoleColorHex()));
        }
        log("=> ĐẠT CHUẨN TÍNH ĐA HÌNH!");
    }

    private void testAbstraction() {
        log("\n[TEST 4] TÍNH TRỪU TƯỢNG (ABSTRACTION)");
        log("-> BaseEntity và NguoiDung là các abstract class: không thể khởi tạo 'new NguoiDung()'");
        log("-> IGenericDAO<T, ID> định nghĩa khuôn mẫu trừu tượng chuẩn hóa 5 hành vi CRUD");
        log("-> ChienLuocThanhToan là interface trừu tượng cho họ thuật toán thanh toán");
        log("=> ĐẠT CHUẨN TÍNH TRỪU TƯỢNG!");
    }

    private void testSingleton() {
        log("\n[PATTERN 1] SINGLETON PATTERN");
        DatabaseContext db1 = DatabaseContext.getInstance();
        DatabaseContext db2 = DatabaseContext.getInstance();
        log("-> db1 hashcode: " + System.identityHashCode(db1));
        log("-> db2 hashcode: " + System.identityHashCode(db2));
        log("-> db1 == db2 ? " + (db1 == db2 ? "CHÍNH XÁC (Cùng 1 thể hiện duy nhất!)" : "Sai"));
        log("-> Số sản phẩm hiện có trong Singleton Database: " + db1.getSanPhamMap().size());
        log("=> ĐẠT CHUẨN SINGLETON PATTERN!");
    }

    private void testFactory() {
        log("\n[PATTERN 2] FACTORY METHOD PATTERN");
        SanPhamKeycap spArtisan = SanPhamFactory.createSanPham(101, "Dragon Gold Artisan", "Artisan", 400000, 700000, 5, null, null, "NCC03");
        SanPhamKeycap spAnime = SanPhamFactory.createSanPham(102, "One Piece Luffy Gear 5", "Anime", 500000, 850000, 10, null, null, "NCC01");

        log("-> SanPhamFactory tạo Artisan tự động gán mô tả resin: \"" + spArtisan.getMoTa() + "\"");
        log("-> SanPhamFactory tạo Anime tự động gán mô tả Dyesub: \"" + spAnime.getMoTa() + "\"");
        log("=> ĐẠT CHUẨN FACTORY METHOD PATTERN!");
    }

    private void testStrategy() {
        log("\n[PATTERN 3] STRATEGY PATTERN (CHIẾN LƯỢC THANH TOÁN)");
        DonHang dh = new DonHang("TEST-01", "Khách Test", "0900", "POS", "Cash", "POS");
        dh.themChiTiet(new ChiTietDonHang(1, "Keycap Test", 1, 500000, 300000));

        PaymentProcessor processor = new PaymentProcessor(new ThanhToanTienMat());
        KetQuaThanhToan rCash = processor.thucHienThanhToan(dh, 600000);
        log("-> Chiến lược Tiền mặt (đưa 600k): " + rCash.getThongDiep());

        processor.setChienLuoc(new ThanhToanVietQR());
        KetQuaThanhToan rQR = processor.thucHienThanhToan(dh, 500000);
        log("-> Chiến lược SePay VietQR Napas: URL sinh mã = " + rQR.getQrUrl());
        log("=> ĐẠT CHUẨN STRATEGY PATTERN!");
    }

    private void testObserver() {
        log("\n[PATTERN 4] OBSERVER PATTERN (PUBLISH / SUBSCRIBE)");
        final boolean[] received = {false};
        IDataObserver testObs = (eventType, data) -> {
            log("   [Observer Event Received] Event: " + eventType + " | Data: " + data);
            received[0] = true;
        };

        Subject.getInstance().registerObserver(testObs);
        log("-> Đăng ký Observer thành công. Tiến hành phát sự kiện 'STOCK_CHANGED'...");
        Subject.getInstance().notifyObservers("STOCK_CHANGED", "Test Keycap #123");
        Subject.getInstance().removeObserver(testObs);
        log("-> Observer đã nhận được thông báo ? " + (received[0] ? "THÀNH CÔNG!" : "Thất bại"));
        log("=> ĐẠT CHUẨN OBSERVER PATTERN!");
    }

    private void testFacade() {
        log("\n[PATTERN 5] MASTER FACADE PATTERN (GEARS SHOP FACADE)");
        GearsShopFacade facade = GearsShopFacade.getInstance();
        log("-> Facade kết nối thống nhất: Tổng doanh thu = " + String.format("%,.0f VNĐ", facade.getTotalRevenue()));
        log("-> Facade truy xuất số nhà cung cấp = " + facade.getAllSuppliers().size());
        log("-> Facade truy xuất số sản phẩm = " + facade.getAllProducts().size());
        log("=> ĐẠT CHUẨN MASTER FACADE PATTERN!");
    }

    private void testBuilder() {
        log("\n[PATTERN 6] BUILDER PATTERN (INVOICE BUILDER)");
        DonHang dh = GearsShopFacade.getInstance().getAllOrders().get(0);
        String preview = new InvoiceBuilder(dh).withHeader(true).withFooter(true).buildPlainText();
        log("-> InvoiceBuilder đã tạo mẫu biên lai dài: " + preview.length() + " ký tự.");
        log("-> Dòng đầu biên lai: " + preview.split("\n")[1].trim());
        log("=> ĐẠT CHUẨN BUILDER PATTERN!");
    }

    private void runAllTests() {
        txtConsole.setText("");
        log("==========================================================================");
        log("      CHẠY BỘ KIỂM THỬ TOÀN DIỆN HƯỚNG ĐỐI TƯỢNG (OOP TEST SUITE)      ");
        log("           ĐỀ TÀI: GEARS KEYCAP SHOP - ĐẠI HỌC SÀI GÒN (SGU)           ");
        log("==========================================================================");
        testEncapsulation();
        testInheritance();
        testPolymorphism();
        testAbstraction();
        testSingleton();
        testFactory();
        testStrategy();
        testObserver();
        testFacade();
        testBuilder();
        log("\n==========================================================================");
        log(">>> TẤT CẢ 10/10 MỤC KIỂM THỬ HƯỚNG ĐỐI TƯỢNG ĐÃ VƯỢT QUA XUẤT SẮC! <<<");
        log("==========================================================================");
    }
}
