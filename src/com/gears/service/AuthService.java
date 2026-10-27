package com.gears.service;

import com.gears.dao.NhanVienDAO;
import com.gears.model.NhanVien;
import com.gears.patterns.singleton.SessionManager;

/**
 * BUS / SERVICE: Phan he Dang nhap & Xac thuc bao mat.
 * Tuan thu quy chuan an toan mat khau (>=8 ky tu, chu in hoa, ky tu dac biet).
 * Theo Module 1 trong so do BFD & Class Diagram.
 */
public class AuthService {
    private final NhanVienDAO nhanVienDAO = new NhanVienDAO();

    /**
     * Kiem tra do phuc tap va tieu chuan an toan cua mat khau.
     */
    public boolean kiemTraMatKhauBaoMat(String password, StringBuilder errorMsg) {
        if (password == null || password.length() < 8) {
            if (errorMsg != null) errorMsg.append("Mật khẩu phải có tối thiểu 8 ký tự!");
            return false;
        }

        boolean hasUpper = false;
        boolean hasSpecial = false;
        String specialChars = "!@#$%^&*()-_+=<>?/{}~|";

        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            if (specialChars.indexOf(c) >= 0) hasSpecial = true;
        }

        if (!hasUpper) {
            if (errorMsg != null) errorMsg.append("Mật khẩu phải chứa ít nhất 1 chữ IN HOA!");
            return false;
        }

        if (!hasSpecial) {
            if (errorMsg != null) errorMsg.append("Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (VD: @, #, $, %...)!");
            return false;
        }

        return true;
    }

    /**
     * Dang nhap vao he thong voi username va password
     */
    public NhanVien dangNhap(String username, String password, StringBuilder errorMsg) {
        if (username == null || username.trim().isEmpty()) {
            if (errorMsg != null) errorMsg.append("Vui lòng nhập tên đăng nhập!");
            return null;
        }

        if (password == null || password.trim().isEmpty()) {
            if (errorMsg != null) errorMsg.append("Vui lòng nhập mật khẩu!");
            return null;
        }

        NhanVien nv = nhanVienDAO.getByUsername(username);
        if (nv == null) {
            if (errorMsg != null) errorMsg.append("Tài khoản không tồn tại trên hệ thống!");
            return null;
        }

        if (nv.isLocked()) {
            if (errorMsg != null) errorMsg.append("Tài khoản này hiện đang BỊ KHÓA truy cập. Vui lòng liên hệ Admin!");
            return null;
        }

        if (!password.equals(nv.getPassword())) {
            if (errorMsg != null) errorMsg.append("Mật khẩu không chính xác!");
            return null;
        }

        SessionManager.getInstance().login(nv);
        return nv;
    }

    public void dangXuat() {
        SessionManager.getInstance().logout();
    }

    public boolean doiMatKhau(String username, String oldPass, String newPass, StringBuilder errorMsg) {
        NhanVien nv = nhanVienDAO.getByUsername(username);
        if (nv == null) {
            if (errorMsg != null) errorMsg.append("Không tìm thấy tài khoản!");
            return false;
        }

        if (!oldPass.equals(nv.getPassword())) {
            if (errorMsg != null) errorMsg.append("Mật khẩu hiện tại không đúng!");
            return false;
        }

        if (!kiemTraMatKhauBaoMat(newPass, errorMsg)) {
            return false;
        }

        nv.setPassword(newPass);
        nhanVienDAO.update(nv);
        return true;
    }
}
