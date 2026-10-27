package com.gears.patterns.strategy;

import com.gears.model.DonHang;

/**
 * DESIGN PATTERN: STRATEGY
 * Giao dien Chien luoc thanh toan da hinh.
 * Cac lop con se dinh nghia thuat toan thanh toan rieng biet (Tien mat, VietQR, The ngan hang).
 */
public interface ChienLuocThanhToan {

    /**
     * Xu ly thanh toan cho don hang
     * @param donHang Don hang can thanh toan
     * @param tienDua So tien khach dua (dung cho tien mat)
     * @return Ket qua thanh toan chi tiet
     */
    KetQuaThanhToan xuLyThanhToan(DonHang donHang, double tienDua);

    String getTenPhuongThuc();
}
