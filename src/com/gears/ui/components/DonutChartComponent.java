package com.gears.ui.components;

import com.gears.ui.theme.UITheme;

import java.awt.*;
import java.awt.geom.Arc2D;
import java.awt.geom.Ellipse2D;
import java.util.ArrayList;
import java.util.List;
import javax.swing.*;

/**
 * DonutChartComponent: Biểu đồ tròn khuyết tâm (Donut Chart) Java2D hiện đại:
 * - Render phân bổ cơ cấu danh mục keycap
 * - Khuyết tâm hiển thị tổng số lượng / metric trung tâm
 * - Legend bên phải hiển thị tên, số lượng và tỷ lệ % đóng góp
 */
public class DonutChartComponent extends JComponent {

    public static class Slice {
        public final String label;
        public final double value;
        public final Color color;

        public Slice(String label, double value, Color color) {
            this.label = label;
            this.value = value;
            this.color = color;
        }
    }

    private final List<Slice> slices = new ArrayList<>();
    private String title = "";
    private String centerTextTop = "TỔNG SỐ";
    private String centerTextValue = "0";

    public DonutChartComponent(String title) {
        this.title = title;
        setPreferredSize(new Dimension(440, 240));
        setOpaque(false);
    }

    public void clearSlices() {
        slices.clear();
        repaint();
    }

    public void addSlice(String label, double value, Color color) {
        slices.add(new Slice(label, value, color));
        repaint();
    }

    public void setCenterInfo(String top, String val) {
        this.centerTextTop = top;
        this.centerTextValue = val;
        repaint();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g.create();

        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

        int w = getWidth();
        int h = getHeight();

        // 1. Ve nen the Card
        g2.setColor(UITheme.BG_CARD);
        g2.fillRoundRect(0, 0, w - 1, h - 1, 12, 12);
        g2.setColor(UITheme.BORDER_COLOR);
        g2.drawRoundRect(0, 0, w - 1, h - 1, 12, 12);

        // 2. Ve tieu de
        int paddingLeft = 20;
        int paddingTop = 20;
        if (title != null && !title.isEmpty()) {
            g2.setFont(UITheme.FONT_BOLD);
            g2.setColor(UITheme.TEXT_PRIMARY);
            g2.drawString(title, paddingLeft, paddingTop + 2);
            paddingTop += 20;
        }

        if (slices.isEmpty()) {
            g2.setFont(UITheme.FONT_REGULAR);
            g2.setColor(UITheme.TEXT_MUTED);
            g2.drawString("Chưa có dữ liệu danh mục", w / 2 - 70, h / 2);
            g2.dispose();
            return;
        }

        double total = 0;
        for (Slice s : slices) total += s.value;
        if (total <= 0) total = 1;

        // 3. Toa do va kich thuoc hinh tron Donut
        int chartDiameter = Math.min(w * 35 / 100, h - paddingTop - 30);
        chartDiameter = Math.max(chartDiameter, 110);
        int chartX = paddingLeft + 10;
        int chartY = paddingTop + (h - paddingTop - chartDiameter) / 2;

        double curAngle = 90.0; // Bat dau tu 12 gio
        for (Slice s : slices) {
            double arcAngle = (s.value / total) * 360.0;
            g2.setColor(s.color);
            g2.fill(new Arc2D.Double(chartX, chartY, chartDiameter, chartDiameter, curAngle, -arcAngle, Arc2D.PIE));
            curAngle -= arcAngle;
        }

        // 4. Lo khuyet tam (Donut Hole)
        int holeDiameter = (int) (chartDiameter * 0.58);
        int holeX = chartX + (chartDiameter - holeDiameter) / 2;
        int holeY = chartY + (chartDiameter - holeDiameter) / 2;

        g2.setColor(UITheme.BG_CARD);
        g2.fill(new Ellipse2D.Double(holeX, holeY, holeDiameter, holeDiameter));
        g2.setColor(UITheme.BORDER_COLOR);
        g2.draw(new Ellipse2D.Double(holeX, holeY, holeDiameter, holeDiameter));

        // Chu o tam Donut
        g2.setFont(new Font("Segoe UI", Font.PLAIN, 10));
        g2.setColor(UITheme.TEXT_MUTED);
        FontMetrics fmTop = g2.getFontMetrics();
        int strWTop = fmTop.stringWidth(centerTextTop);
        g2.drawString(centerTextTop, holeX + (holeDiameter - strWTop) / 2, holeY + holeDiameter / 2 - 4);

        g2.setFont(new Font("Segoe UI", Font.BOLD, 15));
        g2.setColor(UITheme.PRIMARY_RED);
        FontMetrics fmVal = g2.getFontMetrics();
        int strWVal = fmVal.stringWidth(centerTextValue);
        g2.drawString(centerTextValue, holeX + (holeDiameter - strWVal) / 2, holeY + holeDiameter / 2 + 14);

        // 5. Chu thich Legend ben phai
        int legendX = chartX + chartDiameter + 24;
        int legendY = paddingTop + 12;
        int rowHeight = 26;

        for (Slice s : slices) {
            if (legendY + rowHeight > h - 10) break;
            double percent = (s.value / total) * 100.0;

            // Swatch mau tron nho
            g2.setColor(s.color);
            g2.fillOval(legendX, legendY + 5, 10, 10);

            // Ten the loai
            g2.setFont(UITheme.FONT_BOLD);
            g2.setColor(UITheme.TEXT_PRIMARY);
            g2.drawString(s.label, legendX + 18, legendY + 14);

            // So luong va ti le %
            String detailStr = String.format("%.0f nút (%.1f%%)", s.value, percent);
            g2.setFont(UITheme.FONT_SMALL);
            g2.setColor(UITheme.TEXT_SECONDARY);
            g2.drawString(detailStr, legendX + 90, legendY + 14);

            legendY += rowHeight;
        }

        g2.dispose();
    }
}
