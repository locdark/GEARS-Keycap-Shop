package com.gears.service;

import com.gears.dao.KhachHangDAO;
import com.gears.model.KhachHang;
import com.gears.patterns.observer.Subject;

import java.util.ArrayList;
import java.util.List;

/**
 * BUS / SERVICE: Quan ly Khach hang (CRM & Loyalty Coins).
 * Theo Module 4 trong so do BFD & Class Diagram.
 */
public class KhachHangService {
    private final KhachHangDAO khachHangDAO = new KhachHangDAO();

    public List<KhachHang> layTatCaKhachHang() {
        return khachHangDAO.getAll();
    }

    public KhachHang layTheoId(String id) {
        return khachHangDAO.getById(id);
    }

    public List<KhachHang> timKiem(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) return layTatCaKhachHang();
        String kw = keyword.toLowerCase().trim();
        List<KhachHang> list = new ArrayList<>();
        for (KhachHang kh : khachHangDAO.getAll()) {
            if (kh.getHoTen().toLowerCase().contains(kw) 
                    || kh.getId().toLowerCase().contains(kw)
                    || kh.getSoDienThoai().contains(kw)
                    || kh.getEmail().toLowerCase().contains(kw)) {
                list.add(kh);
            }
        }
        return list;
    }

    public boolean themKhachHang(KhachHang kh, StringBuilder errorMsg) {
        if (kh.getHoTen() == null || kh.getHoTen().trim().length() < 2) {
            if (errorMsg != null) errorMsg.append("Họ tên khách hàng phải từ 2 ký tự trở lên!");
            return false;
        }

        if (kh.getSoDienThoai() == null || kh.getSoDienThoai().trim().length() < 9) {
            if (errorMsg != null) errorMsg.append("Số điện thoại không hợp lệ!");
            return false;
        }

        boolean ok = khachHangDAO.insert(kh);
        if (ok) {
            Subject.getInstance().notifyObservers("CUSTOMER_ADDED", kh);
        }
        return ok;
    }

    public boolean capNhatKhachHang(KhachHang kh, StringBuilder errorMsg) {
        if (kh == null || kh.getId() == null) {
            if (errorMsg != null) errorMsg.append("Khách hàng không hợp lệ!");
            return false;
        }

        boolean ok = khachHangDAO.update(kh);
        if (ok) {
            Subject.getInstance().notifyObservers("CUSTOMER_UPDATED", kh);
        }
        return ok;
    }

    public boolean toggleKhoaTaiKhoan(String id) {
        KhachHang kh = khachHangDAO.getById(id);
        if (kh == null) return false;

        if (kh.isLocked()) {
            kh.moKhoaTaiKhoan();
        } else {
            kh.khoaTaiKhoan();
        }

        boolean ok = khachHangDAO.update(kh);
        if (ok) {
            Subject.getInstance().notifyObservers("CUSTOMER_STATUS_CHANGED", kh);
        }
        return ok;
    }

    public void tichLuyDiemSauDonHang(String idKH, double tongTien) {
        if (idKH == null || idKH.isEmpty()) return;
        KhachHang kh = khachHangDAO.getById(idKH);
        if (kh != null && !kh.isLocked()) {
            kh.congChiTieu(tongTien);
            khachHangDAO.update(kh);
            Subject.getInstance().notifyObservers("CUSTOMER_POINTS_UPDATED", kh);
        }
    }
}
