package com.gears.patterns.strategy;

import com.gears.model.DonHang;

/**
 * STRATEGY CONTEXT: Bo dieu huong Chien luoc thanh toan.
 * Cho phep hoan doi linh hoat giua cac phuong thuc thanh toan tai runtime.
 */
public class PaymentProcessor {
    private ChienLuocThanhToan chienLuoc;

    public PaymentProcessor() {
        this.chienLuoc = new ThanhToanTienMat();
    }

    public PaymentProcessor(ChienLuocThanhToan chienLuoc) {
        this.chienLuoc = chienLuoc;
    }

    public void setChienLuoc(ChienLuocThanhToan chienLuoc) {
        this.chienLuoc = chienLuoc;
    }

    public ChienLuocThanhToan getChienLuoc() {
        return chienLuoc;
    }

    public KetQuaThanhToan thucHienThanhToan(DonHang donHang, double tienDua) {
        if (chienLuoc == null) {
            chienLuoc = new ThanhToanTienMat();
        }
        return chienLuoc.xuLyThanhToan(donHang, tienDua);
    }
}
