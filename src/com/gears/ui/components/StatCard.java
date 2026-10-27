package com.gears.ui.components;

import com.gears.ui.theme.UITheme;

import java.awt.*;
import javax.swing.*;
import javax.swing.border.EmptyBorder;

/**
 * StatCard: The hien thi chi so KPI thong ke (Doanh thu, Loi nhuan, Don hang, Ton kho)
 * Thiet ke dang card bo goc voi vien mau trang nha.
 */
public class StatCard extends JPanel {
    private final JLabel lblTitle = new JLabel();
    private final JLabel lblValue = new JLabel();
    private final JLabel lblSub = new JLabel();
    private final Color accentColor;

    public StatCard(String title, String value, String sub, Color accent) {
        this.accentColor = accent;

        setLayout(new BorderLayout(8, 6));
        setBackground(UITheme.BG_CARD);
        setBorder(new EmptyBorder(14, 16, 14, 16));

        lblTitle.setText(title.toUpperCase());
        lblTitle.setFont(new Font("Segoe UI", Font.BOLD, 11));
        lblTitle.setForeground(UITheme.TEXT_SECONDARY);

        lblValue.setText(value);
        lblValue.setFont(UITheme.FONT_METRIC);
        lblValue.setForeground(UITheme.TEXT_PRIMARY);

        lblSub.setText(sub);
        lblSub.setFont(UITheme.FONT_SMALL);
        lblSub.setForeground(accentColor);

        JPanel content = new JPanel();
        content.setOpaque(false);
        content.setLayout(new BoxLayout(content, BoxLayout.Y_AXIS));

        lblTitle.setAlignmentX(Component.LEFT_ALIGNMENT);
        lblValue.setAlignmentX(Component.LEFT_ALIGNMENT);
        lblSub.setAlignmentX(Component.LEFT_ALIGNMENT);

        content.add(lblTitle);
        content.add(Box.createVerticalStrut(4));
        content.add(lblValue);
        content.add(Box.createVerticalStrut(4));
        content.add(lblSub);

        add(content, BorderLayout.CENTER);
    }

    public void setValue(String value) {
        lblValue.setText(value);
    }

    public void setSubtitle(String sub) {
        lblSub.setText(sub);
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // Card Background
        g2.setColor(getBackground());
        g2.fillRoundRect(0, 0, getWidth(), getHeight(), 10, 10);

        // Accent top indicator bar
        g2.setColor(accentColor);
        g2.fillRoundRect(0, 0, getWidth(), 4, 10, 10);

        // Card Border
        g2.setColor(UITheme.BORDER_COLOR);
        g2.drawRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 10, 10);

        g2.dispose();
    }
}
