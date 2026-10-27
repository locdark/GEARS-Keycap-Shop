package com.gears.patterns.strategy;

import com.gears.model.DonHang;

/**
 * STRATEGY 1: Thanh toan Tien mat (Cash Payment).
 * Kiem tra so tien khach dua va tinh tien thua tra lai.
 */
public class ThanhToanTienMat implements ChienLuocThanhToan {

    @Override
    public KetQuaThanhToan xuLyThanhToan(DonHang donHang, double tienKhachDua) {
        double tongTien = donHang.tinhTongTienThanhToan();

        if (tienKhachDua < tongTien) {
            double thieu = tongTien - tienKhachDua;
            return new KetQuaThanhToan(
                false, 
                getTenPhuongThuc(), 
                null, 
                tongTien, 
                tienKhachDua, 
                0, 
                null, 
                "Tiền khách đưa không đủ! Còn thiếu " + String.format("%,.0f VNĐ", thieu)
            );
        }

        double tienThoi = tienKhachDua - tongTien;
        String maGD = "CASH-" + System.currentTimeMillis() % 1000000;

        return new KetQuaThanhToan(
            true, 
            getTenPhuongThuc(), 
            maGD, 
            tongTien, 
            tienKhachDua, 
            tienThoi, 
            null, 
            "Thanh toán tiền mặt thành công! Tiền thối lại cho khách: " + String.format("%,.0f VNĐ", tienThoi)
        );
    }

    @Override
    public String getTenPhuongThuc() {
        return "Tiền mặt (Cash)";
    }
}
