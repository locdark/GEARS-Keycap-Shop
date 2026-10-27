package com.gears.model;

/**
 * Lop truu tuong NguoiDung (User) - Lop cha dai dien cho nguoi dung trong he thong.
 * Hien thuc 4 dac trung OOP:
 * - Truu tuong hoa (Abstraction): Khong the khoi tao truc tiep lop NguoiDung
 * - Dong goi (Encapsulation): Cac truong du lieu private/protected kem Getter/Setter
 * - Ke thua (Inheritance): Duoc ke thua boi KhachHang va NhanVien
 * - Da hinh (Polymorphism): Phuong thuc truu tuong getVaiTro()
 */
public abstract class NguoiDung extends BaseEntity {
    private static final long serialVersionUID = 1L;

    protected String hoTen;
    protected String soDienThoai;
    protected String email;

    public NguoiDung() {
        super();
    }

    public NguoiDung(String id, String hoTen, String soDienThoai, String email) {
        super(id);
        this.hoTen = hoTen;
        this.soDienThoai = soDienThoai;
        this.email = email;
    }

    public String getHoTen() {
        return hoTen != null ? hoTen : "";
    }

    public void setHoTen(String hoTen) {
        if (hoTen != null && hoTen.trim().length() >= 2) {
            this.hoTen = hoTen.trim();
        }
    }

    public String getSoDienThoai() {
        return soDienThoai != null ? soDienThoai : "";
    }

    public void setSoDienThoai(String soDienThoai) {
        this.soDienThoai = soDienThoai != null ? soDienThoai.trim() : "";
    }

    public String getEmail() {
        return email != null ? email : "";
    }

    public void setEmail(String email) {
        this.email = email != null ? email.trim() : "";
    }

    /**
     * Phuong thuc truu tuong (Polymorphism):
     * Lop con KhachHang va NhanVien bat buoc phai ghi de (override) de tra ve vai tro rieng.
     */
    public abstract String getVaiTro();

    /**
     * Lay ma mau dai dien cho vai tro tren giao dien Swing (Hex color)
     */
    public abstract String getRoleColorHex();

    public String hienThiThongTin() {
        return "[" + getVaiTro() + "] " + getHoTen() + " - SĐT: " + getSoDienThoai();
    }
}
