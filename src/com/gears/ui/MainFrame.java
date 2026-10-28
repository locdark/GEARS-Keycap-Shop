package com.gears.ui;

import com.gears.model.NhanVien;
import com.gears.patterns.facade.GearsShopFacade;
import com.gears.ui.components.ModernButton;
import com.gears.ui.components.VectorIcon;
import com.gears.ui.panels.*;
import com.gears.ui.theme.UITheme;

import java.awt.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.swing.*;
import javax.swing.border.EmptyBorder;

/**
 * MainFrame (Boundary): Cửa Sổ Chính Của Ứng Dụng GEARS Keycap Shop.
 * Kiến trúc 3 Lớp: Boundary (MainFrame/Panels) -> Controller/Service (GearsShopFacade) -> DAO/Entity.
 * Hỗ trợ 2 chế độ hiển thị:
 * 1. Chế độ Quản Trị Viên (Admin): Toàn quyền truy cập 10 phân hệ
 * 2. Chế độ Nhân Viên Thu Ngân (Cashier POS): Tập trung bán hàng quầy POS, tra cứu kho, ẩn các tab nhạy cảm
 */
public class MainFrame extends JFrame {
    private final GearsShopFacade facade = GearsShopFacade.getInstance();

    private CardLayout cardLayout;
    private JPanel pnlContentCards;
    private JLabel lblCurrentScreen;
    private JLabel lblClock;

    private final Map<String, JButton> sidebarButtons = new LinkedHashMap<>();
    private String activeCardName = "DASHBOARD";
    private final boolean isCashierMode;

    private static final DateTimeFormatter CLOCK_FMT = DateTimeFormatter.ofPattern("HH:mm:ss - dd/MM/yyyy");

    public MainFrame() {
        this(false);
    }

    public MainFrame(boolean isCashierMode) {
        this.isCashierMode = isCashierMode;

        if (isCashierMode) {
            setTitle("GEARS Keycap Shop - ĐIỂM BÁN HÀNG THU NGÂN (CASHIER POS)");
        } else {
            setTitle("GEARS Keycap Shop - QUẢN TRỊ VIÊN HỆ THỐNG (ADMIN) [Đồ Án PTTKHDT SGU]");
        }

        setSize(1280, 820);
        setMinimumSize(new Dimension(800, 520));
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        getContentPane().setBackground(UITheme.BG_MAIN);
        setLayout(new BorderLayout());

        initTopHeader();
        initSidebar();
        initContentCards();
        initLiveClock();

        // Mo man hinh mac dinh
        if (isCashierMode) {
            switchScreen("POS", "ĐIỂM BÁN LẺ TẠI QUẦY (POS)");
        } else {
            switchScreen("DASHBOARD", "BẢNG ĐIỀU KHIỂN QUẢN TRỊ");
        }
    }

    // ==========================================
    // 1. TOP HEADER BAR
    // ==========================================
    private void initTopHeader() {
        JPanel pnlHeader = new JPanel(new BorderLayout(14, 0));
        pnlHeader.setBackground(UITheme.BG_HEADER);
        pnlHeader.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createMatteBorder(0, 0, 1, 0, UITheme.BORDER_COLOR),
            new EmptyBorder(10, 20, 10, 20)
        ));

        // Left Brand & Screen Title
        JPanel pnlBrand = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 0));
        pnlBrand.setOpaque(false);

        JLabel lblLogo = new JLabel("GEARS");
        lblLogo.setFont(new Font("Segoe UI", Font.BOLD, 17));
        lblLogo.setForeground(Color.WHITE);
        lblLogo.setOpaque(true);
        lblLogo.setBackground(UITheme.PRIMARY_RED);
        lblLogo.setBorder(new EmptyBorder(4, 10, 4, 10));

        lblCurrentScreen = new JLabel("BẢNG ĐIỀU KHIỂN QUẢN TRỊ");
        lblCurrentScreen.setFont(UITheme.FONT_SUBTITLE);
        lblCurrentScreen.setForeground(UITheme.TEXT_PRIMARY);

        pnlBrand.add(lblLogo);
        pnlBrand.add(lblCurrentScreen);
        pnlHeader.add(pnlBrand, BorderLayout.WEST);

        // Right User Profile & Clock
        JPanel pnlRight = new JPanel(new FlowLayout(FlowLayout.RIGHT, 14, 0));
        pnlRight.setOpaque(false);

        lblClock = new JLabel(LocalDateTime.now().format(CLOCK_FMT));
        lblClock.setFont(UITheme.FONT_SMALL);
        lblClock.setForeground(UITheme.TEXT_MUTED);

        NhanVien user = facade.getCurrentUser();
        String userName = (user != null) ? user.getHoTen() : (isCashierMode ? "Phạm Thu Ngân" : "Nguyễn Công Danh");
        String userRole = (user != null) ? user.getVaiTro() : (isCashierMode ? "Thu Ngân (POS)" : "Quản Trị Viên (Admin)");
        Color roleColor = (isCashierMode) ? UITheme.STATUS_INFO : UITheme.PRIMARY_RED;

        JLabel lblUser = new JLabel("<html><b>" + userName + "</b> <font color='" + toHex(roleColor) + "'>(" + userRole + ")</font></html>");
        lblUser.setFont(UITheme.FONT_REGULAR);
        lblUser.setForeground(UITheme.TEXT_PRIMARY);

        ModernButton btnSync = new ModernButton("Tải Lại CSDL", new Color(0x1B, 0x38, 0x4C), new Color(0x23, 0x4C, 0x6A), UITheme.STATUS_INFO);
        btnSync.setFont(UITheme.FONT_SMALL);
        btnSync.setPreferredSize(new Dimension(105, 30));
        btnSync.setToolTipText("Làm mới và đồng bộ toàn bộ CSDL hệ thống");
        btnSync.addActionListener(e -> {
            facade.reloadDatabase();
            JOptionPane.showMessageDialog(this,
                    "ĐÃ ĐỒNG BỘ VÀ TẢI LẠI CSDL THÀNH CÔNG!\n- Toàn bộ dữ liệu 10 phân hệ đã được làm mới từ đĩa.",
                    "Đồng Bộ Thành Công", JOptionPane.INFORMATION_MESSAGE);
        });

        ModernButton btnLogout = new ModernButton("Đăng Xuất", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_SECONDARY);
        btnLogout.setFont(UITheme.FONT_SMALL);
        btnLogout.setPreferredSize(new Dimension(90, 30));
        btnLogout.addActionListener(e -> logout());

        pnlRight.add(lblClock);
        pnlRight.add(lblUser);
        pnlRight.add(btnSync);
        pnlRight.add(btnLogout);

        pnlHeader.add(pnlRight, BorderLayout.EAST);
        add(pnlHeader, BorderLayout.NORTH);
    }

    // ==========================================
    // 2. LEFT NAVIGATION SIDEBAR
    // ==========================================
    private void initSidebar() {
        JPanel pnlSidebar = new JPanel();
        pnlSidebar.setLayout(new BoxLayout(pnlSidebar, BoxLayout.Y_AXIS));
        pnlSidebar.setBackground(UITheme.BG_SIDEBAR);
        pnlSidebar.setPreferredSize(new Dimension(225, 0));
        pnlSidebar.setBorder(BorderFactory.createMatteBorder(0, 0, 0, 1, UITheme.BORDER_COLOR));

        pnlSidebar.add(Box.createVerticalStrut(14));

        JLabel lblMenu = new JLabel("  MENU HỆ THỐNG");
        lblMenu.setFont(new Font("Segoe UI", Font.BOLD, 10));
        lblMenu.setForeground(UITheme.TEXT_MUTED);
        pnlSidebar.add(lblMenu);
        pnlSidebar.add(Box.createVerticalStrut(10));

        // Sidebar Navigation Items voi VectorIcon hien dai chuan ERP
        if (!isCashierMode) {
            addSidebarItem(pnlSidebar, "DASHBOARD", VectorIcon.Type.DASHBOARD, "Tổng Quan", "BẢNG ĐIỀU KHIỂN QUẢN TRỊ");
        }
        addSidebarItem(pnlSidebar, "POS", VectorIcon.Type.POS, "Bán Hàng POS", "ĐIỂM BÁN LẺ TẠI QUẦY (POS)");
        addSidebarItem(pnlSidebar, "SAN_PHAM", VectorIcon.Type.KEYCAP, "Sản Phẩm Keycap", "QUẢN LÝ SẢN PHẨM & KHO HÀNG (100 KEYCAPS)");
        addSidebarItem(pnlSidebar, "DON_HANG", VectorIcon.Type.ORDER, "Quản Lý Đơn Hàng", "QUẢN LÝ ĐƠN HÀNG & DUYỆT TRẠNG THÁI");
        addSidebarItem(pnlSidebar, "KHACH_HANG", VectorIcon.Type.CUSTOMER, "Khách Hàng (CRM)", "HỒ SƠ KHÁCH HÀNG & TÍCH LŨY ĐIỂM");
        addSidebarItem(pnlSidebar, "NCC", VectorIcon.Type.SUPPLIER, "Nhà Cung Cấp", "QUẢN LÝ ĐỐI TÁC & NHÀ CUNG CẤP");

        if (!isCashierMode) {
            addSidebarItem(pnlSidebar, "NHAN_VIEN", VectorIcon.Type.EMPLOYEE, "Quản Lý Nhân Viên", "QUẢN LÝ NHÂN VIÊN & PHÂN QUYỀN");
            addSidebarItem(pnlSidebar, "BAO_CAO", VectorIcon.Type.REPORT, "Báo Cáo Thống Kê", "BÁO CÁO TÀI CHÍNH & LỢI NHUẬN GỘP");
            addSidebarItem(pnlSidebar, "CONFIG", VectorIcon.Type.CONFIG, "Cấu Hình Hệ Thống", "CẤU HÌNH HỆ THỐNG, CSDL & VIETQR");
            addSidebarItem(pnlSidebar, "OOP_INSPECTOR", VectorIcon.Type.INSPECTOR, "OOP Live Inspector", "TRÌNH KIỂM TRA & BẢO VỆ ĐỒ ÁN OOP (SGU)");
        }

        pnlSidebar.add(Box.createVerticalGlue());

        // Footer in sidebar
        JLabel lblSGU = new JLabel("<html><center><font color='#6B7280'>Đồ Án PTTKHDT<br>Nhóm 19 - SGU 2026</font></center></html>");
        lblSGU.setFont(UITheme.FONT_SMALL);
        lblSGU.setAlignmentX(Component.CENTER_ALIGNMENT);
        pnlSidebar.add(lblSGU);
        pnlSidebar.add(Box.createVerticalStrut(14));

        add(pnlSidebar, BorderLayout.WEST);
    }

    private void addSidebarItem(JPanel container, String cardName, VectorIcon.Type iconType, String title, String screenTitle) {
        JButton btn = new JButton("  " + title);
        btn.setFont(UITheme.FONT_BOLD);
        btn.setForeground(UITheme.TEXT_SECONDARY);
        btn.setBackground(UITheme.BG_SIDEBAR);
        btn.setIcon(new VectorIcon(iconType, 18, UITheme.TEXT_SECONDARY));
        btn.setFocusPainted(false);
        btn.setBorderPainted(false);
        btn.setContentAreaFilled(false);
        btn.setHorizontalAlignment(SwingConstants.LEFT);
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        btn.setMaximumSize(new Dimension(212, 40));
        btn.setPreferredSize(new Dimension(212, 40));
        btn.setBorder(new EmptyBorder(6, 16, 6, 12));

        // Hover Effect
        btn.addMouseListener(new java.awt.event.MouseAdapter() {
            @Override
            public void mouseEntered(java.awt.event.MouseEvent e) {
                if (!cardName.equals(activeCardName)) {
                    btn.setOpaque(true);
                    btn.setBackground(UITheme.BG_CARD);
                    btn.setForeground(Color.WHITE);
                    VectorIcon icon = (VectorIcon) btn.getIcon();
                    if (icon != null) icon.setColor(Color.WHITE);
                    btn.repaint();
                }
            }

            @Override
            public void mouseExited(java.awt.event.MouseEvent e) {
                if (!cardName.equals(activeCardName)) {
                    btn.setOpaque(false);
                    btn.setBackground(UITheme.BG_SIDEBAR);
                    btn.setForeground(UITheme.TEXT_SECONDARY);
                    VectorIcon icon = (VectorIcon) btn.getIcon();
                    if (icon != null) icon.setColor(UITheme.TEXT_SECONDARY);
                    btn.repaint();
                }
            }
        });

        btn.addActionListener(e -> {
            // Kiem tra phan quyen cho cac tab quan tri nhay cam
            if (cardName.equals("NHAN_VIEN") || cardName.equals("BAO_CAO") || cardName.equals("CONFIG")) {
                if (isCashierMode || !facade.isAdmin()) {
                    JOptionPane.showMessageDialog(this,
                            "BẠN KHÔNG CÓ QUYỀN TRUY CẬP!\nPhân hệ này chỉ dành riêng cho Quản Trị Viên (Admin).",
                            "Từ Chối Truy Cập", JOptionPane.WARNING_MESSAGE);
                    return;
                }
            }
            switchScreen(cardName, screenTitle);
        });

        sidebarButtons.put(cardName, btn);
        container.add(btn);
        container.add(Box.createVerticalStrut(3));
    }

    private void switchScreen(String cardName, String title) {
        this.activeCardName = cardName;
        cardLayout.show(pnlContentCards, cardName);
        lblCurrentScreen.setText(title);

        // Tự động kiểm tra và đồng bộ lại CSDL khi chuyển sang màn hình Đơn Hàng hoặc Dashboard
        if ("DON_HANG".equals(cardName) || "DASHBOARD".equals(cardName)) {
            facade.reloadDatabase();
        }

        // Update button visual states & vector icon colors
        for (Map.Entry<String, JButton> entry : sidebarButtons.entrySet()) {
            JButton b = entry.getValue();
            VectorIcon icon = (VectorIcon) b.getIcon();
            if (entry.getKey().equals(cardName)) {
                b.setForeground(Color.WHITE);
                b.setOpaque(true);
                b.setBackground(UITheme.PRIMARY_RED);
                if (icon != null) icon.setColor(Color.WHITE);
            } else {
                b.setForeground(UITheme.TEXT_SECONDARY);
                b.setOpaque(false);
                b.setBackground(UITheme.BG_SIDEBAR);
                if (icon != null) icon.setColor(UITheme.TEXT_SECONDARY);
            }
            b.repaint();
        }
    }

    // ==========================================
    // 3. CENTER CONTENT CARDS
    // ==========================================
    private void initContentCards() {
        cardLayout = new CardLayout();
        pnlContentCards = new JPanel(cardLayout);
        pnlContentCards.setBackground(UITheme.BG_MAIN);

        pnlContentCards.add(new DashboardPanel(), "DASHBOARD");
        pnlContentCards.add(new POSPanel(), "POS");
        pnlContentCards.add(new SanPhamPanel(), "SAN_PHAM");
        pnlContentCards.add(new DonHangPanel(), "DON_HANG");
        pnlContentCards.add(new NhaCungCapPanel(), "NCC");
        pnlContentCards.add(new KhachHangPanel(), "KHACH_HANG");
        pnlContentCards.add(new NhanVienPanel(), "NHAN_VIEN");
        pnlContentCards.add(new BaoCaoPanel(), "BAO_CAO");
        pnlContentCards.add(new HeThongConfigPanel(), "CONFIG");
        pnlContentCards.add(new OOPInspectorPanel(), "OOP_INSPECTOR");

        add(pnlContentCards, BorderLayout.CENTER);
    }

    private void initLiveClock() {
        Timer timer = new Timer(1000, e -> {
            lblClock.setText(LocalDateTime.now().format(CLOCK_FMT));
        });
        timer.start();
    }

    private void logout() {
        int confirm = JOptionPane.showConfirmDialog(this, "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?", "Xác Nhận Đăng Xuất", JOptionPane.YES_NO_OPTION);
        if (confirm == JOptionPane.YES_OPTION) {
            facade.logout();
            SwingUtilities.invokeLater(() -> {
                new LoginFrame().setVisible(true);
                dispose();
            });
        }
    }

    private String toHex(Color c) {
        return String.format("#%02x%02x%02x", c.getRed(), c.getGreen(), c.getBlue());
    }
}
