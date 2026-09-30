// ============================================================================
// GEARS KEYCAP SHOP - CONFIG SERVICE (OOP SINGLETON)
// Quan ly cau hinh website, thong tin thuong hieu, upload logo Base64
// ============================================================================

class ConfigService {
    constructor(storageService) {
        if (ConfigService.instance) {
            return ConfigService.instance;
        }
        this._storage = storageService || (typeof StorageService !== 'undefined' ? StorageService.getInstance() : null);
        this._configKey = 'website_config';
        ConfigService.instance = this;
    }

    static getInstance(storageService) {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService(storageService);
        }
        return ConfigService.instance;
    }

    getDefaultConfig() {
        return {
            shopName: "GEARS SHOP",
            brandTagline: "Hệ Thống Bán Lẻ Keycap & Bàn Phím Cơ Chính Hãng",
            topBannerText: "GIẢM 20% TOÀN BỘ KEYCAP ARTISAN VÀ ANIME TRONG THÁNG NÀY!",
            logoUrl: "",
            hotline: "1800 6975",
            email: "cskh@gearskeycap.vn",
            workingHours: "08:00 - 21:30 (Thứ 2 - CN)",
            address: "273 An Dương Vương, Phường 3, Quận 5, TP. Hồ Chí Minh",
            facebookUrl: "https://facebook.com",
            instagramUrl: "https://instagram.com",
            githubUrl: "https://github.com",
            description: "GEARS Shop là cửa hàng chuyên cung cấp keycap giá rẻ và chất lượng tốt, chúng tôi cam kết bán hàng chính hãng, đảm bảo yêu cầu của người tiêu dùng."
        };
    }

    getConfig() {
        const stored = this._getStorage().get(this._configKey, null);
        if (!stored) {
            const defaults = this.getDefaultConfig();
            this._getStorage().set(this._configKey, defaults);
            return defaults;
        }
        return {
            ...this.getDefaultConfig(),
            ...stored
        };
    }

    saveConfig(newConfig) {
        const current = this.getConfig();
        const merged = {
            ...current,
            ...newConfig,
            updatedAt: new Date().toISOString()
        };
        this._getStorage().set(this._configKey, merged);
        return merged;
    }

    resetDefaults() {
        const defaults = this.getDefaultConfig();
        this._getStorage().set(this._configKey, defaults);
        return defaults;
    }

    _getStorage() {
        if (!this._storage) {
            this._storage = (typeof StorageService !== 'undefined') ? StorageService.getInstance() : {
                get: (k, def) => {
                    try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : def; } catch (e) { return def; }
                },
                set: (k, v) => {
                    try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; }
                }
            };
        }
        return this._storage;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfigService;
}
if (typeof window !== 'undefined') {
    window.ConfigService = ConfigService;
}
