package com.gears.ui.panels;

import com.gears.model.KhachHang;
import com.gears.patterns.facade.GearsShopFacade;
import com.gears.patterns.factory.EntityFactory;
import com.gears.patterns.observer.IDataObserver;
import com.gears.patterns.observer.Subject;
import com.gears.ui.components.ModernButton;
import com.gears.ui.components.ModernDialogHelper;
import com.gears.ui.components.ModernTable;
import com.gears.ui.components.ModernTextField;
import com.gears.ui.components.VectorIcon;
import com.gears.ui.theme.UITheme;

import java.awt.*;
import java.text.DecimalFormat;
import java.util.List;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;

/**
 * KhachHangPanel (Boundary): Quan ly Ho so Khach hang (CRM), Tich luy Keycap Coins va Khoa tai khoan.
 * Theo Module 4 trong so do BFD & Class Diagram.
 */
public class KhachHangPanel extends JPanel implements IDataObserver {
    private final GearsShopFacade facade = GearsShopFacade.getInstance();

    private ModernTextField txtSearch;
    private DefaultTableModel tableModel;
    private ModernTable table;

    private static final DecimalFormat CURRENCY = new DecimalFormat("#,##0 'VNĐ'");

    public KhachHangPanel() {
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

        JLabel lblTitle = new JLabel("HỒ SƠ KHÁCH HÀNG & CHƯƠNG TRÌNH KHÁCH THÂN THIẾT (CRM)");
        lblTitle.setFont(UITheme.FONT_TITLE);
        lblTitle.setForeground(UITheme.TEXT_PRIMARY);
        pnlTop.add(lblTitle, BorderLayout.NORTH);

        JPanel pnlFilters = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 0));
        pnlFilters.setOpaque(false);

        txtSearch = new ModernTextField("Tìm mã KH, tên khách hàng, số điện thoại...");
        txtSearch.setPreferredSize(new Dimension(320, 36));
        txtSearch.addActionListener(e -> filterData());
        txtSearch.getDocument().addDocumentListener(new javax.swing.event.DocumentListener() {
            public void insertUpdate(javax.swing.event.DocumentEvent e) { filterData(); }
            public void removeUpdate(javax.swing.event.DocumentEvent e) { filterData(); }
            public void changedUpdate(javax.swing.event.DocumentEvent e) { filterData(); }
        });

        ModernButton btnSearch = new ModernButton("Tra Cứu", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_PRIMARY);
        btnSearch.addActionListener(e -> filterData());

        ModernButton btnAdd = new ModernButton("+ Thêm Khách Hàng Mới", UITheme.PRIMARY_RED, UITheme.PRIMARY_RED_HOVER, Color.WHITE);
        btnAdd.addActionListener(e -> openAddEditDialog(null));

        pnlFilters.add(txtSearch);
        pnlFilters.add(btnSearch);
        pnlFilters.add(btnAdd);

        pnlTop.add(pnlFilters, BorderLayout.CENTER);
        add(pnlTop, BorderLayout.NORTH);
    }

    private void initTable() {
        String[] cols = {"Mã KH", "Họ và Tên", "Số Điện Thoại", "Email", "Điểm Thưởng", "Tổng Chi Tiêu", "Hạng Thành Viên", "Trạng Thái"};
        tableModel = new DefaultTableModel(cols, 0);
        table = new ModernTable(tableModel);

        table.getColumnModel().getColumn(0).setPreferredWidth(70);
        table.getColumnModel().getColumn(1).setPreferredWidth(180);
        table.getColumnModel().getColumn(2).setPreferredWidth(110);
        table.getColumnModel().getColumn(3).setPreferredWidth(180);
        table.getColumnModel().getColumn(4).setPreferredWidth(90);
        table.getColumnModel().getColumn(5).setPreferredWidth(120);
        table.getColumnModel().getColumn(6).setPreferredWidth(130);
        table.getColumnModel().getColumn(7).setPreferredWidth(95);

        // Double-click row de sua nhanh
        table.addMouseListener(new java.awt.event.MouseAdapter() {
            @Override
            public void mouseClicked(java.awt.event.MouseEvent e) {
                if (e.getClickCount() == 2) {
                    editSelected();
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

        ModernButton btnEdit = new ModernButton("Sửa Thông Tin", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_PRIMARY);
        btnEdit.addActionListener(e -> editSelected());

        ModernButton btnLock = new ModernButton("Khóa / Mở Khóa Tài Khoản", new Color(0x3D, 0x32, 0x1A), new Color(0x52, 0x43, 0x22), UITheme.STATUS_WARNING);
        btnLock.addActionListener(e -> toggleLockSelected());

        pnlBottom.add(btnEdit);
        pnlBottom.add(btnLock);
        add(pnlBottom, BorderLayout.SOUTH);
    }

    private void filterData() {
        String kw = txtSearch.getText().trim();
        List<KhachHang> list = facade.searchCustomers(kw);

        tableModel.setRowCount(0);
        if (list.isEmpty() && !kw.isEmpty()) {
            boolean isPhone = kw.matches("^[0-9+]+$");
            tableModel.addRow(new Object[]{
                "➕ MỚI",
                "⚠️ Không tìm thấy khách '" + kw + "'! Bấm đúp để thêm mới...",
                isPhone ? kw : "",
                "",
                "",
                "",
                "Standard",
                "Chưa có"
            });
        } else {
            for (KhachHang kh : list) {
                String statusStr = kh.isLocked() ? "Đã khóa" : "Hoạt động";
                tableModel.addRow(new Object[]{
                    kh.getId(),
                    kh.getHoTen(),
                    kh.getSoDienThoai(),
                    kh.getEmail(),
                    kh.getDiemTichLuy() + " xu",
                    CURRENCY.format(kh.getTongChiTieu()),
                    kh.getHangThanhVien(),
                    statusStr
                });
            }
        }
    }

    public void refreshData() {
        filterData();
    }

    private void editSelected() {
        int row = table.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Vui lòng chọn 1 khách hàng để sửa!", "Nhắc nhở", JOptionPane.WARNING_MESSAGE);
            return;
        }

        String id = (String) table.getValueAt(row, 0);
        if ("➕ MỚI".equals(id)) {
            openAddEditDialog(null);
            return;
        }
        KhachHang kh = facade.getAllCustomers().stream().filter(c -> c.getId().equals(id)).findFirst().orElse(null);
        if (kh != null) openAddEditDialog(kh);
    }

    private void toggleLockSelected() {
        int row = table.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Vui lòng chọn 1 khách hàng để khóa/mở khóa!", "Nhắc nhở", JOptionPane.WARNING_MESSAGE);
            return;
        }

        String id = (String) table.getValueAt(row, 0);
        KhachHang kh = facade.getAllCustomers().stream().filter(c -> c.getId().equals(id)).findFirst().orElse(null);
        if (kh == null) return;

        String action = kh.isLocked() ? "MỞ KHÓA" : "TẠM KHÓA";
        int confirm = JOptionPane.showConfirmDialog(this,
                "Bạn có chắc muốn " + action + " tài khoản của khách hàng [" + kh.getHoTen() + "]?",
                "Xác Nhận " + action, JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE);

        if (confirm == JOptionPane.YES_OPTION) {
            facade.toggleCustomerLock(id);
            JOptionPane.showMessageDialog(this, "Thao tác thành công!", "Thông Báo", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    private void openAddEditDialog(KhachHang existing) {
        boolean isEdit = (existing != null);
        JDialog dialog = new JDialog((Frame) SwingUtilities.getWindowAncestor(this), isEdit ? "Sửa Khách Hàng " + existing.getId() : "Thêm Khách Hàng Mới", true);
        dialog.setSize(520, 480);
        dialog.setLocationRelativeTo(this);
        dialog.getContentPane().setBackground(UITheme.BG_MAIN);
        dialog.setLayout(new BorderLayout(0, 0));

        JPanel pnlHeader = ModernDialogHelper.createModalHeader(
            isEdit ? "CẬP NHẬT HỒ SƠ KHÁCH HÀNG #" + existing.getId() : "THÊM KHÁCH HÀNG THÀNH VIÊN",
            isEdit ? "Điều chỉnh thông tin liên hệ và địa chỉ giao hàng" : "Đăng ký thành viên mới tích lũy Keycap Coins",
            VectorIcon.Type.CUSTOMER
        );
        dialog.add(pnlHeader, BorderLayout.NORTH);

        JPanel pnlForm = new JPanel(new GridLayout(5, 2, 10, 14));
        pnlForm.setOpaque(false);
        pnlForm.setBorder(new EmptyBorder(18, 24, 18, 24));

        ModernTextField txtId = new ModernTextField();
        if (isEdit) {
            txtId.setText(existing.getId());
            txtId.setEnabled(false);
        } else {
            txtId.setPlaceholder("Tự sinh nếu trống (VD: KH05)");
        }

        String searchKw = (txtSearch != null && !isEdit) ? txtSearch.getText().trim() : "";
        boolean isPhone = searchKw.matches("^[0-9+]+$");

        ModernTextField txtName = new ModernTextField();
        if (isEdit) {
            txtName.setText(existing.getHoTen());
        } else if (!isPhone && !searchKw.isEmpty()) {
            txtName.setText(searchKw);
        } else {
            txtName.setPlaceholder("Nhập họ và tên");
        }

        ModernTextField txtPhone = new ModernTextField();
        if (isEdit) {
            txtPhone.setText(existing.getSoDienThoai());
        } else if (isPhone && !searchKw.isEmpty()) {
            txtPhone.setText(searchKw);
        } else {
            txtPhone.setPlaceholder("Nhập số điện thoại (VD: 0912345678)");
        }

        ModernTextField txtEmail = new ModernTextField();
        if (isEdit) txtEmail.setText(existing.getEmail());
        else txtEmail.setPlaceholder("Email liên hệ");

        ModernTextField txtAddress = new ModernTextField();
        if (isEdit) txtAddress.setText(existing.getDiaChi());
        else txtAddress.setPlaceholder("Địa chỉ giao hàng");

        pnlForm.add(ModernDialogHelper.createFieldLabel("Mã Khách Hàng:"));
        pnlForm.add(txtId);
        pnlForm.add(ModernDialogHelper.createFieldLabel("Họ và Tên:"));
        pnlForm.add(txtName);
        pnlForm.add(ModernDialogHelper.createFieldLabel("Số Điện Thoại:"));
        pnlForm.add(txtPhone);
        pnlForm.add(ModernDialogHelper.createFieldLabel("Email:"));
        pnlForm.add(txtEmail);
        pnlForm.add(ModernDialogHelper.createFieldLabel("Địa Chỉ Giao Hàng:"));
        pnlForm.add(txtAddress);

        dialog.add(pnlForm, BorderLayout.CENTER);

        ModernButton btnSave = new ModernButton(isEdit ? "Lưu Thay Đổi" : "Tạo Mới");
        ModernButton btnCancel = new ModernButton("Hủy", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_SECONDARY);
        btnCancel.addActionListener(e -> dialog.dispose());

        btnSave.addActionListener(e -> {
            String id = txtId.getText().trim();
            String name = txtName.getText().trim();
            String phone = txtPhone.getText().trim();
            String email = txtEmail.getText().trim();
            String addr = txtAddress.getText().trim();

            StringBuilder errorMsg = new StringBuilder();
            boolean success;

            if (isEdit) {
                existing.setHoTen(name);
                existing.setSoDienThoai(phone);
                existing.setEmail(email);
                existing.setDiaChi(addr);
                success = facade.updateCustomer(existing, errorMsg);
            } else {
                KhachHang newKh = EntityFactory.createKhachHang(id, name, phone, email, addr);
                success = facade.addCustomer(newKh, errorMsg);
            }

            if (success) {
                JOptionPane.showMessageDialog(dialog, "Thao tác thành công!", "Thông Báo", JOptionPane.INFORMATION_MESSAGE);
                dialog.dispose();
            } else {
                JOptionPane.showMessageDialog(dialog, errorMsg.toString(), "Lỗi", JOptionPane.ERROR_MESSAGE);
            }
        });

        JPanel pnlFooter = ModernDialogHelper.createActionFooter(btnSave, btnCancel);
        dialog.add(pnlFooter, BorderLayout.SOUTH);

        dialog.setVisible(true);
    }

    @Override
    public void onDataChanged(String eventType, Object data) {
        SwingUtilities.invokeLater(this::refreshData);
    }
}
