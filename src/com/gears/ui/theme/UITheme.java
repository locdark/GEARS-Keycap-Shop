package com.gears.ui.theme;

import java.awt.*;
import javax.swing.*;
import javax.swing.border.Border;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;

/**
 * He thong Design System & Bang mau chu dao (Theme Colors):
 * - GearVN Signature Red UI (#E30019)
 * - Obsidian Dark ERP (#121316)
 * - The Card (#1A1D22)
 * - Typography Segoe UI / SansSerif
 */
public class UITheme {
    // Brand Colors
    public static final Color PRIMARY_RED = new Color(0xE3, 0x00, 0x19);
    public static final Color PRIMARY_RED_HOVER = new Color(0xB8, 0x00, 0x14);
    public static final Color PRIMARY_RED_LIGHT = new Color(0xFF, 0x4D, 0x5E);

    // Dark Backgrounds
    public static final Color BG_MAIN = new Color(0x12, 0x13, 0x16);
    public static final Color BG_SIDEBAR = new Color(0x0C, 0x0D, 0x0F);
    public static final Color BG_CARD = new Color(0x1A, 0x1D, 0x22);
    public static final Color BG_CARD_HOVER = new Color(0x23, 0x27, 0x2E);
    public static final Color BG_INPUT = new Color(0x25, 0x29, 0x30);
    public static final Color BG_HEADER = new Color(0x16, 0x18, 0x1C);

    // Borders & Dividers
    public static final Color BORDER_COLOR = new Color(0x32, 0x36, 0x40);
    public static final Color BORDER_FOCUS = new Color(0xE3, 0x00, 0x19);

    // Text Colors - Do tuong phan cao (High Contrast White & Silver)
    public static final Color TEXT_PRIMARY = new Color(0xFF, 0xFF, 0xFF);   // Pure White #FFFFFF
    public static final Color TEXT_SECONDARY = new Color(0xE2, 0xE8, 0xF0); // Slate-200 #E2E8F0 - Trang bac sang ro net, khong bi chim vao nen xam
    public static final Color TEXT_MUTED = new Color(0x94, 0xA3, 0xB8);     // Slate-400 #94A3B8 - Xam sang ro net, khong toi mau

    // Status Colors
    public static final Color STATUS_SUCCESS = new Color(0x10, 0xB9, 0x81); // Emerald
    public static final Color STATUS_WARNING = new Color(0xF5, 0x9E, 0x0B); // Amber
    public static final Color STATUS_DANGER = new Color(0xEF, 0x44, 0x44);  // Red
    public static final Color STATUS_INFO = new Color(0x3B, 0x82, 0xF6);    // Blue
    public static final Color STATUS_PURPLE = new Color(0x8B, 0x5C, 0xF6);  // Purple

    // Fonts
    public static final Font FONT_TITLE = new Font("Segoe UI", Font.BOLD, 20);
    public static final Font FONT_SUBTITLE = new Font("Segoe UI", Font.BOLD, 15);
    public static final Font FONT_BOLD = new Font("Segoe UI", Font.BOLD, 13);
    public static final Font FONT_REGULAR = new Font("Segoe UI", Font.PLAIN, 13);
    public static final Font FONT_SMALL = new Font("Segoe UI", Font.PLAIN, 11);
    public static final Font FONT_METRIC = new Font("Segoe UI", Font.BOLD, 22);

    public static Border createCardBorder() {
        return BorderFactory.createCompoundBorder(
            new LineBorder(BORDER_COLOR, 1, true),
            new EmptyBorder(14, 16, 14, 16)
        );
    }

    public static Border createInputPadding() {
        return BorderFactory.createCompoundBorder(
            new LineBorder(BORDER_COLOR, 1, true),
            new EmptyBorder(8, 12, 8, 12)
        );
    }

    /**
     * Ap dung bo thiet lap mau toan cuc cho Swing UIManager,
     * bao dam moi JLabel, ComboBox, Panel mac dinh deu co chu trang ro net, khong bao gio bi chu den nen toi.
     */
    public static void applyGlobalDarkTheme() {
        try {
            javax.swing.plaf.ColorUIResource textPrimaryRes = new javax.swing.plaf.ColorUIResource(TEXT_PRIMARY);
            javax.swing.plaf.ColorUIResource textSecondaryRes = new javax.swing.plaf.ColorUIResource(TEXT_SECONDARY);
            javax.swing.plaf.ColorUIResource textMutedRes = new javax.swing.plaf.ColorUIResource(TEXT_MUTED);
            javax.swing.plaf.ColorUIResource bgMainRes = new javax.swing.plaf.ColorUIResource(BG_MAIN);
            javax.swing.plaf.ColorUIResource bgCardRes = new javax.swing.plaf.ColorUIResource(BG_CARD);
            javax.swing.plaf.ColorUIResource bgInputRes = new javax.swing.plaf.ColorUIResource(BG_INPUT);
            javax.swing.plaf.ColorUIResource primaryRedRes = new javax.swing.plaf.ColorUIResource(PRIMARY_RED);

            UIManager.put("Label.foreground", textPrimaryRes);
            UIManager.put("Label.disabledForeground", textMutedRes);
            UIManager.put("Label.font", FONT_REGULAR);

            UIManager.put("CheckBox.foreground", textSecondaryRes);
            UIManager.put("CheckBox.background", bgCardRes);
            UIManager.put("CheckBox.font", FONT_REGULAR);

            UIManager.put("RadioButton.foreground", textSecondaryRes);
            UIManager.put("RadioButton.background", bgCardRes);

            UIManager.put("Panel.background", bgMainRes);
            UIManager.put("Panel.foreground", textPrimaryRes);

            UIManager.put("OptionPane.background", bgCardRes);
            UIManager.put("OptionPane.messageForeground", textPrimaryRes);

            UIManager.put("ComboBox.background", bgInputRes);
            UIManager.put("ComboBox.foreground", textPrimaryRes);
            UIManager.put("ComboBox.selectionBackground", primaryRedRes);
            UIManager.put("ComboBox.selectionForeground", Color.WHITE);
            UIManager.put("ComboBox.buttonBackground", bgInputRes);
            UIManager.put("ComboBox.buttonDarkShadow", bgMainRes);

            UIManager.put("Table.background", bgCardRes);
            UIManager.put("Table.foreground", textPrimaryRes);
            UIManager.put("Table.gridColor", new javax.swing.plaf.ColorUIResource(0x28, 0x2D, 0x38));
            UIManager.put("TableHeader.background", new javax.swing.plaf.ColorUIResource(BG_HEADER));
            UIManager.put("TableHeader.foreground", textPrimaryRes);
        } catch (Exception ignored) {}
    }
}
