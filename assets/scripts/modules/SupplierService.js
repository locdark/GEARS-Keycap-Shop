// ============================================================================
// GEARS KEYCAP SHOP - SUPPLIER SERVICE (OOP SINGLETON)
// Quan ly danh sach nha cung cap Keycap va linh kien
// ============================================================================

class SupplierService {
    constructor(storageService) {
        if (SupplierService.instance) {
            return SupplierService.instance;
        }
        this._storage = storageService || (typeof StorageService !== 'undefined' ? StorageService.getInstance() : null);
        SupplierService.instance = this;
    }

    static getInstance(storageService) {
        if (!SupplierService.instance) {
            SupplierService.instance = new SupplierService(storageService);
        }
        return SupplierService.instance;
    }

    getAll() {
        return this._getStorage().get('suppliers', []);
    }

    getById(id) {
        const list = this.getAll();
        return list.find(s => String(s.id) === String(id)) || null;
    }

    search(query) {
        const list = this.getAll();
        if (!query || !query.trim()) return list;
        const q = query.toLowerCase().trim();
        return list.filter(s => 
            (s.id && s.id.toLowerCase().includes(q)) ||
            (s.name && s.name.toLowerCase().includes(q)) ||
            (s.phone && s.phone.includes(q)) ||
            (s.productTypes && s.productTypes.toLowerCase().includes(q))
        );
    }

    add(data) {
        const list = this.getAll();
        const nextId = 'NCC' + String(list.length + 1).padStart(2, '0');
        const newSupplier = {
            id: data.id || nextId,
            name: data.name.trim(),
            phone: (data.phone || '').trim(),
            email: (data.email || '').trim(),
            address: (data.address || '').trim(),
            productTypes: (data.productTypes || 'Artisan, Anime').trim(),
            note: (data.note || '').trim()
        };

        list.push(newSupplier);
        this._getStorage().set('suppliers', list);
        return newSupplier;
    }

    update(id, data) {
        const list = this.getAll();
        const index = list.findIndex(s => String(s.id) === String(id));
        if (index === -1) return null;

        list[index] = {
            ...list[index],
            name: data.name !== undefined ? data.name.trim() : list[index].name,
            phone: data.phone !== undefined ? data.phone.trim() : list[index].phone,
            email: data.email !== undefined ? data.email.trim() : list[index].email,
            address: data.address !== undefined ? data.address.trim() : list[index].address,
            productTypes: data.productTypes !== undefined ? data.productTypes.trim() : list[index].productTypes,
            note: data.note !== undefined ? data.note.trim() : list[index].note
        };

        this._getStorage().set('suppliers', list);
        return list[index];
    }

    delete(id) {
        const list = this.getAll();
        const filtered = list.filter(s => String(s.id) !== String(id));
        if (filtered.length !== list.length) {
            this._getStorage().set('suppliers', filtered);
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
    module.exports = SupplierService;
}
if (typeof window !== 'undefined') {
    window.SupplierService = SupplierService;
}
