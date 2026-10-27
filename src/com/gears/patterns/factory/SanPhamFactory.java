package com.gears.patterns.factory;

import com.gears.model.SanPhamKeycap;

/**
 * DESIGN PATTERN: FACTORY METHOD
 * Dong goi logic khoi tao san pham Keycap theo tung the loai dac thu.
 * - Artisan: Resin thu cong cao cap
 * - Anime: Dyesub Manga / Anime
 * - Pudding: Doubleshot LED RGB
 * - Cherry: Profile tieu chuan
 * - Other: Phim le CNC / Ban phim co
 */
public class SanPhamFactory {

    public static SanPhamKeycap createSanPham(int id, String name, String type, double costPrice, double price, int stock, String img, String desc, String supplierId) {
        String finalDesc = desc;
        String finalImg = (img != null && !img.trim().isEmpty()) ? img : "./assets/img/ShortCut_Icon.png";

        if (finalDesc == null || finalDesc.trim().isEmpty()) {
            switch (type) {
                case "Artisan":
                    finalDesc = "Keycap nghệ thuật đúc thủ công resin đa lớp, hiệu ứng xuyên sáng LED cao cấp.";
                    break;
                case "Anime":
                    finalDesc = "Bộ keycap chủ đề Anime / Manga công nghệ in nhiệt PBT Dyesub 5 mặt sắc nét.";
                    break;
                case "Pudding":
                    finalDesc = "Set keycap bánh bóng Pudding PBT Doubleshot xuyên LED RGB rực rỡ góc gaming.";
                    break;
                case "Cherry":
                    finalDesc = "Bộ keycap tiêu chuẩn Cherry profile công thái học, chất liệu PBT dày dặn chống bóng mờ.";
                    break;
                default:
                    finalDesc = "Phụ kiện bàn phím cơ & keycap chính hãng GEARS Shop.";
                    break;
            }
        }

        return new SanPhamKeycap(id, name, type, costPrice, price, stock, finalImg, finalDesc, supplierId);
    }
}
