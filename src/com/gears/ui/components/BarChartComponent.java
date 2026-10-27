package com.gears.ui.components;

import com.gears.ui.theme.UITheme;

import java.awt.*;
import java.awt.geom.RoundRectangle2D;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
import javax.swing.*;

/**
 * BarChartComponent: Biểu đồ cột tuỳ biến đồ hoạ Java2D sắc nét (High-DPI Anti-Aliased).
 * - Hiệu ứng dải màu Gradient thời thượng
 * - Bo góc đỉnh cột mềm mại
 * - Nhãn giá trị tiền tệ / số lượng nổi bật trên từng cột
 * - Trục tọa độ và lưới nét đứt chuyên nghiệp
 */
public class BarChartComponent extends JComponent {

    public static class BarItem {
        public final String label;
        public final double value;
        public final Color colorStart;
        public final Color colorEnd;

        public BarItem(String label, double value, Color colorStart, Color colorEnd) {
            this.label = label;
            this.value = value;
            this.colorStart = colorStart;
            this.colorEnd = colorEnd;
        }

        public BarItem(String label, double value, Color color) {
            this(label, value, color, color.darker());
        }
    }

    private final List<BarItem> items = new ArrayList<>();
    private String title = "";
    private String unit = "VNĐ";
    private boolean isCurrency = true;

    private static final DecimalFormat CURRENCY_FMT = new DecimalFormat("#,##0 'VNĐ'");
    private static final DecimalFormat SHORT_CURRENCY = new DecimalFormat("#,##0.#M");

    public BarChartComponent(String title) {
        this.title = title;
        setPreferredSize(new Dimension(460, 240));
        setOpaque(false);
    }

    public void setTitle(String title) {
        this.title = title;
        repaint();
    }

    public void setCurrency(boolean isCurrency, String unit) {
        this.isCurrency = isCurrency;
        this.unit = unit;
        repaint();
    }

    public void clearItems() {
        items.clear();
        repaint();
    }

    public void addItem(String label, double value, Color colorStart, Color colorEnd) {
        items.add(new BarItem(label, value, colorStart, colorEnd));
        repaint();
    }

    public void addItem(String label, double value, Color color) {
        items.add(new BarItem(label, value, color));
        repaint();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g.create();

        // Bat che do do hoa chong rang cua Anti-Aliasing
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

        int w = getWidth();
        int h = getHeight();

        // 1. Ve nen the Card toi mau
        g2.setColor(UITheme.BG_CARD);
        g2.fillRoundRect(0, 0, w - 1, h - 1, 12, 12);
        g2.setColor(UITheme.BORDER_COLOR);
        g2.drawRoundRect(0, 0, w - 1, h - 1, 12, 12);

        // 2. Ve Tieu de Bieu do
        int paddingLeft = 20;
        int paddingTop = 20;
        int paddingRight = 20;
        int paddingBottom = 38;

        if (title != null && !title.isEmpty()) {
            g2.setFont(UITheme.FONT_BOLD);
            g2.setColor(UITheme.TEXT_PRIMARY);
            g2.drawString(title, paddingLeft, paddingTop + 2);
            paddingTop += 24;
        }

        if (items.isEmpty()) {
            g2.setFont(UITheme.FONT_REGULAR);
            g2.setColor(UITheme.TEXT_MUTED);
            g2.drawString("Chưa có dữ liệu thống kê", w / 2 - 70, h / 2);
            g2.dispose();
            return;
        }

        // 3. Tinh toan gia tri lon nhat Max Value
        double maxVal = 0;
        for (BarItem item : items) {
            if (item.value > maxVal) maxVal = item.value;
        }
        if (maxVal <= 0) maxVal = 1;

        int plotX = paddingLeft + 10;
        int plotY = paddingTop + 10;
        int plotW = w - plotX - paddingRight - 10;
        int plotH = h - plotY - paddingBottom;

        // 4. Ve luoi net dut tham chieu (Reference Grid Lines)
        g2.setColor(new Color(0x28, 0x2D, 0x38));
        Stroke dashed = new BasicStroke(1.0f, BasicStroke.CAP_BUTT, BasicStroke.JOIN_MITER, 10.0f, new float[]{4.0f, 4.0f}, 0.0f);
        g2.setStroke(dashed);

        int gridLines = 4;
        for (int i = 0; i <= gridLines; i++) {
            int yPos = plotY + (int) ((double) i / gridLines * plotH);
            g2.drawLine(plotX, yPos, plotX + plotW, yPos);
        }
        g2.setStroke(new BasicStroke(1.0f));

        // 5. Ve cac cot bieu do
        int n = items.size();
        int slotWidth = plotW / Math.max(1, n);
        int barWidth = Math.min(54, (int) (slotWidth * 0.65));

        for (int i = 0; i < n; i++) {
            BarItem item = items.get(i);
            int barHeight = (int) ((item.value / maxVal) * (plotH - 24));
            if (barHeight < 4 && item.value > 0) barHeight = 4;

            int barX = plotX + i * slotWidth + (slotWidth - barWidth) / 2;
            int barY = plotY + plotH - barHeight;

            // Gradient Fill cho cot
            GradientPaint gp = new GradientPaint(barX, barY, item.colorStart, barX, plotY + plotH, item.colorEnd);
            g2.setPaint(gp);
            RoundRectangle2D.Float roundBar = new RoundRectangle2D.Float(barX, barY, barWidth, barHeight, 8, 8);
            g2.fill(roundBar);

            // Vien vien nhe phan tren
            g2.setColor(new Color(255, 255, 255, 40));
            g2.draw(roundBar);

            // Nhan gia tri tren dau cot
            String valStr = formatValue(item.value);
            g2.setFont(new Font("Segoe UI", Font.BOLD, 10));
            FontMetrics fm = g2.getFontMetrics();
            int strW = fm.stringWidth(valStr);

            // Ve pill tag nho chua gia tri
            int pillX = barX + (barWidth - strW) / 2 - 4;
            int pillY = barY - 18;
            g2.setColor(new Color(0x12, 0x14, 0x18, 200));
            g2.fillRoundRect(pillX, pillY, strW + 8, 14, 4, 4);

            g2.setColor(UITheme.TEXT_PRIMARY);
            g2.drawString(valStr, pillX + 4, pillY + 11);

            // Ten the loai ben duoi cot
            g2.setFont(UITheme.FONT_SMALL);
            g2.setColor(UITheme.TEXT_SECONDARY);
            FontMetrics fmCat = g2.getFontMetrics();
            int catW = fmCat.stringWidth(item.label);
            g2.drawString(item.label, barX + (barWidth - catW) / 2, plotY + plotH + 18);
        }

        // 6. Duong truc hoanh X-axis
        g2.setColor(UITheme.BORDER_COLOR);
        g2.drawLine(plotX, plotY + plotH, plotX + plotW, plotY + plotH);

        g2.dispose();
    }

    private String formatValue(double val) {
        if (!isCurrency) {
            return String.format("%.0f %s", val, unit);
        }
        if (val >= 1_000_000) {
            return SHORT_CURRENCY.format(val / 1_000_000.0);
        } else if (val >= 1_000) {
            return String.format("%.0fk", val / 1_000.0);
        } else {
            return String.format("%.0f", val);
        }
    }
}
