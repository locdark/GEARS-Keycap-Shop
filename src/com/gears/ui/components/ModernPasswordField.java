package com.gears.ui.components;

import com.gears.ui.theme.UITheme;

import java.awt.*;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import javax.swing.*;
import javax.swing.border.EmptyBorder;

/**
 * ModernPasswordField: Ô nhập mật khẩu tối màu phong cách Dark ERP:
 * - Đồng bộ hoàn toàn kiểu dáng với ModernTextField
 * - Viền xám bạc (#475569) rõ nét, phát sáng viền đỏ (#E30019) khi Focus
 * - Ký tự mật khẩu màu trắng sáng rõ nét, nền tối êm mắt (#1C2028)
 */
public class ModernPasswordField extends JPasswordField {
    private boolean isFocused = false;
    private final int cornerRadius = 8;
    private final Color defaultBorder = new Color(0x47, 0x55, 0x69);
    private final Color defaultBg = new Color(0x1C, 0x20, 0x28);

    public ModernPasswordField() {
        setFont(new Font("Segoe UI", Font.PLAIN, 13));
        setBackground(defaultBg);
        setForeground(Color.WHITE);
        setCaretColor(Color.WHITE);
        setOpaque(false);
        setBorder(new EmptyBorder(8, 14, 8, 14));
        setPreferredSize(new Dimension(240, 38));

        addFocusListener(new FocusListener() {
            @Override
            public void focusGained(FocusEvent e) {
                isFocused = true;
                repaint();
            }

            @Override
            public void focusLost(FocusEvent e) {
                isFocused = false;
                repaint();
            }
        });
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // Nen toi
        g2.setColor(isEnabled() ? defaultBg : new Color(0x14, 0x16, 0x1D));
        g2.fillRoundRect(0, 0, getWidth(), getHeight(), cornerRadius, cornerRadius);

        // Vien focus
        if (isFocused) {
            g2.setColor(UITheme.PRIMARY_RED);
            g2.setStroke(new BasicStroke(2.0f));
        } else {
            g2.setColor(defaultBorder);
            g2.setStroke(new BasicStroke(1.2f));
        }
        g2.drawRoundRect(1, 1, getWidth() - 2, getHeight() - 2, cornerRadius, cornerRadius);

        super.paintComponent(g);
        g2.dispose();
    }
}
