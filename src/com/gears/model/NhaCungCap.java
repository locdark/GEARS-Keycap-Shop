package com.gears.model;

/**
 * Lop NhaCungCap (Supplier) - Dai dien cho cac xuong va hang san xuat Keycap doi tac.
 * Theo so do thiet ke BFD Phan he 2 va ERD CSDL.
 */
public class NhaCungCap extends BaseEntity {
    private static final long serialVersionUID = 1L;

    private String maNCC;
    private String tenNCC;
    private String diaChi;
    private String sdt;
    private String email;
    private String matHangCungCap;
    private String ghiChu;

    public NhaCungCap() {
        super();
    }

    public NhaCungCap(String maNCC, String tenNCC, String diaChi, String sdt, String email, String matHangCungCap, String ghiChu) {
        super(maNCC);
        this.maNCC = maNCC;
        this.tenNCC = tenNCC;
        this.diaChi = diaChi;
        this.sdt = sdt;
        this.email = email;
        this.matHangCungCap = matHangCungCap;
        this.ghiChu = ghiChu;
    }

    public String getMaNCC() {
        return maNCC != null ? maNCC : (id != null ? id : "");
    }

    public void setMaNCC(String maNCC) {
        this.maNCC = maNCC;
        this.id = maNCC;
    }

    public String getTenNCC() {
        return tenNCC != null ? tenNCC : "";
    }

    public void setTenNCC(String tenNCC) {
        this.tenNCC = tenNCC;
    }

    public String getDiaChi() {
        return diaChi != null ? diaChi : "";
    }

    public void setDiaChi(String diaChi) {
        this.diaChi = diaChi;
    }

    public String getSdt() {
        return sdt != null ? sdt : "";
    }

    public void setSdt(String sdt) {
        this.sdt = sdt;
    }

    public String getEmail() {
        return email != null ? email : "";
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMatHangCungCap() {
        return matHangCungCap != null ? matHangCungCap : "";
    }

    public void setMatHangCungCap(String matHangCungCap) {
        this.matHangCungCap = matHangCungCap;
    }

    public String getGhiChu() {
        return ghiChu != null ? ghiChu : "";
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

    @Override
    public String toString() {
        return getTenNCC() + " (" + getMaNCC() + ")";
    }
}
