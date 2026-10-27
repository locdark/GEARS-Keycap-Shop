package com.gears.model;

import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Lop DonHang (Order) - Dong goi toan bo thong tin don hang va quy trinh thanh toan.
 * Chua danh sach ChiTietDonHang (Aggregation / Composition).
 * 
 * RANG BUOC NGHIEP VU PTTKHDT TRONG TAM:
 * Khi don hang da o trang thai "giaohang" (Hoan tat / Done) hoac "huy" (Da huy),
 * he thong KHOA CHAT KHONG CHO PHEP DOI TRANG THAI.
 */
public class DonHang extends BaseEntity {
    private static final long serialVersionUID = 1L;

    private String maDH;
    private String maKH;
    private String tenKhachHang;
    private String soDienThoai;
    private String diaChiGiao;

    private String maNV;
    private String tenNhanVien;

    private LocalDateTime ngayLap;
    private List<ChiTietDonHang> danhSachChiTiet;
    private double phanTramGiamGia; // % Chiet khau

    private String phuongThucTT; // "Cash", "VietQR", "Card", "Online"
    private String kenhBan;       // "POS", "Online"
    private String trangThai;     // "moi", "xuly", "giaohang", "huy"
    private String ghiChu;

    private static final DecimalFormat CURRENCY_FORMAT = new DecimalFormat("#,##0 'VNĐ'");
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public DonHang() {
        super();
        this.danhSachChiTiet = new ArrayList<>();
        this.ngayLap = LocalDateTime.now();
        this.trangThai = "moi";
        this.phuongThucTT = "Cash";
        this.kenhBan = "POS";
        this.phanTramGiamGia = 0.0;
    }

    public DonHang(String maDH, String tenKhachHang, String soDienThoai, String diaChiGiao, String phuongThucTT, String kenhBan) {
        super(maDH);
        this.maDH = maDH;
        this.tenKhachHang = (tenKhachHang != null && !tenKhachHang.isEmpty()) ? tenKhachHang : "Khách vãng lai";
        this.soDienThoai = soDienThoai;
        this.diaChiGiao = (diaChiGiao != null && !diaChiGiao.isEmpty()) ? diaChiGiao : "Mua tại quầy POS";
        this.phuongThucTT = phuongThucTT != null ? phuongThucTT : "Cash";
        this.kenhBan = kenhBan != null ? kenhBan : "POS";
        this.ngayLap = LocalDateTime.now();
        this.trangThai = "moi";
        this.danhSachChiTiet = new ArrayList<>();
        this.phanTramGiamGia = 0.0;
    }

    public String getMaDH() {
        return maDH != null ? maDH : (id != null ? id : "");
    }

    public void setMaDH(String maDH) {
        this.maDH = maDH;
        this.id = maDH;
    }

    public String getMaKH() {
        return maKH != null ? maKH : "";
    }

    public void setMaKH(String maKH) {
        this.maKH = maKH;
    }

    public String getTenKhachHang() {
        return tenKhachHang != null ? tenKhachHang : "Khách vãng lai";
    }

    public void setTenKhachHang(String tenKhachHang) {
        this.tenKhachHang = tenKhachHang;
    }

    public String getSoDienThoai() {
        return soDienThoai != null ? soDienThoai : "";
    }

    public void setSoDienThoai(String soDienThoai) {
        this.soDienThoai = soDienThoai;
    }

    public String getDiaChiGiao() {
        return diaChiGiao != null ? diaChiGiao : "";
    }

    public void setDiaChiGiao(String diaChiGiao) {
        this.diaChiGiao = diaChiGiao;
    }

    public String getMaNV() {
        return maNV != null ? maNV : "";
    }

    public void setMaNV(String maNV) {
        this.maNV = maNV;
    }

    public String getTenNhanVien() {
        return tenNhanVien != null ? tenNhanVien : "Thu ngân";
    }

    public void setTenNhanVien(String tenNhanVien) {
        this.tenNhanVien = tenNhanVien;
    }

    public LocalDateTime getNgayLap() {
        return ngayLap != null ? ngayLap : LocalDateTime.now();
    }

    public void setNgayLap(LocalDateTime ngayLap) {
        this.ngayLap = ngayLap;
    }

    public List<ChiTietDonHang> getDanhSachChiTiet() {
        if (danhSachChiTiet == null) {
            danhSachChiTiet = new ArrayList<>();
        }
        return danhSachChiTiet;
    }

    public void setDanhSachChiTiet(List<ChiTietDonHang> danhSachChiTiet) {
        this.danhSachChiTiet = danhSachChiTiet;
    }

    public void themChiTiet(ChiTietDonHang item) {
        if (item != null) {
            getDanhSachChiTiet().add(item);
        }
    }

    public double getPhanTramGiamGia() {
        return phanTramGiamGia;
    }

    public void setPhanTramGiamGia(double phanTramGiamGia) {
        this.phanTramGiamGia = Math.max(0, Math.min(100, phanTramGiamGia));
    }

    public String getPhuongThucTT() {
        return phuongThucTT != null ? phuongThucTT : "Cash";
    }

    public void setPhuongThucTT(String phuongThucTT) {
        this.phuongThucTT = phuongThucTT;
    }

    public String getKenhBan() {
        return kenhBan != null ? kenhBan : "POS";
    }

    public void setKenhBan(String kenhBan) {
        this.kenhBan = kenhBan;
    }

    public String getTrangThai() {
        return trangThai != null ? trangThai : "moi";
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }

    public String getGhiChu() {
        return ghiChu != null ? ghiChu : "";
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

    // === NGHIEP VU TINH TOAN TIEN TE & LOI NHUAN ===

    public double tinhTongTienTamTinh() {
        double sum = 0.0;
        for (ChiTietDonHang item : getDanhSachChiTiet()) {
            sum += item.tinhThanhTien();
        }
        return sum;
    }

    public double tinhTienGiamGia() {
        return Math.round(tinhTongTienTamTinh() * (phanTramGiamGia / 100.0));
    }

    public double tinhTongTienThanhToan() {
        return Math.max(0, tinhTongTienTamTinh() - tinhTienGiamGia());
    }

    public double tinhTongTien() {
        return tinhTongTienThanhToan();
    }

    public double tinhTongGiaVon() {
        double sum = 0.0;
        for (ChiTietDonHang item : getDanhSachChiTiet()) {
            sum += item.tinhTongGiaVon();
        }
        return sum;
    }

    public double tinhLoiNhuanGop() {
        return Math.max(0, tinhTongTienThanhToan() - tinhTongGiaVon());
    }

    public int tinhTongSoLuongKeycap() {
        int count = 0;
        for (ChiTietDonHang item : getDanhSachChiTiet()) {
            count += item.getSoLuong();
        }
        return count;
    }

    // === RANG BUOC NGHIEP VU KHOA TRANG THAI ===

    /**
     * Kiem tra xem don hang co dang o trang thai KHOA hay khong.
     * "giaohang" = Hoan tat / Done
     * "huy" = Da huy
     */
    public boolean isTrangThaiKhoa() {
        return "giaohang".equalsIgnoreCase(trangThai) || "huy".equalsIgnoreCase(trangThai);
    }

    /**
     * Cap nhat trang thai don hang voi su kiem soat nghiep vu nghiem ngat.
     */
    public boolean capNhatTrangThai(String trangThaiMoi, StringBuilder thongBaoLoi) {
        if (isTrangThaiKhoa()) {
            if (thongBaoLoi != null) {
                thongBaoLoi.append("RÀNG BUỘC NGHIỆP VỤ: Đơn hàng [").append(getMaDH())
                           .append("] đã ở trạng thái HOÀN TẤT hoặc ĐÃ HỦY nên KHÔNG ĐƯỢC PHÉP THAY ĐỔI!");
            }
            return false;
        }
        this.trangThai = trangThaiMoi;
        return true;
    }

    public String getTenTrangThaiTiengViet() {
        if ("giaohang".equalsIgnoreCase(trangThai)) return "Hoàn tất (Done) 🔒";
        if ("huy".equalsIgnoreCase(trangThai)) return "Đã hủy 🔒";
        if ("xuly".equalsIgnoreCase(trangThai)) return "Đang xử lý ⏳";
        return "Mới tiếp nhận 🆕";
    }

    public String getFormattedNgayLap() {
        return getNgayLap().format(DATE_FORMAT);
    }

    public String getFormattedTongTien() {
        return CURRENCY_FORMAT.format(tinhTongTienThanhToan());
    }

    public String getFormattedLoiNhuan() {
        return CURRENCY_FORMAT.format(tinhLoiNhuanGop());
    }
}
