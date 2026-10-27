package com.gears.ui.components;

import com.gears.ui.theme.UITheme;

import java.awt.*;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.util.Vector;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import javax.swing.plaf.basic.BasicComboBoxUI;
import javax.swing.plaf.basic.BasicComboPopup;
import javax.swing.plaf.basic.BasicScrollBarUI;
import javax.swing.plaf.basic.ComboPopup;

/**
 * ModernComboBox: Hộp chọn tùy biến chuẩn Obsidian Dark ERP:
 * - Khắc phục triệt để lỗi combobox nền trắng chữ đèn / chữ trắng nền trắng trên Windows L&F
 * - Nút mũi tên chevron tối giản sắc nét (thay thế nút Windows 3D bevel lỗi thời)
 * - Danh sách sổ xuống (Dropdown Popup) tối màu, chữ trắng rõ ràng, mục đang chọn màu đỏ GearVN
 * - Hỗ trợ hiển thị nổi bật màu xanh ngọc cho các mục thêm mới (chứa ký tự ➕)
 */
public class ModernComboBox<T> extends JComboBox<T> {

    private final Color defaultBorderColor = new Color(0x3B, 0x43, 0x54);
    private final Color focusBorderColor = UITheme.PRIMARY_RED;

    public ModernComboBox() {
        super();
        initStyle();
    }

    public ModernComboBox(T[] items) {
        super(items);
        initStyle();
    }

    public ModernComboBox(Vector<T> items) {
        super(items);
        initStyle();
    }

    public ModernComboBox(ComboBoxModel<T> aModel) {
        super(aModel);
        initStyle();
    }

    private void initStyle() {
        setUI(new ModernComboBoxUI());
        setFont(UITheme.FONT_REGULAR);
        setBackground(UITheme.BG_INPUT);
        setForeground(UITheme.TEXT_PRIMARY);
        setOpaque(true);
        updateBorder(defaultBorderColor);

        setRenderer(new ModernComboRenderer());

        addFocusListener(new FocusListener() {
            @Override
            public void focusGained(FocusEvent e) {
                updateBorder(focusBorderColor);
                repaint();
            }

            @Override
            public void focusLost(FocusEvent e) {
                updateBorder(defaultBorderColor);
                repaint();
            }
        });
    }

    private void updateBorder(Color borderColor) {
        setBorder(BorderFactory.createCompoundBorder(
            new LineBorder(borderColor, 1, true),
            new EmptyBorder(3, 8, 3, 4)
        ));
    }

    // ==============================================================
    // 1. CUSTOM UI DELEGATE: THAY THE HOAN TOAN WINDOWS COMBOBOX UI
    // ==============================================================
    private static class ModernComboBoxUI extends BasicComboBoxUI {

        @Override
        protected JButton createArrowButton() {
            JButton btn = new JButton() {
                @Override
                public void paintComponent(Graphics g) {
                    Graphics2D g2 = (Graphics2D) g.create();
                    g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

                    // Nen nut mui ten toi mau dong bo voi o chon
                    g2.setColor(UITheme.BG_INPUT);
                    g2.fillRect(0, 0, getWidth(), getHeight());

                    // Ve mui ten Chevron hien dai
                    int size = 8;
                    int x = (getWidth() - size) / 2;
                    int y = (getHeight() - (size / 2)) / 2;

                    g2.setColor(getModel().isRollover() ? Color.WHITE : new Color(0x94, 0xA3, 0xB8));
                    g2.setStroke(new BasicStroke(2.0f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));

                    g2.drawLine(x, y, x + size / 2, y + size / 2);
                    g2.drawLine(x + size / 2, y + size / 2, x + size, y);

                    g2.dispose();
                }
            };
            btn.setBorder(BorderFactory.createEmptyBorder(0, 0, 0, 4));
            btn.setContentAreaFilled(false);
            btn.setFocusPainted(false);
            btn.setOpaque(true);
            btn.setBackground(UITheme.BG_INPUT);
            btn.setPreferredSize(new Dimension(28, 28));
            return btn;
        }

        @Override
        public void paintCurrentValueBackground(Graphics g, Rectangle bounds, boolean hasFocus) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setColor(UITheme.BG_INPUT);
            g2.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
            g2.dispose();
        }

        @Override
        protected ComboPopup createPopup() {
            BasicComboPopup popup = new BasicComboPopup(comboBox) {
                @Override
                protected JScrollPane createScroller() {
                    JScrollPane scroller = super.createScroller();
                    scroller.setBorder(BorderFactory.createEmptyBorder());
                    scroller.getViewport().setBackground(UITheme.BG_CARD);
                    scroller.setBackground(UITheme.BG_CARD);

                    // Thanh cuon Scrollbar toi mau
                    JScrollBar vBar = scroller.getVerticalScrollBar();
                    if (vBar != null) {
                        vBar.setUI(new BasicScrollBarUI() {
                            @Override
                            protected void configureScrollBarColors() {
                                this.thumbColor = new Color(0x3B, 0x43, 0x54);
                                this.trackColor = UITheme.BG_CARD;
                            }

                            @Override
                            protected JButton createDecreaseButton(int orientation) {
                                return createZeroButton();
                            }

                            @Override
                            protected JButton createIncreaseButton(int orientation) {
                                return createZeroButton();
                            }

                            private JButton createZeroButton() {
                                JButton b = new JButton();
                                b.setPreferredSize(new Dimension(0, 0));
                                return b;
                            }
                        });
                    }
                    return scroller;
                }
            };

            popup.setBorder(BorderFactory.createLineBorder(new Color(0x3B, 0x43, 0x54), 1));
            return popup;
        }
    }

    // ==============================================================
    // 2. CUSTOM RENDERER: CHU TRANG RO NET, KHONG CON NEN TRANG CHU DEN
    // ==============================================================
    private class ModernComboRenderer extends DefaultListCellRenderer {
        @Override
        public Component getListCellRendererComponent(JList<?> list, Object value, int index, boolean isSelected, boolean cellHasFocus) {
            JLabel lbl = (JLabel) super.getListCellRendererComponent(list, value, index, isSelected, cellHasFocus);
            lbl.setOpaque(true);
            lbl.setBorder(new EmptyBorder(7, 12, 7, 12));
            lbl.setFont(UITheme.FONT_REGULAR);

            String text = (value != null) ? value.toString() : "";
            boolean isAddNew = text.contains("➕") || text.contains("__ADD_NEW__");

            if (index == -1) {
                // Gia tri hien thi trong o ComboBox chinh khi dong
                lbl.setBackground(UITheme.BG_INPUT);
                if (isAddNew) {
                    lbl.setForeground(new Color(0x34, 0xD3, 0x99));
                    lbl.setFont(UITheme.FONT_BOLD);
                } else {
                    lbl.setForeground(UITheme.TEXT_PRIMARY); // Chu trang tinh khiet, cuc ky ro net
                }
            } else {
                // Cac muc trong danh sach so xuong (Popup Dropdown)
                if (isSelected) {
                    lbl.setBackground(UITheme.PRIMARY_RED);
                    lbl.setForeground(Color.WHITE);
                    lbl.setFont(UITheme.FONT_BOLD);
                } else {
                    lbl.setBackground(UITheme.BG_CARD);
                    if (isAddNew) {
                        lbl.setForeground(new Color(0x34, 0xD3, 0x99)); // Mau xanh ngoc noi bat
                        lbl.setFont(UITheme.FONT_BOLD);
                    } else {
                        lbl.setForeground(UITheme.TEXT_PRIMARY); // Chu trang sang de nhin
                    }
                }
            }
            return lbl;
        }
    }
}
