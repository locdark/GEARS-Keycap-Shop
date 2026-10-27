package com.gears.ui.panels;

import com.gears.model.NhaCungCap;
import com.gears.model.SanPhamKeycap;
import com.gears.patterns.facade.GearsShopFacade;
import com.gears.patterns.factory.SanPhamFactory;
import com.gears.patterns.observer.IDataObserver;
import com.gears.patterns.observer.Subject;
import com.gears.ui.components.ImageHelper;
import com.gears.ui.components.ModernButton;
import com.gears.ui.components.ModernComboBox;
import com.gears.ui.components.ModernDialogHelper;
import com.gears.ui.components.ModernTable;
import com.gears.ui.components.ModernTextField;
import com.gears.ui.components.VectorIcon;
import com.gears.ui.theme.UITheme;

import java.awt.*;
import java.io.File;
import java.text.DecimalFormat;
import java.util.List;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;

/**
 * SanPhamPanel (Boundary): Giao dien quan ly Kho & 100 san pham Keycap.
 * Thuoc Module 5 trong so do BFD & Class Diagram.
 * Ket noi truc tiep xuong SanPhamService qua GearsShopFacade (3 Lớp: GUI -> BUS -> DAO).
 */
public class SanPhamPanel extends JPanel implements IDataObserver {
    private final GearsShopFacade facade = GearsShopFacade.getInstance();

    private ModernTextField txtSearch;
    private ModernComboBox<String> cbCategory;
    private DefaultTableModel tableModel;
    private ModernTable table;

    private static final DecimalFormat CURRENCY = new DecimalFormat("#,##0 'VNĐ'");

    public SanPhamPanel() {
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

        JLabel lblTitle = new JLabel("QUẢN LÝ SẢN PHẨM & KHO HÀNG (100 KEYCAPS)");
        lblTitle.setFont(UITheme.FONT_TITLE);
        lblTitle.setForeground(UITheme.TEXT_PRIMARY);
        pnlTop.add(lblTitle, BorderLayout.NORTH);

        JPanel pnlFilters = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 0));
        pnlFilters.setOpaque(false);

        txtSearch = new ModernTextField("Tìm kiếm tên keycap, mã SP...");
        txtSearch.setPreferredSize(new Dimension(280, 36));
        txtSearch.addActionListener(e -> filterData());
        txtSearch.getDocument().addDocumentListener(new javax.swing.event.DocumentListener() {
            public void insertUpdate(javax.swing.event.DocumentEvent e) { filterData(); }
            public void removeUpdate(javax.swing.event.DocumentEvent e) { filterData(); }
            public void changedUpdate(javax.swing.event.DocumentEvent e) { filterData(); }
        });

        cbCategory = new ModernComboBox<>(new String[]{"Tất cả", "Artisan", "Anime", "Pudding", "Cherry", "Other"});
        cbCategory.setPreferredSize(new Dimension(130, 36));
        cbCategory.addActionListener(e -> filterData());

        ModernButton btnFilter = new ModernButton("Lọc Dữ Liệu", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_PRIMARY);
        btnFilter.addActionListener(e -> filterData());

        ModernButton btnAdd = new ModernButton("+ Thêm Sản Phẩm Mới", UITheme.PRIMARY_RED, UITheme.PRIMARY_RED_HOVER, Color.WHITE);
        btnAdd.addActionListener(e -> openAddEditDialog(null));

        pnlFilters.add(txtSearch);
        pnlFilters.add(cbCategory);
        pnlFilters.add(btnFilter);
        pnlFilters.add(btnAdd);

        pnlTop.add(pnlFilters, BorderLayout.CENTER);
        add(pnlTop, BorderLayout.NORTH);
    }

    private void initTable() {
        String[] cols = {"Ảnh", "Mã SP", "Tên Sản Phẩm", "Thể Loại", "Giá Vốn Nhập", "Giá Niêm Yết", "Tồn Kho", "Lợi Nhuận/Nút", "Nhà Cung Cấp"};
        tableModel = new DefaultTableModel(cols, 0);
        table = new ModernTable(tableModel);
        table.setRowHeight(44);

        table.getColumnModel().getColumn(0).setPreferredWidth(52);  // Ảnh Thumbnail
        table.getColumnModel().getColumn(1).setPreferredWidth(55);  // Mã SP
        table.getColumnModel().getColumn(2).setPreferredWidth(260); // Tên Sản Phẩm
        table.getColumnModel().getColumn(3).setPreferredWidth(85);  // Thể Loại
        table.getColumnModel().getColumn(4).setPreferredWidth(105); // Giá Vốn Nhập
        table.getColumnModel().getColumn(5).setPreferredWidth(105); // Giá Niêm Yết
        table.getColumnModel().getColumn(6).setPreferredWidth(70);  // Tồn Kho
        table.getColumnModel().getColumn(7).setPreferredWidth(105); // Lợi Nhuận/Nút
        table.getColumnModel().getColumn(8).setPreferredWidth(85);  // Nhà Cung Cấp

        // Double-click row de mo hop thoai sua san pham
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

        ModernButton btnEdit = new ModernButton("Chỉnh Sửa", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_PRIMARY);
        btnEdit.addActionListener(e -> editSelected());

        ModernButton btnAddStock = new ModernButton("+ Nhập Thêm Hàng", new Color(0x1B, 0x38, 0x2B), new Color(0x23, 0x4C, 0x3A), UITheme.STATUS_SUCCESS);
        btnAddStock.addActionListener(e -> quickAdjustStock(true));

        ModernButton btnSubStock = new ModernButton("- Xuất Bớt Kho", new Color(0x3D, 0x32, 0x1A), new Color(0x52, 0x43, 0x22), UITheme.STATUS_WARNING);
        btnSubStock.addActionListener(e -> quickAdjustStock(false));

        ModernButton btnDelete = new ModernButton("Xóa Sản Phẩm", new Color(0x3E, 0x1A, 0x1E), new Color(0x5A, 0x1E, 0x24), UITheme.STATUS_DANGER);
        btnDelete.addActionListener(e -> deleteSelected());

        pnlBottom.add(btnEdit);
        pnlBottom.add(btnAddStock);
        pnlBottom.add(btnSubStock);
        pnlBottom.add(btnDelete);

        add(pnlBottom, BorderLayout.SOUTH);
    }

    private void filterData() {
        String kw = txtSearch.getText();
        String cat = (String) cbCategory.getSelectedItem();
        List<SanPhamKeycap> list = facade.searchProducts(kw, cat, 0, 0);

        tableModel.setRowCount(0);
        for (SanPhamKeycap sp : list) {
            tableModel.addRow(new Object[]{
                ImageHelper.getProductImage(sp.getHinhAnh(), 42, 34),
                sp.getMaSP(),
                sp.getTenSP(),
                sp.getTheLoai(),
                CURRENCY.format(sp.getGiaNhap()),
                CURRENCY.format(sp.getGiaBan()),
                sp.getSoLuongTon(),
                CURRENCY.format(sp.tinhLoiNhuanDonVi()),
                sp.getMaNCC()
            });
        }
    }

    public void refreshData() {
        filterData();
    }

    private void quickAdjustStock(boolean isAdd) {
        int row = table.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Vui lòng chọn 1 sản phẩm trong bảng!", "Nhắc nhở", JOptionPane.WARNING_MESSAGE);
            return;
        }

        int id = (Integer) table.getValueAt(row, 1);
        SanPhamKeycap sp = facade.getProductById(id);
        if (sp == null) return;

        String action = isAdd ? "NHẬP THÊM" : "XUẤT GIẢM";
        String input = JOptionPane.showInputDialog(this, 
                "Nhập số lượng muốn " + action + " cho sản phẩm:\n[" + sp.getTenSP() + "]\nTồn kho hiện tại: " + sp.getSoLuongTon(), 
                "Điều Chỉnh Tồn Kho", JOptionPane.QUESTION_MESSAGE);

        if (input == null || input.trim().isEmpty()) return;

        try {
            int qty = Integer.parseInt(input.trim());
            if (qty <= 0) {
                JOptionPane.showMessageDialog(this, "Số lượng phải lớn hơn 0!", "Lỗi", JOptionPane.ERROR_MESSAGE);
                return;
            }

            int delta = isAdd ? qty : -qty;
            StringBuilder errorMsg = new StringBuilder();
            boolean ok = facade.adjustStock(id, delta, errorMsg);

            if (ok) {
                JOptionPane.showMessageDialog(this, "Cập nhật tồn kho thành công! Tồn kho mới: " + sp.getSoLuongTon(), "Thành Công", JOptionPane.INFORMATION_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(this, errorMsg.toString(), "Lỗi", JOptionPane.ERROR_MESSAGE);
            }
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Số lượng nhập vào không hợp lệ!", "Lỗi", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void deleteSelected() {
        int row = table.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Vui lòng chọn 1 sản phẩm để xóa!", "Nhắc nhở", JOptionPane.WARNING_MESSAGE);
            return;
        }

        int id = (Integer) table.getValueAt(row, 1);
        SanPhamKeycap sp = facade.getProductById(id);
        if (sp == null) return;

        int confirm = JOptionPane.showConfirmDialog(this,
                "Bạn có chắc chắn muốn xóa sản phẩm:\n[" + sp.getTenSP() + "] (Mã: #" + id + ")?",
                "Xác Nhận Xóa", JOptionPane.YES_NO_OPTION, JOptionPane.WARNING_MESSAGE);

        if (confirm == JOptionPane.YES_OPTION) {
            StringBuilder errorMsg = new StringBuilder();
            boolean ok = facade.deleteProduct(id, errorMsg);
            if (ok) {
                JOptionPane.showMessageDialog(this, "Đã xóa sản phẩm thành công!", "Thành Công", JOptionPane.INFORMATION_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(this, errorMsg.toString(), "Từ Chối Xóa", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private void editSelected() {
        int row = table.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this, "Vui lòng chọn 1 sản phẩm để sửa!", "Nhắc nhở", JOptionPane.WARNING_MESSAGE);
            return;
        }

        int id = (Integer) table.getValueAt(row, 1);
        SanPhamKeycap sp = facade.getProductById(id);
        if (sp != null) {
            openAddEditDialog(sp);
        }
    }

    private void openAddEditDialog(SanPhamKeycap existing) {
        boolean isEdit = (existing != null);
        JDialog dialog = new JDialog((Frame) SwingUtilities.getWindowAncestor(this), isEdit ? "Chỉnh Sửa Sản Phẩm #" + existing.getMaSP() : "Thêm Sản Phẩm Keycap Mới", true);
        dialog.setSize(760, 600);
        dialog.setLocationRelativeTo(this);
        dialog.getContentPane().setBackground(UITheme.BG_MAIN);
        dialog.setLayout(new BorderLayout(0, 0));

        // Header Modal
        JPanel pnlHeader = ModernDialogHelper.createModalHeader(
            isEdit ? "CHỈNH SỬA SẢN PHẨM #" + existing.getMaSP() : "THÊM SẢN PHẨM KEYCAP MỚI",
            isEdit ? "Cập nhật hình ảnh, thông số kỹ thuật, giá bán và tồn kho" : "Tạo mới sản phẩm keycap, chọn ảnh minh họa và thiết lập giá",
            VectorIcon.Type.KEYCAP
        );
        dialog.add(pnlHeader, BorderLayout.NORTH);

        // Center Split Panel: Left is Image Manager, Right is Form Fields
        JPanel pnlCenter = new JPanel(new BorderLayout(18, 0));
        pnlCenter.setOpaque(false);
        pnlCenter.setBorder(new EmptyBorder(18, 22, 18, 22));

        // === LEFT PANEL: IMAGE MANAGER & LIVE PREVIEW ===
        JPanel pnlImageManager = new JPanel();
        pnlImageManager.setLayout(new BoxLayout(pnlImageManager, BoxLayout.Y_AXIS));
        pnlImageManager.setPreferredSize(new Dimension(240, 400));
        pnlImageManager.setBackground(new Color(0x18, 0x1B, 0x22));
        pnlImageManager.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(0x2D, 0x33, 0x40), 1, true),
            new EmptyBorder(14, 14, 14, 14)
        ));

        JLabel lblImgSection = ModernDialogHelper.createFieldLabel("ẢNH SẢN PHẨM");
        lblImgSection.setAlignmentX(Component.CENTER_ALIGNMENT);

        // Path holder for mutable reference in lambdas
        final String[] currentImagePath = new String[]{ 
            (isEdit && existing.getHinhAnh() != null) ? existing.getHinhAnh() : "./assets/img/Products/Artisan/001.jpg" 
        };

        JLabel lblImagePreview = new JLabel();
        lblImagePreview.setPreferredSize(new Dimension(200, 150));
        lblImagePreview.setMaximumSize(new Dimension(200, 150));
        lblImagePreview.setAlignmentX(Component.CENTER_ALIGNMENT);
        lblImagePreview.setHorizontalAlignment(SwingConstants.CENTER);
        lblImagePreview.setBackground(new Color(0x12, 0x14, 0x1A));
        lblImagePreview.setOpaque(true);
        lblImagePreview.setBorder(BorderFactory.createLineBorder(new Color(0x3B, 0x42, 0x52), 1, true));
        lblImagePreview.setIcon(ImageHelper.getProductImage(currentImagePath[0], 195, 145));

        JLabel lblPathDisplay = new JLabel();
        lblPathDisplay.setFont(new Font("Segoe UI", Font.ITALIC, 11));
        lblPathDisplay.setForeground(new Color(0x94, 0xA3, 0xB8));
        lblPathDisplay.setAlignmentX(Component.CENTER_ALIGNMENT);
        lblPathDisplay.setHorizontalAlignment(SwingConstants.CENTER);
        lblPathDisplay.setMaximumSize(new Dimension(210, 24));
        updatePathDisplayLabel(lblPathDisplay, currentImagePath[0]);

        ModernButton btnBrowse = new ModernButton("📂 Tải Lên / Chọn Ảnh...", UITheme.PRIMARY_RED, UITheme.PRIMARY_RED_HOVER, Color.WHITE);
        btnBrowse.setAlignmentX(Component.CENTER_ALIGNMENT);
        btnBrowse.setMaximumSize(new Dimension(210, 36));
        btnBrowse.addActionListener(e -> {
            String savedPath = ImageHelper.chooseAndSaveImage(dialog);
            if (savedPath != null) {
                currentImagePath[0] = savedPath;
                ImageHelper.clearCache();
                lblImagePreview.setIcon(ImageHelper.getProductImage(savedPath, 195, 145));
                updatePathDisplayLabel(lblPathDisplay, savedPath);
            }
        });

        ModernButton btnResetImg = new ModernButton("🔄 Dùng Ảnh Gốc", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_SECONDARY);
        btnResetImg.setAlignmentX(Component.CENTER_ALIGNMENT);
        btnResetImg.setMaximumSize(new Dimension(210, 32));
        btnResetImg.addActionListener(e -> {
            currentImagePath[0] = "./assets/img/Products/Artisan/001.jpg";
            lblImagePreview.setIcon(ImageHelper.getProductImage(currentImagePath[0], 195, 145));
            updatePathDisplayLabel(lblPathDisplay, currentImagePath[0]);
        });

        pnlImageManager.add(lblImgSection);
        pnlImageManager.add(Box.createVerticalStrut(10));
        pnlImageManager.add(lblImagePreview);
        pnlImageManager.add(Box.createVerticalStrut(8));
        pnlImageManager.add(lblPathDisplay);
        pnlImageManager.add(Box.createVerticalStrut(12));
        pnlImageManager.add(btnBrowse);
        pnlImageManager.add(Box.createVerticalStrut(8));
        pnlImageManager.add(btnResetImg);

        pnlCenter.add(pnlImageManager, BorderLayout.WEST);

        // === RIGHT PANEL: FORM FIELDS ===
        JPanel pnlForm = new JPanel(new GridLayout(7, 2, 10, 12));
        pnlForm.setOpaque(false);

        ModernTextField txtName = new ModernTextField();
        if (isEdit) txtName.setText(existing.getTenSP());

        JComboBox<String> cbType = ModernDialogHelper.createStyledComboBox(new String[]{"Artisan", "Anime", "Pudding", "Cherry", "Other"});
        if (isEdit) cbType.setSelectedItem(existing.getTheLoai());

        ModernTextField txtCost = new ModernTextField();
        if (isEdit) txtCost.setText(String.format("%.0f", existing.getGiaNhap()));

        ModernTextField txtPrice = new ModernTextField();
        if (isEdit) txtPrice.setText(String.format("%.0f", existing.getGiaBan()));

        ModernTextField txtStock = new ModernTextField();
        if (isEdit) txtStock.setText(String.valueOf(existing.getSoLuongTon()));

        List<NhaCungCap> allSuppliers = facade.getAllSuppliers();
        String[] nccItems = new String[allSuppliers.size()];
        for (int i = 0; i < allSuppliers.size(); i++) {
            NhaCungCap s = allSuppliers.get(i);
            nccItems[i] = s.getMaNCC() + " - " + s.getTenNCC();
        }
        JComboBox<String> cbNCC = ModernDialogHelper.createStyledComboBox(nccItems);
        if (isEdit && existing.getMaNCC() != null) {
            for (int i = 0; i < cbNCC.getItemCount(); i++) {
                if (cbNCC.getItemAt(i).startsWith(existing.getMaNCC())) {
                    cbNCC.setSelectedIndex(i);
                    break;
                }
            }
        }

        ModernTextField txtDesc = new ModernTextField();
        if (isEdit) txtDesc.setText(existing.getMoTa());

        pnlForm.add(ModernDialogHelper.createFieldLabel("Tên Sản Phẩm:"));
        pnlForm.add(txtName);
        pnlForm.add(ModernDialogHelper.createFieldLabel("Thể Loại / Dòng Phím:"));
        pnlForm.add(cbType);
        pnlForm.add(ModernDialogHelper.createFieldLabel("Giá Vốn Nhập (VNĐ):"));
        pnlForm.add(txtCost);
        pnlForm.add(ModernDialogHelper.createFieldLabel("Giá Bán Niêm Yết (VNĐ):"));
        pnlForm.add(txtPrice);
        pnlForm.add(ModernDialogHelper.createFieldLabel("Số Lượng Tồn Kho (Nút):"));
        pnlForm.add(txtStock);
        pnlForm.add(ModernDialogHelper.createFieldLabel("Nhà Cung Cấp / Xưởng:"));
        pnlForm.add(cbNCC);
        pnlForm.add(ModernDialogHelper.createFieldLabel("Mô Tả Profile & Switch:"));
        pnlForm.add(txtDesc);

        pnlCenter.add(pnlForm, BorderLayout.CENTER);
        dialog.add(pnlCenter, BorderLayout.CENTER);

        // Buttons Footer
        ModernButton btnSave = new ModernButton(isEdit ? "Lưu Thông Tin & Ảnh" : "Tạo Mới Sản Phẩm");
        ModernButton btnCancel = new ModernButton("Hủy Bỏ", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_SECONDARY);
        btnCancel.addActionListener(e -> dialog.dispose());

        btnSave.addActionListener(e -> {
            try {
                String name = txtName.getText().trim();
                String type = (String) cbType.getSelectedItem();
                double cost = Double.parseDouble(txtCost.getText().trim());
                double price = Double.parseDouble(txtPrice.getText().trim());
                int stock = Integer.parseInt(txtStock.getText().trim());
                String nccStr = (String) cbNCC.getSelectedItem();
                String nccId = (nccStr != null && nccStr.contains(" - ")) ? nccStr.split(" - ")[0] : "NCC01";
                String desc = txtDesc.getText().trim();
                String imgPath = currentImagePath[0];

                StringBuilder errorMsg = new StringBuilder();
                boolean success;

                if (isEdit) {
                    existing.setTenSP(name);
                    existing.setTheLoai(type);
                    existing.setGiaNhap(cost);
                    existing.setGiaBan(price);
                    existing.setSoLuongTon(stock);
                    existing.setMaNCC(nccId);
                    existing.setMoTa(desc);
                    existing.setHinhAnh(imgPath);
                    success = facade.updateProduct(existing, errorMsg);
                } else {
                    // Su dung SanPhamFactory (Factory Pattern) voi duong dan anh moi
                    SanPhamKeycap newSp = SanPhamFactory.createSanPham(0, name, type, cost, price, stock, imgPath, desc, nccId);
                    success = facade.addProduct(newSp, errorMsg);
                }

                if (success) {
                    ImageHelper.clearCache();
                    JOptionPane.showMessageDialog(dialog, "Lưu thông tin và hình ảnh sản phẩm thành công!", "Thành Công", JOptionPane.INFORMATION_MESSAGE);
                    dialog.dispose();
                } else {
                    JOptionPane.showMessageDialog(dialog, errorMsg.toString(), "Lỗi", JOptionPane.ERROR_MESSAGE);
                }
            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(dialog, "Giá tiền và số lượng phải là số hợp lệ!", "Lỗi Định Dạng", JOptionPane.ERROR_MESSAGE);
            }
        });

        JPanel pnlFooter = ModernDialogHelper.createActionFooter(btnSave, btnCancel);
        dialog.add(pnlFooter, BorderLayout.SOUTH);

        dialog.setVisible(true);
    }

    private void updatePathDisplayLabel(JLabel label, String path) {
        if (path == null || path.isEmpty()) {
            label.setText("Chưa chọn ảnh");
            return;
        }
        File f = new File(path);
        label.setText(f.getName());
        label.setToolTipText(path);
    }

    @Override
    public void onDataChanged(String eventType, Object data) {
        SwingUtilities.invokeLater(this::refreshData);
    }
}
