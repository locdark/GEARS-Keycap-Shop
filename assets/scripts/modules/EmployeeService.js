// ============================================================================
// GEARS KEYCAP SHOP - EMPLOYEE SERVICE (OOP SINGLETON)
// Quan ly danh sach nhan vien, phan quyen vai tro (Admin vs POS)
// ============================================================================

class EmployeeService {
    constructor(storageService, authService) {
        if (EmployeeService.instance) {
            return EmployeeService.instance;
        }
        this._storage = storageService || (typeof StorageService !== 'undefined' ? StorageService.getInstance() : null);
        this._authService = authService || (typeof AuthService !== 'undefined' ? AuthService.getInstance() : null);
        EmployeeService.instance = this;
    }

    static getInstance(storageService, authService) {
        if (!EmployeeService.instance) {
            EmployeeService.instance = new EmployeeService(storageService, authService);
        }
        return EmployeeService.instance;
    }

    getAll() {
        return this._getStorage().get('employees', []);
    }

    getById(id) {
        const list = this.getAll();
        return list.find(e => String(e.id) === String(id)) || null;
    }

    search(query) {
        const list = this.getAll();
        if (!query || !query.trim()) return list;
        const q = query.toLowerCase().trim();
        return list.filter(e => 
            (e.id && e.id.toLowerCase().includes(q)) ||
            (e.name && e.name.toLowerCase().includes(q)) ||
            (e.username && e.username.toLowerCase().includes(q)) ||
            (e.phone && e.phone.includes(q)) ||
            (e.email && e.email.toLowerCase().includes(q))
        );
    }

    add(data) {
        const aService = this._getAuthService();
        if (data.password) {
            const passCheck = aService.validatePasswordSecurity(data.password);
            if (!passCheck.valid) {
                return { success: false, message: passCheck.message };
            }
        }

        const list = this.getAll();
        const nextId = 'NV' + String(list.length + 1).padStart(2, '0');
        const role = data.role || 'pos';
        const newEmp = {
            id: data.id || nextId,
            name: data.name.trim(),
            phone: (data.phone || '').trim(),
            email: (data.email || '').trim(),
            username: (data.username || '').trim(),
            password: data.password,
            role: role,
            roleName: role === 'admin' ? 'Quản trị viên / Quản lý' : 'Nhân viên POS / Thu ngân',
            status: data.status || 'active',
            createdAt: new Date().toISOString()
        };

        list.push(newEmp);
        this._getStorage().set('employees', list);
        return { success: true, employee: newEmp };
    }

    update(id, data) {
        const list = this.getAll();
        const index = list.findIndex(e => String(e.id) === String(id));
        if (index === -1) return { success: false, message: 'Không tìm thấy nhân viên!' };

        if (data.password) {
            const aService = this._getAuthService();
            const passCheck = aService.validatePasswordSecurity(data.password);
            if (!passCheck.valid) {
                return { success: false, message: passCheck.message };
            }
        }

        const emp = list[index];
        const role = data.role !== undefined ? data.role : emp.role;

        list[index] = {
            ...emp,
            name: data.name !== undefined ? data.name.trim() : emp.name,
            phone: data.phone !== undefined ? data.phone.trim() : emp.phone,
            email: data.email !== undefined ? data.email.trim() : emp.email,
            username: data.username !== undefined ? data.username.trim() : emp.username,
            password: data.password !== undefined ? data.password : emp.password,
            role: role,
            roleName: role === 'admin' ? 'Quản trị viên / Quản lý' : 'Nhân viên POS / Thu ngân',
            status: data.status !== undefined ? data.status : emp.status
        };

        this._getStorage().set('employees', list);
        return { success: true, employee: list[index] };
    }

    updateRole(id, newRole, newStatus) {
        const list = this.getAll();
        const index = list.findIndex(e => String(e.id) === String(id));
        if (index === -1) return null;

        list[index].role = newRole;
        list[index].roleName = newRole === 'admin' ? 'Quản trị viên / Quản lý' : 'Nhân viên POS / Thu ngân';
        if (newStatus) {
            list[index].status = newStatus;
        }

        this._getStorage().set('employees', list);
        return list[index];
    }

    delete(id) {
        const list = this.getAll();
        const filtered = list.filter(e => String(e.id) !== String(id));
        if (filtered.length !== list.length) {
            this._getStorage().set('employees', filtered);
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

    _getAuthService() {
        if (!this._authService) {
            this._authService = (typeof AuthService !== 'undefined') ? AuthService.getInstance() : {
                validatePasswordSecurity: () => ({ valid: true })
            };
        }
        return this._authService;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmployeeService;
}
if (typeof window !== 'undefined') {
    window.EmployeeService = EmployeeService;
}
