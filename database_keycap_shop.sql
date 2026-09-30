-- ============================================================================
-- ĐỒ ÁN MÔN HỌC: PHÂN TÍCH THIẾT KẾ HƯỚNG ĐỐI TƯỢNG (PTTKHDT)
-- TRƯỜNG ĐẠI HỌC SÀI GÒN (SGU) - KHOA CÔNG NGHỆ THÔNG TIN
-- ĐỀ TÀI: XÂY DỰNG HỆ THỐNG QUẢN LÝ CỬA HÀNG BÁN KEYCAP (GEARS KEYCAP SHOP)
-- 
-- THÀNH VIÊN NHÓM THỰC HIỆN:
-- 1. Nguyễn Công Danh - MSSV: 3124410032 (Trưởng nhóm / Backend Lead)
-- 2. Trần Nhật Quang  - MSSV: 3124410293 (Frontend Lead / UI Designer)
-- 3. Lê Hoài Lộc      - MSSV: 3122560041 (Database / Tester Lead)
-- 
-- HỆ QUẢN TRỊ CSDL: MySQL / MariaDB (Tương thích XAMPP phpMyAdmin & SQL Server)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `gears_keycap_shop` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `gears_keycap_shop`;

-- ----------------------------------------------------------------------------
-- 1. BẢNG NHÀ CUNG CẤP (NhaCungCap)
-- Theo Mục 4 (trang 33-34) trong tài liệu PTTKHDT: NhaCungCap(ID_NCC, Ten_NCC, DiaChi_NCC, SDT_NCC)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `ChiTietBaoCao`;
DROP TABLE IF EXISTS `BaoCao`;
DROP TABLE IF EXISTS `ChiTietDonHang`;
DROP TABLE IF EXISTS `DonHang`;
DROP TABLE IF EXISTS `SanPham`;
DROP TABLE IF EXISTS `NhaCungCap`;
DROP TABLE IF EXISTS `DangNhap`;
DROP TABLE IF EXISTS `NhanVien`;
DROP TABLE IF EXISTS `KhachHang`;

CREATE TABLE `NhaCungCap` (
    `ID_NCC` VARCHAR(20) NOT NULL,
    `Ten_NCC` VARCHAR(150) NOT NULL,
    `DiaChi_NCC` VARCHAR(255) NULL,
    `SDT_NCC` VARCHAR(20) NOT NULL,
    `Email_NCC` VARCHAR(100) NULL,
    `MatHangCungCap` VARCHAR(150) NULL,
    `GhiChu` TEXT NULL,
    PRIMARY KEY (`ID_NCC`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. BẢNG SẢN PHẨM KEYCAP (SanPham)
-- SanPham(ID_SP, ID_NCC, Ten_SP, Gia) + Thuộc tính mở rộng: Type, GiaNhap, Stock, Img
-- ----------------------------------------------------------------------------
CREATE TABLE `SanPham` (
    `ID_SP` INT AUTO_INCREMENT NOT NULL,
    `ID_NCC` VARCHAR(20) NOT NULL,
    `Ten_SP` VARCHAR(200) NOT NULL,
    `Type` VARCHAR(50) NOT NULL DEFAULT 'Other', -- Artisan, Anime, Pudding, Other
    `GiaNhap` DECIMAL(15, 2) NOT NULL DEFAULT 0, -- Giá vốn nhập hàng từ NCC
    `Gia` DECIMAL(15, 2) NOT NULL DEFAULT 0,     -- Giá bán niêm yết
    `Stock` INT NOT NULL DEFAULT 0,              -- Số lượng tồn kho
    `Img` VARCHAR(255) NULL,                     -- Đường dẫn ảnh sản phẩm
    `MoTa` TEXT NULL,
    PRIMARY KEY (`ID_SP`),
    CONSTRAINT `FK_SanPham_NhaCungCap` FOREIGN KEY (`ID_NCC`) 
        REFERENCES `NhaCungCap` (`ID_NCC`) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. BẢNG KHÁCH HÀNG (KhachHang)
-- KhachHang(ID_KH, Ten_KH, DiaChi_KH, SDT_KH) + Email, NgayDangKy, TrangThai
-- ----------------------------------------------------------------------------
CREATE TABLE `KhachHang` (
    `ID_KH` VARCHAR(20) NOT NULL,
    `Ten_KH` VARCHAR(150) NOT NULL,
    `DiaChi_KH` VARCHAR(255) NULL,
    `SDT_KH` VARCHAR(20) NULL,
    `Email_KH` VARCHAR(100) NULL,
    `NgayDangKy` DATE NULL,
    `TongChiTieu` DECIMAL(15, 2) DEFAULT 0,
    `TrangThai` ENUM('active', 'locked') DEFAULT 'active',
    PRIMARY KEY (`ID_KH`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. BẢNG NHÂN VIÊN (NhanVien)
-- NhanVien(ID_NV, Ten_NV, DiaChi_NV, SDT_NV)
-- ----------------------------------------------------------------------------
CREATE TABLE `NhanVien` (
    `ID_NV` VARCHAR(20) NOT NULL,
    `Ten_NV` VARCHAR(150) NOT NULL,
    `DiaChi_NV` VARCHAR(255) NULL,
    `SDT_NV` VARCHAR(20) NOT NULL,
    `Email_NV` VARCHAR(100) NULL,
    `ChucVu` VARCHAR(100) DEFAULT 'Nhân viên bán hàng',
    PRIMARY KEY (`ID_NV`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. BẢNG ĐĂNG NHẬP & PHÂN QUYỀN (DangNhap)
-- DangNhap(ID_TK, ID_NV, Username, Password) + Role (admin / pos)
-- ----------------------------------------------------------------------------
CREATE TABLE `DangNhap` (
    `ID_TK` INT AUTO_INCREMENT NOT NULL,
    `ID_NV` VARCHAR(20) NOT NULL,
    `Username` VARCHAR(50) NOT NULL UNIQUE,
    `Password` VARCHAR(255) NOT NULL,
    `Role` ENUM('admin', 'pos') NOT NULL DEFAULT 'pos', -- admin: Quản lý, pos: Thu ngân
    `TrangThai` ENUM('active', 'locked') NOT NULL DEFAULT 'active',
    `NgayTao` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`ID_TK`),
    CONSTRAINT `FK_DangNhap_NhanVien` FOREIGN KEY (`ID_NV`) 
        REFERENCES `NhanVien` (`ID_NV`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. BẢNG ĐƠN HÀNG (DonHang)
-- DonHang(ID_DH, ID_KH, ID_NV, Date, ThanhTien, Ghichu) + PhuongThucTT, TrangThai
-- ----------------------------------------------------------------------------
CREATE TABLE `DonHang` (
    `ID_DH` VARCHAR(30) NOT NULL,
    `ID_KH` VARCHAR(20) NULL,
    `ID_NV` VARCHAR(20) NULL,
    `Date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `TongTienHang` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `ChietKhau` DECIMAL(5, 2) DEFAULT 0, -- % Giảm giá
    `ThanhTien` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `GiaVonTong` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `LoiNhuan` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `PhuongThucTT` ENUM('Cash', 'Bank', 'Customer Account', 'Online') DEFAULT 'Cash',
    `KenhBan` ENUM('POS', 'Online') DEFAULT 'POS',
    `TrangThai` ENUM('moi', 'xuly', 'giaohang', 'huy') DEFAULT 'moi',
    `Ghichu` VARCHAR(255) NULL,
    PRIMARY KEY (`ID_DH`),
    CONSTRAINT `FK_DonHang_KhachHang` FOREIGN KEY (`ID_KH`) 
        REFERENCES `KhachHang` (`ID_KH`) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `FK_DonHang_NhanVien` FOREIGN KEY (`ID_NV`) 
        REFERENCES `NhanVien` (`ID_NV`) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. BẢNG CHI TIẾT ĐƠN HÀNG (ChiTietDonHang)
-- ChiTietDonHang(ID_DH, ID_SP, SoLuong, Gia, ThanhTien)
-- ----------------------------------------------------------------------------
CREATE TABLE `ChiTietDonHang` (
    `ID_DH` VARCHAR(30) NOT NULL,
    `ID_SP` INT NOT NULL,
    `SoLuong` INT NOT NULL DEFAULT 1,
    `GiaNhap` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `Gia` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `ThanhTien` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    PRIMARY KEY (`ID_DH`, `ID_SP`),
    CONSTRAINT `FK_ChiTiet_DonHang` FOREIGN KEY (`ID_DH`) 
        REFERENCES `DonHang` (`ID_DH`) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `FK_ChiTiet_SanPham` FOREIGN KEY (`ID_SP`) 
        REFERENCES `SanPham` (`ID_SP`) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. BẢNG BÁO CÁO & CHI TIẾT BÁO CÁO (BaoCao & ChiTietBaoCao)
-- BaoCao(ID_BC) - ChiTietBaoCao(ID_BC, ID_DH, NgayBatDau, NgayKetThuc)
-- ----------------------------------------------------------------------------
CREATE TABLE `BaoCao` (
    `ID_BC` VARCHAR(20) NOT NULL,
    `Ten_BC` VARCHAR(150) NOT NULL,
    `Loai_BC` ENUM('DoanhThu', 'DoanhSo', 'LoiNhuan') NOT NULL,
    `NgayTao` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `NguoiLap` VARCHAR(20) NULL,
    PRIMARY KEY (`ID_BC`),
    CONSTRAINT `FK_BaoCao_NhanVien` FOREIGN KEY (`NguoiLap`) REFERENCES `NhanVien` (`ID_NV`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `ChiTietBaoCao` (
    `ID_BC` VARCHAR(20) NOT NULL,
    `ID_DH` VARCHAR(30) NOT NULL,
    `NgayBatDau` DATE NOT NULL,
    `NgayKetThuc` DATE NOT NULL,
    PRIMARY KEY (`ID_BC`, `ID_DH`),
    CONSTRAINT `FK_CTBC_BaoCao` FOREIGN KEY (`ID_BC`) REFERENCES `BaoCao` (`ID_BC`) ON DELETE CASCADE,
    CONSTRAINT `FK_CTBC_DonHang` FOREIGN KEY (`ID_DH`) REFERENCES `DonHang` (`ID_DH`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- DỮ LIỆU MẪU ĐỒ ÁN (SAMPLE DATA CHO KEYCAP SHOP)
-- ============================================================================

-- 1. Insert Nhà cung cấp
INSERT INTO `NhaCungCap` (`ID_NCC`, `Ten_NCC`, `DiaChi_NCC`, `SDT_NCC`, `Email_NCC`, `MatHangCungCap`, `GhiChu`) VALUES
('NCC01', 'Akko Gear Official Vietnam', 'Số 123 Đường 3/2, Quận 10, TP.HCM', '0903123456', 'contact@akkogear.vn', 'Anime, Cherry Profile', 'Phân phối chính hãng keycap Akko PBT Dyesub'),
('NCC02', 'Keychron & Glorious Studio', 'Tòa nhà IPC, Quận 7, TP.HCM', '0918765432', 'supplier@keychron.vn', 'Pudding, OEM Profile', 'Chuyên keycap PBT Doubleshot và OEM layout'),
('NCC03', 'Jelly Key Artisan Vietnam', 'Khu Công nghệ cao, TP. Thủ Đức, TP.HCM', '0934567890', 'hello@jellykey.com', 'Artisan Resin', 'Nghệ nhân đúc keycap thủ công resin cao cấp'),
('NCC04', 'HolyOOPS & Novelty Maker', 'KCX Tân Thuận, Quận 7, TP.HCM', '0978112233', 'support@holyoops.asia', 'Keycap Kim Loại CNC', 'Chuyên keycap nhôm và anime kim loại cao cấp');

-- 2. Insert Sản phẩm Keycap
-- Danh sách đầy đủ 100 sản phẩm Keycap chính hãng cấu hình từ các shop uy tín
INSERT INTO `SanPham` (`ID_SP`, `ID_NCC`, `Ten_SP`, `Type`, `GiaNhap`, `Gia`, `Stock`, `Img`, `MoTa`) VALUES
(1, 'NCC03', 'Sun Goddess Shrine Artisan Keycap', 'Artisan', 520000, 825000, 12, './assets/img/Products/Artisan/001.jpg', 'Keycap nghe thuat den than mat troi duc nhua resin thu cong tinh xao 1U SA profile.'),
(2, 'NCC03', 'Galaxy Space Nebula Artisan Keycap', 'Artisan', 500000, 800000, 8, './assets/img/Products/Artisan/002.jpg', 'Keycap hieu ung dai ngan ha huyen ao ket hop bot da quang phat sang trong dem.'),
(3, 'NCC03', 'Koi Fish Natural Pond 3D Artisan Keycap', 'Artisan', 350000, 545000, 15, './assets/img/Products/Artisan/003.jpg', 'Ho ca Koi boi loi song dong, hieu ung nuoc trong suot duc thu cong da lop.'),
(4, 'NCC03', 'Interstellar Deep Universe Keycap', 'Artisan', 600000, 930000, 6, './assets/img/Products/Artisan/004.jpg', 'Tac pham du hanh vu tru Interstellar, vien phi thuyen sieu chi tiet.'),
(5, 'NCC04', 'Cute Cat Paw Silicone Artisan Keycap', 'Artisan', 110000, 188000, 25, './assets/img/Products/Artisan/005.jpg', 'Chan meo dem silicone mem mai tao cam giac nhan em tay de thuong.'),
(6, 'NCC04', 'Mega Charizard X Fire Dragon Keycap', 'Artisan', 180000, 295000, 14, './assets/img/Products/Artisan/006.jpg', 'Rong lua Mega Charizard tao hinh kim loai phu son tinh dien cao cap.'),
(7, 'NCC03', 'Devil Fruit One Piece Resin Keycap', 'Artisan', 620000, 940000, 10, './assets/img/Products/Artisan/007.jpg', 'Trai ac quy Mera Mera no Mi xuyen sang LED trong suot sieu dep.'),
(8, 'NCC03', 'Re:Zero Rem Crystal Artisan Keycap', 'Artisan', 420000, 675000, 9, './assets/img/Products/Artisan/008.jpg', 'Nhan vat nu hau Rem hoa than trong khoi pha le resin huyen ao.'),
(9, 'NCC03', 'Totoro Natural Landscape Waterfall Keycap', 'Artisan', 480000, 760000, 11, './assets/img/Products/Artisan/009.jpg', 'Khu rung Totoro va thac nuoc thu nho moc mac tho mong.'),
(10, 'NCC04', 'Iron Man Arc Reactor Metal Keycap', 'Artisan', 320000, 490000, 16, './assets/img/Products/Artisan/010.jpg', 'Lo phan ung ho quang cua Iron Man lam bang hop kim nhom CNC xuyen LED.'),
(11, 'NCC03', 'Dwarf Factory Terrarium Eden Keycap', 'Artisan', 750000, 1150000, 7, './assets/img/Products/Artisan/001.jpg', 'He sinh thai thuc vat co thu nho ben trong khoi thuy tinh DOM profile.'),
(12, 'NCC03', 'Dwarf Factory Gnarly Koala Artisan', 'Artisan', 780000, 1200000, 5, './assets/img/Products/Artisan/002.jpg', 'Chu gau Koala huyen bi voi mat ngoc tinh xao va canh cay tram huong.'),
(13, 'NCC03', 'Dwarf Factory The Great Duckie', 'Artisan', 690000, 1050000, 8, './assets/img/Products/Artisan/003.jpg', 'Chu vit vang khong lo phieu luu giua dai duong bao la.'),
(14, 'NCC03', 'Jelly Key Dragons of Eden 2.0', 'Artisan', 950000, 1490000, 4, './assets/img/Products/Artisan/004.jpg', 'Rong chau A uy nghi uon luon duoi song hoa thach anh da sac.'),
(15, 'NCC03', 'Jelly Key Retro TV Arcade Series', 'Artisan', 850000, 1350000, 6, './assets/img/Products/Artisan/007.jpg', 'Man hinh tivi thap nien 80 hien thi tro choi dien tu co dien.'),
(16, 'NCC04', 'HolyOOPS Captain America Shield CNC', 'Artisan', 380000, 590000, 18, './assets/img/Products/Artisan/010.jpg', 'Khien doi truong My gia cong nhom nguyen khoi son anot hoa ben mau.'),
(17, 'NCC04', 'HolyOOPS Thor Mjolnir Hammer Keycap', 'Artisan', 420000, 650000, 12, './assets/img/Products/Artisan/010.jpg', 'Bua set Mjolnir dat tren be da titan, khac laser tinh xao.'),
(18, 'NCC04', 'Cyberpunk Oni Mask Resin Artisan', 'Artisan', 490000, 780000, 10, './assets/img/Products/Artisan/008.jpg', 'Mat na quy Oni phong cach Cyberpunk 2077 voi cap sung nhon.'),
(19, 'NCC03', 'Gengar Shadow Pokemon Resin Keycap', 'Artisan', 380000, 590000, 20, './assets/img/Products/Artisan/006.jpg', 'Bong ma Gengar doi mat do phat quang huyen bi trong bong toi.'),
(20, 'NCC03', 'Snorlax Sleeping Meadow Keycap', 'Artisan', 360000, 560000, 14, './assets/img/Products/Artisan/009.jpg', 'Chu Snorlax nam ngu tren dong co hoa vang cuc de thuong.'),
(21, 'NCC03', 'Mount Fuji Snowy Peak Resin Keycap', 'Artisan', 410000, 640000, 15, './assets/img/Products/Artisan/001.jpg', 'Nui Phu Si phu tuyet trang mua xuan hoa anh dao roi tho mong.'),
(22, 'NCC04', 'Ancient Dragon Skull Bone Artisan', 'Artisan', 450000, 720000, 9, './assets/img/Products/Artisan/002.jpg', 'Hop so rong co dai son gia co danh cho tin do Gothic ngau loi.'),
(23, 'NCC04', 'Samurai Kabuto Helmet Titanium Keycap', 'Artisan', 550000, 880000, 8, './assets/img/Products/Artisan/010.jpg', 'Mu giap chien binh Samurai Nhat Ban phay CNC sac sao.'),
(24, 'NCC03', 'Astronaut Moon Walking Space Keycap', 'Artisan', 530000, 840000, 12, './assets/img/Products/Artisan/004.jpg', 'Phi hanh gia buoc di tren be mat mat trang vo vang bong nho.'),
(25, 'NCC04', 'Cybernetic Mechanical Heart Resin Keycap', 'Artisan', 620000, 980000, 7, './assets/img/Products/Artisan/007.jpg', 'Trai tim may moc banh rang co khi chuyen dong theo nhip go.'),
(26, 'NCC01', 'Kimetsu no Yaiba Tanjiro & Nezuko Keycap Set', 'Anime', 480000, 745000, 22, './assets/img/Products/Anime/014.png', 'Bo keycap 108 phim hoa tiet caro xanh den va hoa van kimono Nezuko.'),
(27, 'NCC01', 'Re:Zero Starting Life in Another World Set', 'Anime', 490000, 750000, 18, './assets/img/Products/Anime/015.png', 'Set keycap Rem & Ram tong mau xanh ngoc va hong pastel cuc cuon hut.'),
(28, 'NCC01', 'Pokemon Bulbasaur Forest Garden Keycap Set', 'Anime', 510000, 790000, 16, './assets/img/Products/Anime/016.png', 'Bo keycap Pokemon Ech Dieu Ky song ngu Nhat - Anh in nhiet PBT.'),
(29, 'NCC01', 'Pokemon Charmander Fire Blaze Keycap Set', 'Anime', 510000, 790000, 15, './assets/img/Products/Anime/017.png', 'Set keycap lua cam ruc ro chu de Pokemon Khung Long Lua Charmander.'),
(30, 'NCC01', 'Pokemon Squirtle Water Splash Keycap Set', 'Anime', 510000, 790000, 19, './assets/img/Products/Anime/018.png', 'Set keycap Pokemon Rua Squirtle sac xanh mat diu em ai.'),
(31, 'NCC01', 'Hatsune Miku Vocaloid 01 Limited Edition', 'Anime', 450000, 690000, 14, './assets/img/Products/Anime/019.jpeg', 'Keycap Hatsune Miku tong mau xanh ngoc biec voi font chu so digital.'),
(32, 'NCC01', 'Akko Dragon Ball Super Goku Ultra Instinct', 'Anime', 580000, 890000, 17, './assets/img/Products/Anime/014.png', 'Bo keycap Son Goku Ban Nang Vo Cuc chinh hang Akko JDA profile.'),
(33, 'NCC01', 'Akko Dragon Ball Super Vegeta Super Saiyan Blue', 'Anime', 580000, 890000, 12, './assets/img/Products/Anime/015.png', 'Hoang tu Saiyan Vegeta trang phuc giap chien xanh vang manh me.'),
(34, 'NCC01', 'One Piece Straw Hat Pirates Wano Kuni Set', 'Anime', 520000, 820000, 25, './assets/img/Products/Anime/016.png', 'Bang Hai Tac Mu Rom tai Wano quoc voi hoa van truyen thong Nhat.'),
(35, 'NCC01', 'One Piece Luffy Gear 5 Sun God Nika Keycap', 'Anime', 550000, 860000, 30, './assets/img/Products/Anime/017.png', 'Luffy trang thai Than Mat Troi Nika trang tinh ruc sang Cherry profile.'),
(36, 'NCC01', 'Naruto Shippuden Akatsuki Cloud Keycap Set', 'Anime', 500000, 790000, 24, './assets/img/Products/Anime/018.png', 'Dam may do Akatsuki tren nen den bi an danh cho tin do Ninja.'),
(37, 'NCC01', 'Naruto Uzumaki Sage Mode Orange Set', 'Anime', 480000, 760000, 15, './assets/img/Products/Anime/019.jpeg', 'Naruto trang thai Tien Nhan Thuat voi sac cam bieu tuong.'),
(38, 'NCC01', 'Jujutsu Kaisen Gojo Satoru Infinity Set', 'Anime', 560000, 880000, 28, './assets/img/Products/Anime/014.png', 'Thay Gojo Satoru Vô Lượng Không Xứ mat xanh bac quyen ru.'),
(39, 'NCC01', 'Jujutsu Kaisen Sukuna Ryomen Cursed King', 'Anime', 540000, 850000, 14, './assets/img/Products/Anime/015.png', 'Vua loi nguyen Sukuna hinh xam co dai sac do den ac liet.'),
(40, 'NCC01', 'Chainsaw Man Denji & Pochita Orange Keycaps', 'Anime', 490000, 780000, 20, './assets/img/Products/Anime/016.png', 'Quy cua Pochita va Denji hoa tiet cam den phong cach Manga.'),
(41, 'NCC01', 'Spy x Family Anya Forger Peanuts Keycap', 'Anime', 460000, 720000, 26, './assets/img/Products/Anime/017.png', 'Be Anya Forger bieu cam waku waku sieu yeu mau hong phan.'),
(42, 'NCC01', 'Attack on Titan Survey Corps Wings of Freedom', 'Anime', 520000, 820000, 17, './assets/img/Products/Anime/018.png', 'Doi Trinh Sat canh chim tu do Levi va Eren mau xanh reu quan doi.'),
(43, 'NCC01', 'Neon Genesis Evangelion EVA-01 Unit Purple', 'Anime', 590000, 920000, 15, './assets/img/Products/Anime/019.jpeg', 'Robot EVA-01 phoi mau tim neon va xanh la doc nhat vo nhi.'),
(44, 'NCC01', 'Genshin Impact Raiden Shogun Electro Archon', 'Anime', 570000, 890000, 21, './assets/img/Products/Anime/014.png', 'Loi Than Raiden Ei tia set tim Inazuma sang trong quy phai.'),
(45, 'NCC01', 'Genshin Impact Hu Tao Funeral Director', 'Anime', 550000, 870000, 23, './assets/img/Products/Anime/015.png', 'Hu Tao tiem ma hoa mai do dam hoa buom tinh nghich.'),
(46, 'NCC01', 'Genshin Impact Ganyu Qilin Frost Set', 'Anime', 540000, 860000, 16, './assets/img/Products/Anime/016.png', 'Ganyu bang tuyet nu than Ky Lan mau xanh pastel tinh khiet.'),
(47, 'NCC01', 'Cyberpunk Edgerunners Lucy & David Moonlight', 'Anime', 580000, 910000, 13, './assets/img/Products/Anime/017.png', 'Chuyen tinh mat trang Night City phoi mau neon ruc ro.'),
(48, 'NCC01', 'Tokyo Ghoul Kaneki Ken Awakening Centipede', 'Anime', 500000, 790000, 18, './assets/img/Products/Anime/018.png', 'Kaneki Ken toc trang mat na gieo rac noi kinh hoang.'),
(49, 'NCC01', 'Fate/Stay Night Saber Excalibur Gold Set', 'Anime', 560000, 880000, 15, './assets/img/Products/Anime/019.jpeg', 'Vua Arthur Saber Excalibur thanh kiem chien thang sac xanh lam.'),
(50, 'NCC01', 'Bleach Kurosaki Ichigo Bankai Hollow Set', 'Anime', 510000, 810000, 19, './assets/img/Products/Anime/014.png', 'Ichigo mat na Hollow tram toa tram luan Bankai mau den cam.'),
(51, 'NCC02', 'Keycap PBT Pudding Black LED RGB', 'Pudding', 210000, 350000, 45, './assets/img/Products/Pudding/011.jpg', 'Set keycap banhbong Pudding den chan trang xuyen LED ruc ro.'),
(52, 'NCC02', 'Keycap PBT Pudding Pure White LED', 'Pudding', 210000, 350000, 50, './assets/img/Products/Pudding/012.jpg', 'Set Pudding trang tinh khoi doubleshot khong bao gio bi mo chu.'),
(53, 'NCC02', 'Keycap PBT Pudding Sweet Pink Cherry', 'Pudding', 220000, 360000, 35, './assets/img/Products/Pudding/013.jpg', 'Pudding hong phan nu tinh danh cho goc may gaming cong chua.'),
(54, 'NCC02', 'Keycap PBT Pudding Sky Blue Ocean', 'Pudding', 220000, 360000, 28, './assets/img/Products/Pudding/blue.jpg', 'Pudding xanh da troi pastel tao cam giac mat me thoai mai.'),
(55, 'NCC02', 'Keycap PBT Pudding Lavender Purple', 'Pudding', 220000, 360000, 30, './assets/img/Products/Pudding/purple.jpg', 'Pudding tim oai huong thanh lich ton dang den LED pham ban phat.'),
(56, 'NCC02', 'Keycap PBT Pudding Fiery Red Crimson', 'Pudding', 220000, 360000, 22, './assets/img/Products/Pudding/red.jpg', 'Pudding do lua dam chat gaming chien binh ruc lua dam me.'),
(57, 'NCC02', 'HyperX Pudding Keycaps Black PBT', 'Pudding', 380000, 590000, 25, './assets/img/Products/Pudding/011.jpg', 'Bo keycap Pudding chinh hang HyperX font chu doc quyen ro net.'),
(58, 'NCC02', 'HyperX Pudding Keycaps White PBT', 'Pudding', 380000, 590000, 28, './assets/img/Products/Pudding/012.jpg', 'HyperX Pudding ban trang tuyet dep cho ban phim HyperX Alloy.'),
(59, 'NCC02', 'SteelSeries PrismCaps Universal Pudding', 'Pudding', 420000, 650000, 20, './assets/img/Products/Pudding/011.jpg', 'Keycap banh bong cao cap cua SteelSeries tuong thich Apex Pro.'),
(60, 'NCC02', 'Glorious Aura Keycaps V2 Black', 'Pudding', 450000, 690000, 18, './assets/img/Products/Pudding/011.jpg', 'Glorious Aura the he 2 chong bam van tay hieu ung anh sang vo cuc.'),
(61, 'NCC02', 'Glorious Aura Keycaps V2 White', 'Pudding', 450000, 690000, 19, './assets/img/Products/Pudding/012.jpg', 'Bo keycap Glorious trang ngoc trai chat lieu PBT day 1.5mm.'),
(62, 'NCC02', 'XVX Low Profile Pudding Keycaps Set', 'Pudding', 310000, 490000, 15, './assets/img/Products/Pudding/blue.jpg', 'Pudding phang Low Profile chuyen dung cho ban phim mong gon nhe.'),
(63, 'NCC02', 'Pudding Gradient Rainbow Prism LED', 'Pudding', 280000, 450000, 20, './assets/img/Products/Pudding/purple.jpg', 'Chuyen mau cau vong Gradient 7 mau xuyen sang cuc ky bat mat.'),
(64, 'NCC02', 'Pudding Mint Green Cool Breeze', 'Pudding', 230000, 370000, 22, './assets/img/Products/Pudding/blue.jpg', 'Pudding xanh bac ha tuoi mat tao cam giac em diu thu thai.'),
(65, 'NCC02', 'Pudding Coral Orange Sunset Keycaps', 'Pudding', 230000, 370000, 17, './assets/img/Products/Pudding/red.jpg', 'Mau cam hoang hon am ap ket hop den vang LED am cúng.'),
(66, 'NCC02', 'Pudding Dark Smokey Translucent Grey', 'Pudding', 240000, 380000, 26, './assets/img/Products/Pudding/011.jpg', 'Khoi xam trong mo tao hieu ung anh sang mo ao bi an.'),
(67, 'NCC02', 'Pudding Emerald Green Forest Keycaps', 'Pudding', 230000, 370000, 18, './assets/img/Products/Pudding/blue.jpg', 'Xanh ngoc luc bao sang trong quy phai chan trang xuyen sang.'),
(68, 'NCC02', 'Pudding Cyberpunk Neon Yellow Keycaps', 'Pudding', 250000, 390000, 14, './assets/img/Products/Pudding/red.jpg', 'Vang neon ruc sang cho khong gian phong troi dam chat hacker.'),
(69, 'NCC02', 'Pudding Coffee Milk Cream Duo', 'Pudding', 240000, 380000, 21, './assets/img/Products/Pudding/012.jpg', 'Phoi mau nau ca phe sua ngot ngao tao cam giac am ap.'),
(70, 'NCC02', 'Pudding Midnight Blue Starry Night', 'Pudding', 230000, 370000, 25, './assets/img/Products/Pudding/blue.jpg', 'Xanh dem tinh mich ket hop anh sao dem LED huyen bi.'),
(71, 'NCC04', 'GMK Laser Cyberpunk Synthwave Keycaps', 'Cherry', 1100000, 1750000, 8, './assets/img/Products/Anime/015.png', 'Bo keycap huyen thoai GMK Laser phoi mau tim hong retro thap nien 80.'),
(72, 'NCC04', 'GMK Olivia Minimalist Rose Gold Set', 'Cherry', 1150000, 1850000, 7, './assets/img/Products/Anime/019.jpeg', 'Tong mau trang den diem xuyen vang hong Rose Gold thanh lich dinh cao.'),
(73, 'NCC04', 'GMK Botanical Nature Green Keycaps', 'Cherry', 1050000, 1690000, 10, './assets/img/Products/Anime/016.png', 'Lay cam hung tu vuon thuc vat voi sac xanh la moc mac tuoi tan.'),
(74, 'NCC04', 'GMK Red Samurai Warrior Edition', 'Cherry', 1120000, 1790000, 9, './assets/img/Products/Anime/014.png', 'Bo keycap Samurai giap do vang den kieu hung dam chat vo si dao.'),
(75, 'NCC04', 'GMK Bento Japanese Traditional Dish', 'Cherry', 1080000, 1720000, 11, './assets/img/Products/Anime/018.png', 'Hop com Bento truyen thong Nhat Ban xanh bien trang va ca hoi do.'),
(76, 'NCC01', 'Akko Black & Pink ASA Profile 158 Keys', 'Cherry', 620000, 990000, 20, './assets/img/Products/Anime/015.png', 'Bo keycap 158 phim full layout Akko ASA profile go cuc chac tay.'),
(77, 'NCC01', 'Akko Wavez Cyber Green PBT Dyesub', 'Cherry', 580000, 920000, 16, './assets/img/Products/Anime/016.png', 'Xanh la Wavez hien dai tren nen xam den cuc ky hop dan den RGB.'),
(78, 'NCC01', 'Akko Macaw Blue & Gold ASA Set', 'Cherry', 590000, 940000, 14, './assets/img/Products/Anime/018.png', 'Vang xanh chim Macaw nhiet doi song dong ruc ro.'),
(79, 'NCC02', 'Keychron Retro Mac Layout Dye-Sub PBT', 'Cherry', 490000, 790000, 25, './assets/img/Products/Other/021.jpg', 'Dac tri danh cho nguoi dung macOS voi cac phim Command Option co dien.'),
(80, 'NCC02', 'Keychron K Pro Mint Blue Cherry Profile', 'Cherry', 470000, 750000, 22, './assets/img/Products/Pudding/blue.jpg', 'PBT Double-shot sieu ben chong bong mo tieu chuan go cong thai hoc.'),
(81, 'NCC04', 'KBDfans ePBT Sushi Japanese Hiragana', 'Cherry', 680000, 1080000, 15, './assets/img/Products/Anime/019.jpeg', 'Bo phap Hiragana Nhat Ban chat lieu ePBT nhap khau cao cap.'),
(82, 'NCC04', 'KBDfans ePBT Grand Tour Space Theme', 'Cherry', 720000, 1150000, 12, './assets/img/Products/Artisan/004.jpg', 'Chuyen thoi gian kham pha khong gian vu tru cua NASA va ESA.'),
(83, 'NCC04', 'Drop + MT3 Susuwatari Retro High Profile', 'Cherry', 850000, 1390000, 10, './assets/img/Products/Other/023.jpg', 'Profile MT3 cao lom cong om tron ngon tay tao cam giac go may co dien.'),
(84, 'NCC04', 'Drop + MT3 Cyber Neon High Profile', 'Cherry', 890000, 1450000, 8, './assets/img/Products/Anime/015.png', 'Hoi tho vi tuong tuong tuong lai MT3 profile nhua ABS day 1.8mm.'),
(85, 'NCC01', 'XDA V2 Matcha Tea Soft Green Set', 'Cherry', 380000, 590000, 30, './assets/img/Products/Anime/016.png', 'Be mat XDA phang phiu em ai tong mau tra xanh Matcha nhe nhang.'),
(86, 'NCC01', 'XDA Honey Milk Sweet Cream Set', 'Cherry', 380000, 590000, 32, './assets/img/Products/Pudding/012.jpg', 'Sua mat ong vang kem ngot ngao font chu tron xinh xan.'),
(87, 'NCC04', 'XDA Canvas Dieter Rams Minimalist', 'Cherry', 520000, 830000, 14, './assets/img/Products/Other/020.jpg', 'Cam hung tu triet ly thiet ke toi gian Dieter Rams Braun Duc.'),
(88, 'NCC01', 'MOA Profile Marshmallow Soft Touch Set', 'Cherry', 420000, 670000, 24, './assets/img/Products/Pudding/013.jpg', 'Profile MOA vien tron nhu vien keo xop go am tram thocky.'),
(89, 'NCC01', 'MOA Cat Coffee Garden PBT Dyesub', 'Cherry', 440000, 690000, 21, './assets/img/Products/Artisan/005.jpg', 'Quan ca phe meo xinh xan voi hang loat icon chu meo de thuong.'),
(90, 'NCC04', 'Domikey SA Cyberpunk High Profile Set', 'Cherry', 920000, 1490000, 9, './assets/img/Products/Anime/015.png', 'Profile SA cao sang chanh go tieng am no vang chac nich.'),
(91, 'NCC04', 'TypeWriter Retro Round Metal Rim Keycaps', 'Other', 170000, 270000, 25, './assets/img/Products/Other/023.jpg', 'Bo phim tron may danh chu co vien kim loai ma bac sang trong.'),
(92, 'NCC04', 'OSU! Rhythm Game Custom Single Keycap', 'Other', 28000, 55000, 60, './assets/img/Products/Other/020.jpg', 'Nut le in logo game OSU chuyen dung cho game thu nhap nhip sieu ben.'),
(93, 'NCC04', 'Apple Vintage Classic Rainbow Logo Keycap', 'Other', 30000, 55000, 45, './assets/img/Products/Other/021.jpg', 'Qua tao Apple 7 sac cau vong thap nien 90 hoai niem dep de.'),
(94, 'NCC04', 'CS:GO Global Elite Metal Logo Keycap', 'Other', 65000, 110000, 35, './assets/img/Products/Other/022.jpg', 'Logo CS:GO Counter Strike chat lieu nhom phong cach game thu ban sung.'),
(95, 'NCC03', 'Spacebar Resin Great Wave off Kanagawa 6.25U', 'Other', 260000, 420000, 18, './assets/img/Products/Artisan/003.jpg', 'Phim Spacebar dai 6.25U buc hoa song than Kanagawa duc resin 3D.'),
(96, 'NCC03', 'Spacebar Artisan Galaxy Mountain 6.25U', 'Other', 280000, 450000, 14, './assets/img/Products/Artisan/002.jpg', 'Day nui tuyet hung vi duoi ngan ha spacebar duc tay nghe thuat.'),
(97, 'NCC04', 'Enter Novelty Dragon Head Metallic Keycap', 'Other', 190000, 320000, 20, './assets/img/Products/Artisan/006.jpg', 'Phim Enter dau rong uy nghi duc hop kim son ma vang gold.'),
(98, 'NCC04', 'ESC Artisanal Skull King Dark Bronze', 'Other', 160000, 280000, 22, './assets/img/Products/Artisan/002.jpg', 'Nut ESC dau lau vua doi vuong mien dong hun co dien.'),
(99, 'NCC04', 'Wooden Walnut Handcrafted Artisan Keycap', 'Other', 140000, 240000, 30, './assets/img/Products/Other/023.jpg', 'Go oc cho Walnut tu nhien tien CNC phu dau lau giu van go moc.'),
(100, 'NCC03', 'Ceramic Glazed Custom Keycap Set 1U', 'Other', 220000, 380000, 25, './assets/img/Products/Artisan/001.jpg', 'Chat lieu gom su men ngoc trang men hoa bien am thanh go trong treo doc la.');

-- 3. Insert Khách hàng
INSERT INTO `KhachHang` (`ID_KH`, `Ten_KH`, `DiaChi_KH`, `SDT_KH`, `Email_KH`, `NgayDangKy`, `TongChiTieu`, `TrangThai`) VALUES
('KH01', 'Nguyễn Công Danh (Admin)', 'TP. Hồ Chí Minh', '0912345678', 'admin@gearskeycap.com', '2026-01-10', 4500000, 'active'),
('KH02', 'Nguyễn Văn Hải', '45 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM', '0987654321', 'vanhai99@gmail.com', '2026-02-14', 1850000, 'active'),
('KH03', 'Trần Minh Trí', '78 Nguyễn Trãi, Phường 2, Quận 5, TP.HCM', '0908112233', 'minhtri.dev@gmail.com', '2026-03-01', 2450000, 'active'),
('KH04', 'Lê Thanh Hà', '12 Võ Văn Kiệt, Quận 1, TP.HCM', '0933445566', 'thanhha.design@gmail.com', '2026-03-10', 920000, 'active');

-- 4. Insert Nhân viên
INSERT INTO `NhanVien` (`ID_NV`, `Ten_NV`, `DiaChi_NV`, `SDT_NV`, `Email_NV`, `ChucVu`) VALUES
('NV01', 'Nguyễn Công Danh', '273 An Dương Vương, P.3, Q.5, TP.HCM', '0912345678', 'danh.nguyen@gearskeycap.com', 'Quản trị viên / Quản lý'),
('NV02', 'Trần Nhật Quang', 'Quận 10, TP. Hồ Chí Minh', '0923456789', 'quang.tran@gearskeycap.com', 'Quản trị viên / Quản lý'),
('NV03', 'Lê Hoài Lộc', 'Quận 8, TP. Hồ Chí Minh', '0934567891', 'loc.le@gearskeycap.com', 'Quản trị viên / Quản lý'),
('NV04', 'Phạm Thu Ngân', 'Quận 5, TP. Hồ Chí Minh', '0945678902', 'thungan.pos@gearskeycap.com', 'Nhân viên Bán hàng / Thu ngân POS');

-- 5. Insert Đăng nhập & Phân quyền
INSERT INTO `DangNhap` (`ID_TK`, `ID_NV`, `Username`, `Password`, `Role`, `TrangThai`) VALUES
(1, 'NV01', 'admin', 'admin123', 'admin', 'active'),
(2, 'NV02', 'quangtran', 'admin123', 'admin', 'active'),
(3, 'NV03', 'hoailoc', 'admin123', 'admin', 'active'),
(4, 'NV04', 'cashier', 'cashier123', 'pos', 'active');

-- 6. Insert Đơn hàng mẫu
INSERT INTO `DonHang` (`ID_DH`, `ID_KH`, `ID_NV`, `Date`, `TongTienHang`, `ChietKhau`, `ThanhTien`, `GiaVonTong`, `LoiNhuan`, `PhuongThucTT`, `KenhBan`, `TrangThai`, `Ghichu`) VALUES
('DH-2601', 'KH02', 'NV04', '2026-03-25 09:30:00', 1175000, 0, 1175000, 710000, 465000, 'Cash', 'POS', 'giaohang', 'Đơn mua trực tiếp tại quầy POS'),
('DH-2602', 'KH03', 'NV01', '2026-03-26 14:15:00', 1600000, 5, 1520000, 1010000, 510000, 'Bank', 'POS', 'giaohang', 'Áp dụng chiết khấu khách thân thiết 5%'),
('DH-2603', 'KH04', NULL,   '2026-03-28 16:45:00', 545000, 0, 545000, 350000, 195000, 'Online', 'Online', 'xuly', 'Giao giờ hành chính'),
('DH-2604', NULL,   'NV04', '2026-03-29 11:20:00', 460000, 0, 460000, 275000, 185000, 'Cash', 'POS', 'moi', 'Khách vãng lai mua tại quầy');

-- 7. Insert Chi tiết đơn hàng
INSERT INTO `ChiTietDonHang` (`ID_DH`, `ID_SP`, `SoLuong`, `GiaNhap`, `Gia`, `ThanhTien`) VALUES
('DH-2601', 1, 1, 500000, 825000, 825000),
('DH-2601', 9, 1, 210000, 350000, 350000),
('DH-2602', 6, 2, 480000, 745000, 1490000),
('DH-2602', 13, 2, 25000, 55000, 110000),
('DH-2603', 3, 1, 350000, 545000, 545000),
('DH-2604', 10, 1, 210000, 350000, 350000),
('DH-2604', 14, 1, 65000, 110000, 110000);

-- 8. Insert Báo cáo mẫu
INSERT INTO `BaoCao` (`ID_BC`, `Ten_BC`, `Loai_BC`, `NgayTao`, `NguoiLap`) VALUES
('BC01', 'Báo Cáo Doanh Thu Tháng 03/2026', 'DoanhThu', '2026-03-30 00:00:00', 'NV01'),
('BC02', 'Báo Cáo Doanh Số & Keycap Bán Chạy', 'DoanhSo', '2026-03-30 00:00:00', 'NV01'),
('BC03', 'Báo Cáo Lợi Nhuận Gộp Đồ Án PTTKHDT', 'LoiNhuan', '2026-03-30 00:00:00', 'NV01');
