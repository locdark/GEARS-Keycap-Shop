package com.gears.patterns.facade;

import com.gears.model.*;
import com.gears.patterns.singleton.DatabaseContext;
import com.gears.patterns.singleton.SessionManager;
import com.gears.patterns.strategy.*;
import com.gears.service.*;

import java.io.File;
import java.util.List;
import java.util.Map;

/**
 * DESIGN PATTERN: MASTER FACADE
 * Cung cap mot diem truy cap cap cao tap trung (High-Level Gateway) cho toan bo tang Giao Dien Swing UI.
 * Che giau su phuc tap cua he thong Service, DAO, Entity va cac Design Pattern ben duoi.
 */
public class GearsShopFacade {
    private static GearsShopFacade instance;

    private final AuthService authService = new AuthService();
    private final SanPhamService sanPhamService = new SanPhamService();
    private final NhaCungCapService nhaCungCapService = new NhaCungCapService();
    private final KhachHangService khachHangService = new KhachHangService();
    private final NhanVienService nhanVienService = new NhanVienService();
    private final DonHangService donHangService = new DonHangService();
    private final BaoCaoService baoCaoService = new BaoCaoService();
    private final SessionManager sessionManager = SessionManager.getInstance();
    private final DatabaseContext dbContext = DatabaseContext.getInstance();

    private GearsShopFacade() {}

    public static synchronized GearsShopFacade getInstance() {
        if (instance == null) {
            instance = new GearsShopFacade();
        }
        return instance;
    }

    // === AUTHENTICATION ===
    public NhanVien login(String username, String password, StringBuilder errorMsg) {
        return authService.dangNhap(username, password, errorMsg);
    }

    public void logout() {
        authService.dangXuat();
    }

    public boolean isLoggedIn() {
        return sessionManager.isLoggedIn();
    }

    public NhanVien getCurrentUser() {
        return sessionManager.getCurrentUser();
    }

    public boolean isAdmin() {
        return sessionManager.isAdmin();
    }

    // === PRODUCT MANAGEMENT ===
    public List<SanPhamKeycap> getAllProducts() {
        return sanPhamService.layTatCaSanPham();
    }

    public SanPhamKeycap getProductById(int id) {
        return sanPhamService.layTheoId(id);
    }

    public List<SanPhamKeycap> searchProducts(String kw, String type, double min, double max) {
        return sanPhamService.timKiem(kw, type, min, max);
    }

    public boolean addProduct(SanPhamKeycap sp, StringBuilder errorMsg) {
        return sanPhamService.themSanPham(sp, errorMsg);
    }

    public boolean updateProduct(SanPhamKeycap sp, StringBuilder errorMsg) {
        return sanPhamService.capNhatSanPham(sp, errorMsg);
    }

    public boolean deleteProduct(int id, StringBuilder errorMsg) {
        return sanPhamService.xoaSanPham(id, errorMsg);
    }

    public boolean adjustStock(int id, int delta, StringBuilder errorMsg) {
        return sanPhamService.dieuChinhTonKho(id, delta, errorMsg);
    }

    // === SUPPLIER MANAGEMENT ===
    public List<NhaCungCap> getAllSuppliers() {
        return nhaCungCapService.layTatCaNCC();
    }

    public boolean addSupplier(NhaCungCap ncc, StringBuilder errorMsg) {
        return nhaCungCapService.themNCC(ncc, errorMsg);
    }

    public boolean updateSupplier(NhaCungCap ncc, StringBuilder errorMsg) {
        return nhaCungCapService.capNhatNCC(ncc, errorMsg);
    }

    public boolean deleteSupplier(String maNCC, StringBuilder errorMsg) {
        return nhaCungCapService.xoaNCC(maNCC, errorMsg);
    }

    public int getSupplierProductCount(String maNCC) {
        return nhaCungCapService.demSoSanPhamCungCap(maNCC);
    }

    // === CUSTOMER CRM ===
    public List<KhachHang> getAllCustomers() {
        return khachHangService.layTatCaKhachHang();
    }

    public List<KhachHang> searchCustomers(String kw) {
        return khachHangService.timKiem(kw);
    }

    public boolean addCustomer(KhachHang kh, StringBuilder errorMsg) {
        return khachHangService.themKhachHang(kh, errorMsg);
    }

    public boolean updateCustomer(KhachHang kh, StringBuilder errorMsg) {
        return khachHangService.capNhatKhachHang(kh, errorMsg);
    }

    public boolean toggleCustomerLock(String id) {
        return khachHangService.toggleKhoaTaiKhoan(id);
    }

    // === EMPLOYEE MANAGEMENT ===
    public List<NhanVien> getAllEmployees() {
        return nhanVienService.layTatCaNhanVien();
    }

    public boolean addEmployee(NhanVien nv, StringBuilder errorMsg) {
        return nhanVienService.themNhanVien(nv, errorMsg);
    }

    public boolean updateEmployee(NhanVien nv, StringBuilder errorMsg) {
        return nhanVienService.capNhatNhanVien(nv, errorMsg);
    }

    public boolean toggleEmployeeLock(String id, StringBuilder errorMsg) {
        return nhanVienService.toggleKhoaTaiKhoan(id, errorMsg);
    }

    public boolean assignEmployeeRole(String id, String role) {
        return nhanVienService.phanQuyen(id, role);
    }

    // === POS & ORDER MANAGEMENT ===
    public List<DonHang> getAllOrders() {
        return donHangService.layTatCaDonHang();
    }

    public List<DonHang> searchOrders(String kw, String status, String channel) {
        return donHangService.locDonHang(kw, status, channel);
    }

    public KetQuaThanhToan checkoutPOS(DonHang dh, double cashTendered, ChienLuocThanhToan strategy, StringBuilder errorMsg) {
        return donHangService.thanhToanPOS(dh, cashTendered, strategy, errorMsg);
    }

    public boolean updateOrderStatus(String maDH, String newStatus, StringBuilder errorMsg) {
        return donHangService.capNhatTrangThai(maDH, newStatus, errorMsg);
    }

    public boolean cancelOrder(String maDH, StringBuilder errorMsg) {
        return donHangService.huyDonHang(maDH, errorMsg);
    }

    // === REPORTS & METRICS ===
    public double getTotalRevenue() {
        return baoCaoService.tinhTongDoanhThu();
    }

    public double getTotalCost() {
        return baoCaoService.tinhTongGiaVon();
    }

    public double getTotalGrossProfit() {
        return baoCaoService.tinhTongLoiNhuanGop();
    }

    public int getTotalOrderCount() {
        return baoCaoService.tinhTongSoDonHang();
    }

    public int getTotalKeycapsSold() {
        return baoCaoService.tinhTongKeycapXuatKho();
    }

    public Map<String, Integer> getCategorySalesQuantity() {
        return baoCaoService.thongKeSoLuongTheoTheLoai();
    }

    public Map<String, Double> getCategoryRevenue() {
        return baoCaoService.thongKeDoanhThuTheoTheLoai();
    }

    public boolean exportFinancialReport(File file, StringBuilder errorMsg) {
        return baoCaoService.xuatBaoCaoRaFile(file, errorMsg);
    }

    // === CONFIGURATION ===
    public ShopConfig getShopConfig() {
        return dbContext.getShopConfig();
    }

    public void updateShopConfig(ShopConfig cfg) {
        dbContext.setShopConfig(cfg);
    }
}
