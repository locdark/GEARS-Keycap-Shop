package com.gears.model;

/**
 * Lop KhachHang (Customer) - Ke thua tu NguoiDung.
 * Quan ly thong tin khach hang, dia chi giao hang, tich luy diem thuong Keycap Coins va phan hang.
 */
public class KhachHang extends NguoiDung {
    private static final long serialVersionUID = 1L;

    private String diaChi;
    private int diemTichLuy;
    private double tongChiTieu;
    private String trangThai; // "active" hoac "locked"

    public KhachHang() {
        super();
        this.diemTichLuy = 0;
        this.tongChiTieu = 0.0;
        this.trangThai = "active";
    }

    public KhachHang(String id, String hoTen, String soDienThoai, String email, String diaChi) {
        super(id, hoTen, soDienThoai, email);
        this.diaChi = diaChi;
        this.diemTichLuy = 0;
        this.tongChiTieu = 0.0;
        this.trangThai = "active";
    }

    public KhachHang(String id, String hoTen, String soDienThoai, String email, String diaChi, int diemTichLuy, double tongChiTieu, String trangThai) {
        super(id, hoTen, soDienThoai, email);
        this.diaChi = diaChi;
        this.diemTichLuy = diemTichLuy;
        this.tongChiTieu = tongChiTieu;
        this.trangThai = (trangThai != null && !trangThai.isEmpty()) ? trangThai : "active";
    }

    public String getDiaChi() {
        return diaChi != null ? diaChi : "";
    }

    public void setDiaChi(String diaChi) {
        this.diaChi = diaChi;
    }

    public int getDiemTichLuy() {
        return diemTichLuy;
    }

    public void setDiemTichLuy(int diemTichLuy) {
        this.diemTichLuy = Math.max(0, diemTichLuy);
    }

    public double getTongChiTieu() {
        return tongChiTieu;
    }

    public void setTongChiTieu(double tongChiTieu) {
        this.tongChiTieu = Math.max(0, tongChiTieu);
    }

    public String getTrangThai() {
        return trangThai != null ? trangThai : "active";
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }

    public void congDiem(int diem) {
        if (diem > 0) {
            this.diemTichLuy += diem;
        }
    }

    public void congChiTieu(double soTien) {
        if (soTien > 0) {
            this.tongChiTieu += soTien;
            // Tich luy 1 diem cho moi 10.000 VNĐ chi tieu
            congDiem((int) (soTien / 10000));
        }
    }

    public void khoaTaiKhoan() {
        this.trangThai = "locked";
    }

    public void moKhoaTaiKhoan() {
        this.trangThai = "active";
    }

    public boolean isLocked() {
        return "locked".equalsIgnoreCase(this.trangThai);
    }

    /**
     * Tinh toan hang thanh vien dua tren tong chi tieu & diem tich luy
     */
    public String getHangThanhVien() {
        if (diemTichLuy >= 1000 || tongChiTieu >= 15000000) {
            return "Kim Cương (Diamond)";
        } else if (diemTichLuy >= 500 || tongChiTieu >= 8000000) {
            return "Vàng (Gold)";
        } else if (diemTichLuy >= 200 || tongChiTieu >= 3000000) {
            return "Bạc (Silver)";
        } else {
            return "Thành Viên (Standard)";
        }
    }

    // Ghi de phuong thuc truu tuong (Polymorphism)
    @Override
    public String getVaiTro() {
        return "Khách Hàng Thành Viên";
    }

    @Override
    public String getRoleColorHex() {
        return "#10B981"; // Emerald green
    }
}
