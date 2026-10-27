package com.gears.ui.components;

import com.gears.ui.theme.UITheme;

import java.awt.*;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import javax.swing.*;
import javax.swing.border.EmptyBorder;

/**
 * ModernTextField: Ô nhập liệu phong cách Obsidian Dark ERP:
 * - Khắc phục lỗi input khó nhìn, chìm vào nền xám
 * - Viền xám bạc (#475569) rõ ràng, sắc nét
 * - Khi Focus phát sáng viền đỏ rực (#E30019)
 * - Nền tối (#1C2028), chữ trắng tinh (#FFFFFF), Placeholder rõ nét (#94A3B8)
 */
public class ModernTextField extends JTextField {
    private String placeholder = "";
    private boolean isFocused = false;
    private final int cornerRadius = 8;
    private final Color defaultBorder = new Color(0x47, 0x55, 0x69); // Slate-600 ro net
    private final Color defaultBg = new Color(0x1C, 0x20, 0x28);     // Nen toi tuong phan cao

    public ModernTextField() {
        this("");
    }

    public ModernTextField(String placeholder) {
        this.placeholder = placeholder;
        setFont(new Font("Segoe UI", Font.PLAIN, 13));
        setBackground(defaultBg);
        setForeground(Color.WHITE);
        setCaretColor(Color.WHITE);
        setOpaque(false);
        setBorder(new EmptyBorder(8, 14, 8, 14));

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

    public void setPlaceholder(String placeholder) {
        this.placeholder = placeholder;
        repaint();
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // Nen o nhap lieu
        g2.setColor(isEnabled() ? defaultBg : new Color(0x14, 0x16, 0x1D));
        g2.fillRoundRect(0, 0, getWidth(), getHeight(), cornerRadius, cornerRadius);

        // Vien o nhap lieu
        if (isFocused) {
            g2.setColor(UITheme.PRIMARY_RED);
            g2.setStroke(new BasicStroke(2.0f));
        } else {
            g2.setColor(defaultBorder);
            g2.setStroke(new BasicStroke(1.2f));
        }
        g2.drawRoundRect(1, 1, getWidth() - 2, getHeight() - 2, cornerRadius, cornerRadius);

        super.paintComponent(g);

        // Placeholder chu huong dan ro net
        if (getText().isEmpty() && !placeholder.isEmpty()) {
            g2.setColor(isFocused ? new Color(0x64, 0x74, 0x8B) : new Color(0x94, 0xA3, 0xB8));
            g2.setFont(getFont());
            FontMetrics fm = g2.getFontMetrics();
            int y = (getHeight() - fm.getHeight()) / 2 + fm.getAscent();
            g2.drawString(placeholder, 14, y);
        }

        g2.dispose();
    }
}
