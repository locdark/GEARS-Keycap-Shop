package com.gears.ui.panels;

import com.gears.model.NhaCungCap;
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
import java.util.List;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;

/**
 * NhaCungCapPanel (Boundary): Quan ly Nha cung cap Keycap (Akko, Keychron, Jelly Key, HolyOOPS...).
 * Theo Module 2 trong so do BFD & Class Diagram.
 */
public class NhaCungCapPanel extends JPanel implements IDataObserver {
    private final GearsShopFacade facade = GearsShopFacade.getInstance();

    private ModernTextField txtSearch;
    private DefaultTableModel tableModel;
    private ModernTable table;

    public NhaCungCapPanel() {
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

        JLabel lblTitle = new JLabel("QUẢN LÝ ĐỐI TÁC & NHÀ CUNG CẤP PHÔI KEYCAP");
        lblTitle.setFont(UITheme.FONT_TITLE);
        lblTitle.setForeground(UITheme.TEXT_PRIMARY);
        pnlTop.add(lblTitle, BorderLayout.NORTH);

        JPanel pnlFilters = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 0));
        pnlFilters.setOpaque(false);

        txtSearch = new ModernTextField("Tìm mã NCC, tên xưởng, SĐT...");
        txtSearch.setPreferredSize(new Dimension(280, 36));
        txtSearch.addActionListener(e -> filterData());
        txtSearch.getDocument().addDocumentListener(new javax.swing.event.DocumentListener() {
            public void insertUpdate(javax.swing.event.DocumentEvent e) { filterData(); }
            public void removeUpdate(javax.swing.event.DocumentEvent e) { filterData(); }
            public void changedUpdate(javax.swing.event.DocumentEvent e) { filterData(); }
        });

        ModernButton btnFilter = new ModernButton("Tìm Kiếm", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_PRIMARY);
        btnFilter.addActionListener(e -> filterData());

        ModernButton btnAdd = new ModernButton("+ Thêm Nhà Cung Cấp", UITheme.PRIMARY_RED, UITheme.PRIMARY_RED_HOVER, Color.WHITE);
        btnAdd.addActionListener(e -> openAddEditDialog(null));

        pnlFilters.add(txtSearch);
        pnlFilters.add(btnFilter);
        pnlFilters.add(btnAdd);

        pnlTop.add(pnlFilters, BorderLayout.CENTER);
        add(pnlTop, BorderLayout.NORTH);
    }

    private void initTable() {
        String[] cols = {"Mã NCC", "Tên Nhà Cung Cấp", "Số Điện Thoại", "Email", "Mặt Hàng Cung Cấp", "Số Sản Phẩm Cung Ứng", "Địa Chỉ Trụ Sở"};
        tableModel = new DefaultTableModel(cols, 0);
        table = new ModernTable(tableModel);

        table.getColumnModel().getColumn(0).setPreferredWidth(80);
        table.getColumnModel().getColumn(1).setPreferredWidth(210);
        table.getColumnModel().getColumn(2).setPreferredWidth(110);
        table.getColumnModel().getColumn(3).setPreferredWidth(150);
        table.getColumnModel().getColumn(4).setPreferredWidth(150);
        table.getColumnModel().getColumn(5).setPreferredWidth(130);
        table.getColumnModel().getColumn(6).setPreferredWidth(200);

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

        ModernButton btnDelete = new ModernButton("Xóa Đối Tác NCC", new Color(0x3E, 0x1A, 0x1E), new Color(0x5A, 0x1E, 0x24), UITheme.STATUS_DANGER);
        btnDelete.addActionListener(e -> deleteSelected());

        pnlBottom.add(btnEdit);
        pnlBottom.add(btnDelete);
        add(pnlBottom, BorderLayout.SOUTH);
    }

    private void filterData() {
        String kw = txtSearch.getText();
        List<NhaCungCap> list = facade.getAllSuppliers();

        tableModel.setRowCount(0);
        for (NhaCungCap ncc : list) {
            if (kw.isEmpty() || ncc.getTenNCC().toLowerCase().contains(kw.toLowerCase()) 
                    || ncc.getMaNCC().toLowerCase().contains(kw.toLowerCase())
                    || ncc.getSdt().contains(kw)) {
                int countSP = facade.getSupplierProductCount(ncc.getMaNCC());
                tableModel.addRow(new Object[]{
                    ncc.getMaNCC(),
                    ncc.getTenNCC(),
                    ncc.getSdt(),
                    ncc.getEmail(),
                    ncc.getMatHangCungCap(),
                    countSP + " keycaps",
                    ncc.getDiaChi()
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
            JOptionPane.showMessageDialog(this, "Vui lòng chọn 1 nhà cung cấp để sửa!", "Nhắc nhở", JOptionPane.WARNING_MESSAGE);
            return;
        }

        String maNCC = (String) table.getValueAt(row, 0);
        NhaCungCap ncc = facade.getAllSuppliers().stream().filter(s -> s.getMaNCC().equals(maNCC)).findFirst().orElse(null);
        if (ncc != null) openAddEditDialog(ncc);
    }

    private void deleteSelected() {
        int row = table.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Vui lòng chọn 1 nhà cung cấp để xóa!", "Nhắc nhở", JOptionPane.WARNING_MESSAGE);
            return;
        }

        String maNCC = (String) table.getValueAt(row, 0);
        int confirm = JOptionPane.showConfirmDialog(this,
                "Bạn có chắc muốn xóa đối tác [" + maNCC + "]?\n(Hệ thống sẽ kiểm tra toàn vẹn ràng buộc sản phẩm liên kết)",
                "Xác Nhận Xóa NCC", JOptionPane.YES_NO_OPTION, JOptionPane.WARNING_MESSAGE);

        if (confirm == JOptionPane.YES_OPTION) {
            StringBuilder errorMsg = new StringBuilder();
            boolean ok = facade.deleteSupplier(maNCC, errorMsg);
            if (ok) {
                JOptionPane.showMessageDialog(this, "Đã xóa nhà cung cấp thành công!", "Thành Công", JOptionPane.INFORMATION_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(this, errorMsg.toString(), "Từ Chối Xóa (Ràng Buộc Khóa Ngoại)", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private void openAddEditDialog(NhaCungCap existing) {
        boolean isEdit = (existing != null);
        JDialog dialog = new JDialog((Frame) SwingUtilities.getWindowAncestor(this), isEdit ? "Sửa Nhà Cung Cấp " + existing.getMaNCC() : "Thêm Nhà Cung Cấp Mới", true);
        dialog.setSize(520, 520);
        dialog.setLocationRelativeTo(this);
        dialog.getContentPane().setBackground(UITheme.BG_MAIN);
        dialog.setLayout(new BorderLayout(0, 0));

        JPanel pnlHeader = ModernDialogHelper.createModalHeader(
            isEdit ? "CẬP NHẬT ĐỐI TÁC CUNG ỨNG #" + existing.getMaNCC() : "THÊM ĐỐI TÁC / NHÀ CUNG CẤP",
            isEdit ? "Điều chỉnh địa chỉ xưởng, số điện thoại và mặt hàng" : "Thêm mới xưởng sản xuất và nhập hàng keycap",
            VectorIcon.Type.SUPPLIER
        );
        dialog.add(pnlHeader, BorderLayout.NORTH);

        JPanel pnlForm = new JPanel(new GridLayout(6, 2, 10, 14));
        pnlForm.setOpaque(false);
        pnlForm.setBorder(new EmptyBorder(18, 24, 18, 24));

        ModernTextField txtMa = new ModernTextField();
        if (isEdit) {
            txtMa.setText(existing.getMaNCC());
            txtMa.setEnabled(false);
        } else {
            txtMa.setPlaceholder("Tự sinh nếu để trống (VD: NCC05)");
        }

        ModernTextField txtTen = new ModernTextField();
        if (isEdit) txtTen.setText(existing.getTenNCC());

        ModernTextField txtSdt = new ModernTextField();
        if (isEdit) txtSdt.setText(existing.getSdt());

        ModernTextField txtEmail = new ModernTextField();
        if (isEdit) txtEmail.setText(existing.getEmail());

        ModernTextField txtMatHang = new ModernTextField();
        if (isEdit) txtMatHang.setText(existing.getMatHangCungCap());

        ModernTextField txtDiaChi = new ModernTextField();
        if (isEdit) txtDiaChi.setText(existing.getDiaChi());

        pnlForm.add(ModernDialogHelper.createFieldLabel("Mã Nhà Cung Cấp:"));
        pnlForm.add(txtMa);
        pnlForm.add(ModernDialogHelper.createFieldLabel("Tên Đối Tác / Xưởng:"));
        pnlForm.add(txtTen);
        pnlForm.add(ModernDialogHelper.createFieldLabel("Số Điện Thoại:"));
        pnlForm.add(txtSdt);
        pnlForm.add(ModernDialogHelper.createFieldLabel("Email Liên Hệ:"));
        pnlForm.add(txtEmail);
        pnlForm.add(ModernDialogHelper.createFieldLabel("Mặt Hàng Cung Ứng:"));
        pnlForm.add(txtMatHang);
        pnlForm.add(ModernDialogHelper.createFieldLabel("Địa Chỉ Trụ Sở:"));
        pnlForm.add(txtDiaChi);

        dialog.add(pnlForm, BorderLayout.CENTER);

        ModernButton btnSave = new ModernButton(isEdit ? "Lưu Cập Nhật" : "Tạo NCC Mới");
        ModernButton btnCancel = new ModernButton("Hủy", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_SECONDARY);
        btnCancel.addActionListener(e -> dialog.dispose());

        btnSave.addActionListener(e -> {
            String ma = txtMa.getText().trim();
            String ten = txtTen.getText().trim();
            String sdt = txtSdt.getText().trim();
            String email = txtEmail.getText().trim();
            String matHang = txtMatHang.getText().trim();
            String diaChi = txtDiaChi.getText().trim();

            StringBuilder errorMsg = new StringBuilder();
            boolean success;

            if (isEdit) {
                existing.setTenNCC(ten);
                existing.setSdt(sdt);
                existing.setEmail(email);
                existing.setMatHangCungCap(matHang);
                existing.setDiaChi(diaChi);
                success = facade.updateSupplier(existing, errorMsg);
            } else {
                NhaCungCap ncc = EntityFactory.createNhaCungCap(ma, ten, diaChi, sdt, email, matHang, "");
                success = facade.addSupplier(ncc, errorMsg);
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
