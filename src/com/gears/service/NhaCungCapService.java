package com.gears.service;

import com.gears.dao.NhaCungCapDAO;
import com.gears.dao.SanPhamDAO;
import com.gears.model.NhaCungCap;
import com.gears.model.SanPhamKeycap;
import com.gears.patterns.observer.Subject;

import java.util.ArrayList;
import java.util.List;

/**
 * BUS / SERVICE: Quan ly Nha cung cap.
 * Theo Module 2 trong so do BFD & Class Diagram.
 */
public class NhaCungCapService {
    private final NhaCungCapDAO nccDAO = new NhaCungCapDAO();
    private final SanPhamDAO spDAO = new SanPhamDAO();

    public List<NhaCungCap> layTatCaNCC() {
        return nccDAO.getAll();
    }

    public NhaCungCap layTheoMa(String maNCC) {
        return nccDAO.getById(maNCC);
    }

    public List<NhaCungCap> timKiem(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) return layTatCaNCC();
        String kw = keyword.toLowerCase().trim();
        List<NhaCungCap> list = new ArrayList<>();
        for (NhaCungCap ncc : nccDAO.getAll()) {
            if (ncc.getTenNCC().toLowerCase().contains(kw) 
                    || ncc.getMaNCC().toLowerCase().contains(kw)
                    || ncc.getSdt().contains(kw)
                    || ncc.getEmail().toLowerCase().contains(kw)) {
                list.add(ncc);
            }
        }
        return list;
    }

    public boolean themNCC(NhaCungCap ncc, StringBuilder errorMsg) {
        if (ncc.getTenNCC() == null || ncc.getTenNCC().trim().length() < 3) {
            if (errorMsg != null) errorMsg.append("Tên nhà cung cấp phải có ít nhất 3 ký tự!");
            return false;
        }

        if (ncc.getSdt() == null || ncc.getSdt().trim().length() < 8) {
            if (errorMsg != null) errorMsg.append("Số điện thoại không hợp lệ!");
            return false;
        }

        boolean ok = nccDAO.insert(ncc);
        if (ok) {
            Subject.getInstance().notifyObservers("SUPPLIER_ADDED", ncc);
        }
        return ok;
    }

    public boolean capNhatNCC(NhaCungCap ncc, StringBuilder errorMsg) {
        if (ncc.getTenNCC() == null || ncc.getTenNCC().trim().length() < 3) {
            if (errorMsg != null) errorMsg.append("Tên nhà cung cấp phải có ít nhất 3 ký tự!");
            return false;
        }

        boolean ok = nccDAO.update(ncc);
        if (ok) {
            Subject.getInstance().notifyObservers("SUPPLIER_UPDATED", ncc);
        }
        return ok;
    }

    /**
     * Xoa Nha Cung Cap: Kiem tra rang buoc toan ven khoa ngoai.
     * Khong duoc phep xoa neu con san pham nao dang thuoc NCC nay!
     */
    public boolean xoaNCC(String maNCC, StringBuilder errorMsg) {
        int countSP = 0;
        for (SanPhamKeycap sp : spDAO.getAll()) {
            if (maNCC.equalsIgnoreCase(sp.getMaNCC())) {
                countSP++;
            }
        }

        if (countSP > 0) {
            if (errorMsg != null) {
                errorMsg.append("RÀNG BUỘC TOÀN VẸN KHÓA NGOẠI: Nhà cung cấp [").append(maNCC)
                       .append("] hiện đang cung cấp ").append(countSP)
                       .append(" sản phẩm trong kho. Bạn phải chuyển hoặc xóa các sản phẩm này trước!");
            }
            return false;
        }

        boolean ok = nccDAO.delete(maNCC);
        if (ok) {
            Subject.getInstance().notifyObservers("SUPPLIER_DELETED", maNCC);
        }
        return ok;
    }

    public int demSoSanPhamCungCap(String maNCC) {
        int count = 0;
        for (SanPhamKeycap sp : spDAO.getAll()) {
            if (maNCC.equalsIgnoreCase(sp.getMaNCC())) {
                count++;
            }
        }
        return count;
    }
}
