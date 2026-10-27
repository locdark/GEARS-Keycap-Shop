package com.gears.model;

import java.io.Serializable;

/**
 * Lop ShopConfig - Cau hinh thong tin thuong hieu, nhan dien va tai khoan thanh toan SePay VietQR.
 * Theo Module 8 trong so do BFD.
 */
public class ShopConfig implements Serializable {
    private static final long serialVersionUID = 1L;

    private String tenCuaHang;
    private String slogan;
    private String hotline;
    private String diaChi;
    private String email;
    private String soTaiKhoan;
    private String tenNganHang;
    private String tenChuTaiKhoan;
    private String thongBaoBanner;

    public ShopConfig() {
        this.tenCuaHang = "GEARS Keycap Shop";
        this.slogan = "Chuyên Keycap Nghệ Thuật & Bàn Phím Cơ Chính Hãng";
        this.hotline = "1900.5301 - 0903.123.456";
        this.diaChi = "273 An Dương Vương, Phường 3, Quận 5, TP. Hồ Chí Minh";
        this.email = "support@gearskeycap.vn";
        this.soTaiKhoan = "0987654321";
        this.tenNganHang = "MBBank (Quân Đội)";
        this.tenChuTaiKhoan = "NGUYEN CONG DANH - GEARS SHOP";
        this.thongBaoBanner = "Khuyến mãi ra mắt: Giảm ngay 5% cho hóa đơn trên 1.000.000đ khi thanh toán VietQR!";
    }

    public String getTenCuaHang() {
        return tenCuaHang != null ? tenCuaHang : "GEARS Keycap Shop";
    }

    public void setTenCuaHang(String tenCuaHang) {
        this.tenCuaHang = tenCuaHang;
    }

    public String getSlogan() {
        return slogan != null ? slogan : "";
    }

    public void setSlogan(String slogan) {
        this.slogan = slogan;
    }

    public String getHotline() {
        return hotline != null ? hotline : "";
    }

    public void setHotline(String hotline) {
        this.hotline = hotline;
    }

    public String getDiaChi() {
        return diaChi != null ? diaChi : "";
    }

    public void setDiaChi(String diaChi) {
        this.diaChi = diaChi;
    }

    public String getEmail() {
        return email != null ? email : "";
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSoTaiKhoan() {
        return soTaiKhoan != null ? soTaiKhoan : "";
    }

    public void setSoTaiKhoan(String soTaiKhoan) {
        this.soTaiKhoan = soTaiKhoan;
    }

    public String getTenNganHang() {
        return tenNganHang != null ? tenNganHang : "";
    }

    public void setTenNganHang(String tenNganHang) {
        this.tenNganHang = tenNganHang;
    }

    public String getTenChuTaiKhoan() {
        return tenChuTaiKhoan != null ? tenChuTaiKhoan : "";
    }

    public void setTenChuTaiKhoan(String tenChuTaiKhoan) {
        this.tenChuTaiKhoan = tenChuTaiKhoan;
    }

    public String getThongBaoBanner() {
        return thongBaoBanner != null ? thongBaoBanner : "";
    }

    public void setThongBaoBanner(String thongBaoBanner) {
        this.thongBaoBanner = thongBaoBanner;
    }
}
