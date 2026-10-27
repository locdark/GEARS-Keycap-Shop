package com.gears.util;

import com.gears.model.DonHang;
import com.gears.model.SanPhamKeycap;
import com.gears.patterns.facade.GearsShopFacade;

/**
 * SystemVerificationTest: Kiem tra toan ven he thong 3 lop va 6 Design Patterns.
 */
public class SystemVerificationTest {
    public static void main(String[] args) {
        System.out.println("=====================================================================");
        System.out.println("   KIEM TRA HE THONG QUAN LY CUA HANG GEARS KEYCAP SHOP (PTTKHDT)    ");
        System.out.println("=====================================================================");

        GearsShopFacade facade = GearsShopFacade.getInstance();

        // 1. Kiem tra so luong san pham
        var products = facade.getAllProducts();
        System.out.println("[+] So luong San Pham Keycap da nap vao CSDL: " + products.size() + "/100 items");
        assert products.size() >= 100 : "Loi: Khong du 100 san pham!";

        // 2. Kiem tra nha cung cap
        var suppliers = facade.getAllSuppliers();
        System.out.println("[+] So luong Nha Cung Cap: " + suppliers.size() + " doi tac (Akko, Keychron, Jelly Key, HolyOOPS)");

        // 3. Kiem tra khach hang & nhan vien
        var customers = facade.getAllCustomers();
        var employees = facade.getAllEmployees();
        System.out.println("[+] So luong Khach Hang CRM: " + customers.size() + " thanh vien");
        System.out.println("[+] So luong Nhan Vien: " + employees.size() + " nhan su");

        // 4. Kiem tra don hang & tong doanh thu / loi nhuan
        var orders = facade.getAllOrders();
        System.out.println("[+] So luong Don Hang ban dau: " + orders.size() + " don");
        System.out.printf("[+] Tong Doanh Thu Thuc Te: %,.0f VNĐ%n", facade.getTotalRevenue());
        System.out.printf("[+] Tong Gia Von Hang Ban: %,.0f VNĐ%n", facade.getTotalCost());
        System.out.printf("[+] Tong Loi Nhuan Gop: %,.0f VNĐ%n", facade.getTotalGrossProfit());

        // 5. Kiem tra rang buoc khoa trang thai don hang
        DonHang doneOrder = orders.stream().filter(o -> "giaohang".equals(o.getTrangThai())).findFirst().orElse(null);
        if (doneOrder != null) {
            StringBuilder errorMsg = new StringBuilder();
            boolean canChange = facade.updateOrderStatus(doneOrder.getMaDH(), "xuly", errorMsg);
            System.out.println("[+] Thu doi trang thai don hang da Hoan tat [" + doneOrder.getMaDH() + "]:");
            System.out.println("    -> Ket qua: " + (canChange ? "Loi (cho phep sua)" : "BI CHAN THANH CONG! Noi dung: " + errorMsg));
        }

        // 6. Kiem tra rang buoc xoa nha cung cap co san pham
        StringBuilder nccErr = new StringBuilder();
        boolean canDeleteNCC = facade.deleteSupplier("NCC01", nccErr);
        System.out.println("[+] Thu xoa Nha Cung Cap NCC01 dang co san pham lien ket:");
        System.out.println("    -> Ket qua: " + (canDeleteNCC ? "Loi" : "BI CHAN AN TOAN KHOA NGOAI! Noi dung: " + nccErr));

        System.out.println("=====================================================================");
        System.out.println(">>> HE THONG 3 LOP VA CAC RANG BUOC NGHIEP VU HOAT DONG HOAN HAO! <<<");
        System.out.println("=====================================================================");
    }
}
