package com.gears.ui.components;

import java.awt.*;
import java.awt.geom.*;
import javax.swing.Icon;

/**
 * VectorIcon: Thành phần biểu tượng đồ họa Vector cao cấp vẽ trực tiếp bằng Java2D:
 * - Chống răng cưa (Anti-Aliasing) sắc nét chuẩn Retina / High-DPI
 * - Đổi màu linh hoạt theo trạng thái nút bấm (Active: Trắng, Inactive: Muted Gray, Hover: Đỏ)
 * - Đầy đủ 10 biểu tượng nghiệp vụ chuẩn ERP cho Sidebar & các nút chức năng
 */
public class VectorIcon implements Icon {

    public enum Type {
        DASHBOARD,
        POS,
        KEYCAP,
        ORDER,
        CUSTOMER,
        SUPPLIER,
        EMPLOYEE,
        REPORT,
        CONFIG,
        INSPECTOR,
        SEARCH,
        PLUS,
        EDIT,
        LOCK,
        TRASH,
        CHART
    }

    private final Type type;
    private final int size;
    private Color color;

    public VectorIcon(Type type, int size, Color color) {
        this.type = type;
        this.size = size;
        this.color = color;
    }

    public VectorIcon(Type type, Color color) {
        this(type, 18, color);
    }

    public void setColor(Color color) {
        this.color = color;
    }

    @Override
    public int getIconWidth() {
        return size;
    }

    @Override
    public int getIconHeight() {
        return size;
    }

    @Override
    public void paintIcon(Component c, Graphics g, int x, int y) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setRenderingHint(RenderingHints.KEY_STROKE_CONTROL, RenderingHints.VALUE_STROKE_PURE);

        g2.translate(x, y);
        g2.setColor(color != null ? color : Color.WHITE);
        float s = size / 24.0f; // Chuan hoa ve luoi 24x24
        g2.scale(s, s);

        switch (type) {
            case DASHBOARD:
                drawDashboard(g2);
                break;
            case POS:
                drawPOS(g2);
                break;
            case KEYCAP:
                drawKeycap(g2);
                break;
            case ORDER:
                drawOrder(g2);
                break;
            case CUSTOMER:
                drawCustomer(g2);
                break;
            case SUPPLIER:
                drawSupplier(g2);
                break;
            case EMPLOYEE:
                drawEmployee(g2);
                break;
            case REPORT:
            case CHART:
                drawReport(g2);
                break;
            case CONFIG:
                drawConfig(g2);
                break;
            case INSPECTOR:
                drawInspector(g2);
                break;
            case SEARCH:
                drawSearch(g2);
                break;
            case PLUS:
                drawPlus(g2);
                break;
            case EDIT:
                drawEdit(g2);
                break;
            case LOCK:
                drawLock(g2);
                break;
            case TRASH:
                drawTrash(g2);
                break;
        }

        g2.dispose();
    }

    // 1. DASHBOARD (4 o vuong hien dai)
    private void drawDashboard(Graphics2D g2) {
        g2.fillRoundRect(2, 2, 8, 8, 3, 3);
        g2.fillRoundRect(14, 2, 8, 8, 3, 3);
        g2.fillRoundRect(2, 14, 8, 8, 3, 3);
        g2.fillRoundRect(14, 14, 8, 8, 3, 3);
    }

    // 2. POS (Gio hang mua sam)
    private void drawPOS(Graphics2D g2) {
        g2.setStroke(new BasicStroke(2.0f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
        Path2D p = new Path2D.Float();
        p.moveTo(2, 3);
        p.lineTo(5, 3);
        p.lineTo(8, 15);
        p.lineTo(19, 15);
        p.lineTo(21, 7);
        p.lineTo(6, 7);
        g2.draw(p);

        g2.fillOval(8, 18, 3, 3);
        g2.fillOval(17, 18, 3, 3);
    }

    // 3. KEYCAP (Nut ban phim co 3D)
    private void drawKeycap(Graphics2D g2) {
        g2.setStroke(new BasicStroke(1.8f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
        // Khung ngoai
        g2.drawRoundRect(2, 3, 20, 18, 5, 5);
        // Bevel be mat tren
        g2.drawRoundRect(5, 6, 14, 10, 3, 3);
        // Ky tu o giua
        g2.drawLine(10, 11, 14, 11);
    }

    // 4. ORDER (Kien hang / Hop giao hang)
    private void drawOrder(Graphics2D g2) {
        g2.setStroke(new BasicStroke(1.8f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
        // Than thung
        g2.drawRoundRect(3, 7, 18, 14, 3, 3);
        // Nap mo tren
        Path2D p = new Path2D.Float();
        p.moveTo(2, 7);
        p.lineTo(12, 2);
        p.lineTo(22, 7);
        g2.draw(p);
        // Bang dan niêm phong
        g2.drawLine(12, 7, 12, 15);
    }

    // 5. CUSTOMER (Bieu tuong khach hang CRM)
    private void drawCustomer(Graphics2D g2) {
        g2.setStroke(new BasicStroke(1.8f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
        // Dau nguoi
        g2.drawOval(9, 2, 6, 6);
        // Than nguoi
        Path2D body = new Path2D.Float();
        body.moveTo(4, 21);
        body.curveTo(4, 15, 8, 12, 12, 12);
        body.curveTo(16, 12, 20, 15, 20, 21);
        g2.draw(body);
    }

    // 6. SUPPLIER (Nha may / Xuong san xuat)
    private void drawSupplier(Graphics2D g2) {
        g2.setStroke(new BasicStroke(1.8f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
        Path2D p = new Path2D.Float();
        p.moveTo(2, 21);
        p.lineTo(2, 9);
        p.lineTo(8, 14);
        p.lineTo(8, 9);
        p.lineTo(14, 14);
        p.lineTo(14, 4);
        p.lineTo(22, 4);
        p.lineTo(22, 21);
        p.closePath();
        g2.draw(p);
        g2.fillRect(16, 8, 3, 3);
        g2.fillRect(16, 14, 3, 3);
    }

    // 7. EMPLOYEE (The nhan vien / Nhan su)
    private void drawEmployee(Graphics2D g2) {
        g2.setStroke(new BasicStroke(1.8f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
        g2.drawRoundRect(4, 2, 16, 20, 4, 4);
        g2.drawOval(9, 6, 6, 6);
        g2.drawLine(7, 17, 17, 17);
    }

    // 8. REPORT (Bieu do tai chinh 3 cot tang truong)
    private void drawReport(Graphics2D g2) {
        g2.setStroke(new BasicStroke(1.8f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
        g2.drawLine(2, 21, 22, 21); // Truc day
        g2.fillRect(4, 13, 4, 7);
        g2.fillRect(10, 8, 4, 12);
        g2.fillRect(16, 3, 4, 17);
    }

    // 9. CONFIG (Banh rang cai dat)
    private void drawConfig(Graphics2D g2) {
        g2.setStroke(new BasicStroke(2.0f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
        g2.drawOval(8, 8, 8, 8);
        int cx = 12, cy = 12, r1 = 8, r2 = 11;
        for (int i = 0; i < 8; i++) {
            double angle = i * Math.PI / 4.0;
            int x1 = (int) (cx + r1 * Math.cos(angle));
            int y1 = (int) (cy + r1 * Math.sin(angle));
            int x2 = (int) (cx + r2 * Math.cos(angle));
            int y2 = (int) (cy + r2 * Math.sin(angle));
            g2.drawLine(x1, y1, x2, y2);
        }
    }

    // 10. INSPECTOR (Binh thi nghiem khoa hoc OOP)
    private void drawInspector(Graphics2D g2) {
        g2.setStroke(new BasicStroke(1.8f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
        Path2D p = new Path2D.Float();
        p.moveTo(9, 3);
        p.lineTo(15, 3);
        p.moveTo(10, 3);
        p.lineTo(10, 9);
        p.lineTo(4, 19);
        p.curveTo(4, 22, 20, 22, 20, 19);
        p.lineTo(14, 9);
        p.lineTo(14, 3);
        g2.draw(p);
        g2.fillOval(8, 16, 3, 3);
        g2.fillOval(13, 15, 2, 2);
    }

    // 11. SEARCH (Kinh lup)
    private void drawSearch(Graphics2D g2) {
        g2.setStroke(new BasicStroke(2.0f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
        g2.drawOval(3, 3, 11, 11);
        g2.drawLine(12, 12, 20, 20);
    }

    // 12. PLUS (Dau cong)
    private void drawPlus(Graphics2D g2) {
        g2.setStroke(new BasicStroke(2.2f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
        g2.drawLine(12, 4, 12, 20);
        g2.drawLine(4, 12, 20, 12);
    }

    // 13. EDIT (Cay but)
    private void drawEdit(Graphics2D g2) {
        g2.setStroke(new BasicStroke(1.8f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
        Path2D p = new Path2D.Float();
        p.moveTo(17, 3);
        p.lineTo(21, 7);
        p.lineTo(8, 20);
        p.lineTo(3, 21);
        p.lineTo(4, 16);
        p.closePath();
        g2.draw(p);
        g2.drawLine(14, 6, 18, 10);
    }

    // 14. LOCK (O khoa)
    private void drawLock(Graphics2D g2) {
        g2.setStroke(new BasicStroke(1.8f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
        g2.drawRoundRect(4, 10, 16, 11, 3, 3);
        g2.drawArc(7, 3, 10, 12, 0, 180);
        g2.fillOval(11, 14, 2, 3);
    }

    // 15. TRASH (Thung rac)
    private void drawTrash(Graphics2D g2) {
        g2.setStroke(new BasicStroke(1.8f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
        g2.drawLine(3, 6, 21, 6);
        g2.drawLine(8, 3, 16, 3);
        g2.drawRoundRect(5, 6, 14, 15, 2, 2);
        g2.drawLine(9, 10, 9, 17);
        g2.drawLine(15, 10, 15, 17);
    }
}
