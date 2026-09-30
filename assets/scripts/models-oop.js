// ============================================================================
// MO HINH HUONG DOI TUONG (OOP) - GEARS KEYCAP SHOP (PTTKHDT SGU)
// Ap dung 4 dac trung OOP: Dong goi, Ke thua, Da hinh, Truu tuong hoa
// Ap dung cac Design Patterns: Singleton, Factory, Strategy, Observer
// ============================================================================

/**
 * 1. DESIGN PATTERN: SINGLETON
 * Quan ly ket noi va truy xuat CSDL LocalStorage tap trung
 */
class DatabaseContext {
    constructor() {
        if (DatabaseContext.instance) {
            return DatabaseContext.instance;
        }
        this._storageKeyPrefix = 'gears_';
        DatabaseContext.instance = this;
    }

    static getInstance() {
        if (!DatabaseContext.instance) {
            DatabaseContext.instance = new DatabaseContext();
        }
        return DatabaseContext.instance;
    }

    get(table) {
        try {
            const raw = localStorage.getItem(table);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Loi doc CSDL cho bang:', table, e);
            return [];
        }
    }

    set(table, data) {
        try {
            localStorage.setItem(table, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Loi ghi CSDL cho bang:', table, e);
            return false;
        }
    }
}

/**
 * 2. ENTITY LOP CO SO (BASE CLASS - KE THUA)
 * NguoiDung: Lop cha dai dien cho thuc the con nguoi trong he thong
 */
class NguoiDung {
    constructor(id, hoTen, soDienThoai, email) {
        if (this.constructor === NguoiDung) {
            throw new Error('Khong the khoi tao truc tiep lop truu tuong NguoiDung!');
        }
        // Dong goi (Encapsulation) qua thuoc tinh noi bo
        this._id = id;
        this._hoTen = hoTen;
        this._soDienThoai = soDienThoai;
        this._email = email;
    }

    get id() { return this._id; }
    get hoTen() { return this._hoTen; }
    set hoTen(val) { if (val && val.length >= 2) this._hoTen = val; }
    get soDienThoai() { return this._soDienThoai; }
    set soDienThoai(val) { this._soDienThoai = val; }
    get email() { return this._email; }
    set email(val) { this._email = val; }

    // Phuong thuc truu tuong (Da hinh - Polymorphism)
    getVaiTro() {
        throw new Error('Phuong thuc getVaiTro() phai duoc ghi de boi lop con!');
    }

    hienThiThongTin() {
        return `[${this.getVaiTro()}] ${this._hoTen} - SĐT: ${this._soDienThoai}`;
    }
}

/**
 * Lop con 1: KhachHang ke thua tu NguoiDung
 */
class KhachHang extends NguoiDung {
    constructor(id, hoTen, soDienThoai, email, diaChi, diemTichLuy = 0, trangThai = 'active') {
        super(id, hoTen, soDienThoai, email);
        this._diaChi = diaChi;
        this._diemTichLuy = diemTichLuy;
        this._trangThai = trangThai; // 'active' hoac 'locked'
    }

    get diaChi() { return this._diaChi; }
    set diaChi(val) { this._diaChi = val; }
    get diemTichLuy() { return this._diemTichLuy; }
    get trangThai() { return this._trangThai; }

    // Ghi de da hinh (Override)
    getVaiTro() {
        return 'Khách Hàng Thành Viên';
    }

    congDiem(diem) {
        if (diem > 0) this._diemTichLuy += diem;
    }

    khoaTaiKhoan() {
        this._trangThai = 'locked';
    }

    moKhoaTaiKhoan() {
        this._trangThai = 'active';
    }

    isBlocked() {
        return this._trangThai === 'locked';
    }
}

/**
 * Lop con 2: NhanVien ke thua tu NguoiDung
 */
class NhanVien extends NguoiDung {
    constructor(id, hoTen, soDienThoai, email, chucVu, username, password, ngayVaoLam) {
        super(id, hoTen, soDienThoai, email);
        this._chucVu = chucVu; // 'admin' (Quan ly) hoac 'pos' (Thu ngan)
        this._username = username;
        this._password = password;
        this._ngayVaoLam = ngayVaoLam || new Date().toISOString();
        this._trangThai = 'active';
    }

    get chucVu() { return this._chucVu; }
    get username() { return this._username; }
    get ngayVaoLam() { return this._ngayVaoLam; }

    // Ghi de da hinh (Override)
    getVaiTro() {
        return this._chucVu === 'admin' ? 'Quản Trị Viên / Quản Lý' : 'Nhân Viên Thu Ngân POS';
    }

    kiemTraQuyenAdmin() {
        return this._chucVu === 'admin';
    }
}

/**
 * 3. ENTITY SAN PHAM KEYCAP (DONG GOI & TINH TOAN GIA VON / LOI NHUAN)
 */
class SanPhamKeycap {
    constructor(id, tenSP, theLoai, giaNhap, giaBan, soLuongTon, hinhAnh, moTa, maNCC = 1) {
        this._id = id;
        this._tenSP = tenSP;
        this._theLoai = theLoai; // 'Artisan', 'Anime', 'Pudding', 'Cherry', 'Other'
        this._giaNhap = Number(giaNhap) || 0;
        this._giaBan = Number(giaBan) || 0;
        this._soLuongTon = Number(soLuongTon) || 0;
        this._hinhAnh = hinhAnh || './assets/img/ShortCut_Icon.png';
        this._moTa = moTa || '';
        this._maNCC = maNCC;
    }

    get id() { return this._id; }
    get tenSP() { return this._tenSP; }
    set tenSP(val) { if (val && val.length >= 3) this._tenSP = val; }
    get theLoai() { return this._theLoai; }
    get giaNhap() { return this._giaNhap; }
    get giaBan() { return this._giaBan; }
    get soLuongTon() { return this._soLuongTon; }
    get hinhAnh() { return this._hinhAnh; }
    get moTa() { return this._moTa; }
    get maNCC() { return this._maNCC; }

    // Nghiep vu tinh toan loi nhuan gop
    tinhLoiNhuanDonVi() {
        return Math.max(0, this._giaBan - this._giaNhap);
    }

    tinhTiLeLoiNhuan() {
        if (this._giaBan <= 0) return 0;
        return ((this.tinhLoiNhuanDonVi() / this._giaBan) * 100).toFixed(1);
    }

    // Nghiep vu kiem tra kha dung & dieu chinh kho
    isConHang(soLuongYeuCau = 1) {
        return this._soLuongTon >= soLuongYeuCau;
    }

    nhapKho(soLuong) {
        if (soLuong > 0) {
            this._soLuongTon += soLuong;
            return true;
        }
        return false;
    }

    xuatKho(soLuong) {
        if (soLuong > 0 && this._soLuongTon >= soLuong) {
            this._soLuongTon -= soLuong;
            return true;
        }
        return false;
    }

    // Chuyen thanh plain object de luu CSDL
    toJSON() {
        return {
            id: this._id,
            name: this._tenSP,
            type: this._theLoai,
            costPrice: this._giaNhap,
            price: this._giaBan,
            stock: this._soLuongTon,
            img: this._hinhAnh,
            description: this._moTa,
            supplierId: this._maNCC
        };
    }
}

/**
 * 4. ENTITY CHI TIET DON HANG & DON HANG (COMPOSITION / AGGREGATION)
 */
class ChiTietDonHang {
    constructor(maSP, tenSP, soLuong, donGia, donGiaNhap) {
        this.maSP = maSP;
        this.tenSP = tenSP;
        this.soLuong = Number(soLuong) || 1;
        this.donGia = Number(donGia) || 0;
        this.donGiaNhap = Number(donGiaNhap) || 0;
    }

    tinhThanhTien() {
        return this.soLuong * this.donGia;
    }

    tinhTongGiaVon() {
        return this.soLuong * this.donGiaNhap;
    }

    tinhLoiNhuanMon() {
        return this.tinhThanhTien() - this.tinhTongGiaVon();
    }
}

class DonHang {
    constructor(id, maDon, tenKhach, soDienThoai, diaChi, phuongThucTT = 'Cash', kenhBan = 'POS') {
        this._id = id || Date.now();
        this._maDon = maDon || 'DH-' + String(this._id).slice(-4);
        this._tenKhach = tenKhach || 'Khách vãng lai';
        this._soDienThoai = soDienThoai || '';
        this._diaChi = diaChi || 'Mua tại quầy';
        this._ngayLap = new Date().toISOString();
        this._trangThai = 'moi'; // 'moi', 'xuly', 'giaohang' (Done), 'huy'
        this._phuongThucTT = phuongThucTT;
        this._kenhBan = kenhBan; // 'POS' hoac 'Online'
        this._danhSachChiTiet = [];
        this._phanTramGiamGia = 0;
        this._ghiChu = '';
    }

    get id() { return this._id; }
    get maDon() { return this._maDon; }
    get trangThai() { return this._trangThai; }
    get danhSachChiTiet() { return this._danhSachChiTiet; }

    themChiTiet(chiTiet) {
        if (chiTiet instanceof ChiTietDonHang) {
            this._danhSachChiTiet.push(chiTiet);
        }
    }

    thietLapGiamGia(phanTram) {
        if (phanTram >= 0 && phanTram <= 100) {
            this._phanTramGiamGia = phanTram;
        }
    }

    tinhTongTienTamTinh() {
        return this._danhSachChiTiet.reduce((sum, item) => sum + item.tinhThanhTien(), 0);
    }

    tinhTienGiamGia() {
        return Math.round(this.tinhTongTienTamTinh() * (this._phanTramGiamGia / 100));
    }

    tinhTongTienThanhToan() {
        return Math.max(0, this.tinhTongTienTamTinh() - this.tinhTienGiamGia());
    }

    tinhTongGiaVon() {
        return this._danhSachChiTiet.reduce((sum, item) => sum + item.tinhTongGiaVon(), 0);
    }

    tinhLoiNhuanGop() {
        return Math.max(0, this.tinhTongTienThanhToan() - this.tinhTongGiaVon());
    }

    // RANG BUOC NGHIEP VU QUAN TRONG: DON DA GIAOHANG (DONE) HOAC HUY KHONG DUOC PHEP DOI TRANG THAI
    isTrangThaiKhoa() {
        return this._trangThai === 'giaohang' || this._trangThai === 'huy';
    }

    capNhatTrangThai(trangThaiMoi) {
        if (this.isTrangThaiKhoa()) {
            return {
                thanhCong: false,
                thongBao: 'LỖI NGHIỆP VỤ: Đơn hàng đã ở trạng thái HOÀN TẤT (DONE) hoặc ĐÃ HỦY nên KHÔNG ĐƯỢC PHÉP CẬP NHẬT TRẠNG THÁI NỮA!'
            };
        }
        this._trangThai = trangThaiMoi;
        return {
            thanhCong: true,
            thongBao: `Cập nhật đơn hàng #${this._maDon} sang trạng thái "${trangThaiMoi}" thành công!`
        };
    }
}

/**
 * 5. DESIGN PATTERN: STRATEGY (CHIEN LUOC THANH TOAN DA HINH)
 * Xu ly da hinh giua SePay VietQR va COD
 */
class ChienLuocThanhToan {
    thanhToan(donHang) {
        throw new Error('Phuong thuc thanhToan() phai duoc ghi de boi chien luoc cu the!');
    }
}

class ThanhToanSePayVietQR extends ChienLuocThanhToan {
    constructor(soTaiKhoan = '0987654321', nganHang = 'MBBank', chuTaiKhoan = 'GEARS KEYCAP SHOP') {
        super();
        this.soTaiKhoan = soTaiKhoan;
        this.nganHang = nganHang;
        this.chuTaiKhoan = chuTaiKhoan;
    }

    sinhMaQR(donHang) {
        const soTien = donHang.tinhTongTienThanhToan();
        const noiDung = donHang.maDon;
        return `https://img.vietqr.io/image/MB-${this.soTaiKhoan}-compact2.png?amount=${soTien}&addInfo=${noiDung}&accountName=${encodeURIComponent(this.chuTaiKhoan)}`;
    }

    thanhToan(donHang) {
        return {
            phuongThuc: 'SePay VietQR',
            trangThaiBanDau: 'xuly',
            maQR: this.sinhMaQR(donHang),
            thongTinNganHang: {
                nganHang: this.nganHang,
                stk: this.soTaiKhoan,
                chuTk: this.chuTaiKhoan,
                soTien: donHang.tinhTongTienThanhToan(),
                noiDung: donHang.maDon
            }
        };
    }
}

class ThanhToanCOD extends ChienLuocThanhToan {
    thanhToan(donHang) {
        return {
            phuongThuc: 'COD (Tiền mặt khi nhận hàng)',
            trangThaiBanDau: 'moi',
            soTienThuHo: donHang.tinhTongTienThanhToan(),
            thongBao: 'Khách hàng sẽ thanh toán tiền mặt trực tiếp cho nhân viên giao hàng khi nhận kiện hàng Keycap.'
        };
    }
}

// Bo dieu huong Chien luoc thanh toan (Context)
class PaymentProcessor {
    constructor(chienLuoc) {
        this._chienLuoc = chienLuoc || new ThanhToanSePayVietQR();
    }

    setChienLuoc(chienLuoc) {
        this._chienLuoc = chienLuoc;
    }

    thucHienThanhToan(donHang) {
        return this._chienLuoc.thanhToan(donHang);
    }
}

/**
 * 6. DESIGN PATTERN: FACTORY (SAN XUAT DOI TUONG SAN PHAM & DON HANG)
 */
class SanPhamFactory {
    static taoSanPham(loai, data) {
        switch (loai) {
            case 'Artisan':
                return new SanPhamKeycap(data.id, data.name, 'Artisan', data.costPrice, data.price, data.stock, data.img, data.description || 'Keycap Artisan resin đúc thủ công tinh xảo');
            case 'Anime':
                return new SanPhamKeycap(data.id, data.name, 'Anime', data.costPrice, data.price, data.stock, data.img, data.description || 'Keycap Anime / Manga công nghệ in Dyesub nhiệt cao cấp');
            case 'Pudding':
                return new SanPhamKeycap(data.id, data.name, 'Pudding', data.costPrice, data.price, data.stock, data.img, data.description || 'Keycap PBT Doubleshot Pudding xuyên LED RGB');
            case 'Cherry':
                return new SanPhamKeycap(data.id, data.name, 'Cherry', data.costPrice, data.price, data.stock, data.img, data.description || 'Bộ phím tiêu chuẩn Cherry Profile công thái học');
            default:
                return new SanPhamKeycap(data.id, data.name, 'Other', data.costPrice, data.price, data.stock, data.img, data.description || 'Phụ kiện bàn phím cơ');
        }
    }
}

// Xuat ra moi truong trinh duyet & Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DatabaseContext,
        NguoiDung,
        KhachHang,
        NhanVien,
        SanPhamKeycap,
        ChiTietDonHang,
        DonHang,
        ChienLuocThanhToan,
        ThanhToanSePayVietQR,
        ThanhToanCOD,
        PaymentProcessor,
        SanPhamFactory
    };
}
if (typeof window !== 'undefined') {
    window.OOP = {
        DatabaseContext,
        NguoiDung,
        KhachHang,
        NhanVien,
        SanPhamKeycap,
        ChiTietDonHang,
        DonHang,
        ChienLuocThanhToan,
        ThanhToanSePayVietQR,
        ThanhToanCOD,
        PaymentProcessor,
        SanPhamFactory
    };
}
