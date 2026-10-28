package com.gears.ui.panels;

import com.gears.model.ChiTietDonHang;
import com.gears.model.DonHang;
import com.gears.patterns.facade.GearsShopFacade;
import com.gears.patterns.observer.IDataObserver;
import com.gears.patterns.observer.Subject;
import com.gears.ui.components.ModernButton;
import com.gears.ui.components.ModernComboBox;
import com.gears.ui.components.ModernDialogHelper;
import com.gears.ui.components.ModernTable;
import com.gears.ui.components.ModernTextField;
import com.gears.ui.components.ReceiptDialog;
import com.gears.ui.components.VectorIcon;
import com.gears.ui.theme.UITheme;

import java.awt.*;
import java.text.DecimalFormat;
import java.util.List;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;

/**
 * DonHangPanel (Boundary): Quan ly & Xu ly Don hang toan dien.
 * Theo Module 3 trong so do BFD & Class Diagram.
 * 
 * RANG BUOC NGHIEP VU PTTKHDT BAT BUOC:
 * - Khi don hang o trang thai HOAN TAT (giaohang / Done) hoac DA HUY (huy),
 *   giao dien canh bao va tu choi moi hanh vi thay doi trang thai.
 */
public class DonHangPanel extends JPanel implements IDataObserver {
    private final GearsShopFacade facade = GearsShopFacade.getInstance();

    private ModernTextField txtSearch;
    private ModernComboBox<String> cbStatusFilter;
    private ModernComboBox<String> cbChannelFilter;
    private DefaultTableModel tableModel;
    private ModernTable table;

    private static final DecimalFormat CURRENCY = new DecimalFormat("#,##0 'VNĐ'");

    public DonHangPanel() {
        setLayout(new BorderLayout(14, 14));
        setBackground(UITheme.BG_MAIN);
        setBorder(new EmptyBorder(16, 20, 16, 20));

        initTopBar();
        initTable();
        initBottomActions();

        Subject.getInstance().registerObserver(this);
        refreshData();
    }

    private void initTopBar() {
        JPanel pnlTop = new JPanel(new BorderLayout(10, 8));
        pnlTop.setOpaque(false);

        JLabel lblTitle = new JLabel("QUẢN LÝ ĐƠN HÀNG & DUYỆT TRẠNG THÁI");
        lblTitle.setFont(UITheme.FONT_TITLE);
        lblTitle.setForeground(UITheme.TEXT_PRIMARY);
        pnlTop.add(lblTitle, BorderLayout.NORTH);

        JPanel pnlFilters = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 0));
        pnlFilters.setOpaque(false);

        txtSearch = new ModernTextField("Tìm mã đơn, tên khách, SĐT...");
        txtSearch.setPreferredSize(new Dimension(260, 36));
        txtSearch.addActionListener(e -> filterData());
        txtSearch.getDocument().addDocumentListener(new javax.swing.event.DocumentListener() {
            public void insertUpdate(javax.swing.event.DocumentEvent e) { filterData(); }
            public void removeUpdate(javax.swing.event.DocumentEvent e) { filterData(); }
            public void changedUpdate(javax.swing.event.DocumentEvent e) { filterData(); }
        });

        cbStatusFilter = new ModernComboBox<>(new String[]{"Tất cả", "moi", "xuly", "giaohang", "huy"});
        cbStatusFilter.setPreferredSize(new Dimension(130, 36));
        cbStatusFilter.addActionListener(e -> filterData());

        cbChannelFilter = new ModernComboBox<>(new String[]{"Tất cả", "POS", "Online"});
        cbChannelFilter.setPreferredSize(new Dimension(100, 36));
        cbChannelFilter.addActionListener(e -> filterData());

        ModernButton btnFilter = new ModernButton("Lọc Đơn Hàng", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_PRIMARY);
        btnFilter.addActionListener(e -> filterData());

        ModernButton btnReload = new ModernButton("Tải Lại Dữ Liệu", new Color(0x1B, 0x38, 0x4C), new Color(0x23, 0x4C, 0x6A), UITheme.STATUS_INFO);
        btnReload.setFont(UITheme.FONT_BOLD);
        btnReload.setPreferredSize(new Dimension(145, 36));
        btnReload.setToolTipText("Làm mới và nạp lại toàn bộ đơn hàng mới nhất từ CSDL đĩa");
        btnReload.addActionListener(e -> {
            facade.reloadDatabase();
            refreshData();
            JOptionPane.showMessageDialog(this,
                    "ĐÃ TẢI LẠI VÀ ĐỒNG BỘ CSDL THÀNH CÔNG!\n\n"
                    + "Tổng số đơn hàng hiện có: " + facade.getAllOrders().size() + " đơn\n"
                    + "(Hệ thống tự động liên tục kiểm tra và đồng bộ đơn hàng mới)",
                    "Làm Mới Dữ Liệu Hoàn Tất", JOptionPane.INFORMATION_MESSAGE);
        });

        JLabel lblStatus = new JLabel("Trạng thái:");
        lblStatus.setFont(UITheme.FONT_BOLD);
        lblStatus.setForeground(UITheme.TEXT_SECONDARY);

        JLabel lblChannel = new JLabel("Kênh:");
        lblChannel.setFont(UITheme.FONT_BOLD);
        lblChannel.setForeground(UITheme.TEXT_SECONDARY);

        pnlFilters.add(txtSearch);
        pnlFilters.add(lblStatus);
        pnlFilters.add(cbStatusFilter);
        pnlFilters.add(lblChannel);
        pnlFilters.add(cbChannelFilter);
        pnlFilters.add(btnFilter);
        pnlFilters.add(btnReload);

        pnlTop.add(pnlFilters, BorderLayout.CENTER);
        add(pnlTop, BorderLayout.NORTH);
    }

    private void initTable() {
        String[] cols = {"Mã Đơn", "Ngày Lập", "Khách Hàng", "Thu Ngân", "Kênh Bán", "Thanh Toán", "Tổng Tiền", "Lợi Nhuận Gộp", "Trạng Thái"};
        tableModel = new DefaultTableModel(cols, 0);
        table = new ModernTable(tableModel);

        table.getColumnModel().getColumn(0).setPreferredWidth(85);
        table.getColumnModel().getColumn(1).setPreferredWidth(125);
        table.getColumnModel().getColumn(2).setPreferredWidth(150);
        table.getColumnModel().getColumn(3).setPreferredWidth(130);
        table.getColumnModel().getColumn(4).setPreferredWidth(65);
        table.getColumnModel().getColumn(5).setPreferredWidth(110);
        table.getColumnModel().getColumn(6).setPreferredWidth(110);
        table.getColumnModel().getColumn(7).setPreferredWidth(110);
        table.getColumnModel().getColumn(8).setPreferredWidth(125);

        // Double-click row de xem chi tiet don hang
        table.addMouseListener(new java.awt.event.MouseAdapter() {
            @Override
            public void mouseClicked(java.awt.event.MouseEvent e) {
                if (e.getClickCount() == 2) {
                    viewOrderDetail();
                }
            }
        });

        JScrollPane scroll = new JScrollPane(table);
        scroll.setBorder(BorderFactory.createLineBorder(UITheme.BORDER_COLOR));
        scroll.getViewport().setBackground(UITheme.BG_CARD);
        add(scroll, BorderLayout.CENTER);
    }

    private void initBottomActions() {
        JPanel pnlBottom = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        pnlBottom.setOpaque(false);

        ModernButton btnDetail = new ModernButton("Xem Chi Tiết Đơn", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_PRIMARY);
        btnDetail.addActionListener(e -> viewOrderDetail());

        ModernButton btnStatus = new ModernButton("Đổi Trạng Thái 🔒", UITheme.PRIMARY_RED, UITheme.PRIMARY_RED_HOVER, Color.WHITE);
        btnStatus.addActionListener(e -> updateStatusDialog());

        ModernButton btnPrint = new ModernButton("In Hóa Đơn", new Color(0x1B, 0x38, 0x2B), new Color(0x23, 0x4C, 0x3A), UITheme.STATUS_SUCCESS);
        btnPrint.addActionListener(e -> printReceipt());

        ModernButton btnCancel = new ModernButton("Hủy Đơn (Hoàn Kho)", new Color(0x3E, 0x1A, 0x1E), new Color(0x5A, 0x1E, 0x24), UITheme.STATUS_DANGER);
        btnCancel.addActionListener(e -> cancelSelectedOrder());

        pnlBottom.add(btnDetail);
        pnlBottom.add(btnStatus);
        pnlBottom.add(btnPrint);
        pnlBottom.add(btnCancel);

        add(pnlBottom, BorderLayout.SOUTH);
    }

    private void filterData() {
        String kw = txtSearch.getText();
        String st = (String) cbStatusFilter.getSelectedItem();
        String ch = (String) cbChannelFilter.getSelectedItem();
        List<DonHang> list = facade.searchOrders(kw, st, ch);

        tableModel.setRowCount(0);
        for (DonHang dh : list) {
            tableModel.addRow(new Object[]{
                dh.getMaDH(),
                dh.getFormattedNgayLap(),
                dh.getTenKhachHang(),
                dh.getTenNhanVien(),
                dh.getKenhBan(),
                dh.getPhuongThucTT(),
                dh.getFormattedTongTien(),
                dh.getFormattedLoiNhuan(),
                dh.getTenTrangThaiTiengViet()
            });
        }
    }

    public void refreshData() {
        filterData();
    }

    private void viewOrderDetail() {
        int row = table.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Vui lòng chọn 1 đơn hàng để xem chi tiết!", "Nhắc nhở", JOptionPane.WARNING_MESSAGE);
            return;
        }

        String orderId = (String) table.getValueAt(row, 0);
        DonHang dh = facade.getAllOrders().stream().filter(o -> o.getMaDH().equals(orderId)).findFirst().orElse(null);
        if (dh == null) return;

        JDialog dialog = new JDialog((Frame) SwingUtilities.getWindowAncestor(this), "Chi Tiết Đơn Hàng #" + dh.getMaDH(), true);
        dialog.setSize(680, 560);
        dialog.setLocationRelativeTo(this);
        dialog.getContentPane().setBackground(UITheme.BG_MAIN);
        dialog.setLayout(new BorderLayout(0, 0));

        JPanel pnlHeader = ModernDialogHelper.createModalHeader(
            "CHI TIẾT ĐƠN HÀNG #" + dh.getMaDH(),
            "Kênh: " + dh.getKenhBan() + " | PT: " + dh.getPhuongThucTT() + " | Trạng thái: " + dh.getTenTrangThaiTiengViet(),
            VectorIcon.Type.ORDER
        );
        dialog.add(pnlHeader, BorderLayout.NORTH);

        JPanel pnlBody = new JPanel(new BorderLayout(10, 10));
        pnlBody.setOpaque(false);
        pnlBody.setBorder(new EmptyBorder(12, 16, 12, 16));

        // Info Panel
        JPanel pnlInfo = new JPanel(new GridLayout(4, 2, 8, 8));
        pnlInfo.setBackground(new Color(0x18, 0x1B, 0x22));
        pnlInfo.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(0x2D, 0x33, 0x40), 1, true),
            new EmptyBorder(10, 14, 10, 14)
        ));

        pnlInfo.add(createDetailLabel("Mã đơn: ", dh.getMaDH()));
        pnlInfo.add(createDetailLabel("Ngày lập: ", dh.getFormattedNgayLap()));
        pnlInfo.add(createDetailLabel("Khách hàng: ", dh.getTenKhachHang()));
        pnlInfo.add(createDetailLabel("Thu ngân: ", dh.getTenNhanVien()));
        pnlInfo.add(createDetailLabel("Kênh bán: ", dh.getKenhBan()));
        pnlInfo.add(createDetailLabel("Phương thức: ", dh.getPhuongThucTT()));
        pnlInfo.add(createDetailLabel("Trạng thái: ", dh.getTenTrangThaiTiengViet()));
        pnlInfo.add(createDetailLabel("Ghi chú: ", dh.getGhiChu()));
        pnlBody.add(pnlInfo, BorderLayout.NORTH);

        // Items Table
        String[] cols = {"Tên Sản Phẩm", "Đơn Giá", "Giá Vốn", "SL", "Thành Tiền", "Lợi Nhuận"};
        DefaultTableModel model = new DefaultTableModel(cols, 0);
        ModernTable itemsTable = new ModernTable(model);

        for (ChiTietDonHang item : dh.getDanhSachChiTiet()) {
            model.addRow(new Object[]{
                item.getTenSP(),
                CURRENCY.format(item.getDonGia()),
                CURRENCY.format(item.getDonGiaNhap()),
                item.getSoLuong(),
                CURRENCY.format(item.tinhThanhTien()),
                CURRENCY.format(item.tinhLoiNhuanMon())
            });
        }

        JScrollPane scroll = new JScrollPane(itemsTable);
        scroll.setBorder(BorderFactory.createLineBorder(UITheme.BORDER_COLOR));
        scroll.getViewport().setBackground(UITheme.BG_CARD);
        pnlBody.add(scroll, BorderLayout.CENTER);
        dialog.add(pnlBody, BorderLayout.CENTER);

        // Bottom Summary
        JPanel pnlBottom = new JPanel(new BorderLayout());
        pnlBottom.setBackground(new Color(0x18, 0x1B, 0x22));
        pnlBottom.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createMatteBorder(1, 0, 0, 0, new Color(0x2D, 0x33, 0x40)),
            new EmptyBorder(12, 16, 12, 16)
        ));

        String summary = String.format("<html><font color='#94a3b8'>Tiền hàng:</font> <font color='#ffffff'><b>%s</b></font> &nbsp;|&nbsp; <font color='#94a3b8'>Chiết khấu:</font> <font color='#fbbf24'><b>%.0f%%</b></font> &nbsp;|&nbsp; <font color='#94a3b8'>TỔNG CỘNG:</font> <font color='#e30019'><b>%s</b></font> &nbsp;|&nbsp; <font color='#94a3b8'>Lợi nhuận gộp:</font> <font color='#34d399'><b>%s</b></font></html>",
                CURRENCY.format(dh.tinhTongTienTamTinh()), dh.getPhanTramGiamGia(), dh.getFormattedTongTien(), dh.getFormattedLoiNhuan());
        JLabel lblSum = new JLabel(summary);
        lblSum.setFont(UITheme.FONT_REGULAR);
        pnlBottom.add(lblSum, BorderLayout.WEST);

        ModernButton btnClose = new ModernButton("Đóng", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_SECONDARY);
        btnClose.addActionListener(e -> dialog.dispose());
        pnlBottom.add(btnClose, BorderLayout.EAST);

        dialog.add(pnlBottom, BorderLayout.SOUTH);
        dialog.setVisible(true);
    }

    private JLabel createDetailLabel(String title, String val) {
        JLabel lbl = new JLabel("<html><font color='#94a3b8'>" + title + "</font><font color='#f1f5f9'><b>" + (val != null ? val : "-") + "</b></font></html>");
        lbl.setFont(UITheme.FONT_SMALL);
        return lbl;
    }

    private void updateStatusDialog() {
        int row = table.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Vui lòng chọn 1 đơn hàng để cập nhật trạng thái!", "Nhắc nhở", JOptionPane.WARNING_MESSAGE);
            return;
        }

        String orderId = (String) table.getValueAt(row, 0);
        DonHang dh = facade.getAllOrders().stream().filter(o -> o.getMaDH().equals(orderId)).findFirst().orElse(null);
        if (dh == null) return;

        // KIEM TRA RANG BUOC NGHIEP VU PTTKHDT
        if (dh.isTrangThaiKhoa()) {
            JOptionPane.showMessageDialog(this,
                    "LỖI RÀNG BUỘC NGHIỆP VỤ:\nĐơn hàng [" + dh.getMaDH() + "] hiện đang ở trạng thái CỐ ĐỊNH (" + dh.getTenTrangThaiTiengViet() + ").\n"
                    + "Theo quy định môn PTTKHDT: Đơn hàng ĐÃ HOÀN TẤT hoặc ĐÃ HỦY thì KHÔNG ĐƯỢC PHÉP ĐỔI TRẠNG THÁI!",
                    "Trạng Thái Đã Bị Khóa 🔒", JOptionPane.ERROR_MESSAGE);
            return;
        }

        String[] statuses = {"moi (Mới tiếp nhận)", "xuly (Đang đóng gói)", "giaohang (Đã giao - Done / Khóa)", "huy (Hủy đơn hàng / Hoàn kho)"};
        String selected = (String) JOptionPane.showInputDialog(this,
                "Chọn trạng thái mới cho đơn hàng #" + dh.getMaDH() + ":\n(Lưu ý: Chuyển sang Hoàn tất hoặc Hủy sẽ khóa vĩnh viễn đơn)",
                "Cập Nhật Trạng Thái Đơn Hàng", JOptionPane.QUESTION_MESSAGE, null, statuses, statuses[1]);

        if (selected == null) return;

        String newStatusCode = selected.split(" ")[0];
        StringBuilder errorMsg = new StringBuilder();
        boolean ok = facade.updateOrderStatus(orderId, newStatusCode, errorMsg);

        if (ok) {
            JOptionPane.showMessageDialog(this, "Đã cập nhật trạng thái đơn hàng #" + orderId + " thành công!", "Thành Công", JOptionPane.INFORMATION_MESSAGE);
        } else {
            JOptionPane.showMessageDialog(this, errorMsg.toString(), "Từ Chối Cập Nhật", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void cancelSelectedOrder() {
        int row = table.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Vui lòng chọn 1 đơn hàng để hủy!", "Nhắc nhở", JOptionPane.WARNING_MESSAGE);
            return;
        }

        String orderId = (String) table.getValueAt(row, 0);
        DonHang dh = facade.getAllOrders().stream().filter(o -> o.getMaDH().equals(orderId)).findFirst().orElse(null);
        if (dh == null) return;

        if (dh.isTrangThaiKhoa()) {
            JOptionPane.showMessageDialog(this,
                    "Không thể hủy đơn hàng này vì đơn đã ở trạng thái: " + dh.getTenTrangThaiTiengViet(),
                    "Từ Chối Hủy Đơn", JOptionPane.ERROR_MESSAGE);
            return;
        }

        int confirm = JOptionPane.showConfirmDialog(this,
                "Bạn có chắc muốn HỦY đơn hàng #" + orderId + "?\nHệ thống sẽ tự động hoàn trả lại số lượng Keycap vào tồn kho SanPham!",
                "Xác Nhận Hủy Đơn", JOptionPane.YES_NO_OPTION, JOptionPane.WARNING_MESSAGE);

        if (confirm == JOptionPane.YES_OPTION) {
            StringBuilder errorMsg = new StringBuilder();
            boolean ok = facade.cancelOrder(orderId, errorMsg);
            if (ok) {
                JOptionPane.showMessageDialog(this, "Đã hủy đơn hàng #" + orderId + " và phục hồi tồn kho thành công!", "Thành Công", JOptionPane.INFORMATION_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(this, errorMsg.toString(), "Lỗi", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private void printReceipt() {
        int row = table.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Vui lòng chọn 1 đơn hàng để in hóa đơn!", "Nhắc nhở", JOptionPane.WARNING_MESSAGE);
            return;
        }

        String orderId = (String) table.getValueAt(row, 0);
        DonHang dh = facade.getAllOrders().stream().filter(o -> o.getMaDH().equals(orderId)).findFirst().orElse(null);
        if (dh != null) {
            ReceiptDialog receipt = new ReceiptDialog((Frame) SwingUtilities.getWindowAncestor(this), dh);
            receipt.setVisible(true);
        }
    }

    @Override
    public void onDataChanged(String eventType, Object data) {
        SwingUtilities.invokeLater(this::refreshData);
    }
}
