package com.gears.service;

import com.gears.dao.DonHangDAO;
import com.gears.dao.SanPhamDAO;
import com.gears.model.ChiTietDonHang;
import com.gears.model.DonHang;
import com.gears.model.SanPhamKeycap;
import com.gears.patterns.observer.Subject;
import com.gears.patterns.strategy.ChienLuocThanhToan;
import com.gears.patterns.strategy.KetQuaThanhToan;

import java.util.ArrayList;
import java.util.List;

/**
 * BUS / SERVICE: Quan ly Don hang & Diem ban le POS.
 * Theo Module 3 trong so do BFD & Class Diagram.
 * 
 * RANG BUOC NGHIEP VU PTTKHDT COT LOI:
 * 1. Khong cho phep sua don hang khi trang thai da la HOAN TAT (giaohang / Done) hoac DA HUY (huy).
 * 2. Tu dong tru ton kho khi ban hang tai quay POS.
 * 3. Tu dong hoan tra ton kho khi huy don hang dang o trang thai 'moi' hoac 'xuly'.
 */
public class DonHangService {
    private final DonHangDAO donHangDAO = new DonHangDAO();
    private final SanPhamDAO sanPhamDAO = new SanPhamDAO();
    private final KhachHangService khachHangService = new KhachHangService();

    public List<DonHang> layTatCaDonHang() {
        return donHangDAO.getAll();
    }

    public DonHang layTheoMa(String maDH) {
        return donHangDAO.getById(maDH);
    }

    public List<DonHang> locDonHang(String keyword, String trangThai, String kenhBan) {
        List<DonHang> list = new ArrayList<>();
        String kw = (keyword != null) ? keyword.toLowerCase().trim() : "";

        for (DonHang dh : donHangDAO.getAll()) {
            boolean matchKw = kw.isEmpty() 
                    || dh.getMaDH().toLowerCase().contains(kw)
                    || dh.getTenKhachHang().toLowerCase().contains(kw)
                    || dh.getSoDienThoai().contains(kw);

            boolean matchStatus = (trangThai == null || trangThai.equalsIgnoreCase("Tất cả")) 
                    || dh.getTrangThai().equalsIgnoreCase(trangThai);

            boolean matchChannel = (kenhBan == null || kenhBan.equalsIgnoreCase("Tất cả")) 
                    || dh.getKenhBan().equalsIgnoreCase(kenhBan);

            if (matchKw && matchStatus && matchChannel) {
                list.add(dh);
            }
        }
        return list;
    }

    /**
     * Xu ly tao va thanh toan don hang ban le tai quay POS
     */
    public KetQuaThanhToan thanhToanPOS(DonHang dh, double tienDua, ChienLuocThanhToan chienLuoc, StringBuilder errorMsg) {
        if (dh.getDanhSachChiTiet().isEmpty()) {
            if (errorMsg != null) errorMsg.append("Giỏ hàng POS đang trống! Vui lòng chọn sản phẩm.");
            return null;
        }

        // 1. Kiem tra so luong ton kho kha dung cho tat ca mat hang
        for (ChiTietDonHang item : dh.getDanhSachChiTiet()) {
            SanPhamKeycap sp = sanPhamDAO.getById(item.getMaSP());
            if (sp == null) {
                if (errorMsg != null) errorMsg.append("Sản phẩm [").append(item.getTenSP()).append("] không tồn tại!");
                return null;
            }
            if (!sp.isConHang(item.getSoLuong())) {
                if (errorMsg != null) {
                    errorMsg.append("Sản phẩm [").append(sp.getTenSP())
                           .append("] không đủ hàng trong kho! Tồn hiện tại: ").append(sp.getSoLuongTon())
                           .append(", yêu cầu: ").append(item.getSoLuong());
                }
                return null;
            }
        }

        // 2. Thuc hien chien luoc thanh toan da hinh (Strategy Pattern)
        KetQuaThanhToan ketQua = chienLuoc.xuLyThanhToan(dh, tienDua);
        if (!ketQua.isThanhCong()) {
            if (errorMsg != null) errorMsg.append(ketQua.getThongDiep());
            return ketQua;
        }

        // 3. Thanh toan thanh cong: Tru so luong ton kho
        for (ChiTietDonHang item : dh.getDanhSachChiTiet()) {
            SanPhamKeycap sp = sanPhamDAO.getById(item.getMaSP());
            if (sp != null) {
                sp.xuatKho(item.getSoLuong());
                sanPhamDAO.update(sp);
            }
        }

        // 4. Luu don hang vao CSDL voi trang thai HOAN TAT (giaohang / Done)
        dh.setTrangThai("giaohang");
        dh.setPhuongThucTT(chienLuoc.getTenPhuongThuc());
        donHangDAO.insert(dh);

        // 5. Tich luy diem thuong cho khach hang neu la thanh vien
        if (dh.getMaKH() != null && !dh.getMaKH().isEmpty()) {
            khachHangService.tichLuyDiemSauDonHang(dh.getMaKH(), dh.tinhTongTienThanhToan());
        }

        // 6. Thong bao den cac Observer
        Subject.getInstance().notifyObservers("ORDER_CREATED", dh);
        Subject.getInstance().notifyObservers("STOCK_CHANGED", null);

        return ketQua;
    }

    /**
     * Cap nhat trang thai don hang voi RANG BUOC NGHIEP VU KHOA CHAT:
     * Neu don da o trang thai "giaohang" (Hoan tat) hoac "huy", TU CHOI THAY DOI!
     */
    public boolean capNhatTrangThai(String maDH, String trangThaiMoi, StringBuilder errorMsg) {
        DonHang dh = donHangDAO.getById(maDH);
        if (dh == null) {
            if (errorMsg != null) errorMsg.append("Không tìm thấy đơn hàng #").append(maDH);
            return false;
        }

        // Kiem tra rang buoc khoa trang thai
        if (dh.isTrangThaiKhoa()) {
            if (errorMsg != null) {
                errorMsg.append("LỖI RÀNG BUỘC NGHIỆP VỤ: Đơn hàng [").append(maDH)
                       .append("] hiện đang ở trạng thái CỐ ĐỊNH (")
                       .append(dh.getTenTrangThaiTiengViet())
                       .append("). Hệ thống KHÔNG CHO PHÉP chỉnh sửa trạng thái nữa!");
            }
            return false;
        }

        // Neu chuyen sang "huy", tu dong phuc hoi lai so luong ton kho
        if ("huy".equalsIgnoreCase(trangThaiMoi)) {
            for (ChiTietDonHang item : dh.getDanhSachChiTiet()) {
                SanPhamKeycap sp = sanPhamDAO.getById(item.getMaSP());
                if (sp != null) {
                    sp.nhapKho(item.getSoLuong());
                    sanPhamDAO.update(sp);
                }
            }
            Subject.getInstance().notifyObservers("STOCK_CHANGED", null);
        }

        dh.setTrangThai(trangThaiMoi);
        boolean ok = donHangDAO.update(dh);
        if (ok) {
            Subject.getInstance().notifyObservers("ORDER_STATUS_CHANGED", dh);
        }
        return ok;
    }

    /**
     * Huy don hang: Chi duoc huy khi don o trang thai 'moi' hoac 'xuly'.
     */
    public boolean huyDonHang(String maDH, StringBuilder errorMsg) {
        return capNhatTrangThai(maDH, "huy", errorMsg);
    }
}
