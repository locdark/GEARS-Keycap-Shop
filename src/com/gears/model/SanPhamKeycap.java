package com.gears.model;

import java.text.DecimalFormat;

/**
 * Lop SanPhamKeycap - Dong goi toan bo thong tin san pham Keycap & Ban phim co.
 * Tich hop cac nghiep vu tinh toan gia von, gia ban, loi nhuan bien va xuat/nhap kho.
 * 
 * Dap ung Module 5 trong so do BFD & Class Diagram.
 */
public class SanPhamKeycap extends BaseEntity {
    private static final long serialVersionUID = 1L;

    private int maSP;
    private String tenSP;
    private String theLoai; // "Artisan", "Anime", "Pudding", "Cherry", "Other"
    private double giaNhap;  // Gia von nhap tu NCC
    private double giaBan;   // Gia niem yet ban cho khach
    private int soLuongTon;  // Ton kho kha dung
    private String hinhAnh;  // Duong dan file anh
    private String moTa;     // Chat lieu, profile, layout
    private String maNCC;    // Ma nha cung cap (Akko, Keychron, Jelly Key...)

    private static final DecimalFormat CURRENCY_FORMAT = new DecimalFormat("#,##0 'VNĐ'");

    public SanPhamKeycap() {
        super();
        this.theLoai = "Other";
        this.maNCC = "NCC01";
    }

    public SanPhamKeycap(int maSP, String tenSP, String theLoai, double giaNhap, double giaBan, int soLuongTon, String hinhAnh, String moTa, String maNCC) {
        super(String.valueOf(maSP));
        this.maSP = maSP;
        this.tenSP = tenSP;
        this.theLoai = theLoai != null ? theLoai : "Other";
        this.giaNhap = Math.max(0, giaNhap);
        this.giaBan = Math.max(0, giaBan);
        this.soLuongTon = Math.max(0, soLuongTon);
        this.hinhAnh = hinhAnh;
        this.moTa = moTa;
        this.maNCC = maNCC != null ? maNCC : "NCC01";
    }

    public int getMaSP() {
        return maSP;
    }

    public void setMaSP(int maSP) {
        this.maSP = maSP;
        this.id = String.valueOf(maSP);
    }

    public String getTenSP() {
        return tenSP != null ? tenSP : "";
    }

    public void setTenSP(String tenSP) {
        if (tenSP != null && tenSP.trim().length() >= 2) {
            this.tenSP = tenSP.trim();
        }
    }

    public String getTheLoai() {
        return theLoai != null ? theLoai : "Other";
    }

    public void setTheLoai(String theLoai) {
        this.theLoai = theLoai != null ? theLoai : "Other";
    }

    public double getGiaNhap() {
        return giaNhap;
    }

    public void setGiaNhap(double giaNhap) {
        this.giaNhap = Math.max(0, giaNhap);
    }

    public double getGiaBan() {
        return giaBan;
    }

    public void setGiaBan(double giaBan) {
        this.giaBan = Math.max(0, giaBan);
    }

    public int getSoLuongTon() {
        return soLuongTon;
    }

    public void setSoLuongTon(int soLuongTon) {
        this.soLuongTon = Math.max(0, soLuongTon);
    }

    public String getHinhAnh() {
        return hinhAnh != null ? hinhAnh : "./assets/img/ShortCut_Icon.png";
    }

    public void setHinhAnh(String hinhAnh) {
        this.hinhAnh = hinhAnh;
    }

    public String getMoTa() {
        return moTa != null ? moTa : "";
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }

    public String getMaNCC() {
        return maNCC != null ? maNCC : "NCC01";
    }

    public void setMaNCC(String maNCC) {
        this.maNCC = maNCC;
    }

    // === NGHIEP VU HUONG DOI TUONG (OOP BUSINESS LOGIC) ===

    /**
     * Tinh loi nhuan don vi = Gia ban - Gia nhap
     */
    public double tinhLoiNhuanDonVi() {
        return Math.max(0, giaBan - giaNhap);
    }

    /**
     * Tinh ti le loi nhuan bien (%)
     */
    public double tinhTiLeLoiNhuan() {
        if (giaBan <= 0) return 0.0;
        return (tinhLoiNhuanDonVi() / giaBan) * 100.0;
    }

    /**
     * Kiem tra con du hang trong kho hay khong
     */
    public boolean isConHang(int soLuongYeuCau) {
        return soLuongTon >= soLuongYeuCau && soLuongYeuCau > 0;
    }

    /**
     * Nhap them hang vao kho (+X)
     */
    public boolean nhapKho(int soLuong) {
        if (soLuong > 0) {
            this.soLuongTon += soLuong;
            return true;
        }
        return false;
    }

    /**
     * Xuat hang khoi kho (-X)
     */
    public boolean xuatKho(int soLuong) {
        if (soLuong > 0 && this.soLuongTon >= soLuong) {
            this.soLuongTon -= soLuong;
            return true;
        }
        return false;
    }

    public String getFormattedGiaBan() {
        return CURRENCY_FORMAT.format(giaBan);
    }

    public String getFormattedGiaNhap() {
        return CURRENCY_FORMAT.format(giaNhap);
    }

    public String getFormattedLoiNhuan() {
        return CURRENCY_FORMAT.format(tinhLoiNhuanDonVi());
    }

    @Override
    public String toString() {
        return tenSP + " - " + getFormattedGiaBan() + " (Tồn: " + soLuongTon + ")";
    }
}
