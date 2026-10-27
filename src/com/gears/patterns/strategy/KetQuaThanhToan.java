package com.gears.patterns.strategy;

import java.text.DecimalFormat;

/**
 * Doi tuong ket qua tra ve sau khi thuc hien Chien luoc thanh toan.
 */
public class KetQuaThanhToan {
    private boolean thanhCong;
    private String phuongThuc;
    private String maGiaoDich;
    private double tongTien;
    private double tienKhachDua;
    private double tienThoi;
    private String qrUrl;
    private String thongDiep;

    private static final DecimalFormat CURRENCY_FORMAT = new DecimalFormat("#,##0 'VNĐ'");

    public KetQuaThanhToan(boolean thanhCong, String phuongThuc, String maGiaoDich, double tongTien, double tienKhachDua, double tienThoi, String qrUrl, String thongDiep) {
        this.thanhCong = thanhCong;
        this.phuongThuc = phuongThuc;
        this.maGiaoDich = maGiaoDich;
        this.tongTien = tongTien;
        this.tienKhachDua = tienKhachDua;
        this.tienThoi = tienThoi;
        this.qrUrl = qrUrl;
        this.thongDiep = thongDiep;
    }

    public boolean isThanhCong() { return thanhCong; }
    public String getPhuongThuc() { return phuongThuc; }
    public String getMaGiaoDich() { return maGiaoDich; }
    public double getTongTien() { return tongTien; }
    public double getTienKhachDua() { return tienKhachDua; }
    public double getTienThoi() { return tienThoi; }
    public String getQrUrl() { return qrUrl; }
    public String getThongDiep() { return thongDiep; }

    public String getFormattedTienThoi() {
        return CURRENCY_FORMAT.format(tienThoi);
    }
}
