package com.gears.patterns.strategy;

import com.gears.model.DonHang;

/**
 * STRATEGY 3: Thanh toan The ngan hang (Card POS Terminal).
 * Xy ly quet the tin dung/ghi no qua may POS Terminal tai quay.
 */
public class ThanhToanTheNganHang implements ChienLuocThanhToan {

    @Override
    public KetQuaThanhToan xuLyThanhToan(DonHang donHang, double tienDua) {
        double tongTien = donHang.tinhTongTienThanhToan();
        String maGD = "CARD-POS-" + System.currentTimeMillis() % 1000000;

        return new KetQuaThanhToan(
            true, 
            getTenPhuongThuc(), 
            maGD, 
            tongTien, 
            tongTien, 
            0, 
            null, 
            "Giao dịch quẹt thẻ thành công qua máy POS Terminal! Mã xác thực: " + maGD
        );
    }

    @Override
    public String getTenPhuongThuc() {
        return "Thẻ ngân hàng (POS Card)";
    }
}
