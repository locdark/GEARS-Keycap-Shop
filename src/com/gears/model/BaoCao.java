package com.gears.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Lop BaoCao (Report Entity) - Quan ly bao cao thong ke tai chinh, doanh thu, loi nhuan.
 * Theo Module 7 trong so do BFD & Class Diagram.
 */
public class BaoCao extends BaseEntity {
    private static final long serialVersionUID = 1L;

    private String maBC;
    private String tenBC;
    private String loaiBC; // "DoanhThu", "DoanhSo", "LoiNhuan"
    private LocalDateTime ngayTao;
    private String nguoiLap;
    private LocalDate tuNgay;
    private LocalDate denNgay;
    private double tongDoanhThu;
    private double tongLoiNhuan;
    private int tongSoLuongBan;
    private int tongSoDonHang;

    public BaoCao() {
        super();
        this.ngayTao = LocalDateTime.now();
        this.tuNgay = LocalDate.now().minusMonths(1);
        this.denNgay = LocalDate.now();
    }

    public BaoCao(String maBC, String tenBC, String loaiBC, String nguoiLap, LocalDate tuNgay, LocalDate denNgay) {
        super(maBC);
        this.maBC = maBC;
        this.tenBC = tenBC;
        this.loaiBC = loaiBC;
        this.nguoiLap = nguoiLap;
        this.tuNgay = tuNgay;
        this.denNgay = denNgay;
        this.ngayTao = LocalDateTime.now();
    }

    public String getMaBC() {
        return maBC != null ? maBC : (id != null ? id : "");
    }

    public void setMaBC(String maBC) {
        this.maBC = maBC;
        this.id = maBC;
    }

    public String getTenBC() {
        return tenBC != null ? tenBC : "";
    }

    public void setTenBC(String tenBC) {
        this.tenBC = tenBC;
    }

    public String getLoaiBC() {
        return loaiBC != null ? loaiBC : "DoanhThu";
    }

    public void setLoaiBC(String loaiBC) {
        this.loaiBC = loaiBC;
    }

    public LocalDateTime getNgayTao() {
        return ngayTao != null ? ngayTao : LocalDateTime.now();
    }

    public void setNgayTao(LocalDateTime ngayTao) {
        this.ngayTao = ngayTao;
    }

    public String getNguoiLap() {
        return nguoiLap != null ? nguoiLap : "Admin";
    }

    public void setNguoiLap(String nguoiLap) {
        this.nguoiLap = nguoiLap;
    }

    public LocalDate getTuNgay() {
        return tuNgay;
    }

    public void setTuNgay(LocalDate tuNgay) {
        this.tuNgay = tuNgay;
    }

    public LocalDate getDenNgay() {
        return denNgay;
    }

    public void setDenNgay(LocalDate denNgay) {
        this.denNgay = denNgay;
    }

    public double getTongDoanhThu() {
        return tongDoanhThu;
    }

    public void setTongDoanhThu(double tongDoanhThu) {
        this.tongDoanhThu = tongDoanhThu;
    }

    public double getTongLoiNhuan() {
        return tongLoiNhuan;
    }

    public void setTongLoiNhuan(double tongLoiNhuan) {
        this.tongLoiNhuan = tongLoiNhuan;
    }

    public int getTongSoLuongBan() {
        return tongSoLuongBan;
    }

    public void setTongSoLuongBan(int tongSoLuongBan) {
        this.tongSoLuongBan = tongSoLuongBan;
    }

    public int getTongSoDonHang() {
        return tongSoDonHang;
    }

    public void setTongSoDonHang(int tongSoDonHang) {
        this.tongSoDonHang = tongSoDonHang;
    }

    public String getFormattedNgayTao() {
        return getNgayTao().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
    }
}
