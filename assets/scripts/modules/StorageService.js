// ============================================================================
// GEARS KEYCAP SHOP - STORAGE SERVICE (OOP SINGLETON)
// Quan ly luu tru LocalStorage huong doi tuong tap trung
// ============================================================================

class StorageService {
    constructor() {
        if (StorageService.instance) {
            return StorageService.instance;
        }
        this._subscribers = {};
        StorageService.instance = this;
    }

    static getInstance() {
        if (!StorageService.instance) {
            StorageService.instance = new StorageService();
        }
        return StorageService.instance;
    }

    get(key, defaultValue = null) {
        try {
            if (typeof localStorage === 'undefined') return defaultValue;
            const raw = localStorage.getItem(key);
            if (raw === null || raw === undefined) return defaultValue;
            return JSON.parse(raw);
        } catch (error) {
            console.error(`StorageService.get('${key}') error:`, error);
            return defaultValue;
        }
    }

    set(key, data) {
        try {
            if (typeof localStorage === 'undefined') return false;
            localStorage.setItem(key, JSON.stringify(data));
            this._notifySubscribers(key, data);
            return true;
        } catch (error) {
            console.error(`StorageService.set('${key}') error:`, error);
            return false;
        }
    }

    remove(key) {
        try {
            if (typeof localStorage === 'undefined') return false;
            localStorage.removeItem(key);
            this._notifySubscribers(key, null);
            return true;
        } catch (error) {
            console.error(`StorageService.remove('${key}') error:`, error);
            return false;
        }
    }

    has(key) {
        if (typeof localStorage === 'undefined') return false;
        return localStorage.getItem(key) !== null;
    }

    subscribe(key, callback) {
        if (!this._subscribers[key]) {
            this._subscribers[key] = [];
        }
        this._subscribers[key].push(callback);
    }

    _notifySubscribers(key, data) {
        if (this._subscribers[key]) {
            this._subscribers[key].forEach(cb => {
                try {
                    cb(data);
                } catch (e) {
                    console.error('Storage subscriber error:', e);
                }
            });
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageService;
}
if (typeof window !== 'undefined') {
    window.StorageService = StorageService;
}
