package com.gears.ui.components;

import com.gears.ui.theme.UITheme;

import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.MouseMotionAdapter;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.JTableHeader;
import javax.swing.table.TableCellRenderer;
import javax.swing.table.TableModel;

/**
 * ModernTable: Bảng dữ liệu Dark ERP cao cấp (Obsidian & GearVN Red Theme):
 * - Khắc phục triệt để lỗi màu chữ tiêu đề cột bị trùng với nền trắng trên Windows
 * - Tự động nhận diện và render huy hiệu (Status Pill Badges) cho các cột trạng thái
 * - Hiệu ứng Hover chuột làm nổi bật dòng đang di chuyển mượt mà
 * - Phân biệt dòng chẵn / lẻ (Zebra Striping) tương phản cao
 */
public class ModernTable extends JTable {

    private int hoveredRow = -1;

    public ModernTable(TableModel model) {
        super(model);
        initStyle();
    }

    private void initStyle() {
        setRowHeight(38);
        setFont(UITheme.FONT_REGULAR);
        setBackground(UITheme.BG_CARD);
        setForeground(UITheme.TEXT_PRIMARY);
        setGridColor(new Color(0x28, 0x2D, 0x38));
        setShowVerticalLines(false);
        setShowHorizontalLines(true);
        setSelectionBackground(new Color(0xE3, 0x00, 0x19, 55));
        setSelectionForeground(Color.WHITE);
        setIntercellSpacing(new Dimension(0, 1));
        setFillsViewportHeight(true);

        // ==============================================================
        // 1. HEADER STYLING CHUAN - KHONG BI TRUNG NEN TRANG TREN WINDOWS
        // ==============================================================
        JTableHeader header = getTableHeader();
        header.setReorderingAllowed(false);
        header.setPreferredSize(new Dimension(header.getWidth(), 40));
        header.setBackground(new Color(0x18, 0x1B, 0x22));
        header.setForeground(Color.WHITE);

        // Bat buoc ghi de DefaultTableCellRenderer cua TableHeader de chan L&F Windows ve mau xam trang
        header.setDefaultRenderer(new DefaultTableCellRenderer() {
            @Override
            public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int column) {
                JLabel lbl = (JLabel) super.getTableCellRendererComponent(table, value, isSelected, hasFocus, row, column);
                lbl.setOpaque(true);
                lbl.setBackground(new Color(0x1A, 0x1E, 0x26));
                lbl.setForeground(Color.WHITE);
                lbl.setFont(new Font("Segoe UI", Font.BOLD, 12));
                lbl.setHorizontalAlignment(SwingConstants.LEFT);
                lbl.setBorder(BorderFactory.createCompoundBorder(
                    BorderFactory.createMatteBorder(0, 0, 2, 1, new Color(0x2E, 0x34, 0x42)),
                    new EmptyBorder(0, 12, 0, 8)
                ));
                return lbl;
            }
        });

        // ==============================================================
        // 2. CELL RENDERER (ICON, OBJECT & STATUS BADGE PILLS)
        // ==============================================================
        setDefaultRenderer(ImageIcon.class, new DefaultTableCellRenderer() {
            @Override
            public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int column) {
                JLabel lbl = (JLabel) super.getTableCellRendererComponent(table, value, isSelected, hasFocus, row, column);
                lbl.setText("");
                lbl.setIcon((Icon) value);
                lbl.setHorizontalAlignment(SwingConstants.CENTER);
                lbl.setBackground(isSelected ? new Color(0x3B, 0x15, 0x1C) : (row == hoveredRow ? new Color(0x23, 0x28, 0x34) : (row % 2 == 0 ? new Color(0x14, 0x16, 0x1B) : new Color(0x19, 0x1C, 0x23))));
                return lbl;
            }
        });
        setDefaultRenderer(Icon.class, getDefaultRenderer(ImageIcon.class));

        setDefaultRenderer(Object.class, new DefaultTableCellRenderer() {
            @Override
            public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int column) {
                if (value instanceof Icon) {
                    JLabel lbl = (JLabel) super.getTableCellRendererComponent(table, value, isSelected, hasFocus, row, column);
                    lbl.setText("");
                    lbl.setIcon((Icon) value);
                    lbl.setHorizontalAlignment(SwingConstants.CENTER);
                    lbl.setBackground(isSelected ? new Color(0x3B, 0x15, 0x1C) : (row == hoveredRow ? new Color(0x23, 0x28, 0x34) : (row % 2 == 0 ? new Color(0x14, 0x16, 0x1B) : new Color(0x19, 0x1C, 0x23))));
                    return lbl;
                }

                String text = (value != null) ? value.toString() : "";
                
                // Kiem tra co phai la gia tri Trang Thai can render Badge khong
                if (isStatusValue(text)) {
                    return createStatusBadge(text, isSelected);
                }

                Component c = super.getTableCellRendererComponent(table, value, isSelected, hasFocus, row, column);
                setBorder(new EmptyBorder(0, 12, 0, 12));

                if (isSelected) {
                    c.setBackground(new Color(0x3B, 0x15, 0x1C));
                    c.setForeground(Color.WHITE);
                } else if (row == hoveredRow) {
                    c.setBackground(new Color(0x23, 0x28, 0x34));
                    c.setForeground(UITheme.TEXT_PRIMARY);
                } else {
                    c.setBackground(row % 2 == 0 ? new Color(0x14, 0x16, 0x1B) : new Color(0x19, 0x1C, 0x23));
                    c.setForeground(UITheme.TEXT_PRIMARY);
                }
                return c;
            }
        });

        // ==============================================================
        // 3. MOUSE HOVER TRACKING
        // ==============================================================
        addMouseMotionListener(new MouseMotionAdapter() {
            @Override
            public void mouseMoved(MouseEvent e) {
                int row = rowAtPoint(e.getPoint());
                if (row != hoveredRow) {
                    hoveredRow = row;
                    repaint();
                }
            }
        });

        addMouseListener(new MouseAdapter() {
            @Override
            public void mouseExited(MouseEvent e) {
                hoveredRow = -1;
                repaint();
            }
        });
    }

    private boolean isStatusValue(String s) {
        if (s == null) return false;
        String val = s.trim().toLowerCase();
        return val.startsWith("hoạt động") || val.startsWith("đã khóa") || val.startsWith("đã giao") 
            || val.startsWith("hoàn tất") || val.startsWith("đang xử lý") || val.startsWith("mới") 
            || val.startsWith("đã hủy") || val.equals("moi") || val.equals("xuly") 
            || val.equals("giaohang") || val.equals("huy") || val.contains("diamond")
            || val.contains("gold") || val.contains("silver") || val.contains("standard")
            || val.equals("admin") || val.equals("pos");
    }

    private Component createStatusBadge(String text, boolean isSelected) {
        JPanel pnl = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 6));
        pnl.setOpaque(true);
        pnl.setBackground(isSelected ? new Color(0x3B, 0x15, 0x1C) : new Color(0x14, 0x16, 0x1B));

        String cleanText = text.replace("🔒", "").replace("✅", "").trim();
        Color bgBadge;
        Color fgBadge;

        String lower = cleanText.toLowerCase();
        if (lower.contains("hoạt động") || lower.contains("đã giao") || lower.contains("hoàn tất") || lower.equals("giaohang")) {
            bgBadge = new Color(0x06, 0x4E, 0x3B); // Dark Emerald
            fgBadge = new Color(0x34, 0xD3, 0x99); // Light Emerald
        } else if (lower.contains("đã khóa") || lower.contains("hủy") || lower.equals("huy")) {
            bgBadge = new Color(0x45, 0x0A, 0x0A); // Dark Red
            fgBadge = new Color(0xF8, 0x71, 0x71); // Light Red
        } else if (lower.contains("xử lý") || lower.contains("mới") || lower.equals("moi") || lower.equals("xuly")) {
            bgBadge = new Color(0x45, 0x1A, 0x03); // Dark Amber
            fgBadge = new Color(0xFB, 0xBF, 0x24); // Amber
        } else if (lower.contains("kim cương") || lower.contains("diamond") || lower.equals("admin")) {
            bgBadge = new Color(0x3B, 0x07, 0x64); // Dark Purple
            fgBadge = new Color(0xC0, 0x84, 0xFC); // Light Purple
        } else if (lower.contains("vàng") || lower.contains("gold")) {
            bgBadge = new Color(0x42, 0x20, 0x06); // Dark Gold
            fgBadge = new Color(0xFA, 0xCC, 0x15); // Yellow
        } else {
            bgBadge = new Color(0x1E, 0x29, 0x3B); // Slate
            fgBadge = new Color(0x94, 0xA3, 0xB8); // Light Slate
        }

        JLabel lbl = new JLabel("  " + cleanText + "  ") {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2.setColor(bgBadge);
                g2.fillRoundRect(0, 0, getWidth(), getHeight(), 12, 12);
                g2.setColor(new Color(fgBadge.getRed(), fgBadge.getGreen(), fgBadge.getBlue(), 80));
                g2.drawRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 12, 12);
                g2.dispose();
                super.paintComponent(g);
            }
        };
        lbl.setFont(new Font("Segoe UI", Font.BOLD, 11));
        lbl.setForeground(fgBadge);
        pnl.add(lbl);

        return pnl;
    }

    @Override
    public boolean isCellEditable(int row, int column) {
        return false; // Read-only directly, actions via toolbar buttons and double click
    }
}
