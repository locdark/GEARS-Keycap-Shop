package com.gears.model;

/**
 * Lop NhanVien (Employee) - Ke thua tu NguoiDung.
 * Quan ly tai khoan nhan su, phan quyen Quan tri vien (admin) vs Thu ngan POS (pos).
 */
public class NhanVien extends NguoiDung {
    private static final long serialVersionUID = 1L;

    private String chucVu; // "admin" (Quan ly) hoac "pos" (Thu ngan POS)
    private String username;
    private String password;
    private String ngayVaoLam;
    private String trangThai; // "active" hoac "locked"

    public NhanVien() {
        super();
        this.chucVu = "pos";
        this.trangThai = "active";
    }

    public NhanVien(String id, String hoTen, String soDienThoai, String email, String chucVu, String username, String password) {
        super(id, hoTen, soDienThoai, email);
        this.chucVu = chucVu != null ? chucVu.toLowerCase() : "pos";
        this.username = username;
        this.password = password;
        this.trangThai = "active";
        this.ngayVaoLam = java.time.LocalDate.now().toString();
    }

    public NhanVien(String id, String hoTen, String soDienThoai, String email, String chucVu, String username, String password, String ngayVaoLam, String trangThai) {
        super(id, hoTen, soDienThoai, email);
        this.chucVu = chucVu != null ? chucVu.toLowerCase() : "pos";
        this.username = username;
        this.password = password;
        this.ngayVaoLam = ngayVaoLam;
        this.trangThai = (trangThai != null && !trangThai.isEmpty()) ? trangThai : "active";
    }

    public String getChucVu() {
        return chucVu != null ? chucVu : "pos";
    }

    public void setChucVu(String chucVu) {
        this.chucVu = chucVu != null ? chucVu.toLowerCase() : "pos";
    }

    public String getUsername() {
        return username != null ? username : "";
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password != null ? password : "";
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNgayVaoLam() {
        return ngayVaoLam != null ? ngayVaoLam : "";
    }

    public void setNgayVaoLam(String ngayVaoLam) {
        this.ngayVaoLam = ngayVaoLam;
    }

    public String getTrangThai() {
        return trangThai != null ? trangThai : "active";
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }

    public boolean kiemTraQuyenAdmin() {
        return "admin".equalsIgnoreCase(this.chucVu);
    }

    public boolean isLocked() {
        return "locked".equalsIgnoreCase(this.trangThai);
    }

    public void khoaTaiKhoan() {
        this.trangThai = "locked";
    }

    public void moKhoaTaiKhoan() {
        this.trangThai = "active";
    }

    // Ghi de phuong thuc truu tuong (Polymorphism)
    @Override
    public String getVaiTro() {
        return kiemTraQuyenAdmin() ? "Quản Trị Viên / Quản Lý" : "Nhân Viên Thu Ngân POS";
    }

    @Override
    public String getRoleColorHex() {
        return kiemTraQuyenAdmin() ? "#E30019" : "#3B82F6"; // Red for Admin, Blue for Cashier
    }
}
