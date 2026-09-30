// ============================================================================
// GEARS KEYCAP SHOP - CUSTOMER SERVICE (OOP SINGLETON)
// Quan ly danh sach khach hang, lich su mua hang, trang thai khoa tai khoan
// ============================================================================

class CustomerService {
    constructor(storageService) {
        if (CustomerService.instance) {
            return CustomerService.instance;
        }
        this._storage = storageService || (typeof StorageService !== 'undefined' ? StorageService.getInstance() : null);
        CustomerService.instance = this;
    }

    static getInstance(storageService) {
        if (!CustomerService.instance) {
            CustomerService.instance = new CustomerService(storageService);
        }
        return CustomerService.instance;
    }

    getAll() {
        return this._getStorage().get('user', []);
    }

    getById(id) {
        const users = this.getAll();
        return users.find(u => String(u.id) === String(id) || u.username === id) || null;
    }

    search(query) {
        const users = this.getAll();
        if (!query || !query.trim()) return users;
        const q = query.toLowerCase().trim();
        return users.filter(u => 
            (u.id && String(u.id).toLowerCase().includes(q)) ||
            (u.name && u.name.toLowerCase().includes(q)) ||
            (u.username && u.username.toLowerCase().includes(q)) ||
            (u.phone && u.phone.includes(q)) ||
            (u.email && u.email.toLowerCase().includes(q))
        );
    }

    toggleLock(userId) {
        const users = this.getAll();
        const user = users.find(u => String(u.id) === String(userId) || u.username === userId);
        if (!user) return null;

        user.status = user.status === 'locked' ? 'active' : 'locked';
        this._getStorage().set('user', users);
        return user;
    }

    update(userId, updateData) {
        const users = this.getAll();
        const index = users.findIndex(u => String(u.id) === String(userId) || u.username === userId);
        if (index === -1) return null;

        users[index] = {
            ...users[index],
            ...updateData
        };
        this._getStorage().set('user', users);
        return users[index];
    }

    delete(userId) {
        const users = this.getAll();
        const filtered = users.filter(u => String(u.id) !== String(userId) && u.username !== userId);
        if (filtered.length !== users.length) {
            this._getStorage().set('user', filtered);
            return true;
        }
        return false;
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
    module.exports = CustomerService;
}
if (typeof window !== 'undefined') {
    window.CustomerService = CustomerService;
}
