package com.gears.service;

import com.gears.dao.NhanVienDAO;
import com.gears.model.NhanVien;
import com.gears.patterns.observer.Subject;

import java.util.ArrayList;
import java.util.List;

/**
 * BUS / SERVICE: Quan ly Nhan vien & Phan quyen tai khoan (Admin vs Thu ngan POS).
 * Theo Module 6 trong so do BFD & Class Diagram.
 */
public class NhanVienService {
    private final NhanVienDAO nhanVienDAO = new NhanVienDAO();
    private final AuthService authService = new AuthService();

    public List<NhanVien> layTatCaNhanVien() {
        return nhanVienDAO.getAll();
    }

    public NhanVien layTheoId(String id) {
        return nhanVienDAO.getById(id);
    }

    public List<NhanVien> timKiem(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) return layTatCaNhanVien();
        String kw = keyword.toLowerCase().trim();
        List<NhanVien> list = new ArrayList<>();
        for (NhanVien nv : nhanVienDAO.getAll()) {
            if (nv.getHoTen().toLowerCase().contains(kw) 
                    || nv.getId().toLowerCase().contains(kw)
                    || nv.getUsername().toLowerCase().contains(kw)
                    || nv.getSoDienThoai().contains(kw)
                    || nv.getEmail().toLowerCase().contains(kw)) {
                list.add(nv);
            }
        }
        return list;
    }

    public boolean themNhanVien(NhanVien nv, StringBuilder errorMsg) {
        if (nv.getHoTen() == null || nv.getHoTen().trim().length() < 2) {
            if (errorMsg != null) errorMsg.append("Họ tên nhân viên không hợp lệ!");
            return false;
        }

        if (nv.getUsername() == null || nv.getUsername().trim().length() < 3) {
            if (errorMsg != null) errorMsg.append("Tên đăng nhập phải có ít nhất 3 ký tự!");
            return false;
        }

        if (nhanVienDAO.getByUsername(nv.getUsername()) != null) {
            if (errorMsg != null) errorMsg.append("Tên đăng nhập '" + nv.getUsername() + "' đã tồn tại!");
            return false;
        }

        if (!authService.kiemTraMatKhauBaoMat(nv.getPassword(), errorMsg)) {
            return false;
        }

        boolean ok = nhanVienDAO.insert(nv);
        if (ok) {
            Subject.getInstance().notifyObservers("EMPLOYEE_ADDED", nv);
        }
        return ok;
    }

    public boolean capNhatNhanVien(NhanVien nv, StringBuilder errorMsg) {
        if (nv == null || nv.getId() == null) {
            if (errorMsg != null) errorMsg.append("Nhân viên không hợp lệ!");
            return false;
        }

        boolean ok = nhanVienDAO.update(nv);
        if (ok) {
            Subject.getInstance().notifyObservers("EMPLOYEE_UPDATED", nv);
        }
        return ok;
    }

    public boolean toggleKhoaTaiKhoan(String id, StringBuilder errorMsg) {
        NhanVien nv = nhanVienDAO.getById(id);
        if (nv == null) return false;

        // Khong cho phep khoa tai khoan Admin goc "admin"
        if ("admin".equalsIgnoreCase(nv.getUsername())) {
            if (errorMsg != null) errorMsg.append("Không được phép khóa tài khoản Quản trị viên tối cao (Super Admin)!");
            return false;
        }

        if (nv.isLocked()) {
            nv.moKhoaTaiKhoan();
        } else {
            nv.khoaTaiKhoan();
        }

        boolean ok = nhanVienDAO.update(nv);
        if (ok) {
            Subject.getInstance().notifyObservers("EMPLOYEE_STATUS_CHANGED", nv);
        }
        return ok;
    }

    public boolean phanQuyen(String id, String role) {
        NhanVien nv = nhanVienDAO.getById(id);
        if (nv == null) return false;

        nv.setChucVu(role);
        boolean ok = nhanVienDAO.update(nv);
        if (ok) {
            Subject.getInstance().notifyObservers("EMPLOYEE_ROLE_CHANGED", nv);
        }
        return ok;
    }
}
