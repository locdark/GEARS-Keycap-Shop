package com.gears.patterns.factory;

import com.gears.model.*;

/**
 * DESIGN PATTERN: FACTORY METHOD
 * Nha may tong hop khoi tao cac Entity khac (DonHang, KhachHang, NhanVien, NhaCungCap) kem rang buoc hop le.
 */
public class EntityFactory {

    public static DonHang createDonHangPOS(String maDH, String tenKhach, String sdt, String maNV, String tenNV, String phuongThucTT) {
        DonHang dh = new DonHang(maDH, tenKhach, sdt, "Mua tại quầy POS", phuongThucTT, "POS");
        dh.setMaNV(maNV);
        dh.setTenNhanVien(tenNV);
        dh.setTrangThai("giaohang"); // POS ban tai quay mac dinh la Done (Hoan tat)
        return dh;
    }

    public static KhachHang createKhachHang(String id, String hoTen, String sdt, String email, String diaChi) {
        return new KhachHang(id, hoTen, sdt, email, diaChi);
    }

    public static NhanVien createNhanVien(String id, String hoTen, String sdt, String email, String chucVu, String username, String password) {
        return new NhanVien(id, hoTen, sdt, email, chucVu, username, password);
    }

    public static NhaCungCap createNhaCungCap(String maNCC, String tenNCC, String diaChi, String sdt, String email, String matHang, String ghiChu) {
        return new NhaCungCap(maNCC, tenNCC, diaChi, sdt, email, matHang, ghiChu);
    }
}
