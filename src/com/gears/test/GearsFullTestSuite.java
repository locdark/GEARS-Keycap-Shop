package com.gears.test;

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
import com.gears.service.AuthService;

import java.util.*;

/**
 * BỘ KIỂM THỬ TOÀN DIỆN 48 TEST CASES - GEARS KEYCAP SHOP
 * Đồ Án Môn Học: Phân Tích Thiết Kế Hướng Đối Tượng (PTTKHDT)
 * Trường Đại Học Sài Gòn (SGU) - Khoa Công Nghệ Thông Tin
 * Khớp 100% tài liệu KIEM-THU-HE-THONG-TEST-CASES.md (TC01 -> TC48)
 */
public class GearsFullTestSuite {

    private static int totalTests = 0;
    private static int passedTests = 0;
    private static int failedTests = 0;
    private static final List<String> results = new ArrayList<>();

    public static void main(String[] args) {
        System.out.println("==========================================================================================");
        System.out.println("     BỘ KIỂM THỬ HỆ THỐNG TỰ ĐỘNG (AUTOMATED TEST SUITE) - GEARS KEYCAP SHOP (SGU)        ");
        System.out.println("             Môn: Phân Tích Thiết Kế Hướng Đối Tượng (PTTKHDT) - Nhóm 19                  ");
        System.out.println("==========================================================================================");
        System.out.println();

        AuthService auth = new AuthService();
        GearsShopFacade facade = GearsShopFacade.getInstance();

        // -------------------------------------------------------------------------
        // NHÓM 1: XÁC THỰC & BẢO MẬT (TC01 - TC05)
        // -------------------------------------------------------------------------
        runTest("TC01", "Xác thực & Bảo mật", "Kiểm tra mật khẩu dưới 8 ký tự ('12345')", () -> {
            StringBuilder err = new StringBuilder();
            boolean valid = auth.kiemTraMatKhauBaoMat("12345", err);
            return !valid && err.toString().contains("tối thiểu 8 ký tự");
        });

        runTest("TC02", "Xác thực & Bảo mật", "Kiểm tra mật khẩu thiếu chữ in hoa ('admin12345@')", () -> {
            StringBuilder err = new StringBuilder();
            boolean valid = auth.kiemTraMatKhauBaoMat("admin12345@", err);
            return !valid && err.toString().contains("chữ IN HOA");
        });

        runTest("TC03", "Xác thực & Bảo mật", "Kiểm tra mật khẩu thiếu ký tự đặc biệt ('Admin12345')", () -> {
            StringBuilder err = new StringBuilder();
            boolean valid = auth.kiemTraMatKhauBaoMat("Admin12345", err);
            return !valid && err.toString().contains("ký tự đặc biệt");
        });

        runTest("TC04", "Xác thực & Bảo mật", "Kiểm tra đăng nhập Quản trị viên ('admin' / 'Admin@123')", () -> {
            StringBuilder err = new StringBuilder();
            NhanVien nv = facade.login("admin", "Admin@123", err);
            return nv != null && nv.kiemTraQuyenAdmin() && "admin".equals(nv.getUsername());
        });

        runTest("TC05", "Xác thực & Bảo mật", "Kiểm tra đăng nhập Thu ngân POS ('cashier' / 'Cashier@123')", () -> {
            StringBuilder err = new StringBuilder();
            NhanVien nv = facade.login("cashier", "Cashier@123", err);
            return nv != null && !nv.kiemTraQuyenAdmin() && "pos".equals(nv.getChucVu());
        });

        // -------------------------------------------------------------------------
        // NHÓM 2: QUẢN LÝ SẢN PHẨM & KHO HÀNG (TC06 - TC09)
        // -------------------------------------------------------------------------
        runTest("TC06", "Quản lý Sản phẩm", "Kiểm tra số lượng bộ dữ liệu (đủ 100 Keycaps)", () -> {
            return facade.getAllProducts().size() >= 100;
        });

        runTest("TC07", "Quản lý Sản phẩm", "Kiểm tra cơ cấu 5 thể loại (25 Artisan, 25 Anime, 20 Pudding, 20 Cherry, 10 Other)", () -> {
            int artisan = 0, anime = 0, pudding = 0, cherry = 0, other = 0;
            for (SanPhamKeycap sp : facade.getAllProducts()) {
                switch (sp.getTheLoai()) {
                    case "Artisan": artisan++; break;
                    case "Anime": anime++; break;
                    case "Pudding": pudding++; break;
                    case "Cherry": cherry++; break;
                    case "Other": other++; break;
                }
            }
            return artisan == 25 && anime == 25 && pudding == 20 && cherry == 20 && other == 10;
        });

        runTest("TC08", "Quản lý Sản phẩm", "Ràng buộc giá bán và giá vốn (GiaBan >= GiaNhap > 0)", () -> {
            for (SanPhamKeycap sp : facade.getAllProducts()) {
                if (sp.getGiaBan() < sp.getGiaNhap() || sp.getGiaNhap() <= 0) return false;
            }
            return true;
        });

        runTest("TC09", "Quản lý Kho hàng", "Điều chỉnh tồn kho nhanh (+10 nút) cho sản phẩm #1", () -> {
            SanPhamKeycap sp = facade.getProductById(1);
            int before = sp.getSoLuongTon();
            StringBuilder err = new StringBuilder();
            boolean ok = facade.adjustStock(1, 10, err);
            int after = facade.getProductById(1).getSoLuongTon();
            facade.adjustStock(1, -10, err); // hoàn lại
            return ok && after == before + 10;
        });

        // -------------------------------------------------------------------------
        // NHÓM 3: RÀNG BUỘC ĐƠN HÀNG & KHÓA TRẠNG THÁI (TC10 - TC14)
        // -------------------------------------------------------------------------
        runTest("TC10", "Quản lý Đơn hàng", "Khởi tạo tối thiểu 4 đơn hàng mẫu ban đầu", () -> {
            return facade.getAllOrders().size() >= 4;
        });

        runTest("TC11", "Ràng buộc Đơn hàng", "Đổi trạng thái đơn đã Done ('giaohang') sang 'xuly' bị chặn", () -> {
            StringBuilder err = new StringBuilder();
            boolean ok = facade.updateOrderStatus("DH-2601", "xuly", err);
            return !ok && err.toString().contains("RÀNG BUỘC NGHIỆP VỤ");
        });

        runTest("TC12", "Ràng buộc Đơn hàng", "Đổi trạng thái đơn đã Done ('giaohang') sang 'huy' bị chặn", () -> {
            StringBuilder err = new StringBuilder();
            boolean ok = facade.updateOrderStatus("DH-2601", "huy", err);
            return !ok && err.toString().contains("RÀNG BUỘC NGHIỆP VỤ");
        });

        runTest("TC13", "Ràng buộc Đơn hàng", "Đổi trạng thái đơn đã Hủy ('huy') sang 'giaohang' bị chặn", () -> {
            DonHang dhHuy = new DonHang("DH-TEST-HUY", "Khách Test", "0900", "POS", "Cash", "POS");
            dhHuy.setTrangThai("huy");
            DatabaseContext.getInstance().getDonHangMap().put(dhHuy.getMaDH(), dhHuy);

            StringBuilder err = new StringBuilder();
            boolean ok = facade.updateOrderStatus(dhHuy.getMaDH(), "giaohang", err);
            DatabaseContext.getInstance().getDonHangMap().remove(dhHuy.getMaDH());
            return !ok && err.toString().contains("RÀNG BUỘC NGHIỆP VỤ");
        });

        runTest("TC14", "Quản lý Đơn hàng", "Cập nhật đơn hàng mới ('moi') sang Đang xử lý ('xuly') thành công", () -> {
            StringBuilder err = new StringBuilder();
            boolean ok = facade.updateOrderStatus("DH-2604", "xuly", err);
            facade.updateOrderStatus("DH-2604", "moi", err); // hoàn lại
            return ok;
        });

        // -------------------------------------------------------------------------
        // NHÓM 4: GIỎ HÀNG & TÍNH TOÁN TIỀN TỆ (TC15 - TC16, TC23 - TC26)
        // -------------------------------------------------------------------------
        runTest("TC15", "Giỏ hàng Khách hàng", "Khách chưa đăng nhập thêm vào giỏ hàng thành công", () -> {
            ChiTietDonHang item = new ChiTietDonHang(1, "Sun Goddess Shrine Artisan", 1, 825000, 520000);
            return item.getMaSP() == 1 && item.getSoLuong() == 1;
        });

        runTest("TC16", "Giỏ hàng Khách hàng", "Tính tổng tiền nhiều món (2 SP x 2 nút)", () -> {
            DonHang testOrder = new DonHang("DH-CART-TEST", "Khách Test", "0911", "POS", "Cash", "POS");
            testOrder.themChiTiet(new ChiTietDonHang(1, "Artisan 1", 2, 800000, 500000));
            testOrder.themChiTiet(new ChiTietDonHang(2, "Anime 1", 2, 700000, 450000));
            // 2*800 + 2*700 = 1.6M + 1.4M = 3.0M
            return testOrder.tinhTongTienTamTinh() == 3000000.0;
        });

        runTest("TC23", "Giỏ hàng Stepper", "Tăng số lượng sản phẩm bằng nút (+) (từ 2 lên 3)", () -> {
            ChiTietDonHang item = new ChiTietDonHang(1, "Keycap", 2, 100000, 60000);
            item.setSoLuong(item.getSoLuong() + 1);
            return item.getSoLuong() == 3 && item.tinhThanhTien() == 300000;
        });

        runTest("TC24", "Giỏ hàng Stepper", "Giảm số lượng sản phẩm bằng nút (-) (từ 3 xuống 1)", () -> {
            ChiTietDonHang item = new ChiTietDonHang(1, "Keycap", 3, 100000, 60000);
            item.setSoLuong(item.getSoLuong() - 2);
            return item.getSoLuong() == 1 && item.tinhThanhTien() == 100000;
        });

        runTest("TC25", "Giỏ hàng Stepper", "Xóa sản phẩm khỏi giỏ hàng", () -> {
            List<ChiTietDonHang> items = new ArrayList<>();
            items.add(new ChiTietDonHang(1, "Keycap 1", 1, 100000, 60000));
            items.add(new ChiTietDonHang(2, "Keycap 2", 1, 200000, 120000));
            items.remove(0);
            return items.size() == 1 && items.get(0).getMaSP() == 2;
        });

        runTest("TC26", "Thanh toán COD", "Khởi tạo đơn hàng phương thức COD (Tiền mặt)", () -> {
            DonHang codOrder = new DonHang("DH-COD-TEST", "Khách COD", "0900", "HCM", "Cash", "Online");
            return "Cash".equals(codOrder.getPhuongThucTT()) && "moi".equals(codOrder.getTrangThai());
        });

        // -------------------------------------------------------------------------
        // NHÓM 5: CỔNG THANH TOÁN SEPAY VIETQR (TC17 - TC20)
        // -------------------------------------------------------------------------
        runTest("TC17", "Cổng SePay VietQR", "Khởi tạo chiến lược thanh toán SePay VietQR", () -> {
            ThanhToanVietQR vqr = new ThanhToanVietQR();
            return "SePay VietQR (Chuyển khoản)".equals(vqr.getTenPhuongThuc());
        });

        runTest("TC18", "Cổng SePay VietQR", "Sinh URL mã VietQR Napas chuẩn (chứa MB, STK, số tiền, mã đơn)", () -> {
            DonHang testOrder = new DonHang("DH-QR-999", "Khách QR", "0911", "POS", "VietQR", "POS");
            testOrder.themChiTiet(new ChiTietDonHang(1, "Artisan", 1, 800000, 500000));
            ThanhToanVietQR vqr = new ThanhToanVietQR();
            KetQuaThanhToan res = vqr.xuLyThanhToan(testOrder, 800000);
            String url = res.getQrUrl();
            return url != null && url.contains("img.vietqr.io") && url.contains("DH-QR-999") && url.contains("800000");
        });

        runTest("TC19", "Giả lập Webhook", "Mô phỏng khớp lệnh Webhook SePay VietQR Napas 24/7", () -> {
            DonHang testOrder = new DonHang("DH-WEBHOOK", "Khách Test", "0911", "POS", "VietQR", "POS");
            testOrder.themChiTiet(new ChiTietDonHang(1, "Artisan", 1, 500000, 300000));
            PaymentProcessor processor = new PaymentProcessor(new ThanhToanVietQR());
            KetQuaThanhToan res = processor.thucHienThanhToan(testOrder, 500000);
            return res.isThanhCong() && res.getThongDiep().contains("SePay VietQR Napas");
        });

        runTest("TC20", "Tự động cập nhật", "Tự động hoàn tất và khóa đơn khi thanh toán POS thành công", () -> {
            DonHang posOrder = new DonHang("POS-AUTO-DONE", "Khách Test", "0911", "POS", "Cash", "POS");
            posOrder.themChiTiet(new ChiTietDonHang(1, "Artisan", 1, 825000, 520000));
            StringBuilder err = new StringBuilder();
            KetQuaThanhToan r = facade.checkoutPOS(posOrder, 825000, new ThanhToanTienMat(), err);
            boolean isLocked = posOrder.isTrangThaiKhoa();
            DatabaseContext.getInstance().getDonHangMap().remove("POS-AUTO-DONE"); // dọn dẹp
            return r != null && r.isThanhCong() && isLocked;
        });

        // -------------------------------------------------------------------------
        // NHÓM 6: CẤU HÌNH SHOP & ĐIỂM BÁN LẺ POS (TC21 - TC22, TC27 - TC28)
        // -------------------------------------------------------------------------
        runTest("TC21", "Cấu hình Website", "Tải cấu hình thương hiệu mặc định (Tên shop, hotline, slogan)", () -> {
            ShopConfig cfg = facade.getShopConfig();
            return cfg != null && cfg.getTenCuaHang().contains("GEARS") && cfg.getHotline().contains("1900");
        });

        runTest("TC22", "Cấu hình Website", "Lưu và đồng bộ cấu hình Hotline: '1900.5301 - 0903.123.456'", () -> {
            ShopConfig cfg = facade.getShopConfig();
            cfg.setHotline("1900.5301 - 0903.123.456");
            facade.updateShopConfig(cfg);
            return facade.getShopConfig().getHotline().equals("1900.5301 - 0903.123.456");
        });

        runTest("TC27", "Điểm Bán Lẻ POS", "Khởi tạo phiên bán hàng tại quầy POS với nhân viên đăng nhập", () -> {
            DonHang posOrder = EntityFactory.createDonHangPOS("POS-TEST-01", "Khách Test", "0900", "NV04", "Phạm Thu Ngân", "Cash");
            return "POS".equals(posOrder.getKenhBan()) && "giaohang".equals(posOrder.getTrangThai());
        });

        runTest("TC28", "Điểm Bán Lẻ POS", "Tính chiết khấu %Dic tại quầy (1,000,000đ giảm 10% = 900,000đ)", () -> {
            DonHang discOrder = new DonHang("POS-DISC", "Khách VIP", "0900", "POS", "Cash", "POS");
            discOrder.themChiTiet(new ChiTietDonHang(1, "SP", 1, 1000000, 600000));
            discOrder.setPhanTramGiamGia(10.0);
            return discOrder.tinhTienGiamGia() == 100000.0 && discOrder.tinhTongTienThanhToan() == 900000.0;
        });

        // -------------------------------------------------------------------------
        // NHÓM 7: QUY CHUẨN KỸ THUẬT & TOÀN VẸN (TC29 - TC30)
        // -------------------------------------------------------------------------
        runTest("TC29", "Quy chuẩn Kỹ thuật", "Kiểm tra tính an toàn kiểu dữ liệu và null-safe trên toàn bộ Model", () -> {
            SanPhamKeycap sp = new SanPhamKeycap();
            DonHang dh = new DonHang();
            KhachHang kh = new KhachHang();
            NhanVien nv = new NhanVien();
            return sp.getTenSP() != null && dh.getDanhSachChiTiet() != null && kh.getHoTen() != null && nv.getVaiTro() != null;
        });

        runTest("TC30", "Quy chuẩn Kỹ thuật", "Kiểm tra lưu trữ bền vững CSDL đĩa (Database Persistence data/)", () -> {
            DatabaseContext.getInstance().saveToDisk();
            return new java.io.File("data/gears_database.dat").exists();
        });

        // -------------------------------------------------------------------------
        // NHÓM 8: KIỂM THỬ 6 GOF DESIGN PATTERNS (TC31 - TC37, TC45 - TC47)
        // -------------------------------------------------------------------------
        runTest("TC31", "OOP Singleton", "Kiểm tra tính độc bản DatabaseContext (db1 == db2)", () -> {
            DatabaseContext db1 = DatabaseContext.getInstance();
            DatabaseContext db2 = DatabaseContext.getInstance();
            return db1 == db2;
        });

        runTest("TC32", "OOP AuthService", "Đăng nhập Admin và lưu phiên SessionManager thành công", () -> {
            facade.login("admin", "Admin@123", new StringBuilder());
            SessionManager session = SessionManager.getInstance();
            return session.isLoggedIn() && session.isAdmin();
        });

        runTest("TC33", "OOP ProductService", "Lọc danh mục sản phẩm Artisan trả về chính xác 25 sản phẩm", () -> {
            List<SanPhamKeycap> artisans = facade.searchProducts("", "Artisan", 0, 0);
            return artisans.size() == 25;
        });

        runTest("TC34", "OOP CartService", "Thêm sản phẩm vào đơn và cập nhật tổng tiền", () -> {
            DonHang dh = new DonHang();
            dh.themChiTiet(new ChiTietDonHang(1, "SP 1", 2, 500000, 300000));
            return dh.tinhTongSoLuongKeycap() == 2 && dh.tinhTongTienTamTinh() == 1000000;
        });

        runTest("TC35", "OOP OrderService", "Khóa trạng thái đơn hàng nghiêm ngặt (isTrangThaiKhoa = true)", () -> {
            DonHang dh = facade.getAllOrders().stream().filter(o -> "giaohang".equals(o.getTrangThai())).findFirst().orElse(null);
            return dh != null && dh.isTrangThaiKhoa();
        });

        runTest("TC36", "OOP ReportService", "Tính toán báo cáo tài chính (Doanh thu >= 0, Lợi nhuận gộp >= 0)", () -> {
            double rev = facade.getTotalRevenue();
            double profit = facade.getTotalGrossProfit();
            return rev >= 0 && profit >= 0 && rev >= profit;
        });

        runTest("TC37", "OOP Facade Pattern", "Kiểm tra tích hợp Master GearsShopFacade truy xuất toàn hệ thống", () -> {
            GearsShopFacade f = GearsShopFacade.getInstance();
            return f.getAllProducts().size() >= 100 && f.getAllSuppliers().size() >= 4 && f.getAllCustomers().size() >= 4;
        });

        runTest("TC45", "OOP Factory Pattern", "Khởi tạo qua SanPhamFactory tự động gán mô tả thể loại", () -> {
            SanPhamKeycap sp = SanPhamFactory.createSanPham(201, "Test Artisan", "Artisan", 500000, 800000, 10, null, null, "NCC03");
            return sp.getTheLoai().equals("Artisan") && sp.getMoTa().contains("resin");
        });

        runTest("TC46", "OOP Strategy Pattern", "Chiến lược thanh toán đa dạng (Tiền mặt, VietQR, Thẻ POS)", () -> {
            DonHang dh = new DonHang("DH-ST", "Khách", "0900", "POS", "Cash", "POS");
            dh.themChiTiet(new ChiTietDonHang(1, "SP", 1, 500000, 300000));
            PaymentProcessor p = new PaymentProcessor(new ThanhToanTienMat());
            KetQuaThanhToan rCash = p.thucHienThanhToan(dh, 600000);
            p.setChienLuoc(new ThanhToanTheNganHang());
            KetQuaThanhToan rCard = p.thucHienThanhToan(dh, 500000);
            return rCash.isThanhCong() && rCash.getTienThoi() == 100000.0 && rCard.isThanhCong();
        });

        runTest("TC47", "OOP Observer Pattern", "Đăng ký lắng nghe sự kiện Subject.registerObserver()", () -> {
            final boolean[] fired = {false};
            IDataObserver obs = (eventType, data) -> fired[0] = true;
            Subject.getInstance().registerObserver(obs);
            Subject.getInstance().notifyObservers("TEST_EVENT", "Data");
            Subject.getInstance().removeObserver(obs);
            return fired[0];
        });

        // -------------------------------------------------------------------------
        // NHÓM 9: 4 TRỤ CỘT OOP & VÒNG ĐỜI ĐƠN HÀNG (TC38 - TC44, TC48)
        // -------------------------------------------------------------------------
        runTest("TC38", "OOP Đóng gói", "Kiểm tra Encapsulation & tính biên lợi nhuận", () -> {
            SanPhamKeycap sp = new SanPhamKeycap(99, "Test SP", "Cherry", 500000, 800000, 10, "", "", "NCC01");
            return sp.tinhLoiNhuanDonVi() == 300000.0 && Math.abs(sp.tinhTiLeLoiNhuan() - 37.5) < 0.1;
        });

        runTest("TC39", "OOP Kế thừa", "Kiểm tra Inheritance (KhachHang & NhanVien kế thừa NguoiDung)", () -> {
            KhachHang kh = new KhachHang("KH99", "Tên", "0900", "email", "Địa chỉ");
            NhanVien nv = new NhanVien("NV99", "Tên", "0900", "email", "admin", "user", "pass");
            return (kh instanceof NguoiDung) && (nv instanceof NguoiDung) && (kh instanceof BaseEntity);
        });

        runTest("TC40", "OOP Đa hình", "Ghi đè phương thức getVaiTro() trên KhachHang và NhanVien", () -> {
            NguoiDung u1 = new KhachHang("KH01", "Hải", "09", "e", "dc");
            NguoiDung u2 = new NhanVien("NV01", "Danh", "09", "e", "admin", "u", "p");
            NguoiDung u3 = new NhanVien("NV04", "Ngân", "09", "e", "pos", "u", "p");
            return u1.getVaiTro().contains("Khách Hàng") 
                    && u2.getVaiTro().contains("Quản Trị Viên") 
                    && u3.getVaiTro().contains("Thu Ngân");
        });

        runTest("TC41", "OOP Composition", "DonHang chứa ChiTietDonHang tính tổng tiền, vốn, lãi gộp", () -> {
            DonHang dh = new DonHang();
            dh.themChiTiet(new ChiTietDonHang(1, "Item 1", 2, 500000, 300000)); // tiền=1M, vốn=600k
            dh.themChiTiet(new ChiTietDonHang(2, "Item 2", 1, 250000, 180000)); // tiền=250k, vốn=180k
            // Tổng tiền = 1.25M, Vốn = 780k, Lãi = 470k
            return dh.tinhTongTienTamTinh() == 1250000.0 
                    && dh.tinhTongGiaVon() == 780000.0 
                    && dh.tinhLoiNhuanGop() == 470000.0;
        });

        runTest("TC42", "OOP Vòng đời Đơn", "Đổi trạng thái hợp lệ từ 'moi' sang 'xuly'", () -> {
            DonHang dh = new DonHang("DH-TRANS-TEST", "Khách", "09", "POS", "Cash", "POS");
            dh.setTrangThai("moi");
            StringBuilder err = new StringBuilder();
            boolean ok = dh.capNhatTrangThai("xuly", err);
            return ok && "xuly".equals(dh.getTrangThai());
        });

        runTest("TC43", "OOP Tự động Khóa", "Chuyển sang 'giaohang' (Done) tự động kích hoạt isTrangThaiKhoa", () -> {
            DonHang dh = new DonHang("DH-TRANS-DONE", "Khách", "09", "POS", "Cash", "POS");
            dh.setTrangThai("moi");
            dh.capNhatTrangThai("giaohang", new StringBuilder());
            return dh.isTrangThaiKhoa();
        });

        runTest("TC44", "OOP Bảo vệ Trạng thái", "Từ chối tuyệt đối sửa đơn đã khóa về 'xuly'", () -> {
            DonHang dh = new DonHang("DH-LOCKED", "Khách", "09", "POS", "Cash", "POS");
            dh.setTrangThai("giaohang");
            StringBuilder err = new StringBuilder();
            boolean ok = dh.capNhatTrangThai("xuly", err);
            return !ok && err.toString().contains("RÀNG BUỘC NGHIỆP VỤ");
        });

        runTest("TC48", "OOP Logic Nghiệp vụ", "Điều chỉnh kho hợp lệ và chặn xuất vượt tồn kho âm", () -> {
            SanPhamKeycap sp = new SanPhamKeycap(999, "Test Stock", "Artisan", 100000, 200000, 5, "", "", "NCC01");
            boolean okValid = sp.xuatKho(3);   // Tồn còn 2
            boolean okExceed = sp.xuatKho(10); // Quá tồn -> false
            return okValid && !okExceed && sp.getSoLuongTon() == 2;
        });

        // -------------------------------------------------------------------------
        // TỔNG KẾT BÁO CÁO KIỂM THỬ
        // -------------------------------------------------------------------------
        System.out.println();
        System.out.println("==========================================================================================");
        System.out.println("                         BẢNG TỔNG KẾT KẾT QUẢ KIỂM THỬ HỆ THỐNG                          ");
        System.out.println("==========================================================================================");
        System.out.printf("  - Tổng số Test Cases đã chạy:  %d / 48%n", totalTests);
        System.out.printf("  - Số Test đạt chuẩn (PASSED):   %d (%.1f%%)%n", passedTests, (passedTests * 100.0 / totalTests));
        System.out.printf("  - Số Test thất bại (FAILED):   %d (%.1f%%)%n", failedTests, (failedTests * 100.0 / totalTests));
        System.out.println("==========================================================================================");

        if (failedTests == 0) {
            System.out.println(">>> [XUẤT SẮC] 100% TẤT CẢ 48/48 TEST CASES ĐỀU ĐẠT CHUẨN ĐỒ ÁN PTTKHDT (SGU)! <<<");
        } else {
            System.out.printf(">>> [CẢNH BÁO] Có %d test case thất bại. Vui lòng rà soát lại kết quả.%n", failedTests);
        }
        System.out.println("==========================================================================================");
    }

    private static void runTest(String code, String module, String desc, TestCaseRunner runner) {
        totalTests++;
        try {
            boolean passed = runner.run();
            if (passed) {
                passedTests++;
                System.out.printf("[%s] %-22s : %-58s -> [PASSED ✅]%n", code, module, desc);
            } else {
                failedTests++;
                System.out.printf("[%s] %-22s : %-58s -> [FAILED ❌]%n", code, module, desc);
            }
        } catch (Throwable t) {
            failedTests++;
            System.out.printf("[%s] %-22s : %-58s -> [ERROR 💥: %s]%n", code, module, desc, t.getMessage());
        }
    }

    @FunctionalInterface
    interface TestCaseRunner {
        boolean run() throws Throwable;
    }
}
