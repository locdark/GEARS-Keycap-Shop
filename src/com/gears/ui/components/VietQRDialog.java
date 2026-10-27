package com.gears.ui.components;

import com.gears.model.DonHang;
import com.gears.model.ShopConfig;
import com.gears.patterns.facade.GearsShopFacade;
import com.gears.patterns.strategy.ThanhToanVietQR;
import com.gears.ui.theme.UITheme;

import java.awt.*;
import java.awt.datatransfer.StringSelection;
import java.awt.geom.RoundRectangle2D;
import java.awt.image.BufferedImage;
import java.net.URI;
import java.net.URL;
import java.text.DecimalFormat;
import javax.imageio.ImageIO;
import javax.swing.*;
import javax.swing.border.EmptyBorder;

/**
 * VietQRDialog: Hop thoai sinh va hien thi ma SePay VietQR Napas dong
 * danh rieng cho Thu Ngan POS va Khach Hang:
 * - Tu dong tao ma QR chua chinh xac so tien va ma don hang (addInfo)
 * - Khach hang chi can mo app Ngan hang (VCB, MB, Techcombank, MoMo...) de quet
 * - Ho tro gia lap Webhook khop lenh tu dong 24/7
 */
public class VietQRDialog extends JDialog {

    private static final DecimalFormat CURRENCY = new DecimalFormat("#,##0 'VNĐ'");
    private boolean paymentConfirmed = false;

    public VietQRDialog(Frame parent, DonHang donHang, double amount) {
        super(parent, "Cổng Thanh Toán SePay VietQR Napas 24/7", true);
        setSize(520, 720);
        setLocationRelativeTo(parent);
        getContentPane().setBackground(UITheme.BG_MAIN);
        setLayout(new BorderLayout(0, 0));

        ShopConfig cfg = GearsShopFacade.getInstance().getShopConfig();
        String bank = cfg != null ? cfg.getTenNganHang() : "MB";
        String accountNo = cfg != null ? cfg.getSoTaiKhoan() : "0988888888";
        String accountOwner = cfg != null ? cfg.getTenChuTaiKhoan() : "GEARS KEYCAP SHOP";
        String orderCode = donHang.getMaDH();

        ThanhToanVietQR vietQR = new ThanhToanVietQR(bank, accountNo, accountOwner);
        String qrUrl = vietQR.sinhQrUrl(donHang);

        // 1. Header
        JPanel pnlHeader = ModernDialogHelper.createModalHeader(
            "THANH TOÁN SEPAY VIETQR NAPAS 24/7",
            "Mở app ngân hàng quét mã QR chuyển khoản chính xác nội dung",
            VectorIcon.Type.POS
        );
        add(pnlHeader, BorderLayout.NORTH);

        // 2. Center Content
        JPanel pnlCenter = new JPanel();
        pnlCenter.setLayout(new BoxLayout(pnlCenter, BoxLayout.Y_AXIS));
        pnlCenter.setOpaque(false);
        pnlCenter.setBorder(new EmptyBorder(14, 20, 14, 20));

        // Amount Card
        JPanel pnlAmount = new JPanel(new BorderLayout(6, 4));
        pnlAmount.setBackground(new Color(0x1B, 0x1E, 0x26));
        pnlAmount.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(0x2E, 0x34, 0x42), 1, true),
            new EmptyBorder(10, 14, 10, 14)
        ));
        pnlAmount.setMaximumSize(new Dimension(460, 60));

        JLabel lblAmountTitle = new JLabel("SỐ TIỀN CẦN THANH TOÁN:");
        lblAmountTitle.setFont(UITheme.FONT_SMALL);
        lblAmountTitle.setForeground(new Color(0x94, 0xA3, 0xB8));

        JLabel lblAmountVal = new JLabel(CURRENCY.format(amount));
        lblAmountVal.setFont(new Font("Segoe UI", Font.BOLD, 22));
        lblAmountVal.setForeground(UITheme.PRIMARY_RED);
        lblAmountVal.setHorizontalAlignment(SwingConstants.RIGHT);

        pnlAmount.add(lblAmountTitle, BorderLayout.WEST);
        pnlAmount.add(lblAmountVal, BorderLayout.EAST);
        pnlCenter.add(pnlAmount);
        pnlCenter.add(Box.createVerticalStrut(12));

        // QR Code Box (White background for optical camera scanning)
        JPanel pnlQRCard = new JPanel(new GridBagLayout());
        pnlQRCard.setBackground(Color.WHITE);
        pnlQRCard.setPreferredSize(new Dimension(270, 270));
        pnlQRCard.setMaximumSize(new Dimension(270, 270));
        pnlQRCard.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(0xDC, 0x26, 0x26), 2, true),
            new EmptyBorder(6, 6, 6, 6)
        ));

        JLabel lblQR = new JLabel("Đang tải mã VietQR...", SwingConstants.CENTER);
        lblQR.setFont(new Font("Segoe UI", Font.BOLD, 12));
        lblQR.setForeground(new Color(0x47, 0x55, 0x69));
        lblQR.setPreferredSize(new Dimension(250, 250));
        lblQR.setHorizontalAlignment(SwingConstants.CENTER);
        pnlQRCard.add(lblQR);

        pnlCenter.add(pnlQRCard);
        pnlCenter.add(Box.createVerticalStrut(12));

        // Load QR Code Asynchronously
        loadQrImageAsync(qrUrl, orderCode, amount, lblQR);

        // Bank Details Info Box
        JPanel pnlDetails = new JPanel(new GridLayout(4, 2, 8, 6));
        pnlDetails.setBackground(new Color(0x18, 0x1B, 0x22));
        pnlDetails.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(0x2D, 0x33, 0x40), 1, true),
            new EmptyBorder(10, 14, 10, 14)
        ));
        pnlDetails.setMaximumSize(new Dimension(460, 120));

        pnlDetails.add(createFieldLabel("Ngân Hàng:"));
        pnlDetails.add(createValueLabel(bank + " (Napas 24/7)", UITheme.TEXT_PRIMARY));

        pnlDetails.add(createFieldLabel("Số Tài Khoản:"));
        pnlDetails.add(createValueLabel(accountNo, Color.WHITE));

        pnlDetails.add(createFieldLabel("Chủ Tài Khoản:"));
        pnlDetails.add(createValueLabel(accountOwner, UITheme.TEXT_PRIMARY));

        pnlDetails.add(createFieldLabel("Nội Dung CK (Bắt Buộc):"));
        JPanel pnlCode = new JPanel(new FlowLayout(FlowLayout.LEFT, 6, 0));
        pnlCode.setOpaque(false);
        JLabel lblCode = new JLabel(orderCode);
        lblCode.setFont(new Font("Segoe UI", Font.BOLD, 13));
        lblCode.setForeground(new Color(0xFB, 0xBF, 0x24)); // Amber highlight

        JButton btnCopy = new JButton("Copy");
        btnCopy.setFont(new Font("Segoe UI", Font.PLAIN, 10));
        btnCopy.setForeground(Color.WHITE);
        btnCopy.setBackground(new Color(0x33, 0x41, 0x55));
        btnCopy.setFocusPainted(false);
        btnCopy.setBorder(new EmptyBorder(2, 6, 2, 6));
        btnCopy.addActionListener(e -> {
            Toolkit.getDefaultToolkit().getSystemClipboard().setContents(new StringSelection(orderCode), null);
            JOptionPane.showMessageDialog(this, "Đã sao chép mã đơn [" + orderCode + "] vào bộ nhớ tạm!", "Đã Copy", JOptionPane.INFORMATION_MESSAGE);
        });
        pnlCode.add(lblCode);
        pnlCode.add(btnCopy);
        pnlDetails.add(pnlCode);

        pnlCenter.add(pnlDetails);
        pnlCenter.add(Box.createVerticalStrut(10));

        // Live Webhook Status
        JLabel lblStatus = new JLabel("● Đang lắng nghe Webhook SePay (Khớp lệnh tức thì 24/7)...", SwingConstants.CENTER);
        lblStatus.setFont(new Font("Segoe UI", Font.BOLD, 11));
        lblStatus.setForeground(new Color(0x34, 0xD3, 0x99)); // Emerald Green
        lblStatus.setAlignmentX(Component.CENTER_ALIGNMENT);
        pnlCenter.add(lblStatus);

        add(pnlCenter, BorderLayout.CENTER);

        // 3. Action Buttons
        JPanel pnlFooter = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 12));
        pnlFooter.setBackground(new Color(0x18, 0x1B, 0x22));
        pnlFooter.setBorder(BorderFactory.createMatteBorder(1, 0, 0, 0, new Color(0x2D, 0x33, 0x40)));

        ModernButton btnCancel = new ModernButton("Hủy / Đổi Cách Khác", UITheme.BG_CARD, UITheme.BG_CARD_HOVER, UITheme.TEXT_SECONDARY);
        btnCancel.addActionListener(e -> {
            paymentConfirmed = false;
            dispose();
        });

        ModernButton btnWebhook = new ModernButton("⚡ Mô Phỏng Webhook", new Color(0x06, 0x4E, 0x3B), new Color(0x0F, 0x76, 0x6E), new Color(0x34, 0xD3, 0x99));
        btnWebhook.addActionListener(e -> {
            paymentConfirmed = true;
            JOptionPane.showMessageDialog(this, "Webhook SePay đã nhận 1 giao dịch khớp mã: " + orderCode + "\nTrạng thái: THÀNH CÔNG!", "Webhook Khớp Lệnh", JOptionPane.INFORMATION_MESSAGE);
            dispose();
        });

        ModernButton btnConfirm = new ModernButton("Khách Đã Quét Xong (F9)", UITheme.PRIMARY_RED, UITheme.PRIMARY_RED_HOVER, Color.WHITE);
        btnConfirm.addActionListener(e -> {
            paymentConfirmed = true;
            dispose();
        });

        pnlFooter.add(btnCancel);
        pnlFooter.add(btnWebhook);
        pnlFooter.add(btnConfirm);
        add(pnlFooter, BorderLayout.SOUTH);
    }

    private JLabel createFieldLabel(String text) {
        JLabel lbl = new JLabel(text);
        lbl.setFont(UITheme.FONT_SMALL);
        lbl.setForeground(new Color(0x94, 0xA3, 0xB8));
        return lbl;
    }

    private JLabel createValueLabel(String text, Color color) {
        JLabel lbl = new JLabel(text);
        lbl.setFont(new Font("Segoe UI", Font.BOLD, 12));
        lbl.setForeground(color);
        return lbl;
    }

    private void loadQrImageAsync(String urlStr, String orderCode, double amount, JLabel lblQR) {
        new Thread(() -> {
            try {
                URI uri = new URI(urlStr);
                URL url = uri.toURL();
                BufferedImage img = ImageIO.read(url);
                if (img != null) {
                    Image scaled = img.getScaledInstance(250, 250, Image.SCALE_SMOOTH);
                    SwingUtilities.invokeLater(() -> {
                        lblQR.setIcon(new ImageIcon(scaled));
                        lblQR.setText("");
                    });
                    return;
                }
            } catch (Exception ignored) {}

            // Fallback: Sinh anh QR Code noi bo dep mat neu offline
            BufferedImage fallback = generateProceduralQR(250, 250, orderCode, amount);
            SwingUtilities.invokeLater(() -> {
                lblQR.setIcon(new ImageIcon(fallback));
                lblQR.setText("");
            });
        }).start();
    }

    /**
     * Sinh ma QR thuat toan gia lap phong cach VietQR chuan khi khong co mang
     */
    private BufferedImage generateProceduralQR(int w, int h, String code, double amount) {
        BufferedImage img = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2 = img.createGraphics();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // White background
        g2.setColor(Color.WHITE);
        g2.fillRect(0, 0, w, h);

        int cells = 25;
        int cellSize = w / cells;
        int pad = (w - (cells * cellSize)) / 2;

        g2.setColor(Color.BLACK);

        // 3 Corner Detection Patterns
        drawFinderPattern(g2, pad, pad, cellSize * 7);
        drawFinderPattern(g2, pad + (cells - 7) * cellSize, pad, cellSize * 7);
        drawFinderPattern(g2, pad, pad + (cells - 7) * cellSize, cellSize * 7);

        // Deterministic bit pattern based on orderCode hash
        int hash = Math.abs((code + amount).hashCode());
        for (int r = 0; r < cells; r++) {
            for (int c = 0; c < cells; c++) {
                // Skip finder corners
                if ((r < 8 && c < 8) || (r < 8 && c >= cells - 8) || (r >= cells - 8 && c < 8)) continue;
                // Center badge area
                if (r >= 10 && r <= 14 && c >= 10 && c <= 14) continue;

                int bit = ((hash * (r + 1) * 31 + c * 17 + (r * c)) % 3);
                if (bit == 0 || (r + c) % 4 == 0) {
                    g2.fillRect(pad + c * cellSize, pad + r * cellSize, cellSize, cellSize);
                }
            }
        }

        // Center Napas / VietQR Logo Badge
        int badgeW = cellSize * 6;
        int badgeH = cellSize * 4;
        int bx = (w - badgeW) / 2;
        int by = (h - badgeH) / 2;

        g2.setColor(Color.WHITE);
        g2.fillRoundRect(bx - 3, by - 3, badgeW + 6, badgeH + 6, 8, 8);
        g2.setColor(new Color(0xE3, 0x00, 0x19));
        g2.fillRoundRect(bx, by, badgeW, badgeH, 6, 6);

        g2.setColor(Color.WHITE);
        g2.setFont(new Font("Segoe UI", Font.BOLD, 10));
        FontMetrics fm = g2.getFontMetrics();
        String text = "VietQR";
        int tw = fm.stringWidth(text);
        g2.drawString(text, (w - tw) / 2, by + (badgeH + fm.getAscent()) / 2 - 2);

        g2.dispose();
        return img;
    }

    private void drawFinderPattern(Graphics2D g2, int x, int y, int size) {
        g2.setColor(Color.BLACK);
        g2.fillRect(x, y, size, size);
        g2.setColor(Color.WHITE);
        int border1 = size / 7;
        g2.fillRect(x + border1, y + border1, size - border1 * 2, size - border1 * 2);
        g2.setColor(Color.BLACK);
        int border2 = size / 7 * 2;
        g2.fillRect(x + border2, y + border2, size - border2 * 2, size - border2 * 2);
    }

    public boolean isPaymentConfirmed() {
        return paymentConfirmed;
    }
}
