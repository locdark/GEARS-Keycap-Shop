package com.gears.patterns.builder;

import com.gears.model.ChiTietDonHang;
import com.gears.model.DonHang;
import com.gears.model.ShopConfig;
import com.gears.patterns.singleton.DatabaseContext;

import java.text.DecimalFormat;
import java.time.format.DateTimeFormatter;

/**
 * DESIGN PATTERN: BUILDER
 * Xay dung mau hoa don ban le chuyen nghiep de xem truoc va in an (Receipt / Invoice Builder).
 */
public class InvoiceBuilder {
    private final DonHang donHang;
    private final ShopConfig config;
    private boolean includeHeader = true;
    private boolean includeFooter = true;
    private boolean includeBarcode = true;

    private static final DecimalFormat CURRENCY = new DecimalFormat("#,##0 'VNĐ'");
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    public InvoiceBuilder(DonHang donHang) {
        this.donHang = donHang;
        this.config = DatabaseContext.getInstance().getShopConfig();
    }

    public InvoiceBuilder withHeader(boolean val) {
        this.includeHeader = val;
        return this;
    }

    public InvoiceBuilder withFooter(boolean val) {
        this.includeFooter = val;
        return this;
    }

    public InvoiceBuilder withBarcode(boolean val) {
        this.includeBarcode = val;
        return this;
    }

    public String buildPlainText() {
        StringBuilder sb = new StringBuilder();
        String line = "--------------------------------------------------------\n";
        String doubleLine = "========================================================\n";

        if (includeHeader) {
            sb.append(doubleLine);
            sb.append(centerText(config.getTenCuaHang().toUpperCase(), 56)).append("\n");
            sb.append(centerText(config.getSlogan(), 56)).append("\n");
            sb.append(centerText(config.getDiaChi(), 56)).append("\n");
            sb.append(centerText("Hotline: " + config.getHotline(), 56)).append("\n");
            sb.append(doubleLine);
            sb.append(centerText("HÓA ĐƠN BÁN LẺ KEYCAP & BÀN PHÍM CƠ", 56)).append("\n");
            sb.append(doubleLine);
        }

        sb.append(String.format("Mã đơn: %-20s Ngày: %s\n", donHang.getMaDH(), donHang.getNgayLap().format(DATE_FMT)));
        sb.append(String.format("Khách hàng: %-18s SĐT: %s\n", donHang.getTenKhachHang(), donHang.getSoDienThoai()));
        sb.append(String.format("Thu ngân: %-20s Kênh: %s\n", donHang.getTenNhanVien(), donHang.getKenhBan()));
        sb.append(String.format("Phương thức: %-17s Trạng thái: %s\n", donHang.getPhuongThucTT(), donHang.getTenTrangThaiTiengViet()));
        sb.append(line);

        sb.append(String.format("%-26s %4s %11s %11s\n", "Tên Sản Phẩm", "SL", "Đơn Giá", "Thành Tiền"));
        sb.append(line);

        for (ChiTietDonHang item : donHang.getDanhSachChiTiet()) {
            String name = item.getTenSP();
            if (name.length() > 25) name = name.substring(0, 22) + "...";
            sb.append(String.format("%-26s %4d %11s %11s\n", 
                    name, item.getSoLuong(), 
                    CURRENCY.format(item.getDonGia()), 
                    CURRENCY.format(item.tinhThanhTien())));
        }
        sb.append(line);

        sb.append(String.format("%-35s %19s\n", "Tổng tiền hàng:", CURRENCY.format(donHang.tinhTongTienTamTinh())));
        if (donHang.getPhanTramGiamGia() > 0) {
            sb.append(String.format("%-35s -%18s\n", 
                    "Chiết khấu (" + String.format("%.0f%%", donHang.getPhanTramGiamGia()) + "):", 
                    CURRENCY.format(donHang.tinhTienGiamGia())));
        }
        sb.append(doubleLine);
        sb.append(String.format("%-32s %22s\n", "TỔNG CỘNG THANH TOÁN:", CURRENCY.format(donHang.tinhTongTienThanhToan())));
        sb.append(doubleLine);

        if (includeFooter) {
            sb.append(centerText("CẢM ƠN QUÝ KHÁCH & HẸN GẶP LẠI!", 56)).append("\n");
            sb.append(centerText("Sản phẩm Keycap & Switch được bảo hành 12 tháng", 56)).append("\n");
            sb.append(centerText("Website: https://gearskeycap.vn", 56)).append("\n");
            if (includeBarcode) {
                sb.append(centerText("||| | ||||| || |||| |||| |||| ||| ||||", 56)).append("\n");
                sb.append(centerText("*" + donHang.getMaDH() + "*", 56)).append("\n");
            }
            sb.append(doubleLine);
        }

        return sb.toString();
    }

    private String centerText(String text, int width) {
        if (text == null) return "";
        if (text.length() >= width) return text;
        int left = (width - text.length()) / 2;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < left; i++) sb.append(" ");
        sb.append(text);
        return sb.toString();
    }
}
