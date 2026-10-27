package com.gears.ui.components;

import com.gears.model.DonHang;
import com.gears.patterns.builder.InvoiceBuilder;
import com.gears.ui.theme.UITheme;

import java.awt.*;
import javax.swing.*;
import javax.swing.border.EmptyBorder;

/**
 * ReceiptDialog: Hop thoai xem truoc va in bien lai hoa don ban le POS.
 */
public class ReceiptDialog extends JDialog {

    public ReceiptDialog(Frame parent, DonHang donHang) {
        this((Window) parent, donHang);
    }

    public ReceiptDialog(Dialog parent, DonHang donHang) {
        this((Window) parent, donHang);
    }

    public ReceiptDialog(Window parent, DonHang donHang) {
        super(parent, "Biên Lai Hóa Đơn Bán Lẻ - " + donHang.getMaDH(), ModalityType.APPLICATION_MODAL);
        setSize(480, 640);
        setLocationRelativeTo(parent);
        getContentPane().setBackground(UITheme.BG_MAIN);
        setLayout(new BorderLayout(10, 10));

        // Invoice Text
        String invoiceText = new InvoiceBuilder(donHang).buildPlainText();

        JTextArea txtInvoice = new JTextArea(invoiceText);
        txtInvoice.setFont(new Font("Consolas", Font.PLAIN, 12));
        txtInvoice.setBackground(new Color(0x1E, 0x21, 0x27));
        txtInvoice.setForeground(new Color(0xE2, 0xE8, 0xF0));
        txtInvoice.setEditable(false);
        txtInvoice.setMargin(new Insets(14, 16, 14, 16));

        JScrollPane scroll = new JScrollPane(txtInvoice);
        scroll.setBorder(BorderFactory.createLineBorder(UITheme.BORDER_COLOR));
        add(scroll, BorderLayout.CENTER);

        // Buttons
        JPanel pnlButtons = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 10));
        pnlButtons.setOpaque(false);
        pnlButtons.setBorder(new EmptyBorder(0, 10, 10, 10));

        ModernButton btnPrint = new ModernButton("In Hóa Đơn (Print)");
        btnPrint.addActionListener(e -> {
            try {
                boolean done = txtInvoice.print();
                if (done) {
                    JOptionPane.showMessageDialog(this, "Đã gửi lệnh in hóa đơn thành công!", "Thông Báo", JOptionPane.INFORMATION_MESSAGE);
                }
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Lỗi in: " + ex.getMessage(), "Lỗi", JOptionPane.ERROR_MESSAGE);
            }
        });

        ModernButton btnClose = new ModernButton("Đóng", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_SECONDARY);
        btnClose.addActionListener(e -> dispose());

        pnlButtons.add(btnPrint);
        pnlButtons.add(btnClose);
        add(pnlButtons, BorderLayout.SOUTH);
    }
}
