package com.gears.ui.customer;

import com.gears.model.*;
import com.gears.patterns.facade.GearsShopFacade;
import com.gears.patterns.observer.IDataObserver;
import com.gears.patterns.observer.Subject;
import com.gears.patterns.strategy.*;
import com.gears.ui.components.ImageHelper;
import com.gears.ui.components.ModernButton;
import com.gears.ui.components.ModernComboBox;
import com.gears.ui.components.ModernDialogHelper;
import com.gears.ui.components.ModernTabbedPaneUI;
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
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import javax.swing.table.DefaultTableModel;

/**
 * CustomerFrame (Boundary): Cổng Mua Sắm Dành Riêng Cho Khách Hàng (Customer Portal).
 * - Tra cứu và mua sắm catalog 100 sản phẩm Keycap theo thể loại
 * - Quản lý giỏ hàng trực tuyến & đặt hàng Online (Channel: Online)
 * - Tích lũy và sử dụng Keycap Coins để nhận chiết khấu
 * - Thanh toán tự động qua SePay VietQR hoặc COD
 * - Tra cứu lịch sử đơn hàng cá nhân & tiến độ giao hàng
 * Tự động bắn tín hiệu qua Observer Pattern để Màn hình Quản Trị Viên (Admin)
 * và Màn hình Thu Ngân (Cashier POS) cập nhật doanh thu và đơn hàng thời gian thực!
 */
public class CustomerFrame extends JFrame implements IDataObserver {
    private final GearsShopFacade facade = GearsShopFacade.getInstance();

    private KhachHang currentCustomer;
    private ModernComboBox<KhachHangItem> cbCurrentCustomer;
    private JLabel lblCoins;
    private JLabel lblTier;
    private ModernButton btnCart;

    private ModernTextField txtSearch;
    private String selectedCategory = "Tất cả";
    private JPanel pnlProductGrid;

    // Cart State
    private final List<ChiTietDonHang> cartItems = new ArrayList<>();
    private static final DecimalFormat CURRENCY = new DecimalFormat("#,##0 'VNĐ'");

    // Tabs
    private JTabbedPane tabbedPane;
    private DefaultTableModel myOrdersTableModel;
    private ModernTable myOrdersTable;

    public CustomerFrame() {
        setTitle("GEARS Keycap Shop - CỔNG MUA SẮM KHÁCH HÀNG (CUSTOMER PORTAL)");
        setSize(1180, 780);
        setMinimumSize(new Dimension(720, 500));
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLocationRelativeTo(null);
        getContentPane().setBackground(UITheme.BG_MAIN);
        setLayout(new BorderLayout());

        // Mac dinh dang nhap khach hang mau KH02 (Nguyen Van Hai - Hang Bac)
        loadDefaultCustomer();

        initHeader();
        initTabs();

        Subject.getInstance().registerObserver(this);
        refreshProductGrid();
        refreshMyOrders();
    }

    private void loadDefaultCustomer() {
        List<KhachHang> customers = facade.getAllCustomers();
        for (KhachHang kh : customers) {
            if ("KH02".equals(kh.getId())) {
                currentCustomer = kh;
                return;
            }
        }
        if (!customers.isEmpty()) currentCustomer = customers.get(0);
    }

    // ==============================================================
    // 1. TOP HEADER & CUSTOMER PROFILE
    // ==============================================================
    // 1. TOP HEADER & CUSTOMER PROFILE (RESPONSIVE 2-TIER DESIGN)
    // ==============================================================
    private void initHeader() {
        JPanel pnlHeader = new JPanel();
        pnlHeader.setLayout(new BoxLayout(pnlHeader, BoxLayout.Y_AXIS));
        pnlHeader.setBackground(UITheme.BG_HEADER);
        pnlHeader.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createMatteBorder(0, 0, 1, 0, UITheme.BORDER_COLOR),
            new EmptyBorder(8, 16, 8, 16)
        ));

        // ROW 1: Brand & Cart Button (Never Collides)
        JPanel pnlRow1 = new JPanel(new BorderLayout(10, 0));
        pnlRow1.setOpaque(false);

        JPanel pnlBrand = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 0));
        pnlBrand.setOpaque(false);

        JLabel lblLogo = new JLabel("GEARS STORE");
        lblLogo.setFont(new Font("Segoe UI", Font.BOLD, 16));
        lblLogo.setForeground(Color.WHITE);
        lblLogo.setOpaque(true);
        lblLogo.setBackground(UITheme.PRIMARY_RED);
        lblLogo.setBorder(new EmptyBorder(4, 10, 4, 10));

        JLabel lblSlogan = new JLabel("Thế Giới Keycap & Bàn Phím Cơ Cao Cấp");
        lblSlogan.setFont(UITheme.FONT_REGULAR);
        lblSlogan.setForeground(UITheme.TEXT_SECONDARY);

        pnlBrand.add(lblLogo);
        pnlBrand.add(lblSlogan);
        pnlRow1.add(pnlBrand, BorderLayout.WEST);

        btnCart = new ModernButton("🛒 GIỎ HÀNG (0)", UITheme.PRIMARY_RED, UITheme.PRIMARY_RED_HOVER, Color.WHITE);
        btnCart.setFont(new Font("Segoe UI", Font.BOLD, 13));
        btnCart.setPreferredSize(new Dimension(160, 36));
        btnCart.addActionListener(e -> openCartCheckoutDialog());
        pnlRow1.add(btnCart, BorderLayout.EAST);

        pnlHeader.add(pnlRow1);
        pnlHeader.add(Box.createVerticalStrut(6));

        // ROW 2: Customer Profile, Tier & Coins Bar (Full Width, Zero Overlap)
        JPanel pnlRow2 = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 0));
        pnlRow2.setOpaque(false);

        JLabel lblCustTitle = new JLabel("👤 Khách hàng:");
        lblCustTitle.setFont(UITheme.FONT_BOLD);
        lblCustTitle.setForeground(UITheme.TEXT_SECONDARY);

        cbCurrentCustomer = new ModernComboBox<>();
        cbCurrentCustomer.setPreferredSize(new Dimension(240, 32));

        for (KhachHang kh : facade.getAllCustomers()) {
            cbCurrentCustomer.addItem(new KhachHangItem(kh));
            if (currentCustomer != null && currentCustomer.getId().equals(kh.getId())) {
                cbCurrentCustomer.setSelectedIndex(cbCurrentCustomer.getItemCount() - 1);
            }
        }

        cbCurrentCustomer.addActionListener(e -> {
            KhachHangItem item = (KhachHangItem) cbCurrentCustomer.getSelectedItem();
            if (item != null) {
                currentCustomer = item.khachHang;
                updateCustomerBadge();
                refreshMyOrders();
            }
        });

        lblTier = new JLabel("🎖️ Hạng: Standard");
        lblTier.setFont(UITheme.FONT_BOLD);
        lblTier.setForeground(UITheme.STATUS_INFO);

        lblCoins = new JLabel("🪙 Keycap Coins: 0 xu");
        lblCoins.setFont(UITheme.FONT_BOLD);
        lblCoins.setForeground(UITheme.STATUS_WARNING);

        pnlRow2.add(lblCustTitle);
        pnlRow2.add(cbCurrentCustomer);
        pnlRow2.add(Box.createHorizontalStrut(8));
        pnlRow2.add(lblTier);
        pnlRow2.add(Box.createHorizontalStrut(8));
        pnlRow2.add(lblCoins);

        pnlHeader.add(pnlRow2);
        add(pnlHeader, BorderLayout.NORTH);

        updateCustomerBadge();
    }

    private void updateCustomerBadge() {
        if (currentCustomer != null) {
            lblTier.setText("🎖️ Hạng: " + currentCustomer.getHangThanhVien());
            lblCoins.setText("🪙 Keycap Coins: " + currentCustomer.getDiemTichLuy() + " xu");
        }
    }

    // ==============================================================
    // 2. MAIN TABS (CATALOG & LỊCH SỬ ĐƠN HÀNG)
    // ==============================================================
    private void initTabs() {
        tabbedPane = new JTabbedPane();
        tabbedPane.setUI(new ModernTabbedPaneUI());
        tabbedPane.setFont(new Font("Segoe UI", Font.BOLD, 13));
        tabbedPane.setBackground(UITheme.BG_CARD);
        tabbedPane.setForeground(Color.WHITE);

        tabbedPane.addTab("  🛍️  CỬA HÀNG 100 KEYCAPS  ", createCatalogPanel());
        tabbedPane.addTab("  📦  LỊCH SỬ ĐƠN HÀNG CỦA TÔI  ", createMyOrdersPanel());

        add(tabbedPane, BorderLayout.CENTER);
    }

    // CATALOG PANEL
    private JPanel createCatalogPanel() {
        JPanel pnl = new JPanel(new BorderLayout(12, 10));
        pnl.setBackground(UITheme.BG_MAIN);
        pnl.setBorder(new EmptyBorder(12, 16, 12, 16));

        // Filter Bar (Search + Categories Flow Wrap Layout)
        JPanel pnlTop = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 6));
        pnlTop.setOpaque(false);

        // Search Field with Live Filter DocumentListener
        txtSearch = new ModernTextField("Tìm kiếm tên keycap, mã nút bấm...");
        txtSearch.setPreferredSize(new Dimension(280, 36));
        txtSearch.getDocument().addDocumentListener(new DocumentListener() {
            public void insertUpdate(DocumentEvent e) { refreshProductGrid(); }
            public void removeUpdate(DocumentEvent e) { refreshProductGrid(); }
            public void changedUpdate(DocumentEvent e) { refreshProductGrid(); }
        });
        pnlTop.add(txtSearch);

        // Category Filter Buttons
        JPanel pnlCategories = new JPanel(new FlowLayout(FlowLayout.LEFT, 6, 0));
        pnlCategories.setOpaque(false);

        String[] categories = {"Tất cả", "Artisan", "Anime", "Pudding", "Cherry", "Other"};
        for (String cat : categories) {
            boolean active = cat.equals(selectedCategory);
            ModernButton btnCat = new ModernButton(
                cat,
                active ? UITheme.PRIMARY_RED : UITheme.BG_CARD,
                active ? UITheme.PRIMARY_RED_HOVER : UITheme.BG_CARD_HOVER,
                active ? Color.WHITE : UITheme.TEXT_SECONDARY
            );
            btnCat.setFont(new Font("Segoe UI", Font.BOLD, 12));
            btnCat.setPreferredSize(new Dimension(86, 36));

            btnCat.addActionListener(e -> {
                selectedCategory = cat;
                for (Component c : pnlCategories.getComponents()) {
                    if (c instanceof ModernButton) {
                        ModernButton b = (ModernButton) c;
                        boolean isSel = b.getText().equals(selectedCategory);
                        b.setColors(
                            isSel ? UITheme.PRIMARY_RED : UITheme.BG_CARD,
                            isSel ? UITheme.PRIMARY_RED_HOVER : UITheme.BG_CARD_HOVER,
                            isSel ? Color.WHITE : UITheme.TEXT_SECONDARY
                        );
                    }
                }
                refreshProductGrid();
            });

            pnlCategories.add(btnCat);
        }

        pnlTop.add(pnlCategories);
        pnl.add(pnlTop, BorderLayout.NORTH);

        // Grid Container of Product Cards with Dynamic Responsive Columns
        pnlProductGrid = new JPanel(new GridLayout(0, 4, 12, 12));
        pnlProductGrid.setOpaque(false);

        JScrollPane scroll = new JScrollPane(pnlProductGrid);
        scroll.setBorder(null);
        scroll.getViewport().setBackground(UITheme.BG_MAIN);
        scroll.getVerticalScrollBar().setUnitIncrement(16);

        // Responsive Grid Column Resizer
        scroll.getViewport().addComponentListener(new java.awt.event.ComponentAdapter() {
            @Override
            public void componentResized(java.awt.event.ComponentEvent e) {
                int w = scroll.getViewport().getWidth();
                int cols = Math.max(1, Math.min(4, w / 215));
                if (pnlProductGrid.getLayout() instanceof GridLayout) {
                    GridLayout gl = (GridLayout) pnlProductGrid.getLayout();
                    if (gl.getColumns() != cols) {
                        gl.setColumns(cols);
                        pnlProductGrid.revalidate();
                    }
                }
            }
        });

        pnl.add(scroll, BorderLayout.CENTER);
        return pnl;
    }

    // MY ORDERS PANEL
    private JPanel createMyOrdersPanel() {
        JPanel pnl = new JPanel(new BorderLayout(12, 12));
        pnl.setBackground(UITheme.BG_MAIN);
        pnl.setBorder(new EmptyBorder(16, 20, 16, 20));

        JLabel lblTitle = new JLabel("LỊCH SỬ MUA HÀNG VÀ TIẾN ĐỘ VẬN CHUYỂN");
        lblTitle.setFont(UITheme.FONT_TITLE);
        lblTitle.setForeground(UITheme.TEXT_PRIMARY);
        pnl.add(lblTitle, BorderLayout.NORTH);

        String[] cols = {"Mã Đơn", "Ngày Đặt", "Phương Thức", "Tổng Tiền", "Chiết Khấu", "Trạng Thái Giao Hàng"};
        myOrdersTableModel = new DefaultTableModel(cols, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
        myOrdersTable = new ModernTable(myOrdersTableModel);

        // Adjust column widths for clean readability
        myOrdersTable.getColumnModel().getColumn(0).setPreferredWidth(100);
        myOrdersTable.getColumnModel().getColumn(1).setPreferredWidth(140);
        myOrdersTable.getColumnModel().getColumn(2).setPreferredWidth(110);
        myOrdersTable.getColumnModel().getColumn(3).setPreferredWidth(130);
        myOrdersTable.getColumnModel().getColumn(4).setPreferredWidth(90);
        myOrdersTable.getColumnModel().getColumn(5).setPreferredWidth(150);

        // Double-click row de mo truc tiep chi tiet don hang
        myOrdersTable.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    viewSelectedOrderDetail();
                }
            }
        });

        JScrollPane scroll = new JScrollPane(myOrdersTable);
        scroll.setBorder(BorderFactory.createLineBorder(UITheme.BORDER_COLOR));
        scroll.getViewport().setBackground(UITheme.BG_CARD);
        pnl.add(scroll, BorderLayout.CENTER);

        // Bottom Actions Bar
        JPanel pnlBottom = new JPanel(new BorderLayout(10, 0));
        pnlBottom.setOpaque(false);
        pnlBottom.setBorder(new EmptyBorder(8, 0, 0, 0));

        JLabel lblHint = new JLabel("💡 Nhấp đúp chuột vào đơn hàng hoặc bấm [Xem Chi Tiết Đơn Hàng] để xem danh sách sản phẩm & in biên lai.");
        lblHint.setFont(UITheme.FONT_SMALL);
        lblHint.setForeground(UITheme.TEXT_MUTED);
        pnlBottom.add(lblHint, BorderLayout.WEST);

        JPanel pnlActions = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        pnlActions.setOpaque(false);

        ModernButton btnRefresh = new ModernButton("🔄 Tải Lại", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_SECONDARY);
        btnRefresh.setFont(new Font("Segoe UI", Font.BOLD, 12));
        btnRefresh.addActionListener(e -> refreshMyOrders());

        ModernButton btnPrint = new ModernButton("🧾 In / Xem Biên Lai", new Color(0x1B, 0x38, 0x2B), new Color(0x23, 0x4C, 0x3A), UITheme.STATUS_SUCCESS);
        btnPrint.setFont(new Font("Segoe UI", Font.BOLD, 12));
        btnPrint.addActionListener(e -> printSelectedReceipt());

        ModernButton btnDetail = new ModernButton("🔍 Xem Chi Tiết Đơn Hàng", UITheme.PRIMARY_RED, UITheme.PRIMARY_RED_HOVER, Color.WHITE);
        btnDetail.setFont(new Font("Segoe UI", Font.BOLD, 12));
        btnDetail.addActionListener(e -> viewSelectedOrderDetail());

        pnlActions.add(btnRefresh);
        pnlActions.add(btnPrint);
        pnlActions.add(btnDetail);
        pnlBottom.add(pnlActions, BorderLayout.EAST);

        pnl.add(pnlBottom, BorderLayout.SOUTH);
        return pnl;
    }

    // ==============================================================
    // 3. PRODUCT GRID RENDERING
    // ==============================================================
    private void refreshProductGrid() {
        pnlProductGrid.removeAll();

        String kw = txtSearch != null ? txtSearch.getText().trim() : "";
        List<SanPhamKeycap> products = facade.searchProducts(kw, selectedCategory, 0, 0);

        for (SanPhamKeycap sp : products) {
            pnlProductGrid.add(createProductCard(sp));
        }

        pnlProductGrid.revalidate();
        pnlProductGrid.repaint();
    }

    private JPanel createProductCard(SanPhamKeycap sp) {
        JPanel card = new JPanel();
        card.setLayout(new BoxLayout(card, BoxLayout.Y_AXIS));
        card.setBackground(UITheme.BG_CARD);
        card.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(UITheme.BORDER_COLOR, 1, true),
            new EmptyBorder(12, 14, 12, 14)
        ));

        // Category Tag & ID
        JPanel pnlTop = new JPanel(new BorderLayout());
        pnlTop.setOpaque(false);

        JLabel lblId = new JLabel("#" + sp.getMaSP());
        lblId.setFont(UITheme.FONT_SMALL);
        lblId.setForeground(UITheme.TEXT_MUTED);

        JLabel lblCat = new JLabel(" " + sp.getTheLoai() + " ");
        lblCat.setFont(new Font("Segoe UI", Font.BOLD, 10));
        lblCat.setForeground(UITheme.PRIMARY_RED);
        lblCat.setBorder(BorderFactory.createLineBorder(UITheme.PRIMARY_RED, 1, true));

        pnlTop.add(lblId, BorderLayout.WEST);
        pnlTop.add(lblCat, BorderLayout.EAST);
        card.add(pnlTop);
        card.add(Box.createVerticalStrut(8));

        // Product Image Thumbnail
        JLabel lblImg = new JLabel();
        lblImg.setAlignmentX(Component.CENTER_ALIGNMENT);
        lblImg.setPreferredSize(new Dimension(190, 125));
        lblImg.setMaximumSize(new Dimension(Integer.MAX_VALUE, 125));
        lblImg.setHorizontalAlignment(SwingConstants.CENTER);
        lblImg.setIcon(ImageHelper.getProductImage(sp.getHinhAnh(), 190, 125));
        lblImg.setBackground(new Color(0x16, 0x18, 0x20));
        lblImg.setOpaque(true);
        lblImg.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(0x2A, 0x30, 0x3D), 1, true),
            new EmptyBorder(2, 2, 2, 2)
        ));
        card.add(lblImg);
        card.add(Box.createVerticalStrut(10));

        // Product Name
        JLabel lblName = new JLabel("<html><b>" + sp.getTenSP() + "</b></html>");
        lblName.setFont(UITheme.FONT_REGULAR);
        lblName.setForeground(UITheme.TEXT_PRIMARY);
        lblName.setPreferredSize(new Dimension(200, 36));
        lblName.setMaximumSize(new Dimension(Integer.MAX_VALUE, 40));
        card.add(lblName);
        card.add(Box.createVerticalStrut(8));

        // Stock status
        boolean inStock = sp.getSoLuongTon() > 0;
        JLabel lblStock = new JLabel(inStock ? "Còn hàng: " + sp.getSoLuongTon() + " nút" : "Tạm hết hàng");
        lblStock.setFont(UITheme.FONT_SMALL);
        lblStock.setForeground(inStock ? UITheme.STATUS_SUCCESS : UITheme.STATUS_DANGER);
        card.add(lblStock);
        card.add(Box.createVerticalStrut(6));

        // Price
        JLabel lblPrice = new JLabel(sp.getFormattedGiaBan());
        lblPrice.setFont(new Font("Segoe UI", Font.BOLD, 16));
        lblPrice.setForeground(UITheme.PRIMARY_RED);
        card.add(lblPrice);
        card.add(Box.createVerticalStrut(10));

        // Add to Cart Button
        ModernButton btnAdd = new ModernButton(inStock ? "+ Thêm Vào Giỏ" : "Hết Hàng");
        btnAdd.setEnabled(inStock);
        if (!inStock) {
            btnAdd.setBackground(UITheme.BG_INPUT);
            btnAdd.setForeground(UITheme.TEXT_MUTED);
        } else {
            btnAdd.addActionListener(e -> addToCart(sp));
        }
        btnAdd.setMaximumSize(new Dimension(Integer.MAX_VALUE, 34));
        card.add(btnAdd);

        return card;
    }

    private void addToCart(SanPhamKeycap sp) {
        for (ChiTietDonHang item : cartItems) {
            if (item.getMaSP() == sp.getMaSP()) {
                if (item.getSoLuong() + 1 > sp.getSoLuongTon()) {
                    JOptionPane.showMessageDialog(this, "Số lượng trong giỏ đã đạt mức tối đa tồn kho (" + sp.getSoLuongTon() + ")!", "Cảnh Báo", JOptionPane.WARNING_MESSAGE);
                    return;
                }
                item.setSoLuong(item.getSoLuong() + 1);
                updateCartButton();
                return;
            }
        }
        cartItems.add(new ChiTietDonHang(sp.getMaSP(), sp.getTenSP(), 1, sp.getGiaBan(), sp.getGiaNhap()));
        updateCartButton();
    }

    private void updateCartButton() {
        int count = 0;
        for (ChiTietDonHang i : cartItems) count += i.getSoLuong();
        btnCart.setText("🛒 GIỎ HÀNG (" + count + ")");
    }

    // ==============================================================
    // 4. CART & ONLINE CHECKOUT DIALOG
    // ==============================================================
    private void openCartCheckoutDialog() {
        if (cartItems.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Giỏ hàng của bạn đang trống! Hãy chọn những mẫu Keycap yêu thích trước nhé.", "Giỏ Hàng Trống", JOptionPane.INFORMATION_MESSAGE);
            return;
        }

        JDialog dialog = new JDialog(this, "Giỏ Hàng & Đặt Hàng Trực Tuyến GEARS", true);
        dialog.setSize(680, 560);
        dialog.setLocationRelativeTo(this);
        dialog.getContentPane().setBackground(UITheme.BG_MAIN);
        dialog.setLayout(new BorderLayout(10, 10));

        // Cart items table
        String[] cols = {"Sản Phẩm", "Đơn Giá", "Số Lượng", "Thành Tiền"};
        DefaultTableModel model = new DefaultTableModel(cols, 0);
        ModernTable table = new ModernTable(model);

        Runnable refreshTable = () -> {
            model.setRowCount(0);
            for (ChiTietDonHang i : cartItems) {
                model.addRow(new Object[]{i.getTenSP(), CURRENCY.format(i.getDonGia()), i.getSoLuong(), CURRENCY.format(i.tinhThanhTien())});
            }
        };
        refreshTable.run();

        JScrollPane scroll = new JScrollPane(table);
        scroll.setBorder(BorderFactory.createLineBorder(UITheme.BORDER_COLOR));
        dialog.add(scroll, BorderLayout.CENTER);

        // Calculation & Checkout Panel
        JPanel pnlBottom = new JPanel();
        pnlBottom.setLayout(new BoxLayout(pnlBottom, BoxLayout.Y_AXIS));
        pnlBottom.setBackground(UITheme.BG_CARD);
        pnlBottom.setBorder(new EmptyBorder(14, 16, 14, 16));

        double rawTotal = 0;
        for (ChiTietDonHang i : cartItems) rawTotal += i.tinhThanhTien();

        JLabel lblSubtotal = new JLabel("Tổng tiền hàng: " + CURRENCY.format(rawTotal));
        lblSubtotal.setFont(UITheme.FONT_BOLD);
        lblSubtotal.setForeground(UITheme.TEXT_PRIMARY);

        JCheckBox chkUseCoins = new JCheckBox("Dùng Keycap Coins giảm giá (Chiết khấu 5% thành viên):");
        chkUseCoins.setFont(UITheme.FONT_REGULAR);
        chkUseCoins.setForeground(UITheme.STATUS_WARNING);
        chkUseCoins.setOpaque(false);
        chkUseCoins.setSelected(true);

        final double finalRawTotal = rawTotal;
        double discountRate = chkUseCoins.isSelected() ? 5.0 : 0.0;
        double finalTotal = finalRawTotal * (1 - discountRate / 100.0);

        JLabel lblFinal = new JLabel("TỔNG THANH TOÁN: " + CURRENCY.format(finalTotal));
        lblFinal.setFont(new Font("Segoe UI", Font.BOLD, 18));
        lblFinal.setForeground(UITheme.PRIMARY_RED);

        chkUseCoins.addActionListener(e -> {
            double rate = chkUseCoins.isSelected() ? 5.0 : 0.0;
            double tot = finalRawTotal * (1 - rate / 100.0);
            lblFinal.setText("TỔNG THANH TOÁN: " + CURRENCY.format(tot));
        });

        // Payment method
        ModernComboBox<String> cbPayment = new ModernComboBox<>(new String[]{"SePay VietQR Napas (Chuyển khoản tức thì)", "Thanh toán khi nhận hàng (COD)"});
        cbPayment.setFont(UITheme.FONT_BOLD);
        cbPayment.setPreferredSize(new Dimension(340, 36));

        JPanel pnlPayRow = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 4));
        pnlPayRow.setOpaque(false);
        JLabel lblPayMethodTitle = new JLabel("Phương thức thanh toán:");
        lblPayMethodTitle.setFont(UITheme.FONT_BOLD);
        lblPayMethodTitle.setForeground(UITheme.TEXT_SECONDARY);
        pnlPayRow.add(lblPayMethodTitle);
        pnlPayRow.add(cbPayment);

        // Buttons
        JPanel pnlBtns = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        pnlBtns.setOpaque(false);

        ModernButton btnConfirm = new ModernButton("XÁC NHẬN ĐẶT HÀNG NGAY", UITheme.PRIMARY_RED, UITheme.PRIMARY_RED_HOVER, Color.WHITE);
        btnConfirm.setPreferredSize(new Dimension(240, 42));

        btnConfirm.addActionListener(e -> {
            String orderCode = "ONLINE-" + (System.currentTimeMillis() % 1000000);
            String custName = currentCustomer != null ? currentCustomer.getHoTen() : "Khách Hàng Online";
            String custId = currentCustomer != null ? currentCustomer.getId() : null;
            String payMethod = (String) cbPayment.getSelectedItem();

            DonHang order = new DonHang(orderCode, custName, currentCustomer != null ? currentCustomer.getSoDienThoai() : "",
                    currentCustomer != null ? currentCustomer.getDiaChi() : "Giao tận nơi", payMethod, "Online");
            order.setMaKH(custId);
            order.setPhanTramGiamGia(chkUseCoins.isSelected() ? 5.0 : 0.0);

            for (ChiTietDonHang item : cartItems) {
                order.themChiTiet(item);
            }

            ChienLuocThanhToan strategy = payMethod.contains("VietQR") ? new ThanhToanVietQR() : new ThanhToanTienMat();

            if (payMethod.contains("VietQR")) {
                VietQRDialog qrDialog = new VietQRDialog(this, order, order.tinhTongTienThanhToan());
                qrDialog.setVisible(true);
                if (!qrDialog.isPaymentConfirmed()) {
                    return; // Khách hủy giao dịch QR
                }
            }

            StringBuilder errorMsg = new StringBuilder();
            KetQuaThanhToan result = facade.checkoutPOS(order, order.tinhTongTien(), strategy, errorMsg);

            if (result != null && result.isThanhCong()) {
                cartItems.clear();
                updateCartButton();
                dialog.dispose();

                // Hien thi bien lai hoa don
                ReceiptDialog receipt = new ReceiptDialog(this, order);
                receipt.setVisible(true);

                JOptionPane.showMessageDialog(this,
                        "ĐẶT HÀNG THÀNH CÔNG!\n- Mã đơn hàng: #" + orderCode + "\n- Đơn hàng đã được chuyển vào hệ thống quản trị.\n"
                        + "Observer Pattern đã tự động kích hoạt cập nhật lên Dashboard của Quản Trị Viên và Thu Ngân POS!",
                        "Đặt Hàng Thành Công", JOptionPane.INFORMATION_MESSAGE);

                tabbedPane.setSelectedIndex(1); // Chuyen sang tab Lich Su Don Hang
                refreshMyOrders();
            } else {
                JOptionPane.showMessageDialog(dialog, errorMsg.toString(), "Lỗi Đặt Hàng", JOptionPane.ERROR_MESSAGE);
            }
        });

        ModernButton btnCancel = new ModernButton("Tiếp Tục Mua", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_SECONDARY);
        btnCancel.addActionListener(e -> dialog.dispose());

        pnlBtns.add(btnCancel);
        pnlBtns.add(btnConfirm);

        pnlBottom.add(lblSubtotal);
        pnlBottom.add(Box.createVerticalStrut(4));
        pnlBottom.add(chkUseCoins);
        pnlBottom.add(Box.createVerticalStrut(6));
        pnlBottom.add(pnlPayRow);
        pnlBottom.add(Box.createVerticalStrut(8));
        pnlBottom.add(lblFinal);
        pnlBottom.add(Box.createVerticalStrut(10));
        pnlBottom.add(pnlBtns);

        dialog.add(pnlBottom, BorderLayout.SOUTH);
        dialog.setVisible(true);
    }

    private void refreshMyOrders() {
        if (myOrdersTableModel == null) return;
        myOrdersTableModel.setRowCount(0);

        if (currentCustomer == null) return;

        List<DonHang> allOrders = facade.getAllOrders();
        for (DonHang dh : allOrders) {
            if (currentCustomer.getId().equals(dh.getMaKH()) || currentCustomer.getHoTen().equalsIgnoreCase(dh.getTenKhachHang())) {
                myOrdersTableModel.addRow(new Object[]{
                    dh.getMaDH(),
                    dh.getFormattedNgayLap(),
                    dh.getPhuongThucTT(),
                    dh.getFormattedTongTien(),
                    dh.getPhanTramGiamGia() + "%",
                    dh.getTenTrangThaiTiengViet()
                });
            }
        }
    }

    private void viewSelectedOrderDetail() {
        int row = myOrdersTable.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this,
                "Vui lòng nhấp chọn 1 đơn hàng trong danh sách để xem chi tiết!",
                "Nhắc nhở", JOptionPane.WARNING_MESSAGE);
            return;
        }

        String orderId = (String) myOrdersTable.getValueAt(row, 0);
        DonHang dh = facade.getAllOrders().stream()
                .filter(o -> o.getMaDH().equals(orderId))
                .findFirst().orElse(null);

        if (dh == null) {
            JOptionPane.showMessageDialog(this, "Không tìm thấy dữ liệu cho đơn hàng #" + orderId, "Thông Báo", JOptionPane.ERROR_MESSAGE);
            return;
        }

        JDialog dialog = new JDialog(this, "Chi Tiết Đơn Hàng #" + dh.getMaDH(), true);
        dialog.setSize(750, 620);
        dialog.setMinimumSize(new Dimension(640, 480));
        dialog.setLocationRelativeTo(this);
        dialog.getContentPane().setBackground(UITheme.BG_MAIN);
        dialog.setLayout(new BorderLayout(0, 0));

        // Header Modal
        JPanel pnlHeader = ModernDialogHelper.createModalHeader(
            "CHI TIẾT ĐƠN HÀNG #" + dh.getMaDH(),
            "Ngày đặt: " + dh.getFormattedNgayLap() + " | Trạng thái: " + dh.getTenTrangThaiTiengViet() + " | Kênh: " + dh.getKenhBan(),
            VectorIcon.Type.ORDER
        );
        dialog.add(pnlHeader, BorderLayout.NORTH);

        JPanel pnlBody = new JPanel(new BorderLayout(12, 12));
        pnlBody.setOpaque(false);
        pnlBody.setBorder(new EmptyBorder(14, 18, 14, 18));

        // Customer & Shipping Info Card
        JPanel pnlInfo = new JPanel(new GridLayout(4, 2, 10, 8));
        pnlInfo.setBackground(new Color(0x18, 0x1B, 0x22));
        pnlInfo.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(0x2D, 0x33, 0x40), 1, true),
            new EmptyBorder(12, 16, 12, 16)
        ));

        pnlInfo.add(createDetailLabel("Mã đơn hàng: ", dh.getMaDH()));
        pnlInfo.add(createDetailLabel("Thời gian đặt: ", dh.getFormattedNgayLap()));
        pnlInfo.add(createDetailLabel("Người nhận: ", dh.getTenKhachHang()));
        pnlInfo.add(createDetailLabel("Số điện thoại: ", dh.getSoDienThoai()));
        pnlInfo.add(createDetailLabel("Địa chỉ giao: ", dh.getDiaChiGiao()));
        pnlInfo.add(createDetailLabel("Phương thức: ", dh.getPhuongThucTT()));
        pnlInfo.add(createDetailLabel("Trạng thái đơn: ", dh.getTenTrangThaiTiengViet()));
        pnlInfo.add(createDetailLabel("Ghi chú: ", (dh.getGhiChu() != null && !dh.getGhiChu().trim().isEmpty()) ? dh.getGhiChu() : "Giao hàng tiêu chuẩn"));
        pnlBody.add(pnlInfo, BorderLayout.NORTH);

        // Product items table
        String[] itemCols = {"STT", "Tên Sản Phẩm Keycap", "Đơn Giá", "Số Lượng", "Thành Tiền"};
        DefaultTableModel itemModel = new DefaultTableModel(itemCols, 0) {
            @Override
            public boolean isCellEditable(int r, int c) { return false; }
        };
        ModernTable itemsTable = new ModernTable(itemModel);
        itemsTable.getColumnModel().getColumn(0).setPreferredWidth(45);
        itemsTable.getColumnModel().getColumn(1).setPreferredWidth(280);
        itemsTable.getColumnModel().getColumn(2).setPreferredWidth(120);
        itemsTable.getColumnModel().getColumn(3).setPreferredWidth(70);
        itemsTable.getColumnModel().getColumn(4).setPreferredWidth(130);

        int stt = 1;
        for (ChiTietDonHang item : dh.getDanhSachChiTiet()) {
            itemModel.addRow(new Object[]{
                stt++,
                item.getTenSP(),
                CURRENCY.format(item.getDonGia()),
                item.getSoLuong(),
                CURRENCY.format(item.tinhThanhTien())
            });
        }

        JScrollPane scrollItems = new JScrollPane(itemsTable);
        scrollItems.setBorder(BorderFactory.createLineBorder(UITheme.BORDER_COLOR));
        scrollItems.getViewport().setBackground(UITheme.BG_CARD);
        pnlBody.add(scrollItems, BorderLayout.CENTER);

        dialog.add(pnlBody, BorderLayout.CENTER);

        // Bottom Summary & Actions Footer
        JPanel pnlBottom = new JPanel(new BorderLayout(12, 0));
        pnlBottom.setBackground(new Color(0x18, 0x1B, 0x22));
        pnlBottom.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createMatteBorder(1, 0, 0, 0, new Color(0x2D, 0x33, 0x40)),
            new EmptyBorder(12, 18, 12, 18)
        ));

        double tamTinh = dh.tinhTongTienTamTinh();
        double chietKhau = dh.getPhanTramGiamGia();
        double tienGiam = tamTinh * (chietKhau / 100.0);
        String summaryHtml = String.format(
            "<html><span style='color:#94a3b8'>Tiền hàng:</span> <b style='color:#ffffff'>%s</b>"
            + (chietKhau > 0 ? " &nbsp;|&nbsp; <span style='color:#94a3b8'>Chiết khấu:</span> <b style='color:#fbbf24'>%.0f%% (-%s)</b>" : "")
            + " &nbsp;|&nbsp; <span style='color:#94a3b8'>TỔNG THANH TOÁN:</span> <b style='color:#e30019; font-size:13px;'>%s</b></html>",
            CURRENCY.format(tamTinh),
            chietKhau,
            CURRENCY.format(tienGiam),
            dh.getFormattedTongTien()
        );
        JLabel lblSummary = new JLabel(summaryHtml);
        lblSummary.setFont(UITheme.FONT_REGULAR);
        pnlBottom.add(lblSummary, BorderLayout.WEST);

        JPanel pnlModalActions = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        pnlModalActions.setOpaque(false);

        ModernButton btnPrintModal = new ModernButton("🧾 In Biên Lai (Print)", new Color(0x1B, 0x38, 0x2B), new Color(0x23, 0x4C, 0x3A), UITheme.STATUS_SUCCESS);
        btnPrintModal.setFont(new Font("Segoe UI", Font.BOLD, 12));
        btnPrintModal.addActionListener(e -> {
            ReceiptDialog receipt = new ReceiptDialog(dialog, dh);
            receipt.setVisible(true);
        });

        ModernButton btnClose = new ModernButton("Đóng", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_SECONDARY);
        btnClose.setFont(new Font("Segoe UI", Font.BOLD, 12));
        btnClose.addActionListener(e -> dialog.dispose());

        pnlModalActions.add(btnPrintModal);
        pnlModalActions.add(btnClose);
        pnlBottom.add(pnlModalActions, BorderLayout.EAST);

        dialog.add(pnlBottom, BorderLayout.SOUTH);
        dialog.setVisible(true);
    }

    private void printSelectedReceipt() {
        int row = myOrdersTable.getSelectedRow();
        if (row < 0) {
            JOptionPane.showMessageDialog(this,
                "Vui lòng chọn 1 đơn hàng để in hoặc xem biên lai!",
                "Nhắc nhở", JOptionPane.WARNING_MESSAGE);
            return;
        }

        String orderId = (String) myOrdersTable.getValueAt(row, 0);
        DonHang dh = facade.getAllOrders().stream()
                .filter(o -> o.getMaDH().equals(orderId))
                .findFirst().orElse(null);

        if (dh != null) {
            ReceiptDialog receipt = new ReceiptDialog(this, dh);
            receipt.setVisible(true);
        }
    }

    private JLabel createDetailLabel(String title, String val) {
        JLabel lbl = new JLabel("<html><font color='#94a3b8'>" + title + "</font><font color='#f1f5f9'><b>" + (val != null && !val.trim().isEmpty() ? val : "-") + "</b></font></html>");
        lbl.setFont(UITheme.FONT_SMALL);
        return lbl;
    }

    @Override
    public void onDataChanged(String eventType, Object data) {
        SwingUtilities.invokeLater(() -> {
            refreshProductGrid();
            refreshMyOrders();
            updateCustomerBadge();
        });
    }

    // Helper class for customer dropdown
    private static class KhachHangItem {
        final KhachHang khachHang;

        KhachHangItem(KhachHang kh) {
            this.khachHang = kh;
        }

        @Override
        public String toString() {
            return khachHang.getHoTen() + " (" + khachHang.getSoDienThoai() + ")";
        }
    }
}
