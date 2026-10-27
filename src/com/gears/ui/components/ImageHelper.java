package com.gears.ui.components;

import com.gears.ui.theme.UITheme;

import java.awt.*;
import java.awt.geom.RoundRectangle2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.HashMap;
import java.util.Map;
import javax.imageio.ImageIO;
import javax.swing.ImageIcon;
import javax.swing.JFileChooser;

/**
 * ImageHelper: Bộ tiện ích xử lý hình ảnh sản phẩm Keycap:
 * - Tự động nạp và co giãn ảnh mượt mà (Bicubic / High Quality Smoothing)
 * - Tự động tạo ảnh minh họa 3D phong cách Keycap nghệ thuật nếu không tìm thấy tệp ảnh
 * - Lưu ảnh tải lên từ máy tính vào thư mục assets/img/Products/
 */
public class ImageHelper {

    private static final Map<String, ImageIcon> imageCache = new HashMap<>();

    public static ImageIcon getProductImage(String rawPath, int width, int height) {
        String cacheKey = (rawPath != null ? rawPath : "default") + "_" + width + "x" + height;
        if (imageCache.containsKey(cacheKey)) {
            return imageCache.get(cacheKey);
        }

        File imgFile = resolveFile(rawPath);
        if (imgFile != null && imgFile.exists() && imgFile.isFile()) {
            try {
                BufferedImage original = ImageIO.read(imgFile);
                if (original != null) {
                    BufferedImage scaled = scaleImage(original, width, height);
                    ImageIcon icon = new ImageIcon(scaled);
                    imageCache.put(cacheKey, icon);
                    return icon;
                }
            } catch (Exception ignored) {}
        }

        // Tao anh minh hoa procedural dep mat neu anh khong ton tai
        ImageIcon procedural = new ImageIcon(createFallbackKeycapImage(width, height, rawPath));
        imageCache.put(cacheKey, procedural);
        return procedural;
    }

    public static void clearCache() {
        imageCache.clear();
    }

    public static String chooseAndSaveImage(Component parent) {
        JFileChooser chooser = new JFileChooser();
        chooser.setDialogTitle("Chọn Tệp Ảnh Sản Phẩm Keycap");
        chooser.setFileSelectionMode(JFileChooser.FILES_ONLY);
        chooser.setAcceptAllFileFilterUsed(false);
        chooser.addChoosableFileFilter(new javax.swing.filechooser.FileNameExtensionFilter(
            "Tệp hình ảnh (*.jpg, *.jpeg, *.png, *.webp, *.gif)", "jpg", "jpeg", "png", "webp", "gif"));

        File initialDir = new File("assets/img/Products");
        if (initialDir.exists()) chooser.setCurrentDirectory(initialDir);

        int result = chooser.showOpenDialog(parent);
        if (result == JFileChooser.APPROVE_OPTION) {
            File selected = chooser.getSelectedFile();
            return saveUploadedImage(selected);
        }
        return null;
    }

    public static String saveUploadedImage(File sourceFile) {
        if (sourceFile == null || !sourceFile.exists()) return null;
        try {
            File uploadDir = new File("assets/img/Products/Uploaded");
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // Neu file da nam san trong thu muc assets/img/Products thi lay duong dan tuong doi
            String absSource = sourceFile.getAbsolutePath().replace("\\", "/");
            int idx = absSource.indexOf("assets/img/Products/");
            if (idx >= 0) {
                return "./" + absSource.substring(idx);
            }

            String rawName = sourceFile.getName();
            String cleanName = System.currentTimeMillis() + "_" + rawName.replaceAll("[^a-zA-Z0-9._-]", "_");
            File dest = new File(uploadDir, cleanName);
            java.nio.file.Files.copy(sourceFile.toPath(), dest.toPath(), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            return "./assets/img/Products/Uploaded/" + cleanName;
        } catch (Exception ex) {
            ex.printStackTrace();
            return sourceFile.getAbsolutePath();
        }
    }

    private static File resolveFile(String path) {
        if (path == null || path.trim().isEmpty()) return null;
        String clean = path.trim().replace("\\", "/");

        File f = new File(clean);
        if (f.exists() && f.isFile()) return f;

        if (clean.startsWith("./")) {
            clean = clean.substring(2);
            f = new File(clean);
            if (f.exists() && f.isFile()) return f;
        }

        f = new File("assets/img/Products/" + clean);
        if (f.exists() && f.isFile()) return f;

        // Kiem tra trong tung thu muc con: Artisan, Anime, Pudding, Other, Uploaded
        String[] subdirs = {"Artisan", "Anime", "Pudding", "Other", "Uploaded"};
        for (String sub : subdirs) {
            File subF = new File("assets/img/Products/" + sub + "/" + clean);
            if (subF.exists() && subF.isFile()) return subF;

            int lastSlash = clean.lastIndexOf('/');
            String filename = (lastSlash >= 0) ? clean.substring(lastSlash + 1) : clean;
            File fnFile = new File("assets/img/Products/" + sub + "/" + filename);
            if (fnFile.exists() && fnFile.isFile()) return fnFile;
        }

        // Kiem tra thu muc cha ../ phong truong hop CWD la bin/
        File parentF = new File("../" + clean);
        if (parentF.exists() && parentF.isFile()) return parentF;

        File parentAssets = new File("../assets/img/Products/" + clean);
        if (parentAssets.exists() && parentAssets.isFile()) return parentAssets;

        return null;
    }

    private static BufferedImage scaleImage(BufferedImage src, int w, int h) {
        BufferedImage resized = new BufferedImage(w, h, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2 = resized.createGraphics();
        g2.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // Bo tron goc anh
        RoundRectangle2D.Float clip = new RoundRectangle2D.Float(0, 0, w, h, 8, 8);
        g2.setClip(clip);

        // Canh giua anh va crop theo ty le
        double srcRatio = (double) src.getWidth() / src.getHeight();
        double targetRatio = (double) w / h;

        int drawW = w;
        int drawH = h;
        int drawX = 0;
        int drawY = 0;

        if (srcRatio > targetRatio) {
            drawW = (int) (h * srcRatio);
            drawX = -(drawW - w) / 2;
        } else {
            drawH = (int) (w / srcRatio);
            drawY = -(drawH - h) / 2;
        }

        g2.drawImage(src, drawX, drawY, drawW, drawH, null);
        g2.dispose();
        return resized;
    }

    public static BufferedImage createFallbackKeycapImage(int w, int h, String hint) {
        BufferedImage img = new BufferedImage(w, h, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2 = img.createGraphics();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // Background Gradient
        Color c1 = new Color(0x1F, 0x24, 0x30);
        Color c2 = new Color(0x14, 0x16, 0x1D);
        GradientPaint gp = new GradientPaint(0, 0, c1, w, h, c2);
        g2.setPaint(gp);
        g2.fillRoundRect(0, 0, w, h, 8, 8);

        // Keycap Shape 3D
        int pad = Math.min(w, h) / 6;
        int kw = w - pad * 2;
        int kh = h - pad * 2;

        g2.setColor(new Color(0x2E, 0x35, 0x44));
        g2.fillRoundRect(pad, pad, kw, kh, 10, 10);

        g2.setColor(UITheme.PRIMARY_RED);
        g2.fillRoundRect(pad + 4, pad + 4, kw - 8, kh - 8, 8, 8);

        g2.setColor(Color.WHITE);
        g2.setFont(new Font("Segoe UI", Font.BOLD, Math.max(10, h / 7)));
        FontMetrics fm = g2.getFontMetrics();
        String text = "KEYCAP";
        int tw = fm.stringWidth(text);
        g2.drawString(text, (w - tw) / 2, h / 2 + fm.getAscent() / 2 - 2);

        g2.dispose();
        return img;
    }
}
