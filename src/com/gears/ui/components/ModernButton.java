package com.gears.ui.components;

import com.gears.ui.theme.UITheme;

import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import javax.swing.*;

/**
 * ModernButton: Nut bam giao dien tuy bien hien dai voi hieu ung Hover & Bo goc.
 */
public class ModernButton extends JButton {
    private Color normalColor;
    private Color hoverColor;
    private Color textColor;
    private int cornerRadius = 8;
    private boolean isHovered = false;

    public ModernButton(String text) {
        this(text, UITheme.PRIMARY_RED, UITheme.PRIMARY_RED_HOVER, UITheme.TEXT_PRIMARY);
    }

    public ModernButton(String text, Color bg, Color hover, Color fg) {
        super(text);
        this.normalColor = bg;
        this.hoverColor = hover;
        this.textColor = fg;

        setContentAreaFilled(false);
        setFocusPainted(false);
        setBorderPainted(false);
        setFont(UITheme.FONT_BOLD);
        setForeground(textColor);
        setCursor(new Cursor(Cursor.HAND_CURSOR));
        setMargin(new Insets(8, 16, 8, 16));

        addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                isHovered = true;
                repaint();
            }

            @Override
            public void mouseExited(MouseEvent e) {
                isHovered = false;
                repaint();
            }
        });
    }

    public void setColors(Color normal, Color hover, Color text) {
        this.normalColor = normal;
        this.hoverColor = hover;
        this.textColor = text;
        setForeground(text);
        repaint();
    }

    public void setCornerRadius(int radius) {
        this.cornerRadius = radius;
        repaint();
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        if (!isEnabled()) {
            g2.setColor(new Color(0x3A, 0x3E, 0x47));
        } else if (isHovered) {
            g2.setColor(hoverColor);
        } else {
            g2.setColor(normalColor);
        }

        g2.fillRoundRect(0, 0, getWidth(), getHeight(), cornerRadius, cornerRadius);
        g2.dispose();

        super.paintComponent(g);
    }
}
