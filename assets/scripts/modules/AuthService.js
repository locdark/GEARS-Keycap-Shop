// ============================================================================
// GEARS KEYCAP SHOP - AUTH SERVICE (OOP SINGLETON)
// Quan ly xac thuc, phan quyen, kiem tra do phuc tap mat khau
// ============================================================================

class AuthService {
    constructor(storageService) {
        if (AuthService.instance) {
            return AuthService.instance;
        }
        this._storage = storageService || (typeof StorageService !== 'undefined' ? StorageService.getInstance() : null);
        AuthService.instance = this;
    }

    static getInstance(storageService) {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService(storageService);
        }
        return AuthService.instance;
    }

    /**
     * Kiem tra do bao mat cua mat khau:
     * - Toi thieu 8 ky tu
     * - Co it nhat 1 chu cai in hoa
     * - Co it nhat 1 ky tu dac biet
     */
    validatePasswordSecurity(password) {
        if (!password || typeof password !== 'string') {
            return {
                valid: false,
                message: 'Mật khẩu không được để trống!'
            };
        }

        if (password.length < 8) {
            return {
                valid: false,
                message: 'Mật khẩu phải có tối thiểu 8 ký tự để đảm bảo an toàn!'
            };
        }

        const hasUpperCase = /[A-Z]/.test(password);
        if (!hasUpperCase) {
            return {
                valid: false,
                message: 'Mật khẩu phải chứa ít nhất 1 chữ cái VIẾT HOA (A-Z)!'
            };
        }

        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        if (!hasSpecialChar) {
            return {
                valid: false,
                message: 'Mật khẩu phải chứa ít nhất 1 ký tự ĐẶC BIỆT (!@#$%^&*...)!'
            };
        }

        return {
            valid: true,
            message: 'Mật khẩu đạt tiêu chuẩn an toàn cao!'
        };
    }

    /**
     * Dang nhap Admin / POS
     */
    loginAdmin(username, password) {
        const passCheck = this.validatePasswordSecurity(password);
        if (!passCheck.valid) {
            return { success: false, message: passCheck.message };
        }

        const employees = this._getStorage().get('employees', []);
        const employee = employees.find(e => 
            (e.username === username || e.email === username) && e.password === password
        );

        if (!employee) {
            return { success: false, message: 'Tài khoản hoặc mật khẩu không chính xác!' };
        }

        if (employee.status === 'locked') {
            return { success: false, message: 'Tài khoản nhân viên này đã bị khóa quyền truy cập!' };
        }

        const sessionUser = {
            id: employee.id,
            name: employee.name,
            username: employee.username,
            role: employee.role,
            roleName: employee.roleName || (employee.role === 'admin' ? 'Quản trị viên / Quản lý' : 'Nhân viên POS'),
            avatar: employee.avatar || '../img/ShortCut_Icon.png',
            loginTime: new Date().toISOString()
        };

        this._getStorage().set('currentAdminUser', sessionUser);
        return { success: true, user: sessionUser };
    }

    /**
     * Dang nhap Khach Hang
     */
    loginCustomer(username, password) {
        const users = this._getStorage().get('user', []);
        const user = users.find(u => 
            (u.username === username || u.email === username) && u.password === password
        );

        if (!user) {
            return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng!' };
        }

        if (user.status === 'locked') {
            return { success: false, message: 'Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ hỗ trợ!' };
        }

        const customerSession = {
            id: user.id || user.username,
            name: user.name || user.username,
            username: user.username,
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            loginTime: new Date().toISOString()
        };

        this._getStorage().set('currentUser', customerSession);
        return { success: true, user: customerSession };
    }

    /**
     * Dang ky tai khoan khach hang moi
     */
    registerCustomer(userData) {
        const passCheck = this.validatePasswordSecurity(userData.password);
        if (!passCheck.valid) {
            return { success: false, message: passCheck.message };
        }

        const users = this._getStorage().get('user', []);
        const exists = users.some(u => u.username === userData.username || (userData.email && u.email === userData.email));
        if (exists) {
            return { success: false, message: 'Tên đăng nhập hoặc email đã tồn tại trong hệ thống!' };
        }

        const newUser = {
            id: 'KH' + String(users.length + 1).padStart(4, '0'),
            name: userData.name || userData.username,
            username: userData.username,
            password: userData.password,
            email: userData.email || '',
            phone: userData.phone || '',
            address: userData.address || '',
            status: 'active',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        this._getStorage().set('user', users);
        return { success: true, user: newUser };
    }

    getCurrentAdminUser() {
        let user = this._getStorage().get('currentAdminUser', null) || this._getStorage().get('clientLoggedInUser', null);
        if (!user && typeof sessionStorage !== 'undefined') {
            try {
                user = JSON.parse(sessionStorage.getItem('currentAdminUser') || sessionStorage.getItem('clientLoggedInUser') || 'null');
            } catch (e) {}
        }
        if (user && (user.userType === 'admin' || user.username === 'admin')) {
            user.role = 'admin';
            user.roleName = user.roleName || 'Quản Trị Viên (Admin)';
        }
        return user;
    }

    getCurrentCustomer() {
        return this._getStorage().get('currentUser', null);
    }

    logoutAdmin() {
        this._getStorage().remove('currentAdminUser');
        if (typeof window !== 'undefined') {
            window.location.href = 'login.html';
        }
    }

    logoutCustomer() {
        this._getStorage().remove('currentUser');
        if (typeof window !== 'undefined') {
            window.location.reload();
        }
    }

    checkAuth(requiredRole = 'admin') {
        const currentUser = this.getCurrentAdminUser();
        if (!currentUser) {
            if (typeof window !== 'undefined') {
                window.location.href = 'login.html';
            }
            return false;
        }

        const isAdmin = currentUser.role === 'admin' || currentUser.userType === 'admin';
        if (requiredRole === 'admin' && !isAdmin) {
            alert('Bạn không có quyền truy cập chức năng này! Chuyển về POS.');
            if (typeof window !== 'undefined') {
                window.location.href = 'pos.html';
            }
            return false;
        }

        return true;
    }

    _getStorage() {
        if (!this._storage) {
            this._storage = (typeof StorageService !== 'undefined') ? StorageService.getInstance() : {
                get: (k, def) => {
                    try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : def; } catch (e) { return def; }
                },
                set: (k, v) => {
                    try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; }
                },
                remove: (k) => {
                    try { localStorage.removeItem(k); return true; } catch (e) { return false; }
                }
            };
        }
        return this._storage;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthService;
}
if (typeof window !== 'undefined') {
    window.AuthService = AuthService;
}
