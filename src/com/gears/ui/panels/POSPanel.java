package com.gears.ui.panels;

import com.gears.model.*;
import com.gears.patterns.facade.GearsShopFacade;
import com.gears.patterns.observer.IDataObserver;
import com.gears.patterns.observer.Subject;
import com.gears.patterns.factory.EntityFactory;
import com.gears.patterns.strategy.*;
import com.gears.ui.components.ImageHelper;
import com.gears.ui.components.ModernButton;
import com.gears.ui.components.ModernComboBox;
import com.gears.ui.components.ModernDialogHelper;
import com.gears.ui.components.ModernTable;
import com.gears.ui.components.ModernTextField;
import com.gears.ui.components.ReceiptDialog;
import com.gears.ui.components.VectorIcon;
import com.gears.ui.components.VietQRDialog;
import com.gears.ui.theme.UITheme;

import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;

/**
 * POSPanel: Màn hình Bán Hàng Tại Quầy POS Terminal (Obsidian Dark ERP).
 * Phân hệ trọng tâm của nhân viên thu ngân:
 * - Tra cứu và lọc nhanh 100 sản phẩm Keycap theo thể loại
 * - Thêm vào giỏ hàng, tùy chỉnh số lượng (+/-)
 * - Chọn khách hàng thành viên (tích lũy điểm & chiết khấu)
 * - Hỗ trợ đa chiến lược thanh toán (Strategy Pattern): Tiền mặt, SePay VietQR, Thẻ POS
 * - Tự động trừ tồn kho và sinh biên lai in ấn chuyên nghiệp
 */
public class POSPanel extends JPanel implements IDataObserver {
    private final GearsShopFacade facade = GearsShopFacade.getInstance();

    // Left Components (Products)
    private ModernTextField txtSearch;
    private ModernComboBox<String> cbCategory;
    private DefaultTableModel productTableModel;
    private ModernTable productTable;
    private List<SanPhamKeycap> currentProductList = new ArrayList<>();

    // Right Components (Cart & Customer)
    private ModernTextField txtCustSearch;
    private ModernComboBox<KhachHangItem> cbCustomer;
    private JLabel lblCustomerTier;
    private JPanel pnlNotFoundNotice;
    private JLabel lblNotFoundMsg;
    private ModernButton btnNotFoundAdd;
    private boolean isUpdatingCustomerCombo = false;
    private DefaultTableModel cartTableModel;
    private ModernTable cartTable;
    private final List<ChiTietDonHang> cartItems = new ArrayList<>();

    // Financial Labels
    private JLabel lblSubtotal;
    private ModernTextField txtDiscount;
    private JLabel lblDiscountAmount;
    private JLabel lblGrandTotal;

    // Payment Selection
    private ModernComboBox<String> cbPaymentMethod;
    private JPanel pnlCashDetails;
    private ModernTextField txtCashGiven;
    private JLabel lblCashChange;

    private static final DecimalFormat CURRENCY = new DecimalFormat("#,##0 'VNĐ'");

    public POSPanel() {
        setLayout(new BorderLayout(14, 14));
        setBackground(UITheme.BG_MAIN);
        setBorder(new EmptyBorder(14, 16, 14, 16));

        JSplitPane splitPane = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, createProductCatalogPanel(), createCartCheckoutPanel());
        splitPane.setResizeWeight(0.56);
        splitPane.setDividerLocation(620);
        splitPane.setDividerSize(5);
        splitPane.setOpaque(false);
        splitPane.setBorder(null);

        add(splitPane, BorderLayout.CENTER);

        Subject.getInstance().registerObserver(this);
        loadProducts();
        loadCustomers();
    }

    // ==========================================
    // 1. LEFT PANEL: DANH MỤC SẢN PHẨM KEYCAP
    // ==========================================
    private JPanel createProductCatalogPanel() {
        JPanel pnl = new JPanel(new BorderLayout(0, 10));
        pnl.setOpaque(false);

        // Header & Search Filter
        JPanel pnlTop = new JPanel(new BorderLayout(10, 8));
        pnlTop.setOpaque(false);

        JLabel lblTitle = new JLabel("DANH MỤC KEYCAP & BÀN PHÍM CƠ");
        lblTitle.setFont(UITheme.FONT_SUBTITLE);
        lblTitle.setForeground(UITheme.TEXT_PRIMARY);
        pnlTop.add(lblTitle, BorderLayout.NORTH);

        JPanel pnlFilters = new JPanel(new BorderLayout(8, 0));
        pnlFilters.setOpaque(false);

        txtSearch = new ModernTextField("Tìm kiếm theo tên keycap, mã SP hoặc mô tả...");
        txtSearch.setPreferredSize(new Dimension(320, 36));
        txtSearch.addActionListener(e -> filterProducts());
        txtSearch.getDocument().addDocumentListener(new javax.swing.event.DocumentListener() {
            public void insertUpdate(javax.swing.event.DocumentEvent e) { filterProducts(); }
            public void removeUpdate(javax.swing.event.DocumentEvent e) { filterProducts(); }
            public void changedUpdate(javax.swing.event.DocumentEvent e) { filterProducts(); }
        });

        cbCategory = new ModernComboBox<>(new String[]{"Tất cả", "Artisan", "Anime", "Pudding", "Cherry", "Other"});
        cbCategory.setPreferredSize(new Dimension(140, 36));
        cbCategory.addActionListener(e -> filterProducts());

        ModernButton btnSearch = new ModernButton("Tìm", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_PRIMARY);
        btnSearch.addActionListener(e -> filterProducts());

        pnlFilters.add(txtSearch, BorderLayout.CENTER);
        pnlFilters.add(cbCategory, BorderLayout.EAST);
        pnlTop.add(pnlFilters, BorderLayout.CENTER);

        pnl.add(pnlTop, BorderLayout.NORTH);

        // Products Table
        String[] cols = {"Ảnh", "Mã", "Tên Sản Phẩm", "Thể Loại", "Giá Bán", "Tồn Kho"};
        productTableModel = new DefaultTableModel(cols, 0);
        productTable = new ModernTable(productTableModel);
        productTable.setRowHeight(42);
        productTable.getColumnModel().getColumn(0).setPreferredWidth(50);
        productTable.getColumnModel().getColumn(1).setPreferredWidth(45);
        productTable.getColumnModel().getColumn(2).setPreferredWidth(230);
        productTable.getColumnModel().getColumn(3).setPreferredWidth(85);
        productTable.getColumnModel().getColumn(4).setPreferredWidth(100);
        productTable.getColumnModel().getColumn(5).setPreferredWidth(65);

        // Double click to add to cart
        productTable.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    addSelectedProductToCart();
                }
            }
        });

        JScrollPane scroll = new JScrollPane(productTable);
        scroll.setBorder(BorderFactory.createLineBorder(UITheme.BORDER_COLOR));
        scroll.getViewport().setBackground(UITheme.BG_CARD);
        pnl.add(scroll, BorderLayout.CENTER);

        // Bottom Add Button
        JPanel pnlBottom = new JPanel(new FlowLayout(FlowLayout.RIGHT, 0, 0));
        pnlBottom.setOpaque(false);
        ModernButton btnAddToCart = new ModernButton("+ Thêm Sản Phẩm Đang Chọn Vào Giỏ");
        btnAddToCart.addActionListener(e -> addSelectedProductToCart());
        pnlBottom.add(btnAddToCart);
        pnl.add(pnlBottom, BorderLayout.SOUTH);

        return pnl;
    }

    // ==========================================
    // 2. RIGHT PANEL: GIỎ HÀNG & THANH TOÁN POS
    // ==========================================
    private JPanel createCartCheckoutPanel() {
        JPanel pnl = new JPanel(new BorderLayout(0, 10));
        pnl.setOpaque(false);
        pnl.setBorder(new EmptyBorder(0, 8, 0, 0));

        // Customer Selection Card
        JPanel pnlCustomer = new JPanel();
        pnlCustomer.setLayout(new BoxLayout(pnlCustomer, BoxLayout.Y_AXIS));
        pnlCustomer.setOpaque(false);
        pnlCustomer.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(UITheme.BORDER_COLOR, 1, true),
            new EmptyBorder(8, 10, 8, 10)
        ));

        // Row 1: Header (Title + Tier Badge + [+ Thêm KH] Button)
        JPanel pnlCustHeader = new JPanel(new BorderLayout(6, 0));
        pnlCustHeader.setOpaque(false);

        JLabel lblCustTitle = new JLabel("KHÁCH HÀNG THÀNH VIÊN:");
        lblCustTitle.setFont(UITheme.FONT_BOLD);
        lblCustTitle.setForeground(UITheme.TEXT_SECONDARY);

        JPanel pnlHeaderRight = new JPanel(new FlowLayout(FlowLayout.RIGHT, 6, 0));
        pnlHeaderRight.setOpaque(false);

        lblCustomerTier = new JLabel("Hạng: Vãng lai");
        lblCustomerTier.setFont(UITheme.FONT_SMALL);
        lblCustomerTier.setForeground(UITheme.STATUS_INFO);

        ModernButton btnQuickAdd = new ModernButton("+ Thêm KH", UITheme.PRIMARY_RED, UITheme.PRIMARY_RED_HOVER, Color.WHITE);
        btnQuickAdd.setFont(new Font("Segoe UI", Font.BOLD, 11));
        btnQuickAdd.setPreferredSize(new Dimension(86, 26));
        btnQuickAdd.addActionListener(e -> {
            String q = txtCustSearch != null ? txtCustSearch.getText().trim() : "";
            openQuickAddCustomerDialog(q);
        });

        pnlHeaderRight.add(lblCustomerTier);
        pnlHeaderRight.add(btnQuickAdd);

        pnlCustHeader.add(lblCustTitle, BorderLayout.WEST);
        pnlCustHeader.add(pnlHeaderRight, BorderLayout.EAST);
        pnlCustomer.add(pnlCustHeader);
        pnlCustomer.add(Box.createVerticalStrut(6));

        // Row 2: Search input & Styled ComboBox
        JPanel pnlCustControls = new JPanel(new BorderLayout(6, 0));
        pnlCustControls.setOpaque(false);

        txtCustSearch = new ModernTextField("Tìm SĐT / Tên...");
        txtCustSearch.setPreferredSize(new Dimension(135, 32));
        txtCustSearch.getDocument().addDocumentListener(new javax.swing.event.DocumentListener() {
            public void insertUpdate(javax.swing.event.DocumentEvent e) { onCustomerSearchChanged(); }
            public void removeUpdate(javax.swing.event.DocumentEvent e) { onCustomerSearchChanged(); }
            public void changedUpdate(javax.swing.event.DocumentEvent e) { onCustomerSearchChanged(); }
        });

        cbCustomer = new ModernComboBox<>();
        cbCustomer.setPreferredSize(new Dimension(220, 32));
        cbCustomer.addActionListener(e -> updateCustomerTier());

        pnlCustControls.add(txtCustSearch, BorderLayout.WEST);
        pnlCustControls.add(cbCustomer, BorderLayout.CENTER);
        pnlCustomer.add(pnlCustControls);

        // Row 3: Notice when customer not found
        pnlNotFoundNotice = new JPanel(new BorderLayout(6, 0));
        pnlNotFoundNotice.setOpaque(false);
        pnlNotFoundNotice.setBorder(new EmptyBorder(6, 2, 0, 2));
        pnlNotFoundNotice.setVisible(false);

        lblNotFoundMsg = new JLabel("Chưa có khách hàng này.");
        lblNotFoundMsg.setFont(UITheme.FONT_SMALL);
        lblNotFoundMsg.setForeground(UITheme.STATUS_WARNING);

        btnNotFoundAdd = new ModernButton("➕ Thêm Khách Hàng Này", new Color(0x06, 0x4E, 0x3B), new Color(0x0F, 0x76, 0x6E), new Color(0x34, 0xD3, 0x99));
        btnNotFoundAdd.setFont(new Font("Segoe UI", Font.BOLD, 11));
        btnNotFoundAdd.setPreferredSize(new Dimension(175, 26));
        btnNotFoundAdd.addActionListener(e -> {
            String q = txtCustSearch != null ? txtCustSearch.getText().trim() : "";
            openQuickAddCustomerDialog(q);
        });

        pnlNotFoundNotice.add(lblNotFoundMsg, BorderLayout.CENTER);
        pnlNotFoundNotice.add(btnNotFoundAdd, BorderLayout.EAST);
        pnlCustomer.add(pnlNotFoundNotice);

        pnl.add(pnlCustomer, BorderLayout.NORTH);

        // Cart Table
        String[] cartCols = {"Sản Phẩm", "Đơn Giá", "SL", "Thành Tiền"};
        cartTableModel = new DefaultTableModel(cartCols, 0);
        cartTable = new ModernTable(cartTableModel);
        cartTable.getColumnModel().getColumn(0).setPreferredWidth(170);
        cartTable.getColumnModel().getColumn(1).setPreferredWidth(90);
        cartTable.getColumnModel().getColumn(2).setPreferredWidth(45);
        cartTable.getColumnModel().getColumn(3).setPreferredWidth(95);

        JScrollPane cartScroll = new JScrollPane(cartTable);
        cartScroll.setBorder(BorderFactory.createLineBorder(UITheme.BORDER_COLOR));
        cartScroll.getViewport().setBackground(UITheme.BG_CARD);

        // Cart Actions Panel (+, -, Xóa)
        JPanel pnlCartActions = new JPanel(new FlowLayout(FlowLayout.RIGHT, 6, 6));
        pnlCartActions.setOpaque(false);

        ModernButton btnIncrease = new ModernButton("+ Tăng SL", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_PRIMARY);
        btnIncrease.addActionListener(e -> modifyCartItemQuantity(1));

        ModernButton btnDecrease = new ModernButton("- Giảm SL", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_PRIMARY);
        btnDecrease.addActionListener(e -> modifyCartItemQuantity(-1));

        ModernButton btnRemove = new ModernButton("Xóa Món", new Color(0x3E, 0x1A, 0x1E), new Color(0x5A, 0x1E, 0x24), UITheme.STATUS_DANGER);
        btnRemove.addActionListener(e -> removeSelectedCartItem());

        ModernButton btnClear = new ModernButton("Làm Mới Giỏ", UITheme.BG_INPUT, UITheme.BORDER_COLOR, UITheme.TEXT_MUTED);
        btnClear.addActionListener(e -> clearCart());

        pnlCartActions.add(btnIncrease);
        pnlCartActions.add(btnDecrease);
        pnlCartActions.add(btnRemove);
        pnlCartActions.add(btnClear);

        JPanel pnlCartCenter = new JPanel(new BorderLayout());
        pnlCartCenter.setOpaque(false);
        pnlCartCenter.add(cartScroll, BorderLayout.CENTER);
        pnlCartCenter.add(pnlCartActions, BorderLayout.SOUTH);

        pnl.add(pnlCartCenter, BorderLayout.CENTER);

        // Bottom Calculation & Checkout
        JPanel pnlCheckout = new JPanel();
        pnlCheckout.setLayout(new BoxLayout(pnlCheckout, BoxLayout.Y_AXIS));
        pnlCheckout.setBackground(UITheme.BG_CARD);
        pnlCheckout.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(UITheme.BORDER_COLOR, 1, true),
            new EmptyBorder(12, 14, 12, 14)
        ));

        // Subtotal row
        lblSubtotal = new JLabel("0 VNĐ");
        lblSubtotal.setFont(UITheme.FONT_BOLD);
        lblSubtotal.setForeground(UITheme.TEXT_PRIMARY);
        pnlCheckout.add(createSummaryRow("Tạm tính hàng:", lblSubtotal));
        pnlCheckout.add(Box.createVerticalStrut(6));

        // Discount row
        txtDiscount = new ModernTextField("0");
        txtDiscount.setPreferredSize(new Dimension(60, 28));
        txtDiscount.setHorizontalAlignment(JTextField.RIGHT);
        txtDiscount.addActionListener(e -> recalculateTotals());

        lblDiscountAmount = new JLabel("-0 VNĐ");
        lblDiscountAmount.setFont(UITheme.FONT_REGULAR);
        lblDiscountAmount.setForeground(UITheme.STATUS_WARNING);

        JPanel pnlDiscRow = new JPanel(new BorderLayout(8, 0));
        pnlDiscRow.setOpaque(false);
        JLabel lblDiscTitle = new JLabel("Chiết khấu %Dic:");
        lblDiscTitle.setFont(UITheme.FONT_REGULAR);
        lblDiscTitle.setForeground(UITheme.TEXT_SECONDARY);
        pnlDiscRow.add(lblDiscTitle, BorderLayout.WEST);

        JPanel pnlDiscInputs = new JPanel(new FlowLayout(FlowLayout.RIGHT, 4, 0));
        pnlDiscInputs.setOpaque(false);
        pnlDiscInputs.add(txtDiscount);
        pnlDiscInputs.add(new JLabel("%  ="));
        pnlDiscInputs.add(lblDiscountAmount);
        pnlDiscRow.add(pnlDiscInputs, BorderLayout.EAST);
        pnlCheckout.add(pnlDiscRow);
        pnlCheckout.add(Box.createVerticalStrut(6));

        // Grand Total row
        lblGrandTotal = new JLabel("0 VNĐ");
        lblGrandTotal.setFont(new Font("Segoe UI", Font.BOLD, 19));
        lblGrandTotal.setForeground(UITheme.PRIMARY_RED);
        pnlCheckout.add(createSummaryRow("TỔNG THANH TOÁN:", lblGrandTotal));
        pnlCheckout.add(Box.createVerticalStrut(10));

        // Payment Method row
        cbPaymentMethod = new ModernComboBox<>(new String[]{"Tiền mặt (Cash)", "SePay VietQR (Chuyển khoản)", "Thẻ ngân hàng (POS Card)"});
        cbPaymentMethod.setFont(UITheme.FONT_BOLD);
        cbPaymentMethod.addActionListener(e -> togglePaymentMethodFields());

        ModernButton btnQuickQR = new ModernButton("⚡ Tạo QR", UITheme.PRIMARY_RED, UITheme.PRIMARY_RED_HOVER, Color.WHITE);
        btnQuickQR.setFont(new Font("Segoe UI", Font.BOLD, 11));
        btnQuickQR.setPreferredSize(new Dimension(86, 28));
        btnQuickQR.addActionListener(e -> showQuickVietQR());

        JPanel pnlMethodRow = new JPanel(new BorderLayout(6, 0));
        pnlMethodRow.setOpaque(false);
        pnlMethodRow.add(cbPaymentMethod, BorderLayout.CENTER);
        pnlMethodRow.add(btnQuickQR, BorderLayout.EAST);

        pnlCheckout.add(createSummaryRow("Phương thức TT:", pnlMethodRow));
        pnlCheckout.add(Box.createVerticalStrut(8));

        // Cash Tendered & Change
        pnlCashDetails = new JPanel(new GridLayout(2, 2, 6, 6));
        pnlCashDetails.setOpaque(false);

        JLabel lblCashGivenTitle = new JLabel("Tiền khách đưa:");
        lblCashGivenTitle.setFont(UITheme.FONT_REGULAR);
        lblCashGivenTitle.setForeground(UITheme.TEXT_SECONDARY);

        txtCashGiven = new ModernTextField("0");
        txtCashGiven.setPreferredSize(new Dimension(100, 28));
        txtCashGiven.addActionListener(e -> recalculateChange());

        JLabel lblCashChangeTitle = new JLabel("Tiền thối lại:");
        lblCashChangeTitle.setFont(UITheme.FONT_REGULAR);
        lblCashChangeTitle.setForeground(UITheme.TEXT_SECONDARY);

        lblCashChange = new JLabel("0 VNĐ");
        lblCashChange.setFont(UITheme.FONT_BOLD);
        lblCashChange.setForeground(UITheme.STATUS_SUCCESS);

        pnlCashDetails.add(lblCashGivenTitle);
        pnlCashDetails.add(txtCashGiven);
        pnlCashDetails.add(lblCashChangeTitle);
        pnlCashDetails.add(lblCashChange);
        pnlCheckout.add(pnlCashDetails);
        pnlCheckout.add(Box.createVerticalStrut(12));

        // Big Checkout Button
        ModernButton btnCheckout = new ModernButton("THANH TOÁN & IN BIÊN LAI HÓA ĐƠN", UITheme.PRIMARY_RED, UITheme.PRIMARY_RED_HOVER, Color.WHITE);
        btnCheckout.setFont(new Font("Segoe UI", Font.BOLD, 14));
        btnCheckout.setPreferredSize(new Dimension(Integer.MAX_VALUE, 44));
        btnCheckout.setMaximumSize(new Dimension(Integer.MAX_VALUE, 44));
        btnCheckout.addActionListener(e -> processCheckout());
        pnlCheckout.add(btnCheckout);

        pnl.add(pnlCheckout, BorderLayout.SOUTH);

        return pnl;
    }

    private JPanel createSummaryRow(String title, JComponent valueComp) {
        JPanel p = new JPanel(new BorderLayout());
        p.setOpaque(false);
        JLabel lbl = new JLabel(title);
        lbl.setFont(UITheme.FONT_BOLD);
        lbl.setForeground(UITheme.TEXT_SECONDARY);
        p.add(lbl, BorderLayout.WEST);
        p.add(valueComp, BorderLayout.EAST);
        return p;
    }

    // ==========================================
    // 3. LOGIC & BUSINESS WORKFLOWS
    // ==========================================
    private void loadProducts() {
        filterProducts();
    }

    private void filterProducts() {
        String kw = txtSearch != null ? txtSearch.getText() : "";
        String cat = cbCategory != null ? (String) cbCategory.getSelectedItem() : "Tất cả";
        currentProductList = facade.searchProducts(kw, cat, 0, 0);

        productTableModel.setRowCount(0);
        for (SanPhamKeycap sp : currentProductList) {
            productTableModel.addRow(new Object[]{
                ImageHelper.getProductImage(sp.getHinhAnh(), 40, 32),
                sp.getMaSP(),
                sp.getTenSP(),
                sp.getTheLoai(),
                sp.getFormattedGiaBan(),
                sp.getSoLuongTon()
            });
        }
    }

    private void onCustomerSearchChanged() {
        if (isUpdatingCustomerCombo) return;
        String query = txtCustSearch != null ? txtCustSearch.getText().trim() : "";
        loadCustomers(query);
    }

    private void loadCustomers() {
        String query = (txtCustSearch != null) ? txtCustSearch.getText().trim() : "";
        loadCustomers(query);
    }

    private void loadCustomers(String query) {
        if (cbCustomer == null) return;
        isUpdatingCustomerCombo = true;
        try {
            KhachHangItem prevSelected = (KhachHangItem) cbCustomer.getSelectedItem();
            cbCustomer.removeAllItems();

            boolean isFilter = (query != null && !query.isEmpty());
            String q = isFilter ? query.toLowerCase() : "";

            // Luon them Khach Vang Lai o dau
            cbCustomer.addItem(new KhachHangItem(null, "Khách Vãng Lai (Mua tại quầy)", "Standard"));

            List<KhachHang> all = facade.getAllCustomers();
            int matchCount = 0;

            for (KhachHang kh : all) {
                if (kh.isLocked()) continue;
                String display = kh.getHoTen() + " (" + kh.getSoDienThoai() + ")";
                if (!isFilter || display.toLowerCase().contains(q) || kh.getId().toLowerCase().contains(q) || kh.getSoDienThoai().contains(q)) {
                    cbCustomer.addItem(new KhachHangItem(kh.getId(), display, kh.getHangThanhVien()));
                    matchCount++;
                }
            }

            if (isFilter) {
                if (matchCount == 0) {
                    // Khong tim thay khach hang nao!
                    cbCustomer.addItem(new KhachHangItem("__ADD_NEW__", "➕ Không tìm thấy! Bấm để thêm mới: \"" + query + "\"", ""));
                    if (pnlNotFoundNotice != null) {
                        lblNotFoundMsg.setText("⚠️ Chưa có khách SĐT/Tên '" + query + "':");
                        pnlNotFoundNotice.setVisible(true);
                    }
                    cbCustomer.setSelectedIndex(0);
                } else {
                    cbCustomer.addItem(new KhachHangItem("__ADD_NEW__", "➕ Thêm khách hàng mới: \"" + query + "\"", ""));
                    if (pnlNotFoundNotice != null) pnlNotFoundNotice.setVisible(false);
                    cbCustomer.setSelectedIndex(1);
                }
            } else {
                cbCustomer.addItem(new KhachHangItem("__ADD_NEW__", "➕ [ Thêm Khách Hàng Mới... ]", ""));
                if (pnlNotFoundNotice != null) pnlNotFoundNotice.setVisible(false);
            }

            // Restore selection if still in list
            if (prevSelected != null && prevSelected.id != null && !"__ADD_NEW__".equals(prevSelected.id)) {
                for (int i = 0; i < cbCustomer.getItemCount(); i++) {
                    KhachHangItem it = cbCustomer.getItemAt(i);
                    if (it != null && prevSelected.id.equals(it.id)) {
                        cbCustomer.setSelectedIndex(i);
                        break;
                    }
                }
            }
        } finally {
            isUpdatingCustomerCombo = false;
        }
        updateCustomerTier();
    }

    private void updateCustomerTier() {
        if (isUpdatingCustomerCombo) return;
        KhachHangItem item = (KhachHangItem) cbCustomer.getSelectedItem();
        if (item != null) {
            if ("__ADD_NEW__".equals(item.id)) {
                isUpdatingCustomerCombo = true;
                cbCustomer.setSelectedIndex(0);
                isUpdatingCustomerCombo = false;
                String query = (txtCustSearch != null) ? txtCustSearch.getText().trim() : "";
                openQuickAddCustomerDialog(query);
                return;
            }
            lblCustomerTier.setText("Hạng: " + (item.tier != null && !item.tier.isEmpty() ? item.tier : "Vãng lai"));
        }
    }

    private void openQuickAddCustomerDialog(String prefillQuery) {
        JDialog dialog = new JDialog((Frame) SwingUtilities.getWindowAncestor(this), "Thêm Khách Hàng Mới Tại Quầy POS", true);
        dialog.setSize(480, 420);
        dialog.setLocationRelativeTo(this);
        dialog.getContentPane().setBackground(UITheme.BG_MAIN);
        dialog.setLayout(new BorderLayout(0, 0));

        JPanel pnlHeader = ModernDialogHelper.createModalHeader(
            "THÊM KHÁCH HÀNG MỚI TẠI QUẦY",
            "Đăng ký thành viên mới để tích lũy điểm và áp dụng chiết khấu",
            VectorIcon.Type.CUSTOMER
        );
        dialog.add(pnlHeader, BorderLayout.NORTH);

        JPanel pnlForm = new JPanel(new GridLayout(4, 2, 10, 14));
        pnlForm.setOpaque(false);
        pnlForm.setBorder(new EmptyBorder(18, 24, 18, 24));

        boolean isPhone = (prefillQuery != null && prefillQuery.matches("^[0-9+]+$"));

        ModernTextField txtName = new ModernTextField();
        if (!isPhone && prefillQuery != null && !prefillQuery.isEmpty()) {
            txtName.setText(prefillQuery);
        } else {
            txtName.setPlaceholder("Nhập họ tên khách hàng");
        }

        ModernTextField txtPhone = new ModernTextField();
        if (isPhone) {
            txtPhone.setText(prefillQuery);
        } else {
            txtPhone.setPlaceholder("Nhập số điện thoại (VD: 0912345678)");
        }

        ModernTextField txtEmail = new ModernTextField();
        txtEmail.setPlaceholder("Email (không bắt buộc)");

        ModernTextField txtAddress = new ModernTextField();
        txtAddress.setPlaceholder("Địa chỉ (không bắt buộc)");

        pnlForm.add(ModernDialogHelper.createFieldLabel("Họ và Tên (*):"));
        pnlForm.add(txtName);
        pnlForm.add(ModernDialogHelper.createFieldLabel("Số Điện Thoại (*):"));
        pnlForm.add(txtPhone);
        pnlForm.add(ModernDialogHelper.createFieldLabel("Email Liên Hệ:"));
        pnlForm.add(txtEmail);
        pnlForm.add(ModernDialogHelper.createFieldLabel("Địa Chỉ Giao Hàng:"));
        pnlForm.add(txtAddress);

        dialog.add(pnlForm, BorderLayout.CENTER);

        ModernButton btnSave = new ModernButton("Lưu & Chọn Vào Đơn", UITheme.PRIMARY_RED, UITheme.PRIMARY_RED_HOVER, Color.WHITE);
        ModernButton btnCancel = new ModernButton("Hủy", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_SECONDARY);
        btnCancel.addActionListener(e -> {
            dialog.dispose();
            if (cbCustomer.getSelectedItem() != null && "__ADD_NEW__".equals(((KhachHangItem) cbCustomer.getSelectedItem()).id)) {
                cbCustomer.setSelectedIndex(0);
            }
        });

        btnSave.addActionListener(e -> {
            String name = txtName.getText().trim();
            String phone = txtPhone.getText().trim();
            String email = txtEmail.getText().trim();
            String addr = txtAddress.getText().trim();

            if (name.isEmpty() || phone.isEmpty()) {
                JOptionPane.showMessageDialog(dialog, "Vui lòng nhập đầy đủ Họ tên và Số điện thoại khách hàng!", "Thiếu Thông Tin", JOptionPane.WARNING_MESSAGE);
                return;
            }

            StringBuilder errorMsg = new StringBuilder();
            KhachHang newKh = EntityFactory.createKhachHang("", name, phone, email, addr);
            boolean ok = facade.addCustomer(newKh, errorMsg);

            if (ok) {
                if (txtCustSearch != null) txtCustSearch.setText("");
                loadCustomers();
                for (int i = 0; i < cbCustomer.getItemCount(); i++) {
                    KhachHangItem item = cbCustomer.getItemAt(i);
                    if (item != null && newKh.getId().equals(item.id)) {
                        cbCustomer.setSelectedIndex(i);
                        break;
                    }
                }
                JOptionPane.showMessageDialog(this, "Đã thêm thành công khách hàng [" + name + "] (#" + newKh.getId() + ")!", "Thành Công", JOptionPane.INFORMATION_MESSAGE);
                dialog.dispose();
            } else {
                JOptionPane.showMessageDialog(dialog, errorMsg.toString(), "Lỗi", JOptionPane.ERROR_MESSAGE);
            }
        });

        JPanel pnlFooter = ModernDialogHelper.createActionFooter(btnSave, btnCancel);
        dialog.add(pnlFooter, BorderLayout.SOUTH);

        dialog.setVisible(true);
    }

    private void addSelectedProductToCart() {
        int selectedRow = productTable.getSelectedRow();
        if (selectedRow < 0) {
            JOptionPane.showMessageDialog(this, "Vui lòng chọn một sản phẩm trong bảng bên trái!", "Nhắc nhở", JOptionPane.WARNING_MESSAGE);
            return;
        }

        int productId = (Integer) productTable.getValueAt(selectedRow, 1);
        SanPhamKeycap sp = facade.getProductById(productId);
        if (sp == null) return;

        if (sp.getSoLuongTon() <= 0) {
            JOptionPane.showMessageDialog(this, "Sản phẩm '" + sp.getTenSP() + "' đã hết hàng trong kho!", "Hết Hàng", JOptionPane.ERROR_MESSAGE);
            return;
        }

        // Kiem tra da co trong gio chua
        for (ChiTietDonHang item : cartItems) {
            if (item.getMaSP() == sp.getMaSP()) {
                if (item.getSoLuong() + 1 > sp.getSoLuongTon()) {
                    JOptionPane.showMessageDialog(this, "Không thể thêm! Tồn kho khả dụng chỉ còn: " + sp.getSoLuongTon(), "Cảnh Báo", JOptionPane.WARNING_MESSAGE);
                    return;
                }
                item.setSoLuong(item.getSoLuong() + 1);
                refreshCartTable();
                return;
            }
        }

        // Them moi vao gio
        cartItems.add(new ChiTietDonHang(sp.getMaSP(), sp.getTenSP(), 1, sp.getGiaBan(), sp.getGiaNhap()));
        refreshCartTable();
    }

    private void modifyCartItemQuantity(int delta) {
        int row = cartTable.getSelectedRow();
        if (row < 0 || row >= cartItems.size()) return;

        ChiTietDonHang item = cartItems.get(row);
        SanPhamKeycap sp = facade.getProductById(item.getMaSP());

        int newQty = item.getSoLuong() + delta;
        if (newQty <= 0) {
            cartItems.remove(row);
        } else {
            if (sp != null && newQty > sp.getSoLuongTon()) {
                JOptionPane.showMessageDialog(this, "Tồn kho chỉ còn: " + sp.getSoLuongTon(), "Cảnh báo tồn kho", JOptionPane.WARNING_MESSAGE);
                return;
            }
            item.setSoLuong(newQty);
        }
        refreshCartTable();
    }

    private void removeSelectedCartItem() {
        int row = cartTable.getSelectedRow();
        if (row >= 0 && row < cartItems.size()) {
            cartItems.remove(row);
            refreshCartTable();
        }
    }

    private void clearCart() {
        cartItems.clear();
        refreshCartTable();
    }

    private void refreshCartTable() {
        cartTableModel.setRowCount(0);
        for (ChiTietDonHang item : cartItems) {
            cartTableModel.addRow(new Object[]{
                item.getTenSP(),
                CURRENCY.format(item.getDonGia()),
                item.getSoLuong(),
                CURRENCY.format(item.tinhThanhTien())
            });
        }
        recalculateTotals();
    }

    private void recalculateTotals() {
        double subtotal = 0.0;
        for (ChiTietDonHang item : cartItems) {
            subtotal += item.tinhThanhTien();
        }
        lblSubtotal.setText(CURRENCY.format(subtotal));

        double discountPercent = 0.0;
        try {
            discountPercent = Double.parseDouble(txtDiscount.getText().trim());
        } catch (Exception ignored) {}

        double discountAmount = Math.round(subtotal * (discountPercent / 100.0));
        lblDiscountAmount.setText("-" + CURRENCY.format(discountAmount));

        double grandTotal = Math.max(0, subtotal - discountAmount);
        lblGrandTotal.setText(CURRENCY.format(grandTotal));

        if (txtCashGiven.getText().isEmpty() || txtCashGiven.getText().equals("0")) {
            txtCashGiven.setText(String.format("%.0f", grandTotal));
        }

        recalculateChange();
    }

    private void recalculateChange() {
        double grandTotal = 0.0;
        try {
            String clean = lblGrandTotal.getText().replaceAll("[^0-9]", "");
            if (!clean.isEmpty()) grandTotal = Double.parseDouble(clean);
        } catch (Exception ignored) {}

        double cashGiven = 0.0;
        try {
            cashGiven = Double.parseDouble(txtCashGiven.getText().replaceAll("[^0-9]", ""));
        } catch (Exception ignored) {}

        double change = Math.max(0, cashGiven - grandTotal);
        lblCashChange.setText(CURRENCY.format(change));
    }

    private void togglePaymentMethodFields() {
        String method = (String) cbPaymentMethod.getSelectedItem();
        boolean isCash = method != null && method.startsWith("Tiền mặt");
        pnlCashDetails.setVisible(isCash);
        revalidate();
        repaint();
    }

    private void processCheckout() {
        if (cartItems.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Giỏ hàng đang trống! Vui lòng chọn sản phẩm trước.", "Thông Báo", JOptionPane.WARNING_MESSAGE);
            return;
        }

        KhachHangItem custItem = (KhachHangItem) cbCustomer.getSelectedItem();
        String customerId = (custItem != null && !"__ADD_NEW__".equals(custItem.id)) ? custItem.id : null;
        String customerName = "Khách vãng lai";
        String customerPhone = "";

        if (customerId != null) {
            KhachHang kh = facade.getAllCustomers().stream().filter(c -> c.getId().equals(customerId)).findFirst().orElse(null);
            if (kh != null) {
                customerName = kh.getHoTen();
                customerPhone = kh.getSoDienThoai();
            } else if (custItem != null && custItem.name != null) {
                customerName = custItem.name;
            }
        }

        double discountPercent = 0.0;
        try {
            discountPercent = Double.parseDouble(txtDiscount.getText().trim());
        } catch (Exception ignored) {}

        String selectedMethod = (String) cbPaymentMethod.getSelectedItem();
        ChienLuocThanhToan strategy;

        if (selectedMethod != null && selectedMethod.contains("VietQR")) {
            strategy = new ThanhToanVietQR();
        } else if (selectedMethod != null && selectedMethod.contains("Thẻ")) {
            strategy = new ThanhToanTheNganHang();
        } else {
            strategy = new ThanhToanTienMat();
        }

        double cashTendered = 0.0;
        try {
            cashTendered = Double.parseDouble(txtCashGiven.getText().replaceAll("[^0-9]", ""));
        } catch (Exception ignored) {}

        // Tao doi tuong DonHang
        String orderCode = "POS-" + (System.currentTimeMillis() % 1000000);
        DonHang order = new DonHang(orderCode, customerName, customerPhone, "Mua tại quầy POS", strategy.getTenPhuongThuc(), "POS");
        order.setMaKH(customerId);
        order.setPhanTramGiamGia(discountPercent);

        NhanVien currentStaff = facade.getCurrentUser();
        if (currentStaff != null) {
            order.setMaNV(currentStaff.getId());
            order.setTenNhanVien(currentStaff.getHoTen());
        }

        for (ChiTietDonHang item : cartItems) {
            order.themChiTiet(item);
        }

        // Neu chon thanh toan SePay VietQR: Mo hop thoai VietQRDialog de nhan vien huong dan khach quet ma
        if (selectedMethod != null && selectedMethod.contains("VietQR")) {
            VietQRDialog qrDialog = new VietQRDialog((Frame) SwingUtilities.getWindowAncestor(this), order, order.tinhTongTienThanhToan());
            qrDialog.setVisible(true);
            if (!qrDialog.isPaymentConfirmed()) {
                return; // Khach huy hoac doi phuong thuc
            }
        }

        StringBuilder errorMsg = new StringBuilder();
        KetQuaThanhToan result = facade.checkoutPOS(order, cashTendered, strategy, errorMsg);

        if (result != null && result.isThanhCong()) {
            // Thanh cong -> Mo hop thoai In bien lai hoa don
            ReceiptDialog receipt = new ReceiptDialog((Frame) SwingUtilities.getWindowAncestor(this), order);
            receipt.setVisible(true);

            // Xoa gio hang
            clearCart();
            txtDiscount.setText("0");
        } else {
            JOptionPane.showMessageDialog(this, errorMsg.toString(), "Lỗi Thanh Toán", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void showQuickVietQR() {
        if (cartItems.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Giỏ hàng đang trống! Vui lòng chọn sản phẩm vào giỏ trước.", "Nhắc Nhở", JOptionPane.WARNING_MESSAGE);
            return;
        }
        cbPaymentMethod.setSelectedIndex(1); // Chuyen sang VietQR
        double discountPercent = 0.0;
        try { discountPercent = Double.parseDouble(txtDiscount.getText().trim()); } catch (Exception ignored) {}

        String orderCode = "POS-" + (System.currentTimeMillis() % 1000000);
        DonHang tempOrder = new DonHang(orderCode, "Khách tại quầy", "", "Mua tại quầy POS", "SePay VietQR (Chuyển khoản)", "POS");
        tempOrder.setPhanTramGiamGia(discountPercent);
        for (ChiTietDonHang item : cartItems) {
            tempOrder.themChiTiet(item);
        }

        VietQRDialog qrDialog = new VietQRDialog((Frame) SwingUtilities.getWindowAncestor(this), tempOrder, tempOrder.tinhTongTienThanhToan());
        qrDialog.setVisible(true);
        if (qrDialog.isPaymentConfirmed()) {
            processCheckout();
        }
    }

    @Override
    public void onDataChanged(String eventType, Object data) {
        SwingUtilities.invokeLater(() -> {
            filterProducts();
            loadCustomers();
        });
    }

    // Helper class for customer dropdown
    private static class KhachHangItem {
        final String id;
        final String name;
        final String tier;

        KhachHangItem(String id, String name, String tier) {
            this.id = id;
            this.name = name;
            this.tier = tier;
        }

        @Override
        public String toString() {
            return name;
        }
    }
}
