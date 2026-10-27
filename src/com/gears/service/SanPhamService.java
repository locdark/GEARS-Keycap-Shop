package com.gears.service;

import com.gears.dao.DonHangDAO;
import com.gears.dao.SanPhamDAO;
import com.gears.model.ChiTietDonHang;
import com.gears.model.DonHang;
import com.gears.model.SanPhamKeycap;
import com.gears.patterns.observer.Subject;

import java.util.ArrayList;
import java.util.List;

/**
 * BUS / SERVICE: Quan ly nghiep vu San pham Keycap.
 * Theo Module 5 trong so do BFD & Class Diagram.
 */
public class SanPhamService {
    private final SanPhamDAO sanPhamDAO = new SanPhamDAO();
    private final DonHangDAO donHangDAO = new DonHangDAO();

    public List<SanPhamKeycap> layTatCaSanPham() {
        return sanPhamDAO.getAll();
    }

    public SanPhamKeycap layTheoId(int id) {
        return sanPhamDAO.getById(id);
    }

    public List<SanPhamKeycap> timKiem(String keyword, String theLoai, double minPrice, double maxPrice) {
        List<SanPhamKeycap> all = sanPhamDAO.getAll();
        List<SanPhamKeycap> filtered = new ArrayList<>();

        String kw = (keyword != null) ? keyword.toLowerCase().trim() : "";

        for (SanPhamKeycap sp : all) {
            boolean matchKw = kw.isEmpty() || sp.getTenSP().toLowerCase().contains(kw) 
                    || String.valueOf(sp.getMaSP()).contains(kw)
                    || sp.getMoTa().toLowerCase().contains(kw);

            boolean matchType = (theLoai == null || theLoai.equalsIgnoreCase("Tất cả")) 
                    || sp.getTheLoai().equalsIgnoreCase(theLoai);

            boolean matchPrice = (minPrice <= 0 || sp.getGiaBan() >= minPrice) 
                    && (maxPrice <= 0 || sp.getGiaBan() <= maxPrice);

            if (matchKw && matchType && matchPrice) {
                filtered.add(sp);
            }
        }
        return filtered;
    }

    public boolean themSanPham(SanPhamKeycap sp, StringBuilder errorMsg) {
        if (sp.getTenSP() == null || sp.getTenSP().trim().length() < 3) {
            if (errorMsg != null) errorMsg.append("Tên sản phẩm phải có ít nhất 3 ký tự!");
            return false;
        }

        if (sp.getGiaBan() <= 0) {
            if (errorMsg != null) errorMsg.append("Giá bán phải lớn hơn 0 VNĐ!");
            return false;
        }

        if (sp.getGiaNhap() < 0) {
            if (errorMsg != null) errorMsg.append("Giá vốn nhập kho không được âm!");
            return false;
        }

        boolean ok = sanPhamDAO.insert(sp);
        if (ok) {
            Subject.getInstance().notifyObservers("PRODUCT_ADDED", sp);
        }
        return ok;
    }

    public boolean capNhatSanPham(SanPhamKeycap sp, StringBuilder errorMsg) {
        if (sp == null || sp.getMaSP() <= 0) {
            if (errorMsg != null) errorMsg.append("Mã sản phẩm không hợp lệ!");
            return false;
        }

        if (sp.getTenSP() == null || sp.getTenSP().trim().length() < 3) {
            if (errorMsg != null) errorMsg.append("Tên sản phẩm phải có ít nhất 3 ký tự!");
            return false;
        }

        boolean ok = sanPhamDAO.update(sp);
        if (ok) {
            Subject.getInstance().notifyObservers("PRODUCT_UPDATED", sp);
        }
        return ok;
    }

    /**
     * Xoa san pham: Kiem tra rang buoc toan ven du lieu.
     * Khong cho xoa san pham neu da tung co trong lich su don hang!
     */
    public boolean xoaSanPham(int maSP, StringBuilder errorMsg) {
        for (DonHang dh : donHangDAO.getAll()) {
            for (ChiTietDonHang ct : dh.getDanhSachChiTiet()) {
                if (ct.getMaSP() == maSP) {
                    if (errorMsg != null) {
                        errorMsg.append("RÀNG BUỘC TOÀN VẸN: Sản phẩm #").append(maSP)
                               .append(" đã phát sinh giao dịch trong đơn hàng [").append(dh.getMaDH())
                               .append("]. KHÔNG ĐƯỢC PHÉP XÓA để bảo toàn lịch sử bán hàng!");
                    }
                    return false;
                }
            }
        }

        boolean ok = sanPhamDAO.delete(maSP);
        if (ok) {
            Subject.getInstance().notifyObservers("PRODUCT_DELETED", maSP);
        }
        return ok;
    }

    /**
     * Dieu chinh nhanh so luong ton kho (+X hoac -X)
     */
    public boolean dieuChinhTonKho(int maSP, int delta, StringBuilder errorMsg) {
        SanPhamKeycap sp = sanPhamDAO.getById(maSP);
        if (sp == null) {
            if (errorMsg != null) errorMsg.append("Không tìm thấy sản phẩm!");
            return false;
        }

        if (delta < 0 && sp.getSoLuongTon() + delta < 0) {
            if (errorMsg != null) errorMsg.append("Tồn kho hiện tại (" + sp.getSoLuongTon() + ") không đủ để trừ " + Math.abs(delta) + "!");
            return false;
        }

        sp.setSoLuongTon(sp.getSoLuongTon() + delta);
        sanPhamDAO.update(sp);
        Subject.getInstance().notifyObservers("STOCK_CHANGED", sp);
        return true;
    }
}
