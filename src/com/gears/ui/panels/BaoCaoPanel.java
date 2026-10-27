package com.gears.ui.panels;

import com.gears.patterns.facade.GearsShopFacade;
import com.gears.patterns.observer.IDataObserver;
import com.gears.patterns.observer.Subject;
import com.gears.ui.components.BarChartComponent;
import com.gears.ui.components.ModernButton;
import com.gears.ui.components.StatCard;
import com.gears.ui.theme.UITheme;

import java.awt.*;
import java.io.File;
import java.text.DecimalFormat;
import java.util.Map;
import javax.swing.*;
import javax.swing.border.EmptyBorder;

/**
 * BaoCaoPanel (Boundary): Thống kê Báo cáo Tài chính 3 nhánh BFD:
 * 1. Doanh thu bán hàng thực tế
 * 2. Tổng giá vốn xuất kho
 * 3. Lợi nhuận gộp (Doanh thu - Giá vốn)
 * Tích hợp trực quan hóa bằng biểu đồ Java2D BarChart và Xuất file Excel (.csv).
 * Theo Module 7 trong sơ đồ BFD & Class Diagram.
 */
public class BaoCaoPanel extends JPanel implements IDataObserver {
    private final GearsShopFacade facade = GearsShopFacade.getInstance();

    private StatCard cardRevenue;
    private StatCard cardCost;
    private StatCard cardProfit;
    private StatCard cardOrders;
    private StatCard cardKeycaps;

    private BarChartComponent chartProfitVsRevenue;
    private JPanel pnlCategoryBars;
    private static final DecimalFormat CURRENCY = new DecimalFormat("#,##0 'VNĐ'");

    public BaoCaoPanel() {
        setLayout(new BorderLayout(14, 14));
        setBackground(UITheme.BG_MAIN);
        setBorder(new EmptyBorder(16, 20, 16, 20));

        initHeader();
        initMetricCards();
        initChartsAndBreakdown();

        Subject.getInstance().registerObserver(this);
        refreshData();
    }

    private void initHeader() {
        JPanel pnlHeader = new JPanel(new BorderLayout(10, 0));
        pnlHeader.setOpaque(false);

        JLabel lblTitle = new JLabel("BÁO CÁO THỐNG KÊ TÀI CHÍNH & LỢI NHUẬN GỘP");
        lblTitle.setFont(UITheme.FONT_TITLE);
        lblTitle.setForeground(UITheme.TEXT_PRIMARY);

        JLabel lblSub = new JLabel("Hệ thống tổng hợp tự động theo 3 nhánh BFD: Doanh thu - Giá vốn - Lợi nhuận gộp");
        lblSub.setFont(UITheme.FONT_REGULAR);
        lblSub.setForeground(UITheme.TEXT_SECONDARY);

        JPanel pnlTitles = new JPanel();
        pnlTitles.setOpaque(false);
        pnlTitles.setLayout(new BoxLayout(pnlTitles, BoxLayout.Y_AXIS));
        pnlTitles.add(lblTitle);
        pnlTitles.add(Box.createVerticalStrut(4));
        pnlTitles.add(lblSub);

        ModernButton btnExport = new ModernButton("Xuất Báo Cáo Ra Excel (.csv)", new Color(0x1B, 0x38, 0x2B), new Color(0x23, 0x4C, 0x3A), UITheme.STATUS_SUCCESS);
        btnExport.addActionListener(e -> exportReport());

        pnlHeader.add(pnlTitles, BorderLayout.WEST);
        pnlHeader.add(btnExport, BorderLayout.EAST);

        add(pnlHeader, BorderLayout.NORTH);
    }

    private void initMetricCards() {
        JPanel pnlMetrics = new JPanel(new GridLayout(1, 5, 12, 0));
        pnlMetrics.setOpaque(false);

        cardRevenue = new StatCard("Tổng Doanh Thu", "0 VNĐ", "Đơn đã hoàn tất", UITheme.STATUS_SUCCESS);
        cardCost = new StatCard("Tổng Giá Vốn", "0 VNĐ", "Chi phí nhập hàng NCC", UITheme.STATUS_WARNING);
        cardProfit = new StatCard("Lợi Nhuận Gộp", "0 VNĐ", "Doanh thu trừ vốn", UITheme.PRIMARY_RED);
        cardOrders = new StatCard("Tổng Đơn Hàng", "0 đơn", "Gồm POS & Online", UITheme.STATUS_INFO);
        cardKeycaps = new StatCard("Keycap Xuất Kho", "0 nút", "Số lượng bán ra", UITheme.STATUS_PURPLE);

        pnlMetrics.add(cardRevenue);
        pnlMetrics.add(cardCost);
        pnlMetrics.add(cardProfit);
        pnlMetrics.add(cardOrders);
        pnlMetrics.add(cardKeycaps);

        JPanel pnlCenter = new JPanel();
        pnlCenter.setLayout(new BoxLayout(pnlCenter, BoxLayout.Y_AXIS));
        pnlCenter.setOpaque(false);
        pnlCenter.add(pnlMetrics);
        pnlCenter.add(Box.createVerticalStrut(14));

        add(pnlCenter, BorderLayout.CENTER);
    }

    private void initChartsAndBreakdown() {
        JPanel pnlCenter = (JPanel) ((BorderLayout) getLayout()).getLayoutComponent(BorderLayout.CENTER);

        JPanel pnlSplit = new JPanel(new GridLayout(1, 2, 14, 0));
        pnlSplit.setOpaque(false);

        // Trai: Bieu do Cot Doanh Thu & Loi Nhuan
        chartProfitVsRevenue = new BarChartComponent("BIỂU ĐỒ DOANH THU BÁN HÀNG THEO DANH MỤC");
        pnlSplit.add(chartProfitVsRevenue);

        // Phai: Danh sach tien do the loai
        JPanel pnlChartCard = new JPanel(new BorderLayout(0, 12));
        pnlChartCard.setBackground(UITheme.BG_CARD);
        pnlChartCard.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(UITheme.BORDER_COLOR, 1, true),
            new EmptyBorder(16, 20, 16, 20)
        ));

        JLabel lblChartTitle = new JLabel("CƠ CẤU DOANH SỐ & DOANH THU THEO THỂ LOẠI KEYCAP");
        lblChartTitle.setFont(UITheme.FONT_SUBTITLE);
        lblChartTitle.setForeground(UITheme.TEXT_PRIMARY);
        pnlChartCard.add(lblChartTitle, BorderLayout.NORTH);

        pnlCategoryBars = new JPanel();
        pnlCategoryBars.setOpaque(false);
        pnlCategoryBars.setLayout(new BoxLayout(pnlCategoryBars, BoxLayout.Y_AXIS));

        pnlChartCard.add(pnlCategoryBars, BorderLayout.CENTER);
        pnlSplit.add(pnlChartCard);

        pnlCenter.add(pnlSplit);
    }

    public void refreshData() {
        double revenue = facade.getTotalRevenue();
        double cost = facade.getTotalCost();
        double profit = facade.getTotalGrossProfit();
        int orders = facade.getTotalOrderCount();
        int keycaps = facade.getTotalKeycapsSold();

        cardRevenue.setValue(CURRENCY.format(revenue));
        cardCost.setValue(CURRENCY.format(cost));
        cardProfit.setValue(CURRENCY.format(profit));
        cardOrders.setValue(orders + " đơn");
        cardKeycaps.setValue(keycaps + " keycaps");

        // Cap nhat Bieu Do Cot
        chartProfitVsRevenue.clearItems();
        Map<String, Double> catRev = facade.getCategoryRevenue();
        Color[] colors = {
            new Color(0xE3, 0x00, 0x19), // Red
            new Color(0x3B, 0x82, 0xF6), // Blue
            new Color(0x10, 0xB9, 0x81), // Emerald
            new Color(0xF5, 0x9E, 0x0B), // Amber
            new Color(0x8B, 0x5C, 0xF6)  // Purple
        };

        int idx = 0;
        for (Map.Entry<String, Double> e : catRev.entrySet()) {
            Color c = colors[idx % colors.length];
            chartProfitVsRevenue.addItem(e.getKey(), e.getValue(), c, c.darker());
            idx++;
        }

        // Build category bars
        pnlCategoryBars.removeAll();
        Map<String, Integer> catQty = facade.getCategorySalesQuantity();

        int maxQty = 1;
        for (int q : catQty.values()) {
            if (q > maxQty) maxQty = q;
        }

        idx = 0;
        for (String cat : catQty.keySet()) {
            int qty = catQty.getOrDefault(cat, 0);
            double rev = catRev.getOrDefault(cat, 0.0);
            Color barColor = colors[idx % colors.length];

            pnlCategoryBars.add(createCategoryRow(cat, qty, rev, maxQty, barColor));
            pnlCategoryBars.add(Box.createVerticalStrut(10));
            idx++;
        }

        pnlCategoryBars.revalidate();
        pnlCategoryBars.repaint();
    }

    private JPanel createCategoryRow(String category, int qty, double revenue, int maxQty, Color color) {
        JPanel row = new JPanel(new BorderLayout(14, 4));
        row.setOpaque(false);

        JLabel lblName = new JLabel(String.format("%-10s (%d đã bán)", category, qty));
        lblName.setFont(UITheme.FONT_BOLD);
        lblName.setForeground(UITheme.TEXT_PRIMARY);
        lblName.setPreferredSize(new Dimension(150, 22));

        JLabel lblRev = new JLabel(CURRENCY.format(revenue));
        lblRev.setFont(UITheme.FONT_BOLD);
        lblRev.setForeground(color);
        lblRev.setHorizontalAlignment(SwingConstants.RIGHT);
        lblRev.setPreferredSize(new Dimension(140, 22));

        // Visual Bar
        JPanel barContainer = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

                g2.setColor(UITheme.BG_INPUT);
                g2.fillRoundRect(0, 4, getWidth(), getHeight() - 8, 6, 6);

                int barWidth = (int) ((getWidth() * (Math.max(1, qty) / (double) maxQty)));
                g2.setColor(color);
                g2.fillRoundRect(0, 4, Math.max(8, barWidth), getHeight() - 8, 6, 6);

                g2.dispose();
            }
        };
        barContainer.setOpaque(false);
        barContainer.setPreferredSize(new Dimension(200, 22));

        row.add(lblName, BorderLayout.WEST);
        row.add(barContainer, BorderLayout.CENTER);
        row.add(lblRev, BorderLayout.EAST);

        return row;
    }

    private void exportReport() {
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setDialogTitle("Lưu Báo Cáo Tài Chính Excel");
        fileChooser.setSelectedFile(new File("Bao_Cao_Tai_Chinh_GEARS_" + System.currentTimeMillis() % 100000 + ".csv"));

        int userSelection = fileChooser.showSaveDialog(this);
        if (userSelection == JFileChooser.APPROVE_OPTION) {
            File fileToSave = fileChooser.getSelectedFile();
            if (!fileToSave.getName().toLowerCase().endsWith(".csv")) {
                fileToSave = new File(fileToSave.getAbsolutePath() + ".csv");
            }

            StringBuilder errorMsg = new StringBuilder();
            boolean ok = facade.exportFinancialReport(fileToSave, errorMsg);

            if (ok) {
                JOptionPane.showMessageDialog(this,
                        "Xuất báo cáo tài chính thành công!\nĐường dẫn: " + fileToSave.getAbsolutePath(),
                        "Xuất Báo Cáo Thành Công", JOptionPane.INFORMATION_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(this, errorMsg.toString(), "Lỗi Xuất File", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    @Override
    public void onDataChanged(String eventType, Object data) {
        SwingUtilities.invokeLater(this::refreshData);
    }
}
