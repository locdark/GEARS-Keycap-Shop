package com.gears.patterns.strategy;

import com.gears.model.DonHang;
import com.gears.patterns.singleton.DatabaseContext;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * STRATEGY 2: Thanh toan SePay VietQR (Chuyen khoan ngan hang tu dong Napas 24/7).
 * Tu dong sinh ma QR chuyen khoan voi so tien, noi dung ma don hang va tai khoan cua hang.
 */
public class ThanhToanVietQR implements ChienLuocThanhToan {

    private String nganHang;
    private String soTaiKhoan;
    private String tenChuTaiKhoan;

    public ThanhToanVietQR() {
        var cfg = DatabaseContext.getInstance().getShopConfig();
        this.nganHang = "MB";
        this.soTaiKhoan = cfg.getSoTaiKhoan();
        this.tenChuTaiKhoan = cfg.getTenChuTaiKhoan();
    }

    public ThanhToanVietQR(String nganHang, String soTaiKhoan, String tenChuTaiKhoan) {
        this.nganHang = nganHang;
        this.soTaiKhoan = soTaiKhoan;
        this.tenChuTaiKhoan = tenChuTaiKhoan;
    }

    public String sinhQrUrl(DonHang donHang) {
        double tongTien = donHang.tinhTongTienThanhToan();
        String noiDung = donHang.getMaDH();
        String encodedName = "";
        try {
            encodedName = URLEncoder.encode(tenChuTaiKhoan, StandardCharsets.UTF_8.toString());
        } catch (Exception ignored) {}

        return String.format("https://img.vietqr.io/image/%s-%s-compact2.png?amount=%.0f&addInfo=%s&accountName=%s",
                nganHang, soTaiKhoan, tongTien, noiDung, encodedName);
    }

    @Override
    public KetQuaThanhToan xuLyThanhToan(DonHang donHang, double tienDua) {
        double tongTien = donHang.tinhTongTienThanhToan();
        String maGD = "VQR-" + System.currentTimeMillis() % 1000000;
        String qrUrl = sinhQrUrl(donHang);

        return new KetQuaThanhToan(
            true, 
            getTenPhuongThuc(), 
            maGD, 
            tongTien, 
            tongTien, 
            0, 
            qrUrl, 
            "Khớp lệnh SePay VietQR Napas 24/7 thành công qua STK: " + soTaiKhoan + " (" + nganHang + ")!"
        );
    }

    @Override
    public String getTenPhuongThuc() {
        return "SePay VietQR (Chuyển khoản)";
    }
}
