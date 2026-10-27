package com.gears.patterns.singleton;

import com.gears.model.*;
import java.io.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * DESIGN PATTERN: SINGLETON
 * Quan ly toan bo CSDL du lieu, dam bao chi co 1 the hien duy nhat (Single Instance).
 * Tu dong khoi tao (Seed Data) day du 100 San pham Keycap, 4 Nha cung cap, Khach hang, Nhan vien va Don hang mau.
 * Luu tru ben vung tren o dia (Persistence) qua thu muc /data/.
 */
public class DatabaseContext {
    private static DatabaseContext instance;

    private final Map<Integer, SanPhamKeycap> sanPhamMap = new LinkedHashMap<>();
    private final Map<String, NhaCungCap> nhaCungCapMap = new LinkedHashMap<>();
    private final Map<String, KhachHang> khachHangMap = new LinkedHashMap<>();
    private final Map<String, NhanVien> nhanVienMap = new LinkedHashMap<>();
    private final Map<String, DonHang> donHangMap = new LinkedHashMap<>();
    private final Map<String, BaoCao> baoCaoMap = new LinkedHashMap<>();
    private ShopConfig shopConfig;

    private static final String DATA_DIR = "data";
    private static final String DB_FILE = "data/gears_database.dat";

    private DatabaseContext() {
        new File(DATA_DIR).mkdirs();
        loadFromDisk();
        if (sanPhamMap.isEmpty()) {
            initSeedData();
            saveToDisk();
        }
    }

    public static synchronized DatabaseContext getInstance() {
        if (instance == null) {
            instance = new DatabaseContext();
        }
        return instance;
    }

    public synchronized void saveToDisk() {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(DB_FILE))) {
            oos.writeObject(new ArrayList<>(sanPhamMap.values()));
            oos.writeObject(new ArrayList<>(nhaCungCapMap.values()));
            oos.writeObject(new ArrayList<>(khachHangMap.values()));
            oos.writeObject(new ArrayList<>(nhanVienMap.values()));
            oos.writeObject(new ArrayList<>(donHangMap.values()));
            oos.writeObject(new ArrayList<>(baoCaoMap.values()));
            oos.writeObject(shopConfig);
        } catch (Exception e) {
            System.err.println("Lỗi lưu CSDL xuống đĩa: " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    public synchronized void loadFromDisk() {
        File file = new File(DB_FILE);
        if (!file.exists()) return;

        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(file))) {
            List<SanPhamKeycap> products = (List<SanPhamKeycap>) ois.readObject();
            for (SanPhamKeycap p : products) sanPhamMap.put(p.getMaSP(), p);

            List<NhaCungCap> suppliers = (List<NhaCungCap>) ois.readObject();
            for (NhaCungCap s : suppliers) nhaCungCapMap.put(s.getMaNCC(), s);

            List<KhachHang> customers = (List<KhachHang>) ois.readObject();
            for (KhachHang c : customers) khachHangMap.put(c.getId(), c);

            List<NhanVien> employees = (List<NhanVien>) ois.readObject();
            for (NhanVien e : employees) nhanVienMap.put(e.getId(), e);

            List<DonHang> orders = (List<DonHang>) ois.readObject();
            for (DonHang o : orders) donHangMap.put(o.getMaDH(), o);

            List<BaoCao> reports = (List<BaoCao>) ois.readObject();
            for (BaoCao r : reports) baoCaoMap.put(r.getMaBC(), r);

            shopConfig = (ShopConfig) ois.readObject();
        } catch (Exception e) {
            System.err.println("Không thể đọc CSDL từ đĩa (sẽ khởi tạo lại mẫu): " + e.getMessage());
        }
    }

    // === ACCESSORS ===
    public Map<Integer, SanPhamKeycap> getSanPhamMap() { return sanPhamMap; }
    public Map<String, NhaCungCap> getNhaCungCapMap() { return nhaCungCapMap; }
    public Map<String, KhachHang> getKhachHangMap() { return khachHangMap; }
    public Map<String, NhanVien> getNhanVienMap() { return nhanVienMap; }
    public Map<String, DonHang> getDonHangMap() { return donHangMap; }
    public Map<String, BaoCao> getBaoCaoMap() { return baoCaoMap; }
    public ShopConfig getShopConfig() {
        if (shopConfig == null) shopConfig = new ShopConfig();
        return shopConfig;
    }
    public void setShopConfig(ShopConfig cfg) {
        this.shopConfig = cfg;
        saveToDisk();
    }

    public synchronized void reseedDefaultData() {
        sanPhamMap.clear();
        nhaCungCapMap.clear();
        khachHangMap.clear();
        nhanVienMap.clear();
        donHangMap.clear();
        baoCaoMap.clear();
        initSeedData();
        saveToDisk();
    }

    // === KHOI TAO DU LIEU MAU CHUAN DO AN (SEED DATA) ===
    private void initSeedData() {
        this.shopConfig = new ShopConfig();

        // 1. Nha Cung Cap
        nhaCungCapMap.put("NCC01", new NhaCungCap("NCC01", "Akko Gear Official Vietnam", "Số 123 Đường 3/2, Quận 10, TP.HCM", "0903123456", "contact@akkogear.vn", "Anime, Cherry Profile", "Phân phối chính hãng keycap Akko PBT Dyesub"));
        nhaCungCapMap.put("NCC02", new NhaCungCap("NCC02", "Keychron & Glorious Studio", "Tòa nhà IPC, Quận 7, TP.HCM", "0918765432", "supplier@keychron.vn", "Pudding, OEM Profile", "Chuyên keycap PBT Doubleshot và OEM layout"));
        nhaCungCapMap.put("NCC03", new NhaCungCap("NCC03", "Jelly Key Artisan Vietnam", "Khu Công nghệ cao, TP. Thủ Đức, TP.HCM", "0934567890", "hello@jellykey.com", "Artisan Resin", "Nghệ nhân đúc keycap thủ công resin cao cấp"));
        nhaCungCapMap.put("NCC04", new NhaCungCap("NCC04", "HolyOOPS & Novelty Maker", "KCX Tân Thuận, Quận 7, TP.HCM", "0978112233", "support@holyoops.asia", "Keycap Kim Loại CNC", "Chuyên keycap nhôm và anime kim loại cao cấp"));

        // 2. Nhan Vien (Quan ly & Thu ngan)
        nhanVienMap.put("NV01", new NhanVien("NV01", "Nguyễn Công Danh", "0912345678", "danh.nguyen@gearskeycap.com", "admin", "admin", "Admin@123", "2026-01-01", "active"));
        nhanVienMap.put("NV02", new NhanVien("NV02", "Trần Nhật Quang", "0923456789", "quang.tran@gearskeycap.com", "admin", "quangtran", "Quang@123", "2026-01-01", "active"));
        nhanVienMap.put("NV03", new NhanVien("NV03", "Lê Hoài Lộc", "0934567891", "loc.le@gearskeycap.com", "admin", "hoailoc", "Loc@12345", "2026-01-01", "active"));
        nhanVienMap.put("NV04", new NhanVien("NV04", "Phạm Thu Ngân", "0945678902", "thungan.pos@gearskeycap.com", "pos", "cashier", "Cashier@123", "2026-02-15", "active"));

        // 3. Khach Hang
        khachHangMap.put("KH01", new KhachHang("KH01", "Nguyễn Công Danh", "0912345678", "admin@gearskeycap.com", "273 An Dương Vương, P.3, Q.5, TP.HCM", 450, 4500000, "active"));
        khachHangMap.put("KH02", new KhachHang("KH02", "Nguyễn Văn Hải", "0987654321", "vanhai99@gmail.com", "45 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM", 185, 1850000, "active"));
        khachHangMap.put("KH03", new KhachHang("KH03", "Trần Minh Trí", "0908112233", "minhtri.dev@gmail.com", "78 Nguyễn Trãi, Phường 2, Quận 5, TP.HCM", 245, 2450000, "active"));
        khachHangMap.put("KH04", new KhachHang("KH04", "Lê Thanh Hà", "0933445566", "thanhha.design@gmail.com", "12 Võ Văn Kiệt, Quận 1, TP.HCM", 92, 920000, "active"));

        // 4. San Pham Keycap (Kho day du 100 items)
        seedAll100Products();

        // 5. Don Hang Mau (Gom ca don hoan tat de kiem thu rang buoc khoa)
        seedSampleOrders();

        // 6. Bao Cao Mau
        BaoCao bc1 = new BaoCao("BC01", "Báo Cáo Doanh Thu Tháng 03/2026", "DoanhThu", "Nguyễn Công Danh", LocalDate.of(2026, 3, 1), LocalDate.of(2026, 3, 31));
        bc1.setTongDoanhThu(3700000);
        bc1.setTongLoiNhuan(1470000);
        bc1.setTongSoDonHang(3);
        bc1.setTongSoLuongBan(8);
        baoCaoMap.put(bc1.getMaBC(), bc1);

        BaoCao bc2 = new BaoCao("BC02", "Báo Cáo Doanh Số & Keycap Bán Chạy", "DoanhSo", "Nguyễn Công Danh", LocalDate.of(2026, 3, 1), LocalDate.of(2026, 3, 31));
        bc2.setTongDoanhThu(3700000);
        bc2.setTongLoiNhuan(1470000);
        bc2.setTongSoDonHang(3);
        bc2.setTongSoLuongBan(8);
        baoCaoMap.put(bc2.getMaBC(), bc2);

        BaoCao bc3 = new BaoCao("BC03", "Báo Cáo Lợi Nhuận Gộp Đồ Án PTTKHDT", "LoiNhuan", "Nguyễn Công Danh", LocalDate.of(2026, 3, 1), LocalDate.of(2026, 3, 31));
        bc3.setTongDoanhThu(3700000);
        bc3.setTongLoiNhuan(1470000);
        bc3.setTongSoDonHang(3);
        bc3.setTongSoLuongBan(8);
        baoCaoMap.put(bc3.getMaBC(), bc3);
    }

    private void seedSampleOrders() {
        // DH-2601 (Da hoan tat tai POS - KHOA KHONG CHO SUA)
        DonHang dh1 = new DonHang("DH-2601", "Nguyễn Văn Hải", "0987654321", "Mua tại quầy POS", "Cash", "POS");
        dh1.setMaKH("KH02");
        dh1.setMaNV("NV04");
        dh1.setTenNhanVien("Phạm Thu Ngân");
        dh1.setNgayLap(LocalDateTime.of(2026, 3, 25, 9, 30));
        dh1.themChiTiet(new ChiTietDonHang(1, "Sun Goddess Shrine Artisan Keycap", 1, 825000, 520000));
        dh1.themChiTiet(new ChiTietDonHang(51, "Keycap PBT Pudding Black LED RGB", 1, 350000, 210000));
        dh1.setTrangThai("giaohang"); // Hoan tat -> KHOA
        dh1.setGhiChu("Đơn bán lẻ tại quầy POS đã thu tiền mặt và in hóa đơn");
        donHangMap.put(dh1.getMaDH(), dh1);

        // DH-2602 (Giao thanh cong - KHOA)
        DonHang dh2 = new DonHang("DH-2602", "Trần Minh Trí", "0908112233", "Mua tại quầy POS", "VietQR", "POS");
        dh2.setMaKH("KH03");
        dh2.setMaNV("NV01");
        dh2.setTenNhanVien("Nguyễn Công Danh");
        dh2.setNgayLap(LocalDateTime.of(2026, 3, 26, 14, 15));
        dh2.themChiTiet(new ChiTietDonHang(26, "Kimetsu no Yaiba Tanjiro & Nezuko Keycap Set", 2, 745000, 480000));
        dh2.setPhanTramGiamGia(5.0); // Chiet khau 5%
        dh2.setTrangThai("giaohang"); // Done -> KHOA
        dh2.setGhiChu("Khách thân thiết quét mã SePay VietQR");
        donHangMap.put(dh2.getMaDH(), dh2);

        // DH-2603 (Dang xu ly)
        DonHang dh3 = new DonHang("DH-2603", "Lê Thanh Hà", "0933445566", "12 Võ Văn Kiệt, Quận 1, TP.HCM", "VietQR", "Online");
        dh3.setMaKH("KH04");
        dh3.setNgayLap(LocalDateTime.of(2026, 3, 28, 16, 45));
        dh3.themChiTiet(new ChiTietDonHang(3, "Koi Fish Natural Pond 3D Artisan Keycap", 1, 545000, 350000));
        dh3.setTrangThai("xuly");
        dh3.setGhiChu("Giao giờ hành chính, gọi trước khi đến");
        donHangMap.put(dh3.getMaDH(), dh3);

        // DH-2604 (Don moi)
        DonHang dh4 = new DonHang("DH-2604", "Khách vãng lai", "0911223344", "Mua tại quầy", "Cash", "POS");
        dh4.setMaNV("NV04");
        dh4.setTenNhanVien("Phạm Thu Ngân");
        dh4.setNgayLap(LocalDateTime.of(2026, 3, 29, 11, 20));
        dh4.themChiTiet(new ChiTietDonHang(5, "Cute Cat Paw Silicone Artisan Keycap", 2, 188000, 110000));
        dh4.setTrangThai("moi");
        dh4.setGhiChu("Khách mua chân mèo silicone");
        donHangMap.put(dh4.getMaDH(), dh4);
    }

    private void seedAll100Products() {
        Object[][] raw = new Object[][] {
            // Artisan 1-25
            {1, "NCC03", "Sun Goddess Shrine Artisan Keycap", "Artisan", 520000.0, 825000.0, 12, "./assets/img/Products/Artisan/001.jpg", "Keycap nghệ thuật đền thần mặt trời đúc nhựa resin thủ công tinh xảo 1U SA profile."},
            {2, "NCC03", "Galaxy Space Nebula Artisan Keycap", "Artisan", 500000.0, 800000.0, 8, "./assets/img/Products/Artisan/002.jpg", "Keycap hiệu ứng dải ngân hà huyền ảo kết hợp bột dạ quang phát sáng trong đêm."},
            {3, "NCC03", "Koi Fish Natural Pond 3D Artisan Keycap", "Artisan", 350000.0, 545000.0, 15, "./assets/img/Products/Artisan/003.jpg", "Hồ cá Koi bơi lội sống động, hiệu ứng nước trong suốt đúc thủ công đa lớp."},
            {4, "NCC03", "Interstellar Deep Universe Keycap", "Artisan", 600000.0, 930000.0, 6, "./assets/img/Products/Artisan/004.jpg", "Tác phẩm du hành vũ trụ Interstellar, viền phi thuyền siêu chi tiết."},
            {5, "NCC04", "Cute Cat Paw Silicone Artisan Keycap", "Artisan", 110000.0, 188000.0, 25, "./assets/img/Products/Artisan/005.jpg", "Chân mèo đệm silicone mềm mại tạo cảm giác nhấn êm tay dễ thương."},
            {6, "NCC04", "Mega Charizard X Fire Dragon Keycap", "Artisan", 180000.0, 295000.0, 14, "./assets/img/Products/Artisan/006.jpg", "Rồng lửa Mega Charizard tạo hình kim loại phủ sơn tĩnh điện cao cấp."},
            {7, "NCC03", "Devil Fruit One Piece Resin Keycap", "Artisan", 620000.0, 940000.0, 10, "./assets/img/Products/Artisan/007.jpg", "Trái ác quỷ Mera Mera no Mi xuyên sáng LED trong suốt siêu đẹp."},
            {8, "NCC03", "Re:Zero Rem Crystal Artisan Keycap", "Artisan", 420000.0, 675000.0, 9, "./assets/img/Products/Artisan/008.jpg", "Nhân vật nữ hầu Rem hóa thân trong khối pha lê resin huyền ảo."},
            {9, "NCC03", "Totoro Natural Landscape Waterfall Keycap", "Artisan", 480000.0, 760000.0, 11, "./assets/img/Products/Artisan/009.jpg", "Khu rừng Totoro và thác nước thu nhỏ mộc mạc thơ mộng."},
            {10, "NCC04", "Iron Man Arc Reactor Metal Keycap", "Artisan", 320000.0, 490000.0, 16, "./assets/img/Products/Artisan/010.jpg", "Lò phản ứng hồ quang của Iron Man làm bằng hợp kim nhôm CNC xuyên LED."},
            {11, "NCC03", "Dwarf Factory Terrarium Eden Keycap", "Artisan", 750000.0, 1150000.0, 7, "./assets/img/Products/Artisan/001.jpg", "Hệ sinh thái thực vật cổ thu nhỏ bên trong khối thủy tinh DOM profile."},
            {12, "NCC03", "Dwarf Factory Gnarly Koala Artisan", "Artisan", 780000.0, 1200000.0, 5, "./assets/img/Products/Artisan/002.jpg", "Chú gấu Koala huyền bí với mắt ngọc tinh xảo và cành cây trầm hương."},
            {13, "NCC03", "Dwarf Factory The Great Duckie", "Artisan", 690000.0, 1050000.0, 8, "./assets/img/Products/Artisan/003.jpg", "Chú vịt vàng khổng lồ phiêu lưu giữa đại dương bao la."},
            {14, "NCC03", "Jelly Key Dragons of Eden 2.0", "Artisan", 950000.0, 1490000.0, 4, "./assets/img/Products/Artisan/004.jpg", "Rồng châu Á uy nghi uốn lượn dưới sóng hoa thạch anh đa sắc."},
            {15, "NCC03", "Jelly Key Retro TV Arcade Series", "Artisan", 850000.0, 1350000.0, 6, "./assets/img/Products/Artisan/007.jpg", "Màn hình tivi thập niên 80 hiển thị trò chơi điện tử cổ điển."},
            {16, "NCC04", "HolyOOPS Captain America Shield CNC", "Artisan", 380000.0, 590000.0, 18, "./assets/img/Products/Artisan/010.jpg", "Khiên đội trưởng Mỹ gia công nhôm nguyên khối sơn anot hóa bền màu."},
            {17, "NCC04", "HolyOOPS Thor Mjolnir Hammer Keycap", "Artisan", 420000.0, 650000.0, 12, "./assets/img/Products/Artisan/010.jpg", "Búa sét Mjolnir đặt trên bệ đá titan, khắc laser tinh xảo."},
            {18, "NCC04", "Cyberpunk Oni Mask Resin Artisan", "Artisan", 490000.0, 780000.0, 10, "./assets/img/Products/Artisan/008.jpg", "Mặt nạ quỷ Oni phong cách Cyberpunk 2077 với cặp sừng nhọn."},
            {19, "NCC03", "Gengar Shadow Pokemon Resin Keycap", "Artisan", 380000.0, 590000.0, 20, "./assets/img/Products/Artisan/006.jpg", "Bóng ma Gengar đôi mắt đỏ phát quang huyền bí trong bóng tối."},
            {20, "NCC03", "Snorlax Sleeping Meadow Keycap", "Artisan", 360000.0, 560000.0, 14, "./assets/img/Products/Artisan/009.jpg", "Chú Snorlax nằm ngủ trên đồng cỏ hoa vàng cực dễ thương."},
            {21, "NCC03", "Mount Fuji Snowy Peak Resin Keycap", "Artisan", 410000.0, 640000.0, 15, "./assets/img/Products/Artisan/001.jpg", "Núi Phú Sĩ phủ tuyết trắng mùa xuân hoa anh đào rơi thơ mộng."},
            {22, "NCC04", "Ancient Dragon Skull Bone Artisan", "Artisan", 450000.0, 720000.0, 9, "./assets/img/Products/Artisan/002.jpg", "Hộp sọ rồng cổ đại sơn giả cổ dành cho tín đồ Gothic ngầu lòi."},
            {23, "NCC04", "Samurai Kabuto Helmet Titanium Keycap", "Artisan", 550000.0, 880000.0, 8, "./assets/img/Products/Artisan/010.jpg", "Mũ giáp chiến binh Samurai Nhật Bản phay CNC sắc sảo."},
            {24, "NCC03", "Astronaut Moon Walking Space Keycap", "Artisan", 530000.0, 840000.0, 12, "./assets/img/Products/Artisan/004.jpg", "Phi hành gia bước đi trên bề mặt mặt trăng vô vàn bóng nhỏ."},
            {25, "NCC04", "Cybernetic Mechanical Heart Resin Keycap", "Artisan", 620000.0, 980000.0, 7, "./assets/img/Products/Artisan/007.jpg", "Trái tim máy móc bánh răng cơ khí chuyển động theo nhịp gõ."},

            // Anime 26-50
            {26, "NCC01", "Kimetsu no Yaiba Tanjiro & Nezuko Keycap Set", "Anime", 480000.0, 745000.0, 22, "./assets/img/Products/Anime/014.png", "Bộ keycap 108 phím họa tiết ca rô xanh đen và hoa văn kimono Nezuko."},
            {27, "NCC01", "Re:Zero Starting Life in Another World Set", "Anime", 490000.0, 750000.0, 18, "./assets/img/Products/Anime/015.png", "Set keycap Rem & Ram tông màu xanh ngọc và hồng pastel cực cuốn hút."},
            {28, "NCC01", "Pokemon Bulbasaur Forest Garden Keycap Set", "Anime", 510000.0, 790000.0, 16, "./assets/img/Products/Anime/016.png", "Bộ keycap Pokemon Ếch Diệu Kỳ song ngữ Nhật - Anh in nhiệt PBT."},
            {29, "NCC01", "Pokemon Charmander Fire Blaze Keycap Set", "Anime", 510000.0, 790000.0, 15, "./assets/img/Products/Anime/017.png", "Set keycap lửa cam rực rỡ chủ đề Pokemon Khủng Long Lửa Charmander."},
            {30, "NCC01", "Pokemon Squirtle Water Splash Keycap Set", "Anime", 510000.0, 790000.0, 19, "./assets/img/Products/Anime/018.png", "Set keycap Pokemon Rùa Squirtle sắc xanh mát dịu êm ái."},
            {31, "NCC01", "Hatsune Miku Vocaloid 01 Limited Edition", "Anime", 450000.0, 690000.0, 14, "./assets/img/Products/Anime/019.jpeg", "Keycap Hatsune Miku tông màu xanh ngọc biếc với font chữ số digital."},
            {32, "NCC01", "Akko Dragon Ball Super Goku Ultra Instinct", "Anime", 580000.0, 890000.0, 17, "./assets/img/Products/Anime/014.png", "Bộ keycap Son Goku Bản Năng Vô Cực chính hãng Akko JDA profile."},
            {33, "NCC01", "Akko Dragon Ball Super Vegeta Super Saiyan Blue", "Anime", 580000.0, 890000.0, 12, "./assets/img/Products/Anime/015.png", "Hoàng tử Saiyan Vegeta trang phục giáp chiến xanh vàng mạnh mẽ."},
            {34, "NCC01", "One Piece Straw Hat Pirates Wano Kuni Set", "Anime", 520000.0, 820000.0, 25, "./assets/img/Products/Anime/016.png", "Băng Hải Tặc Mũ Rơm tại Wano quốc với hoa văn truyền thống Nhật."},
            {35, "NCC01", "One Piece Luffy Gear 5 Sun God Nika Keycap", "Anime", 550000.0, 860000.0, 30, "./assets/img/Products/Anime/017.png", "Luffy trạng thái Thần Mặt Trời Nika trắng tinh rực sáng Cherry profile."},
            {36, "NCC01", "Naruto Shippuden Akatsuki Cloud Keycap Set", "Anime", 500000.0, 790000.0, 24, "./assets/img/Products/Anime/018.png", "Đám mây đỏ Akatsuki trên nền đen bí ẩn dành cho tín đồ Ninja."},
            {37, "NCC01", "Naruto Uzumaki Sage Mode Orange Set", "Anime", 480000.0, 760000.0, 15, "./assets/img/Products/Anime/019.jpeg", "Naruto trạng thái Tiên Nhân Thuật với sắc cam biểu tượng."},
            {38, "NCC01", "Jujutsu Kaisen Gojo Satoru Infinity Set", "Anime", 560000.0, 880000.0, 28, "./assets/img/Products/Anime/014.png", "Thầy Gojo Satoru Vô Lượng Không Xứ mắt xanh bạc quyến rũ."},
            {39, "NCC01", "Jujutsu Kaisen Sukuna Ryomen Cursed King", "Anime", 540000.0, 850000.0, 14, "./assets/img/Products/Anime/015.png", "Vua lời nguyền Sukuna hình xăm cổ đại sắc đỏ đen ác liệt."},
            {40, "NCC01", "Chainsaw Man Denji & Pochita Orange Keycaps", "Anime", 490000.0, 780000.0, 20, "./assets/img/Products/Anime/016.png", "Quỷ cưa Pochita và Denji họa tiết cam đen phong cách Manga."},
            {41, "NCC01", "Spy x Family Anya Forger Peanuts Keycap", "Anime", 460000.0, 720000.0, 26, "./assets/img/Products/Anime/017.png", "Bé Anya Forger biểu cảm waku waku siêu yêu màu hồng phấn."},
            {42, "NCC01", "Attack on Titan Survey Corps Wings of Freedom", "Anime", 520000.0, 820000.0, 17, "./assets/img/Products/Anime/018.png", "Đội Trinh Sát cánh chim tự do Levi và Eren màu xanh rêu quân đội."},
            {43, "NCC01", "Neon Genesis Evangelion EVA-01 Unit Purple", "Anime", 590000.0, 920000.0, 15, "./assets/img/Products/Anime/019.jpeg", "Robot EVA-01 phối màu tím neon và xanh lá độc nhất vô nhị."},
            {44, "NCC01", "Genshin Impact Raiden Shogun Electro Archon", "Anime", 570000.0, 890000.0, 21, "./assets/img/Products/Anime/014.png", "Lôi Thần Raiden Ei tia sét tím Inazuma sang trọng quý phái."},
            {45, "NCC01", "Genshin Impact Hu Tao Funeral Director", "Anime", 550000.0, 870000.0, 23, "./assets/img/Products/Anime/015.png", "Hu Tao tiệm ma hoa mai đỏ thẫm hoa bướm tinh nghịch."},
            {46, "NCC01", "Genshin Impact Ganyu Qilin Frost Set", "Anime", 540000.0, 860000.0, 16, "./assets/img/Products/Anime/016.png", "Ganyu băng tuyết nữ thần Kỳ Lân màu xanh pastel tinh khiết."},
            {47, "NCC01", "Cyberpunk Edgerunners Lucy & David Moonlight", "Anime", 580000.0, 910000.0, 13, "./assets/img/Products/Anime/017.png", "Chuyện tình mặt trăng Night City phối màu neon rực rỡ."},
            {48, "NCC01", "Tokyo Ghoul Kaneki Ken Awakening Centipede", "Anime", 500000.0, 790000.0, 18, "./assets/img/Products/Anime/018.png", "Kaneki Ken tóc trắng mặt nạ gieo rắc nỗi kinh hoàng."},
            {49, "NCC01", "Fate/Stay Night Saber Excalibur Gold Set", "Anime", 560000.0, 880000.0, 15, "./assets/img/Products/Anime/019.jpeg", "Vua Arthur Saber Excalibur thanh kiếm chiến thắng sắc xanh lam."},
            {50, "NCC01", "Bleach Kurosaki Ichigo Bankai Hollow Set", "Anime", 510000.0, 810000.0, 19, "./assets/img/Products/Anime/014.png", "Ichigo mặt nạ Hollow trảm tỏa trảm luân Bankai màu đen cam."},

            // Pudding 51-70
            {51, "NCC02", "Keycap PBT Pudding Black LED RGB", "Pudding", 210000.0, 350000.0, 45, "./assets/img/Products/Pudding/011.jpg", "Set keycap bánh bóng Pudding đen chân trắng xuyên LED rực rỡ."},
            {52, "NCC02", "Keycap PBT Pudding Pure White LED", "Pudding", 210000.0, 350000.0, 50, "./assets/img/Products/Pudding/012.jpg", "Set Pudding trắng tinh khôi doubleshot không bao giờ bị mờ chữ."},
            {53, "NCC02", "Keycap PBT Pudding Sweet Pink Cherry", "Pudding", 220000.0, 360000.0, 35, "./assets/img/Products/Pudding/013.jpg", "Pudding hồng phấn nữ tính dành cho góc máy gaming công chúa."},
            {54, "NCC02", "Keycap PBT Pudding Sky Blue Ocean", "Pudding", 220000.0, 360000.0, 28, "./assets/img/Products/Pudding/blue.jpg", "Pudding xanh da trời pastel tạo cảm giác mát mẻ thoải mái."},
            {55, "NCC02", "Keycap PBT Pudding Lavender Purple", "Pudding", 220000.0, 360000.0, 30, "./assets/img/Products/Pudding/purple.jpg", "Pudding tím oải hương thanh lịch tôn dáng đèn LED phím bấm."},
            {56, "NCC02", "Keycap PBT Pudding Fiery Red Crimson", "Pudding", 220000.0, 360000.0, 22, "./assets/img/Products/Pudding/red.jpg", "Pudding đỏ lửa đậm chất gaming chiến binh rực lửa đam mê."},
            {57, "NCC02", "HyperX Pudding Keycaps Black PBT", "Pudding", 380000.0, 590000.0, 25, "./assets/img/Products/Pudding/011.jpg", "Bộ keycap Pudding chính hãng HyperX font chữ độc quyền rõ nét."},
            {58, "NCC02", "HyperX Pudding Keycaps White PBT", "Pudding", 380000.0, 590000.0, 28, "./assets/img/Products/Pudding/012.jpg", "HyperX Pudding bản trắng tuyệt đẹp cho bàn phím HyperX Alloy."},
            {59, "NCC02", "SteelSeries PrismCaps Universal Pudding", "Pudding", 420000.0, 650000.0, 20, "./assets/img/Products/Pudding/011.jpg", "Keycap bánh bóng cao cấp của SteelSeries tương thích Apex Pro."},
            {60, "NCC02", "Glorious Aura Keycaps V2 Black", "Pudding", 450000.0, 690000.0, 18, "./assets/img/Products/Pudding/011.jpg", "Glorious Aura thế hệ 2 chống bám vân tay hiệu ứng ánh sáng vô cực."},
            {61, "NCC02", "Glorious Aura Keycaps V2 White", "Pudding", 450000.0, 690000.0, 19, "./assets/img/Products/Pudding/012.jpg", "Bộ keycap Glorious trắng ngọc trai chất liệu PBT dày 1.5mm."},
            {62, "NCC02", "XVX Low Profile Pudding Keycaps Set", "Pudding", 310000.0, 490000.0, 15, "./assets/img/Products/Pudding/blue.jpg", "Pudding phẳng Low Profile chuyên dụng cho bàn phím mỏng gọn nhẹ."},
            {63, "NCC02", "Pudding Gradient Rainbow Prism LED", "Pudding", 280000.0, 450000.0, 20, "./assets/img/Products/Pudding/purple.jpg", "Chuyển màu cầu vồng Gradient 7 màu xuyên sáng cực kỳ bắt mắt."},
            {64, "NCC02", "Pudding Mint Green Cool Breeze", "Pudding", 230000.0, 370000.0, 22, "./assets/img/Products/Pudding/blue.jpg", "Pudding xanh bạc hà tươi mát tạo cảm giác êm dịu thư thái."},
            {65, "NCC02", "Pudding Coral Orange Sunset Keycaps", "Pudding", 230000.0, 370000.0, 17, "./assets/img/Products/Pudding/red.jpg", "Màu cam hoàng hôn ấm áp kết hợp đèn vàng LED ấm cúng."},
            {66, "NCC02", "Pudding Dark Smokey Translucent Grey", "Pudding", 240000.0, 380000.0, 26, "./assets/img/Products/Pudding/011.jpg", "Khói xám trong mờ tạo hiệu ứng ánh sáng mờ ảo bí ẩn."},
            {67, "NCC02", "Pudding Emerald Green Forest Keycaps", "Pudding", 230000.0, 370000.0, 18, "./assets/img/Products/Pudding/blue.jpg", "Xanh ngọc lục bảo sang trọng quý phái chân trắng xuyên sáng."},
            {68, "NCC02", "Pudding Cyberpunk Neon Yellow Keycaps", "Pudding", 250000.0, 390000.0, 14, "./assets/img/Products/Pudding/red.jpg", "Vàng neon rực sáng cho không gian phòng tối đậm chất hacker."},
            {69, "NCC02", "Pudding Coffee Milk Cream Duo", "Pudding", 240000.0, 380000.0, 21, "./assets/img/Products/Pudding/012.jpg", "Phối màu nâu cà phê sữa ngọt ngào tạo cảm giác ấm áp."},
            {70, "NCC02", "Pudding Midnight Blue Starry Night", "Pudding", 230000.0, 370000.0, 25, "./assets/img/Products/Pudding/blue.jpg", "Xanh đêm tĩnh mịch kết hợp ánh sao đêm LED huyền bí."},

            // Cherry 71-90
            {71, "NCC04", "GMK Laser Cyberpunk Synthwave Keycaps", "Cherry", 1100000.0, 1750000.0, 8, "./assets/img/Products/Anime/015.png", "Bộ keycap huyền thoại GMK Laser phối màu tím hồng retro thập niên 80."},
            {72, "NCC04", "GMK Olivia Minimalist Rose Gold Set", "Cherry", 1150000.0, 1850000.0, 7, "./assets/img/Products/Anime/019.jpeg", "Tông màu trắng đen điểm xuyến vàng hồng Rose Gold thanh lịch đỉnh cao."},
            {73, "NCC04", "GMK Botanical Nature Green Keycaps", "Cherry", 1050000.0, 1690000.0, 10, "./assets/img/Products/Anime/016.png", "Lấy cảm hứng từ vườn thực vật với sắc xanh lá mộc mạc tươi tắn."},
            {74, "NCC04", "GMK Red Samurai Warrior Edition", "Cherry", 1120000.0, 1790000.0, 9, "./assets/img/Products/Anime/014.png", "Bộ keycap Samurai giáp đỏ vàng đen kiêu hùng đậm chất võ sĩ đạo."},
            {75, "NCC04", "GMK Bento Japanese Traditional Dish", "Cherry", 1080000.0, 1720000.0, 11, "./assets/img/Products/Anime/018.png", "Hộp cơm Bento truyền thống Nhật Bản xanh biển trắng và cá hồi đỏ."},
            {76, "NCC01", "Akko Black & Pink ASA Profile 158 Keys", "Cherry", 620000.0, 990000.0, 20, "./assets/img/Products/Anime/015.png", "Bộ keycap 158 phím full layout Akko ASA profile gõ cực chắc tay."},
            {77, "NCC01", "Akko Wavez Cyber Green PBT Dyesub", "Cherry", 580000.0, 920000.0, 16, "./assets/img/Products/Anime/016.png", "Xanh lá Wavez hiện đại trên nền xám đen cực kỳ hợp dàn đèn RGB."},
            {78, "NCC01", "Akko Macaw Blue & Gold ASA Set", "Cherry", 590000.0, 940000.0, 14, "./assets/img/Products/Anime/018.png", "Vàng xanh chim Macaw nhiệt đới sống động rực rỡ."},
            {79, "NCC02", "Keychron Retro Mac Layout Dye-Sub PBT", "Cherry", 490000.0, 790000.0, 25, "./assets/img/Products/Other/021.jpg", "Đặc trị dành cho người dùng macOS với các phím Command Option cổ điển."},
            {80, "NCC02", "Keychron K Pro Mint Blue Cherry Profile", "Cherry", 470000.0, 750000.0, 22, "./assets/img/Products/Pudding/blue.jpg", "PBT Double-shot siêu bền chống bóng mờ tiêu chuẩn gõ công thái học."},
            {81, "NCC04", "KBDfans ePBT Sushi Japanese Hiragana", "Cherry", 680000.0, 1080000.0, 15, "./assets/img/Products/Anime/019.jpeg", "Bộ pháp Hiragana Nhật Bản chất liệu ePBT nhập khẩu cao cấp."},
            {82, "NCC04", "KBDfans ePBT Grand Tour Space Theme", "Cherry", 720000.0, 1150000.0, 12, "./assets/img/Products/Artisan/004.jpg", "Chuyến thám hiểm không gian vũ trụ của NASA và ESA."},
            {83, "NCC04", "Drop + MT3 Susuwatari Retro High Profile", "Cherry", 850000.0, 1390000.0, 10, "./assets/img/Products/Other/023.jpg", "Profile MT3 cao lõm cong ôm trọn ngón tay tạo cảm giác gõ máy cổ điển."},
            {84, "NCC04", "Drop + MT3 Cyber Neon High Profile", "Cherry", 890000.0, 1450000.0, 8, "./assets/img/Products/Anime/015.png", "Hơi thở viễn tưởng tương lai MT3 profile nhựa ABS dày 1.8mm."},
            {85, "NCC01", "XDA V2 Matcha Tea Soft Green Set", "Cherry", 380000.0, 590000.0, 30, "./assets/img/Products/Anime/016.png", "Bề mặt XDA phẳng phiu êm ái tông màu trà xanh Matcha nhẹ nhàng."},
            {86, "NCC01", "XDA Honey Milk Sweet Cream Set", "Cherry", 380000.0, 590000.0, 32, "./assets/img/Products/Pudding/012.jpg", "Sữa mật ong vàng kem ngọt ngào font chữ tròn xinh xắn."},
            {87, "NCC04", "XDA Canvas Dieter Rams Minimalist", "Cherry", 520000.0, 830000.0, 14, "./assets/img/Products/Other/020.jpg", "Cảm hứng từ triết lý thiết kế tối giản Dieter Rams Braun Đức."},
            {88, "NCC01", "MOA Profile Marshmallow Soft Touch Set", "Cherry", 420000.0, 670000.0, 24, "./assets/img/Products/Pudding/013.jpg", "Profile MOA viền tròn như viên kẹo xốp gõ âm trầm thocky."},
            {89, "NCC01", "MOA Cat Coffee Garden PBT Dyesub", "Cherry", 440000.0, 690000.0, 21, "./assets/img/Products/Artisan/005.jpg", "Quán cà phê mèo xinh xắn với hàng loạt icon chú mèo dễ thương."},
            {90, "NCC04", "Domikey SA Cyberpunk High Profile Set", "Cherry", 920000.0, 1490000.0, 9, "./assets/img/Products/Anime/015.png", "Profile SA cao sang chảnh gõ tiếng âm vang chắc nịch."},

            // Other 91-100
            {91, "NCC04", "TypeWriter Retro Round Metal Rim Keycaps", "Other", 170000.0, 270000.0, 25, "./assets/img/Products/Other/023.jpg", "Bộ phím tròn máy đánh chữ cổ viền kim loại mạ bạc sang trọng."},
            {92, "NCC04", "OSU! Rhythm Game Custom Single Keycap", "Other", 28000.0, 55000.0, 60, "./assets/img/Products/Other/020.jpg", "Nút lẻ in logo game OSU chuyên dụng cho game thủ nhịp điệu siêu bền."},
            {93, "NCC04", "Apple Vintage Classic Rainbow Logo Keycap", "Other", 30000.0, 55000.0, 45, "./assets/img/Products/Other/021.jpg", "Quả táo Apple 7 sắc cầu vồng thập niên 90 hoài niệm đẹp đẽ."},
            {94, "NCC04", "CS:GO Global Elite Metal Logo Keycap", "Other", 65000.0, 110000.0, 35, "./assets/img/Products/Other/022.jpg", "Logo CS:GO Counter Strike chất liệu nhôm phong cách game thủ bắn súng."},
            {95, "NCC03", "Spacebar Resin Great Wave off Kanagawa 6.25U", "Other", 260000.0, 420000.0, 18, "./assets/img/Products/Artisan/003.jpg", "Phím Spacebar dài 6.25U bức họa sóng thần Kanagawa đúc resin 3D."},
            {96, "NCC03", "Spacebar Artisan Galaxy Mountain 6.25U", "Other", 280000.0, 450000.0, 14, "./assets/img/Products/Artisan/002.jpg", "Dãy núi tuyết hùng vĩ dưới ngân hà spacebar đúc tay nghệ thuật."},
            {97, "NCC04", "Enter Novelty Dragon Head Metallic Keycap", "Other", 190000.0, 320000.0, 20, "./assets/img/Products/Artisan/006.jpg", "Phím Enter đầu rồng uy nghi đúc hợp kim sơn mạ vàng gold."},
            {98, "NCC04", "ESC Artisanal Skull King Dark Bronze", "Other", 160000.0, 280000.0, 22, "./assets/img/Products/Artisan/002.jpg", "Nút ESC đầu lâu vua đội vương miện đồng hun cổ điển."},
            {99, "NCC04", "Wooden Walnut Handcrafted Artisan Keycap", "Other", 140000.0, 240000.0, 30, "./assets/img/Products/Other/023.jpg", "Gỗ óc chó Walnut tự nhiên tiện CNC phủ dầu lau giữ vân gỗ mộc."},
            {100, "NCC03", "Ceramic Glazed Custom Keycap Set 1U", "Other", 220000.0, 380000.0, 25, "./assets/img/Products/Artisan/001.jpg", "Chất liệu gốm sứ men ngọc tráng men hỏa biến âm thanh gõ trong trẻo độc lạ."}
        };

        for (Object[] r : raw) {
            int id = (Integer) r[0];
            String ncc = (String) r[1];
            String name = (String) r[2];
            String type = (String) r[3];
            double cost = (Double) r[4];
            double price = (Double) r[5];
            int stock = (Integer) r[6];
            String img = (String) r[7];
            String desc = (String) r[8];

            sanPhamMap.put(id, new SanPhamKeycap(id, name, type, cost, price, stock, img, desc, ncc));
        }
    }
}
