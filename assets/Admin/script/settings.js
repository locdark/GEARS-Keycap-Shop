// ============================================================================
// WEBSITE SETTINGS CONTROLLER - Cấu hình Website & Upload Logo
// ============================================================================

let currentConfig = {};
let uploadedLogoBase64 = null;

document.addEventListener('DOMContentLoaded', function() {
    if (window.AdminCommon && window.AdminCommon.checkAuth) {
        AdminCommon.checkAuth('admin');
    }
    loadSettings();
});

function loadSettings() {
    currentConfig = AdminCommon.getWebsiteConfig() || {};

    document.getElementById('cfg-shop-name').value = currentConfig.shopName || 'GEARS SHOP';
    document.getElementById('cfg-brand-tagline').value = currentConfig.brandTagline || '';
    document.getElementById('cfg-top-banner').value = currentConfig.topBannerText || '';

    document.getElementById('cfg-hotline').value = currentConfig.hotline || '1800 6975';
    document.getElementById('cfg-email').value = currentConfig.email || 'cskh@gearskeycap.vn';
    document.getElementById('cfg-hours').value = currentConfig.workingHours || '08:00 - 21:30 (Thứ 2 - CN)';
    document.getElementById('cfg-address').value = currentConfig.address || '273 An Dương Vương, Phường 3, Quận 5, TP. Hồ Chí Minh';

    document.getElementById('cfg-fb').value = currentConfig.facebookUrl || 'https://facebook.com';
    document.getElementById('cfg-insta').value = currentConfig.instagramUrl || 'https://instagram.com';
    document.getElementById('cfg-gh').value = currentConfig.githubUrl || 'https://github.com';

    document.getElementById('cfg-desc').value = currentConfig.description || 'GEARS Shop là cửa hàng chuyên cung cấp keycap giá rẻ và chất lượng tốt, chúng tôi cam kết bán hàng chính hãng, đảm bảo yêu cầu của người tiêu dùng.';

    // Preview Logo
    const previewImg = document.getElementById('logo-preview-img');
    const statusText = document.getElementById('logo-preview-status');
    if (currentConfig.logoUrl) {
        previewImg.src = currentConfig.logoUrl;
        statusText.innerText = 'Logo đã được tải lên thành công';
        uploadedLogoBase64 = currentConfig.logoUrl;
    } else {
        previewImg.src = '../img/ShortCut_Icon.png';
        statusText.innerText = 'Logo hiện tại (Biểu tượng mặc định)';
        uploadedLogoBase64 = null;
    }
}

function handleLogoUpload(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];

    // Kiểm tra dung lượng file (tối đa 2MB)
    if (file.size > 2 * 1024 * 1024) {
        AdminCommon.showToast('Dung lượng ảnh logo không được vượt quá 2MB!', 'error');
        input.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedLogoBase64 = e.target.result;
        const previewImg = document.getElementById('logo-preview-img');
        const statusText = document.getElementById('logo-preview-status');
        previewImg.src = uploadedLogoBase64;
        statusText.innerText = `Đã chọn: ${file.name} (${Math.round(file.size / 1024)} KB)`;
        AdminCommon.showToast('Đã tải ảnh logo lên thành công! Hãy bấm Lưu cấu hình.', 'success');
    };
    reader.readAsDataURL(file);
}

function resetDefaultLogo() {
    uploadedLogoBase64 = '';
    document.getElementById('logo-preview-img').src = '../img/ShortCut_Icon.png';
    document.getElementById('logo-preview-status').innerText = 'Đã khôi phục biểu tượng icon mặc định';
    document.getElementById('logo-file-input').value = '';
    AdminCommon.showToast('Đã chọn biểu tượng mặc định.', 'info');
}

function saveWebsiteConfig() {
    const shopName = document.getElementById('cfg-shop-name').value.trim();
    const brandTagline = document.getElementById('cfg-brand-tagline').value.trim();
    const topBannerText = document.getElementById('cfg-top-banner').value.trim();

    const hotline = document.getElementById('cfg-hotline').value.trim();
    const email = document.getElementById('cfg-email').value.trim();
    const workingHours = document.getElementById('cfg-hours').value.trim();
    const address = document.getElementById('cfg-address').value.trim();

    const facebookUrl = document.getElementById('cfg-fb').value.trim();
    const instagramUrl = document.getElementById('cfg-insta').value.trim();
    const githubUrl = document.getElementById('cfg-gh').value.trim();
    const description = document.getElementById('cfg-desc').value.trim();

    if (!shopName) {
        AdminCommon.showToast('Vui lòng nhập tên thương hiệu cửa hàng!', 'error');
        document.getElementById('cfg-shop-name').focus();
        return;
    }

    const updatedConfig = {
        ...currentConfig,
        shopName,
        brandTagline,
        topBannerText,
        hotline: hotline || '1800 6975',
        email: email || 'cskh@gearskeycap.vn',
        workingHours: workingHours || '08:00 - 21:30',
        address: address || '273 An Dương Vương, Phường 3, Quận 5, TP. Hồ Chí Minh',
        facebookUrl: facebookUrl || 'https://facebook.com',
        instagramUrl: instagramUrl || 'https://instagram.com',
        githubUrl: githubUrl || 'https://github.com',
        description: description || 'GEARS Shop là cửa hàng chuyên cung cấp keycap giá rẻ và chất lượng tốt, chúng tôi cam kết bán hàng chính hãng, đảm bảo yêu cầu của người tiêu dùng.',
        logoUrl: uploadedLogoBase64 !== null ? uploadedLogoBase64 : (currentConfig.logoUrl || '')
    };

    AdminCommon.setLocalStorage('websiteConfig', updatedConfig);
    currentConfig = updatedConfig;
    AdminCommon.showToast('ĐÃ LƯU CẤU HÌNH WEBSITE THÀNH CÔNG!', 'success');
}

function resetAllConfigToDefault() {
    if (!confirm('Bạn có chắc chắn muốn khôi phục toàn bộ cấu hình website về mặc định ban đầu không?')) {
        return;
    }

    const defaultConfig = {
        shopName: "GEARS SHOP",
        brandTagline: "Chuyên cung cấp keycap giá rẻ và chất lượng tốt",
        description: "GEARS Shop là cửa hàng chuyên cung cấp keycap giá rẻ và chất lượng tốt, chúng tôi cam kết bán hàng chính hãng, đảm bảo yêu cầu của người tiêu dùng.",
        logoUrl: "",
        faviconUrl: "./assets/img/ShortCut_Icon.png",
        hotline: "1800 6975",
        email: "cskh@gearskeycap.vn",
        address: "273 An Dương Vương, Phường 3, Quận 5, TP. Hồ Chí Minh",
        workingHours: "08:00 - 21:30 (Thứ 2 - Chủ Nhật)",
        topBannerText: "ƯU ĐÃI ĐỘC QUYỀN THÁNG 03/2026 - BỘ SƯU TẬP KEYCAP CUSTOM CAO CẤP",
        facebookUrl: "https://facebook.com",
        instagramUrl: "https://instagram.com",
        githubUrl: "https://github.com"
    };

    AdminCommon.setLocalStorage('websiteConfig', defaultConfig);
    uploadedLogoBase64 = null;
    loadSettings();
    AdminCommon.showToast('Đã khôi phục cấu hình website về mặc định!', 'info');
}
