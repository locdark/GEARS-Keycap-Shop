package com.gears.ui.panels;

import com.gears.model.NhanVien;
import com.gears.patterns.facade.GearsShopFacade;
import com.gears.patterns.factory.EntityFactory;
import com.gears.patterns.observer.IDataObserver;
import com.gears.patterns.observer.Subject;
import com.gears.ui.components.ModernButton;
import com.gears.ui.components.ModernTable;
import com.gears.ui.components.ModernTextField;
import com.gears.ui.theme.UITheme;

import java.awt.*;
import java.util.List;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;

/**
 * NhanVienPanel (Boundary): Quan ly Nhan su, Phan quyen Quan tri vien vs Thu ngan POS.
 * Theo Module 6 trong so do BFD & Class Diagram.
 */
public class NhanVienPanel extends JPanel implements IDataObserver {
    private final GearsShopFacade facade = GearsShopFacade.getInstance();

    private ModernTextField txtSearch;
    private DefaultTableModel tableModel;
    private ModernTable table;

    public NhanVienPanel() {
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

        JLabel lblTitle = new JLabel("QUẢN LÝ NHÂN VIÊN & PHÂN QUYỀN HỆ THỐNG");
        lblTitle.setFont(UITheme.FONT_TITLE);
        lblTitle.setForeground(UITheme.TEXT_PRIMARY);
        pnlTop.add(lblTitle, BorderLayout.NORTH);

        JPanel pnlFilters = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 0));
        pnlFilters.setOpaque(false);

        txtSearch = new ModernTextField("Tìm tên, mã nhân viên, username...");
        txtSearch.setPreferredSize(new Dimension(300, 36));
        txtSearch.addActionListener(e -> filterData());
        txtSearch.getDocument().addDocumentListener(new javax.swing.event.DocumentListener() {
            public void insertUpdate(javax.swing.event.DocumentEvent e) { filterData(); }
            public void removeUpdate(javax.swing.event.DocumentEvent e) { filterData(); }
            public void changedUpdate(javax.swing.event.DocumentEvent e) { filterData(); }
        });

        ModernButton btnSearch = new ModernButton("Tra Cứu", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_PRIMARY);
        btnSearch.addActionListener(e -> filterData());

        ModernButton btnAdd = new ModernButton("+ Thêm Nhân Viên Mới", UITheme.PRIMARY_RED, UITheme.PRIMARY_RED_HOVER, Color.WHITE);
        btnAdd.addActionListener(e -> openAddEditDialog(null));

        pnlFilters.add(txtSearch);
        pnlFilters.add(btnSearch);
        pnlFilters.add(btnAdd);

        pnlTop.add(pnlFilters, BorderLayout.CENTER);
        add(pnlTop, BorderLayout.NORTH);
    }

    private void initTable() {
        String[] cols = {"Mã NV", "Họ và Tên", "Tên Đăng Nhập", "Chức Vụ / Vai Trò", "Số Điện Thoại", "Email", "Ngày Vào Làm", "Trạng Thái"};
        tableModel = new DefaultTableModel(cols, 0);
        table = new ModernTable(tableModel);

        table.getColumnModel().getColumn(0).setPreferredWidth(70);
        table.getColumnModel().getColumn(1).setPreferredWidth(170);
        table.getColumnModel().getColumn(2).setPreferredWidth(110);
        table.getColumnModel().getColumn(3).setPreferredWidth(180);
        table.getColumnModel().getColumn(4).setPreferredWidth(110);
        table.getColumnModel().getColumn(5).setPreferredWidth(170);
        table.getColumnModel().getColumn(6).setPreferredWidth(100);
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

        ModernButton btnRole = new ModernButton("Chuyển Quyền (Admin / POS)", UITheme.PRIMARY_RED, UITheme.PRIMARY_RED_HOVER, Color.WHITE);
        btnRole.addActionListener(e -> changeRoleSelected());

        ModernButton btnLock = new ModernButton("Khóa / Mở Khóa Truy Cập", new Color(0x3E, 0x1A, 0x1E), new Color(0x5A, 0x1E, 0x24), UITheme.STATUS_DANGER);
        btnLock.addActionListener(e -> toggleLockSelected());

        pnlBottom.add(btnEdit);
        pnlBottom.add(btnRole);
        pnlBottom.add(btnLock);
        add(pnlBottom, BorderLayout.SOUTH);
    }

    private void filterData() {
        String kw = txtSearch.getText();
        List<NhanVien> list = facade.getAllEmployees();

        tableModel.setRowCount(0);
        for (NhanVien nv : list) {
            if (kw.isEmpty() || nv.getHoTen().toLowerCase().contains(kw.toLowerCase()) 
                    || nv.getUsername().toLowerCase().contains(kw.toLowerCase())
                    || nv.getId().toLowerCase().contains(kw.toLowerCase())) {
                String statusStr = nv.isLocked() ? "Đã khóa" : "Hoạt động";
                tableModel.addRow(new Object[]{
                    nv.getId(),
                    nv.getHoTen(),
                    nv.getUsername(),
                    nv.getVaiTro(),
                    nv.getSoDienThoai(),
                    nv.getEmail(),
                    nv.getNgayVaoLam(),
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
            JOptionPane.showMessageDialog(this, "Vui lòng chọn 1 nhân viên để sửa!", "Nhắc nhở", JOptionPane.WARNING_MESSAGE);
            return;
        }

        String id = (String) table.getValueAt(row, 0);
        NhanVien nv = facade.getAllEmployees().stream().filter(e -> e.getId().equals(id)).findFirst().orElse(null);
        if (nv != null) openAddEditDialog(nv);
    }

    private void changeRoleSelected() {
        int row = table.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Vui lòng chọn 1 nhân viên để phân quyền!", "Nhắc nhở", JOptionPane.WARNING_MESSAGE);
            return;
        }

        String id = (String) table.getValueAt(row, 0);
        NhanVien nv = facade.getAllEmployees().stream().filter(e -> e.getId().equals(id)).findFirst().orElse(null);
        if (nv == null) return;

        String[] roles = {"admin (Quản Trị Viên / Quản Lý)", "pos (Nhân Viên Bán Hàng / Thu Ngân)"};
        int currentIdx = nv.kiemTraQuyenAdmin() ? 0 : 1;

        String selected = (String) JOptionPane.showInputDialog(this,
                "Chọn vai trò mới cho nhân viên [" + nv.getHoTen() + "]:",
                "Phân Quyền Nhân Sự", JOptionPane.QUESTION_MESSAGE, null, roles, roles[currentIdx]);

        if (selected != null) {
            String roleCode = selected.startsWith("admin") ? "admin" : "pos";
            facade.assignEmployeeRole(id, roleCode);
            JOptionPane.showMessageDialog(this, "Đã cập nhật quyền hạn thành công!", "Thành Công", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    private void toggleLockSelected() {
        int row = table.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Vui lòng chọn 1 nhân viên để khóa/mở khóa!", "Nhắc nhở", JOptionPane.WARNING_MESSAGE);
            return;
        }

        String id = (String) table.getValueAt(row, 0);
        NhanVien nv = facade.getAllEmployees().stream().filter(e -> e.getId().equals(id)).findFirst().orElse(null);
        if (nv == null) return;

        StringBuilder errorMsg = new StringBuilder();
        boolean ok = facade.toggleEmployeeLock(id, errorMsg);
        if (ok) {
            JOptionPane.showMessageDialog(this, "Cập nhật trạng thái truy cập thành công!", "Thông Báo", JOptionPane.INFORMATION_MESSAGE);
        } else {
            JOptionPane.showMessageDialog(this, errorMsg.toString(), "Từ Chối Thao Tác", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void openAddEditDialog(NhanVien existing) {
        boolean isEdit = (existing != null);
        JDialog dialog = new JDialog((Frame) SwingUtilities.getWindowAncestor(this), isEdit ? "Sửa Nhân Viên " + existing.getId() : "Thêm Nhân Viên Mới", true);
        dialog.setSize(520, 560);
        dialog.setLocationRelativeTo(this);
        dialog.getContentPane().setBackground(UITheme.BG_MAIN);
        dialog.setLayout(new BorderLayout());

        // 1. Header Banner
        JPanel pnlHeader = com.gears.ui.components.ModernDialogHelper.createModalHeader(
            isEdit ? "CHỈNH SỬA NHÂN VIÊN #" + existing.getId() : "THÊM NHÂN VIÊN MỚI",
            "Cập nhật tài khoản đăng nhập, chức vụ và phân quyền quản trị",
            com.gears.ui.components.VectorIcon.Type.EMPLOYEE
        );
        dialog.add(pnlHeader, BorderLayout.NORTH);

        // 2. Form Body
        JPanel pnlBodyWrapper = new JPanel(new BorderLayout());
        pnlBodyWrapper.setOpaque(false);
        pnlBodyWrapper.setBorder(new EmptyBorder(16, 24, 16, 24));

        JPanel pnlForm = new JPanel(new GridLayout(7, 2, 12, 12));
        pnlForm.setOpaque(false);

        ModernTextField txtId = new ModernTextField();
        if (isEdit) {
            txtId.setText(existing.getId());
            txtId.setEnabled(false);
        } else {
            txtId.setPlaceholder("Tự sinh nếu trống (VD: NV05)");
        }

        ModernTextField txtName = new ModernTextField();
        if (isEdit) txtName.setText(existing.getHoTen());

        ModernTextField txtUsername = new ModernTextField();
        if (isEdit) {
            txtUsername.setText(existing.getUsername());
            txtUsername.setEnabled(false);
        }

        com.gears.ui.components.ModernPasswordField txtPass = new com.gears.ui.components.ModernPasswordField();
        if (isEdit) txtPass.setText(existing.getPassword());

        JComboBox<String> cbRole = com.gears.ui.components.ModernDialogHelper.createStyledComboBox(new String[]{"admin (Quản trị viên)", "pos (Thu ngân POS)"});
        if (isEdit && !existing.kiemTraQuyenAdmin()) cbRole.setSelectedIndex(1);

        ModernTextField txtPhone = new ModernTextField();
        if (isEdit) txtPhone.setText(existing.getSoDienThoai());

        ModernTextField txtEmail = new ModernTextField();
        if (isEdit) txtEmail.setText(existing.getEmail());

        pnlForm.add(com.gears.ui.components.ModernDialogHelper.createFieldLabel("Mã Nhân Viên:"));
        pnlForm.add(txtId);
        pnlForm.add(com.gears.ui.components.ModernDialogHelper.createFieldLabel("Họ và Tên:"));
        pnlForm.add(txtName);
        pnlForm.add(com.gears.ui.components.ModernDialogHelper.createFieldLabel("Tên Đăng Nhập:"));
        pnlForm.add(txtUsername);
        pnlForm.add(com.gears.ui.components.ModernDialogHelper.createFieldLabel("Mật Khẩu (>=8 ký tự, hoa, đặc biệt):"));
        pnlForm.add(txtPass);
        pnlForm.add(com.gears.ui.components.ModernDialogHelper.createFieldLabel("Chức Vụ / Phân Quyền:"));
        pnlForm.add(cbRole);
        pnlForm.add(com.gears.ui.components.ModernDialogHelper.createFieldLabel("Số Điện Thoại:"));
        pnlForm.add(txtPhone);
        pnlForm.add(com.gears.ui.components.ModernDialogHelper.createFieldLabel("Email Nội Bộ:"));
        pnlForm.add(txtEmail);

        pnlBodyWrapper.add(pnlForm, BorderLayout.CENTER);
        dialog.add(pnlBodyWrapper, BorderLayout.CENTER);

        // 3. Footer Action Buttons
        ModernButton btnSave = new ModernButton(isEdit ? "Lưu Thay Đổi" : "Tạo Mới", UITheme.PRIMARY_RED, UITheme.PRIMARY_RED_HOVER, Color.WHITE);
        btnSave.setPreferredSize(new Dimension(140, 38));
        btnSave.addActionListener(e -> {
            String id = txtId.getText().trim();
            String name = txtName.getText().trim();
            String user = txtUsername.getText().trim();
            String pass = new String(txtPass.getPassword()).trim();
            String role = ((String) cbRole.getSelectedItem()).startsWith("admin") ? "admin" : "pos";
            String phone = txtPhone.getText().trim();
            String email = txtEmail.getText().trim();

            StringBuilder errorMsg = new StringBuilder();
            boolean success;

            if (isEdit) {
                existing.setHoTen(name);
                existing.setPassword(pass);
                existing.setChucVu(role);
                existing.setSoDienThoai(phone);
                existing.setEmail(email);
                success = facade.updateEmployee(existing, errorMsg);
            } else {
                NhanVien newNv = EntityFactory.createNhanVien(id, name, phone, email, role, user, pass);
                success = facade.addEmployee(newNv, errorMsg);
            }

            if (success) {
                JOptionPane.showMessageDialog(dialog, "Thao tác thành công!", "Thông Báo", JOptionPane.INFORMATION_MESSAGE);
                dialog.dispose();
            } else {
                JOptionPane.showMessageDialog(dialog, errorMsg.toString(), "Lỗi", JOptionPane.ERROR_MESSAGE);
            }
        });

        ModernButton btnCancel = new ModernButton("Hủy", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_SECONDARY);
        btnCancel.setPreferredSize(new Dimension(100, 38));
        btnCancel.addActionListener(e -> dialog.dispose());

        JPanel pnlFooter = com.gears.ui.components.ModernDialogHelper.createActionFooter(btnSave, btnCancel);
        dialog.add(pnlFooter, BorderLayout.SOUTH);

        dialog.setVisible(true);
    }

    @Override
    public void onDataChanged(String eventType, Object data) {
        SwingUtilities.invokeLater(this::refreshData);
    }
}
