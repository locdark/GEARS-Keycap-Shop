package com.gears.patterns.singleton;

import com.gears.model.NhanVien;

/**
 * DESIGN PATTERN: SINGLETON
 * Quan ly phien dang nhap (User Session) hien tai cua he thong.
 */
public class SessionManager {
    private static SessionManager instance;
    private NhanVien currentUser;

    private SessionManager() {}

    public static synchronized SessionManager getInstance() {
        if (instance == null) {
            instance = new SessionManager();
        }
        return instance;
    }

    public void login(NhanVien user) {
        this.currentUser = user;
    }

    public void logout() {
        this.currentUser = null;
    }

    public boolean isLoggedIn() {
        return currentUser != null;
    }

    public NhanVien getCurrentUser() {
        return currentUser;
    }

    public boolean isAdmin() {
        return currentUser != null && currentUser.kiemTraQuyenAdmin();
    }

    public String getCurrentUserName() {
        return currentUser != null ? currentUser.getHoTen() : "Khách";
    }

    public String getCurrentUserRole() {
        return currentUser != null ? currentUser.getVaiTro() : "Chưa đăng nhập";
    }
}
