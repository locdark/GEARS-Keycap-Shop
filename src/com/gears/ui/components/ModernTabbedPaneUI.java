package com.gears.ui.components;

import com.gears.ui.theme.UITheme;

import java.awt.*;
import javax.swing.*;
import javax.swing.plaf.basic.BasicTabbedPaneUI;

/**
 * ModernTabbedPaneUI: Giao diện Tab Dark Obsidian cao cấp:
 * - Khắc phục triệt để lỗi Tab bị nền trắng chữ trắng / mờ nhạt trên Windows
 * - Tab đang chọn nổi bật với nền Đỏ GearVN (#E30019) và chữ trắng in đậm
 * - Tab chưa chọn nền tối (#181B22), chữ xám bạc (#CBD5E1) rõ nét
 * - Đệm lót (padding) rộng rãi, không còn viền trắng hay nét đứt focus
 */
public class ModernTabbedPaneUI extends BasicTabbedPaneUI {

    @Override
    protected void installDefaults() {
        super.installDefaults();
        tabInsets = new Insets(10, 20, 10, 20);
        selectedTabPadInsets = new Insets(0, 0, 0, 0);
        contentBorderInsets = new Insets(1, 1, 1, 1);
    }

    @Override
    protected void paintTabBackground(Graphics g, int tabPlacement, int tabIndex, int x, int y, int w, int h, boolean isSelected) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        if (isSelected) {
            g2.setColor(UITheme.PRIMARY_RED);
            g2.fillRoundRect(x + 1, y + 1, w - 2, h - 1, 6, 6);
        } else {
            g2.setColor(new Color(0x18, 0x1B, 0x22));
            g2.fillRoundRect(x + 1, y + 2, w - 2, h - 3, 6, 6);
        }

        // Vien tab nhe
        g2.setColor(new Color(0x33, 0x3C, 0x4D));
        g2.drawRoundRect(x + 1, y + (isSelected ? 1 : 2), w - 2, h - (isSelected ? 1 : 3), 6, 6);

        g2.dispose();
    }

    @Override
    protected void paintTabBorder(Graphics g, int tabPlacement, int tabIndex, int x, int y, int w, int h, boolean isSelected) {
        // Khong ve vien 3D cu ky cua Windows
    }

    @Override
    protected void paintContentBorder(Graphics g, int tabPlacement, int selectedIndex) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setColor(new Color(0x28, 0x2D, 0x38));
        g2.drawRect(0, 0, tabPane.getWidth() - 1, tabPane.getHeight() - 1);
        g2.dispose();
    }

    @Override
    protected void paintFocusIndicator(Graphics g, int tabPlacement, Rectangle[] rects, int tabIndex, Rectangle iconRect, Rectangle textRect, boolean isSelected) {
        // Khong ve hinh chu nhat net dut
    }

    @Override
    protected void paintText(Graphics g, int tabPlacement, Font font, FontMetrics metrics, int tabIndex, String title, Rectangle textRect, boolean isSelected) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

        g2.setFont(isSelected ? UITheme.FONT_BOLD : UITheme.FONT_REGULAR);
        g2.setColor(isSelected ? Color.WHITE : new Color(0xCB, 0xD5, 0xE1));

        // Can giua chu trong tab
        int y = textRect.y + metrics.getAscent() + (textRect.height - metrics.getHeight()) / 2;
        g2.drawString(title, textRect.x, y);

        g2.dispose();
    }
}
