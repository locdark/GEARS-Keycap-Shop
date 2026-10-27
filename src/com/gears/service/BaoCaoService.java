package com.gears.service;

import com.gears.dao.DonHangDAO;
import com.gears.dao.SanPhamDAO;
import com.gears.model.ChiTietDonHang;
import com.gears.model.DonHang;
import com.gears.model.SanPhamKeycap;

import java.io.File;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.text.DecimalFormat;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * BUS / SERVICE: Thong ke Bao cao Tai chinh, Doanh thu, Doanh so va Loi nhuan gop.
 * Theo Module 7 trong so do BFD & Class Diagram.
 */
public class BaoCaoService {
    private final DonHangDAO donHangDAO = new DonHangDAO();
    private final SanPhamDAO sanPhamDAO = new SanPhamDAO();

    private static final DecimalFormat CURRENCY_FMT = new DecimalFormat("#,##0 'VNĐ'");

    public double tinhTongDoanhThu() {
        double total = 0.0;
        for (DonHang dh : donHangDAO.getAll()) {
            if ("giaohang".equalsIgnoreCase(dh.getTrangThai())) {
                total += dh.tinhTongTienThanhToan();
            }
        }
        return total;
    }

    public double tinhTongGiaVon() {
        double total = 0.0;
        for (DonHang dh : donHangDAO.getAll()) {
            if ("giaohang".equalsIgnoreCase(dh.getTrangThai())) {
                total += dh.tinhTongGiaVon();
            }
        }
        return total;
    }

    public double tinhTongLoiNhuanGop() {
        return Math.max(0, tinhTongDoanhThu() - tinhTongGiaVon());
    }

    public int tinhTongSoDonHang() {
        return donHangDAO.getAll().size();
    }

    public int tinhTongSoDonHoanTat() {
        int count = 0;
        for (DonHang dh : donHangDAO.getAll()) {
            if ("giaohang".equalsIgnoreCase(dh.getTrangThai())) {
                count++;
            }
        }
        return count;
    }

    public int tinhTongKeycapXuatKho() {
        int total = 0;
        for (DonHang dh : donHangDAO.getAll()) {
            if ("giaohang".equalsIgnoreCase(dh.getTrangThai())) {
                total += dh.tinhTongSoLuongKeycap();
            }
        }
        return total;
    }

    public Map<String, Integer> thongKeSoLuongTheoTheLoai() {
        Map<String, Integer> map = new LinkedHashMap<>();
        map.put("Artisan", 0);
        map.put("Anime", 0);
        map.put("Pudding", 0);
        map.put("Cherry", 0);
        map.put("Other", 0);

        for (DonHang dh : donHangDAO.getAll()) {
            if ("giaohang".equalsIgnoreCase(dh.getTrangThai())) {
                for (ChiTietDonHang ct : dh.getDanhSachChiTiet()) {
                    SanPhamKeycap sp = sanPhamDAO.getById(ct.getMaSP());
                    if (sp != null) {
                        String type = sp.getTheLoai();
                        map.put(type, map.getOrDefault(type, 0) + ct.getSoLuong());
                    }
                }
            }
        }
        return map;
    }

    public Map<String, Double> thongKeDoanhThuTheoTheLoai() {
        Map<String, Double> map = new LinkedHashMap<>();
        map.put("Artisan", 0.0);
        map.put("Anime", 0.0);
        map.put("Pudding", 0.0);
        map.put("Cherry", 0.0);
        map.put("Other", 0.0);

        for (DonHang dh : donHangDAO.getAll()) {
            if ("giaohang".equalsIgnoreCase(dh.getTrangThai())) {
                for (ChiTietDonHang ct : dh.getDanhSachChiTiet()) {
                    SanPhamKeycap sp = sanPhamDAO.getById(ct.getMaSP());
                    if (sp != null) {
                        String type = sp.getTheLoai();
                        map.put(type, map.getOrDefault(type, 0.0) + ct.tinhThanhTien());
                    }
                }
            }
        }
        return map;
    }

    public boolean xuatBaoCaoRaFile(File file, StringBuilder errorMsg) {
        try (PrintWriter writer = new PrintWriter(file, StandardCharsets.UTF_8.name())) {
            // Write BOM for Excel UTF-8 compatibility
            writer.print('\ufeff');

            writer.println("BÁO CÁO TÀI CHÍNH & DOANH THU BÁN LẺ - GEARS KEYCAP SHOP");
            writer.println("Thời gian xuất file: " + java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")));
            writer.println("==========================================================================");
            writer.println("CHỈ SỐ TỔNG QUAN");
            writer.println("Tổng doanh thu thực tế (VNĐ)," + tinhTongDoanhThu());
            writer.println("Tổng giá vốn hàng bán (VNĐ)," + tinhTongGiaVon());
            writer.println("Tổng lợi nhuận gộp (VNĐ)," + tinhTongLoiNhuanGop());
            writer.println("Tổng số đơn hàng," + tinhTongSoDonHang());
            writer.println("Số đơn hoàn tất thành công," + tinhTongSoDonHoanTat());
            writer.println("Tổng số lượng nút/bộ Keycap đã xuất kho," + tinhTongKeycapXuatKho());
            writer.println();
            writer.println("==========================================================================");
            writer.println("DANH SÁCH ĐƠN HÀNG CHI TIẾT");
            writer.println("Mã Đơn,Ngày Lập,Khách Hàng,Thu Ngân,Kênh Bán,Phương Thức TT,Trạng Thái,Tổng Tiền (VNĐ),Giá Vốn (VNĐ),Lợi Nhuận (VNĐ)");

            for (DonHang dh : donHangDAO.getAll()) {
                writer.println(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%.0f,%.0f,%.0f",
                        dh.getMaDH(),
                        dh.getFormattedNgayLap(),
                        dh.getTenKhachHang(),
                        dh.getTenNhanVien(),
                        dh.getKenhBan(),
                        dh.getPhuongThucTT(),
                        dh.getTrangThai(),
                        dh.tinhTongTienThanhToan(),
                        dh.tinhTongGiaVon(),
                        dh.tinhLoiNhuanGop()
                ));
            }

            return true;
        } catch (Exception e) {
            if (errorMsg != null) errorMsg.append("Lỗi xuất file báo cáo: ").append(e.getMessage());
            return false;
        }
    }
}
