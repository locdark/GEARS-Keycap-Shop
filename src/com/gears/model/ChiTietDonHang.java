package com.gears.model;

import java.io.Serializable;
import java.text.DecimalFormat;

/**
 * Lop ChiTietDonHang (Order Detail / Line Item).
 * Mo hinh hoa quan he Composition / Aggregation voi DonHang.
 */
public class ChiTietDonHang implements Serializable {
    private static final long serialVersionUID = 1L;

    private int maSP;
    private String tenSP;
    private int soLuong;
    private double donGia;      // Don gia ban
    private double donGiaNhap;  // Don gia von nhap

    private static final DecimalFormat CURRENCY_FORMAT = new DecimalFormat("#,##0 'VNĐ'");

    public ChiTietDonHang() {
        this.soLuong = 1;
    }

    public ChiTietDonHang(int maSP, String tenSP, int soLuong, double donGia, double donGiaNhap) {
        this.maSP = maSP;
        this.tenSP = tenSP;
        this.soLuong = Math.max(1, soLuong);
        this.donGia = Math.max(0, donGia);
        this.donGiaNhap = Math.max(0, donGiaNhap);
    }

    public int getMaSP() {
        return maSP;
    }

    public void setMaSP(int maSP) {
        this.maSP = maSP;
    }

    public String getTenSP() {
        return tenSP != null ? tenSP : "";
    }

    public void setTenSP(String tenSP) {
        this.tenSP = tenSP;
    }

    public int getSoLuong() {
        return soLuong;
    }

    public void setSoLuong(int soLuong) {
        this.soLuong = Math.max(1, soLuong);
    }

    public double getDonGia() {
        return donGia;
    }

    public void setDonGia(double donGia) {
        this.donGia = Math.max(0, donGia);
    }

    public double getDonGiaNhap() {
        return donGiaNhap;
    }

    public void setDonGiaNhap(double donGiaNhap) {
        this.donGiaNhap = Math.max(0, donGiaNhap);
    }

    // === NGHIEP VU HUONG DOI TUONG ===

    /**
     * Tinh thanh tien = So luong * Don gia ban
     */
    public double tinhThanhTien() {
        return soLuong * donGia;
    }

    /**
     * Tinh tong gia von = So luong * Don gia nhap
     */
    public double tinhTongGiaVon() {
        return soLuong * donGiaNhap;
    }

    /**
     * Tinh loi nhuan mon = Thanh tien - Tong gia von
     */
    public double tinhLoiNhuanMon() {
        return tinhThanhTien() - tinhTongGiaVon();
    }

    public String getFormattedDonGia() {
        return CURRENCY_FORMAT.format(donGia);
    }

    public String getFormattedThanhTien() {
        return CURRENCY_FORMAT.format(tinhThanhTien());
    }
}
