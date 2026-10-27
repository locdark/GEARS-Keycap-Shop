package com.gears.ui.components;

import com.gears.ui.theme.UITheme;

import java.awt.*;
import javax.swing.*;
import javax.swing.border.EmptyBorder;

/**
 * ModernDialogHelper: Bộ sinh giao diện Modal / Hộp thoại chuẩn hóa:
 * - Khắc phục hoàn toàn lỗi nhãn chữ bị tối màu chìm vào nền đen
 * - Tùy biến JComboBox tối màu, không còn bị vệt trắng chói mắt của Windows
 * - Banner Header hiện đại có Icon, tiêu đề và dòng giải thích nghiệp vụ
 * - Nút bấm hành động bo góc mềm mại, êm mắt
 */
public class ModernDialogHelper {

    public static JPanel createModalHeader(String title, String subtitle, VectorIcon.Type iconType) {
        JPanel pnl = new JPanel(new BorderLayout(14, 0));
        pnl.setBackground(new Color(0x18, 0x1B, 0x22));
        pnl.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createMatteBorder(0, 0, 1, 0, new Color(0x2D, 0x33, 0x40)),
            new EmptyBorder(14, 20, 14, 20)
        ));

        // Icon trai
        JLabel lblIcon = new JLabel(new VectorIcon(iconType, 24, UITheme.PRIMARY_RED));
        pnl.add(lblIcon, BorderLayout.WEST);

        // Titles
        JPanel pnlText = new JPanel();
        pnlText.setLayout(new BoxLayout(pnlText, BoxLayout.Y_AXIS));
        pnlText.setOpaque(false);

        JLabel lblTitle = new JLabel(title);
        lblTitle.setFont(new Font("Segoe UI", Font.BOLD, 15));
        lblTitle.setForeground(Color.WHITE);

        JLabel lblSub = new JLabel(subtitle != null ? subtitle : "Vui lòng nhập đầy đủ thông tin bên dưới");
        lblSub.setFont(UITheme.FONT_SMALL);
        lblSub.setForeground(new Color(0x94, 0xA3, 0xB8));

        pnlText.add(lblTitle);
        pnlText.add(Box.createVerticalStrut(3));
        pnlText.add(lblSub);
        pnl.add(pnlText, BorderLayout.CENTER);

        return pnl;
    }

    public static JLabel createFieldLabel(String text) {
        JLabel lbl = new JLabel(text);
        lbl.setFont(new Font("Segoe UI", Font.BOLD, 12));
        lbl.setForeground(new Color(0xF1, 0xF5, 0xF9)); // Trắng ngà dễ nhìn, độ tương phản cao
        return lbl;
    }

    public static <T> JComboBox<T> createStyledComboBox(T[] items) {
        ModernComboBox<T> cb = new ModernComboBox<>(items);
        cb.setPreferredSize(new Dimension(240, 36));
        return cb;
    }

    public static JPanel createActionFooter(JButton btnSave, JButton btnCancel) {
        JPanel pnl = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 12));
        pnl.setBackground(new Color(0x18, 0x1B, 0x22));
        pnl.setBorder(BorderFactory.createMatteBorder(1, 0, 0, 0, new Color(0x2D, 0x33, 0x40)));

        if (btnCancel != null) pnl.add(btnCancel);
        if (btnSave != null) pnl.add(btnSave);

        return pnl;
    }
}
