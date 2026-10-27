package com.gears.ui.panels;

import com.gears.model.DonHang;
import com.gears.patterns.facade.GearsShopFacade;
import com.gears.patterns.observer.IDataObserver;
import com.gears.patterns.observer.Subject;
import com.gears.ui.components.BarChartComponent;
import com.gears.ui.components.DonutChartComponent;
import com.gears.ui.components.ModernTable;
import com.gears.ui.components.StatCard;
import com.gears.ui.theme.UITheme;

import java.awt.*;
import java.text.DecimalFormat;
import java.util.List;
import java.util.Map;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;

/**
 * DashboardPanel: Bảng Điều Khiển Quản Trị Hệ Thống GEARS Keycap Shop.
 * Tích hợp đầy đủ biểu đồ trực quan hóa dữ liệu Java2D:
 * 1. KPI Cards (Doanh Thu, Lợi Nhuận Gộp, Đơn Hàng, Keycap Đã Bán)
 * 2. BarChartComponent: Biểu đồ cột Doanh thu theo Thể loại Keycap
 * 3. DonutChartComponent: Biểu đồ tròn cơ cấu số lượng danh mục sản phẩm
 * 4. Bảng giao dịch đơn hàng gần đây với Status Pill Badges
 * Tự động cập nhật tức thời qua Observer Pattern khi có đơn hàng mới phát sinh.
 */
public class DashboardPanel extends JPanel implements IDataObserver {
    private final GearsShopFacade facade = GearsShopFacade.getInstance();

    private StatCard cardRevenue;
    private StatCard cardProfit;
    private StatCard cardOrders;
    private StatCard cardKeycaps;

    private BarChartComponent barChartRevenue;
    private DonutChartComponent donutChartCategory;

    private DefaultTableModel tableModel;
    private ModernTable tableRecentOrders;

    private static final DecimalFormat CURRENCY = new DecimalFormat("#,##0 'VNĐ'");

    public DashboardPanel() {
        setLayout(new BorderLayout(14, 14));
        setBackground(UITheme.BG_MAIN);
        setBorder(new EmptyBorder(16, 20, 16, 20));

        initHeader();
        initContent();

        // Dang ky Observer lang nghe thay doi du lieu tu toan he thong
        Subject.getInstance().registerObserver(this);

        refreshData();
    }

    private void initHeader() {
        JPanel pnlHeader = new JPanel(new BorderLayout());
        pnlHeader.setOpaque(false);

        JLabel lblTitle = new JLabel("BẢNG ĐIỀU KHIỂN QUẢN TRỊ (DASHBOARD)");
        lblTitle.setFont(UITheme.FONT_TITLE);
        lblTitle.setForeground(UITheme.TEXT_PRIMARY);

        JLabel lblSub = new JLabel("Hệ thống quản lý chuỗi bán lẻ lẻ Keycap & Bàn phím cơ - Giám sát tài chính & tồn kho thời gian thực");
        lblSub.setFont(UITheme.FONT_REGULAR);
        lblSub.setForeground(UITheme.TEXT_SECONDARY);

        JPanel pnlText = new JPanel();
        pnlText.setOpaque(false);
        pnlText.setLayout(new BoxLayout(pnlText, BoxLayout.Y_AXIS));
        pnlText.add(lblTitle);
        pnlText.add(Box.createVerticalStrut(4));
        pnlText.add(lblSub);

        pnlHeader.add(pnlText, BorderLayout.WEST);
        add(pnlHeader, BorderLayout.NORTH);
    }

    private void initContent() {
        JPanel pnlScrollableContent = new JPanel();
        pnlScrollableContent.setLayout(new BoxLayout(pnlScrollableContent, BoxLayout.Y_AXIS));
        pnlScrollableContent.setOpaque(false);

        // 1. KPI STAT CARDS ROW
        JPanel pnlStats = new JPanel(new GridLayout(1, 4, 14, 0));
        pnlStats.setOpaque(false);
        pnlStats.setMaximumSize(new Dimension(Integer.MAX_VALUE, 100));

        cardRevenue = new StatCard("Tổng Doanh Thu", "0 VNĐ", "Doanh thu bán lẻ thực tế", UITheme.STATUS_SUCCESS);
        cardProfit = new StatCard("Lợi Nhuận Gộp", "0 VNĐ", "Doanh thu trừ giá vốn", UITheme.PRIMARY_RED);
        cardOrders = new StatCard("Tổng Đơn Hàng", "0 đơn", "Bao gồm POS & Online", UITheme.STATUS_INFO);
        cardKeycaps = new StatCard("Keycap Đã Bán", "0 nút", "Số lượng xuất kho", UITheme.STATUS_PURPLE);

        pnlStats.add(cardRevenue);
        pnlStats.add(cardProfit);
        pnlStats.add(cardOrders);
        pnlStats.add(cardKeycaps);
        pnlScrollableContent.add(pnlStats);
        pnlScrollableContent.add(Box.createVerticalStrut(14));

        // 2. CHARTS ROW (BAR CHART + DONUT CHART SIDE-BY-SIDE)
        JPanel pnlCharts = new JPanel(new GridLayout(1, 2, 14, 0));
        pnlCharts.setOpaque(false);
        pnlCharts.setPreferredSize(new Dimension(900, 240));
        pnlCharts.setMaximumSize(new Dimension(Integer.MAX_VALUE, 250));

        barChartRevenue = new BarChartComponent("BIỂU ĐỒ DOANH THU THEO THỂ LOẠI KEYCAP");
        donutChartCategory = new DonutChartComponent("CƠ CẤU DANH MỤC & TỒN KHO 100 KEYCAPS");

        pnlCharts.add(barChartRevenue);
        pnlCharts.add(donutChartCategory);
        pnlScrollableContent.add(pnlCharts);
        pnlScrollableContent.add(Box.createVerticalStrut(14));

        // 3. RECENT ORDERS TABLE
        JPanel pnlOrders = new JPanel(new BorderLayout(0, 8));
        pnlOrders.setOpaque(false);

        JLabel lblTableTitle = new JLabel("GIAO DỊCH ĐƠN HÀNG GẦN ĐÂY");
        lblTableTitle.setFont(UITheme.FONT_SUBTITLE);
        lblTableTitle.setForeground(UITheme.TEXT_PRIMARY);
        pnlOrders.add(lblTableTitle, BorderLayout.NORTH);

        String[] cols = {"Mã Đơn", "Ngày Lập", "Khách Hàng", "Thu Ngân", "Kênh Bán", "Thanh Toán", "Tổng Tiền", "Trạng Thái"};
        tableModel = new DefaultTableModel(cols, 0);
        tableRecentOrders = new ModernTable(tableModel);

        tableRecentOrders.getColumnModel().getColumn(0).setPreferredWidth(90);
        tableRecentOrders.getColumnModel().getColumn(1).setPreferredWidth(130);
        tableRecentOrders.getColumnModel().getColumn(2).setPreferredWidth(160);
        tableRecentOrders.getColumnModel().getColumn(3).setPreferredWidth(130);
        tableRecentOrders.getColumnModel().getColumn(4).setPreferredWidth(75);
        tableRecentOrders.getColumnModel().getColumn(5).setPreferredWidth(120);
        tableRecentOrders.getColumnModel().getColumn(6).setPreferredWidth(120);
        tableRecentOrders.getColumnModel().getColumn(7).setPreferredWidth(110);

        JScrollPane scroll = new JScrollPane(tableRecentOrders);
        scroll.setBorder(BorderFactory.createLineBorder(UITheme.BORDER_COLOR));
        scroll.getViewport().setBackground(UITheme.BG_CARD);
        scroll.setPreferredSize(new Dimension(900, 220));

        pnlOrders.add(scroll, BorderLayout.CENTER);
        pnlScrollableContent.add(pnlOrders);

        add(pnlScrollableContent, BorderLayout.CENTER);
    }

    public void refreshData() {
        double revenue = facade.getTotalRevenue();
        double profit = facade.getTotalGrossProfit();
        int orders = facade.getTotalOrderCount();
        int keycaps = facade.getTotalKeycapsSold();

        cardRevenue.setValue(CURRENCY.format(revenue));
        cardProfit.setValue(CURRENCY.format(profit));
        cardOrders.setValue(orders + " đơn");
        cardKeycaps.setValue(keycaps + " keycaps");

        // 1. Cap nhat du lieu Bieu Do Cot (Bar Chart)
        barChartRevenue.clearItems();
        Map<String, Double> catRev = facade.getCategoryRevenue();
        Color[] barColors = {
            UITheme.PRIMARY_RED,
            UITheme.STATUS_INFO,
            UITheme.STATUS_SUCCESS,
            UITheme.STATUS_WARNING,
            UITheme.STATUS_PURPLE
        };
        int cIdx = 0;
        for (Map.Entry<String, Double> e : catRev.entrySet()) {
            Color c = barColors[cIdx % barColors.length];
            barChartRevenue.addItem(e.getKey(), e.getValue(), c, c.darker());
            cIdx++;
        }

        // 2. Cap nhat du lieu Bieu Do Donut (Donut Chart)
        donutChartCategory.clearSlices();
        Map<String, Integer> catStock = facade.getCategorySalesQuantity();
        int totalKeycaps = facade.getAllProducts().size();
        donutChartCategory.setCenterInfo("TỔNG KHO", totalKeycaps + " SP");

        int sIdx = 0;
        for (String cat : new String[]{"Artisan", "Anime", "Pudding", "Cherry", "Other"}) {
            int countInCat = (int) facade.getAllProducts().stream().filter(p -> cat.equalsIgnoreCase(p.getTheLoai())).count();
            Color c = barColors[sIdx % barColors.length];
            donutChartCategory.addSlice(cat, countInCat, c);
            sIdx++;
        }

        // 3. Cap nhat Bang Don Hang Gan Day
        tableModel.setRowCount(0);
        List<DonHang> allOrders = facade.getAllOrders();
        int limit = Math.min(allOrders.size(), 8);

        for (int i = allOrders.size() - 1; i >= allOrders.size() - limit; i--) {
            if (i < 0) break;
            DonHang dh = allOrders.get(i);
            tableModel.addRow(new Object[]{
                dh.getMaDH(),
                dh.getFormattedNgayLap(),
                dh.getTenKhachHang(),
                dh.getTenNhanVien(),
                dh.getKenhBan(),
                dh.getPhuongThucTT(),
                dh.getFormattedTongTien(),
                dh.getTenTrangThaiTiengViet()
            });
        }
    }

    @Override
    public void onDataChanged(String eventType, Object data) {
        SwingUtilities.invokeLater(this::refreshData);
    }
}
