// ============================================================================
// GEARS KEYCAP SHOP - MASTER APP CONTAINER (OOP ARCHITECTURE)
// Môn học: Phân tích Thiết kế Hướng Đối tượng (PTTKHDT) - ĐH Sài Gòn (SGU)
// Nhóm sinh viên: Nguyễn Công Danh (3124410032), Trần Nhật Quang (3124410293), Lê Hoài Lộc (3122560041)
// Tích hợp toàn diện: StorageService, AuthService, ProductService, CartService,
// OrderService, CustomerService, SupplierService, EmployeeService, ReportService,
// ConfigService, NotificationService
// ============================================================================

// ============================================================================
// GEARS KEYCAP SHOP - DOMAIN ENTITIES & DESIGN PATTERNS (OOP CORE)
// Khoa CNTT - Truong Dai hoc Sai Gon (SGU) - Mon hoc: PTTKHDT
// Nhom sinh vien: Nguyen Cong Danh (3124410032), Tran Nhat Quang (3124410293), Le Hoai Loc (3122560041)
//
// 4 TRU COT HUONG DOI TUONG (OOP PRINCIPLES):
// 1. Dong goi (Encapsulation): Thuoc tinh duoc bao ve, truy cap qua Getter/Setter va phuong thuc nghiep vu.
// 2. Ke thua (Inheritance): BaseEntity -> User -> Customer / Employee, PaymentStrategy -> VietQR / Cash / Card.
// 3. Da hinh (Polymorphism): Ghi de phuong thuc getRoleName(), getRoleBadge(), pay(order, context).
// 4. Truu tuong (Abstraction): BaseEntity, Abstract User, PaymentStrategy an giau chi tiet xu ly phuc tap.
//
// CAC DESIGN PATTERNS DUOC AP DUNG:
// - Factory Pattern: EntityFactory
// - Strategy Pattern: PaymentStrategy, VietQRPaymentStrategy, CashPaymentStrategy, CardPaymentStrategy
// - Observer Pattern: StorageObservable / Pub-Sub
// - Singleton Pattern: cac Service quan ly thuc the
// - Facade Pattern: GearsApp
// ============================================================================

/**
 * 1. BASE ENTITY (Lop thuc the co so truu tuong)
 */
class BaseEntity {
    constructor(id) {
        this._id = id !== undefined && id !== null ? Number(id) : null;
        this._createdAt = new Date().toISOString();
        this._updatedAt = new Date().toISOString();
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = Number(value);
        this.touch();
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    touch() {
        this._updatedAt = new Date().toISOString();
    }

    equals(other) {
        if (!other || !(other instanceof BaseEntity)) return false;
        return this._id === other.id;
    }

    toJSON() {
        return {
            id: this._id,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt
        };
    }

    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}

/**
 * 2. USER (Lop co so dai dien cho nguoi dung trong he thong - Truu tuong)
 */
class User extends BaseEntity {
    constructor(id, name, username, phone, email, role, status = 'active') {
        super(id);
        this._name = (name || '').trim();
        this._username = (username || '').trim();
        this._phone = (phone || '').trim();
        this._email = (email || '').trim();
        this._role = role || 'guest';
        this._status = status || 'active';
    }

    get name() { return this._name; }
    set name(val) { this._name = (val || '').trim(); this.touch(); }

    get username() { return this._username; }
    set username(val) { this._username = (val || '').trim(); this.touch(); }

    get phone() { return this._phone; }
    set phone(val) { this._phone = (val || '').trim(); this.touch(); }

    get email() { return this._email; }
    set email(val) { this._email = (val || '').trim(); this.touch(); }

    get role() { return this._role; }
    set role(val) { this._role = val; this.touch(); }

    get status() { return this._status; }
    set status(val) { this._status = val; this.touch(); }

    isActive() {
        return this._status === 'active';
    }

    // Phuong thuc da hinh (Polymorphic Method - duoc ghi de boi lop con)
    getRoleName() {
        return 'Nguoi dung';
    }

    getRoleBadgeClass() {
        return 'badge-secondary';
    }

    toJSON() {
        return {
            ...super.toJSON(),
            name: this._name,
            username: this._username,
            phone: this._phone,
            email: this._email,
            role: this._role,
            status: this._status
        };
    }
}

/**
 * 3. CUSTOMER (Ke thua tu User)
 */
class Customer extends User {
    constructor(id, name, phone, email, address = '', rewardPoints = 0, isLocked = false) {
        super(id, name, '', phone, email, 'customer', isLocked ? 'locked' : 'active');
        this._address = (address || '').trim();
        this._rewardPoints = Number(rewardPoints) || 0;
        this._isLocked = Boolean(isLocked);
    }

    get address() { return this._address; }
    set address(val) { this._address = (val || '').trim(); this.touch(); }

    get rewardPoints() { return this._rewardPoints; }
    set rewardPoints(val) { this._rewardPoints = Math.max(0, Number(val) || 0); this.touch(); }

    get isLocked() { return this._isLocked; }
    set isLocked(val) { 
        this._isLocked = Boolean(val); 
        this._status = this._isLocked ? 'locked' : 'active';
        this.touch(); 
    }

    // Ghi de phuong thuc da hinh (Polymorphic Override)
    getRoleName() {
        return 'Khach hang';
    }

    getRoleBadgeClass() {
        return 'badge-info';
    }

    getMembershipTier() {
        if (this._rewardPoints >= 1000) return 'VIP Kim Cuong';
        if (this._rewardPoints >= 500) return 'VIP Vang';
        if (this._rewardPoints >= 200) return 'VIP Bac';
        return 'Thanh vien';
    }

    addRewardPoints(points) {
        const pts = Number(points) || 0;
        if (pts > 0) {
            this._rewardPoints += pts;
            this.touch();
        }
        return this._rewardPoints;
    }

    toggleLock() {
        this._isLocked = !this._isLocked;
        this._status = this._isLocked ? 'locked' : 'active';
        this.touch();
        return this._isLocked;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            address: this._address,
            rewardPoints: this._rewardPoints,
            isLocked: this._isLocked,
            membershipTier: this.getMembershipTier()
        };
    }
}

/**
 * 4. EMPLOYEE (Ke thua tu User)
 */
class Employee extends User {
    constructor(id, name, username, phone, email, role = 'cashier', position = 'Nhan vien ban hang', status = 'active') {
        super(id, name, username, phone, email, role, status);
        this._position = position || (role === 'admin' ? 'Quan ly cua hang' : 'Nhan vien thu ngan');
    }

    get position() { return this._position; }
    set position(val) { this._position = val; this.touch(); }

    // Ghi de phuong thuc da hinh (Polymorphic Override)
    getRoleName() {
        return this._role === 'admin' ? 'Quan tri vien' : 'Nhan vien Thu ngan';
    }

    getRoleBadgeClass() {
        return this._role === 'admin' ? 'badge-primary' : 'badge-success';
    }

    hasPermission(action) {
        if (!this.isActive()) return false;
        if (this._role === 'admin') return true;
        // Thu ngan (POS) co quyen ban hang, in hoa don, tra cuu san pham
        const cashierPermissions = ['pos_checkout', 'print_receipt', 'view_products', 'create_customer'];
        return cashierPermissions.includes(action);
    }

    toJSON() {
        return {
            ...super.toJSON(),
            position: this._position,
            roleName: this.getRoleName()
        };
    }
}

/**
 * 5. PRODUCT (Thuc the San pham Keycap - Ke thua tu BaseEntity)
 */
class Product extends BaseEntity {
    constructor(id, name, type, price, costPrice, stock, img, description = '', supplierId = 1) {
        super(id);
        this._name = (name || '').trim();
        this._type = type || 'Other';
        this._price = Number(price) || 0;
        this._costPrice = Number(costPrice) || Math.round(this._price * 0.65);
        this._stock = Math.max(0, Number(stock) || 0);
        this._img = img || './assets/img/ShortCut_Icon.png';
        this._description = description || '';
        this._supplierId = Number(supplierId) || 1;
    }

    get name() { return this._name; }
    set name(val) { this._name = (val || '').trim(); this.touch(); }

    get type() { return this._type; }
    set type(val) { this._type = val; this.touch(); }

    get price() { return this._price; }
    set price(val) { this._price = Math.max(0, Number(val) || 0); this.touch(); }

    get costPrice() { return this._costPrice; }
    set costPrice(val) { this._costPrice = Math.max(0, Number(val) || 0); this.touch(); }

    get stock() { return this._stock; }
    set stock(val) { this._stock = Math.max(0, Number(val) || 0); this.touch(); }

    get img() { return this._img; }
    set img(val) { this._img = val || './assets/img/ShortCut_Icon.png'; this.touch(); }

    get description() { return this._description; }
    set description(val) { this._description = val || ''; this.touch(); }

    get supplierId() { return this._supplierId; }
    set supplierId(val) { this._supplierId = Number(val) || 1; this.touch(); }

    isAvailable() {
        return this._stock > 0;
    }

    isLowStock(threshold = 5) {
        return this._stock <= threshold;
    }

    calculateProfitUnit() {
        return Math.max(0, this._price - this._costPrice);
    }

    calculateProfitMargin() {
        if (this._price <= 0) return 0;
        return Number((((this._price - this._costPrice) / this._price) * 100).toFixed(1));
    }

    adjustStock(delta) {
        const change = Number(delta) || 0;
        const newStock = this._stock + change;
        if (newStock < 0) {
            return { success: false, message: 'Ton kho khong the am!' };
        }
        this._stock = newStock;
        this.touch();
        return { success: true, currentStock: this._stock };
    }

    formatPrice() {
        return new Intl.NumberFormat('vi-VN').format(this._price) + ' đ';
    }

    formatCostPrice() {
        return new Intl.NumberFormat('vi-VN').format(this._costPrice) + ' đ';
    }

    toJSON() {
        return {
            ...super.toJSON(),
            name: this._name,
            type: this._type,
            price: this._price,
            costPrice: this._costPrice,
            stock: this._stock,
            img: this._img,
            description: this._description,
            supplierId: this._supplierId
        };
    }
}

/**
 * 6. ORDER ITEM (Chi tiet san pham trong don hang - Quan he Composition voi Order)
 */
class OrderItem {
    constructor(id, name, price, costPrice, quantity = 1, img = '') {
        this._id = Number(id);
        this._name = (name || '').trim();
        this._price = Number(price) || 0;
        this._costPrice = Number(costPrice) || Math.round(this._price * 0.65);
        this._quantity = Math.max(1, Number(quantity) || 1);
        this._img = img || './assets/img/ShortCut_Icon.png';
    }

    get id() { return this._id; }
    get name() { return this._name; }
    get price() { return this._price; }
    get costPrice() { return this._costPrice; }
    get quantity() { return this._quantity; }
    set quantity(val) { this._quantity = Math.max(1, Number(val) || 1); }
    get img() { return this._img; }

    calcSubTotal() {
        return this._price * this._quantity;
    }

    calcCostTotal() {
        return this._costPrice * this._quantity;
    }

    calcProfit() {
        return this.calcSubTotal() - this.calcCostTotal();
    }

    formatSubTotal() {
        return new Intl.NumberFormat('vi-VN').format(this.calcSubTotal()) + ' đ';
    }

    toJSON() {
        return {
            id: this._id,
            name: this._name,
            price: this._price,
            costPrice: this._costPrice,
            quantity: this._quantity,
            img: this._img
        };
    }
}

/**
 * 7. ORDER (Thuc the Don hang - Dong goi Aggregate Root nghiem ngat)
 */
class Order extends BaseEntity {
    constructor(id, code, customerName, customerPhone, customerEmail, shippingAddress, note = '', paymentMethod = 'COD', paymentStatus = 'unpaid', status = 'choxuly', items = [], totalAmount = 0, discountAmount = 0) {
        super(id);
        this._code = code || ('DH' + String(id || 0).padStart(4, '0'));
        this._customerName = (customerName || 'Khach vang lai').trim();
        this._customerPhone = (customerPhone || '').trim();
        this._customerEmail = (customerEmail || '').trim();
        this._shippingAddress = (shippingAddress || 'Mua tai quay').trim();
        this._note = (note || '').trim();
        this._paymentMethod = paymentMethod || 'COD';
        this._paymentStatus = paymentStatus || (paymentMethod === 'SePay' ? 'pending' : 'unpaid');
        this._status = status || (paymentMethod === 'POS' ? 'giaohang' : 'choxuly');
        this._discountAmount = Number(discountAmount) || 0;
        
        // Composition quan ly tap hop OrderItem
        this._items = Array.isArray(items) ? items.map(it => {
            if (it instanceof OrderItem) return it;
            return new OrderItem(it.id, it.name, it.price, it.costPrice, it.quantity, it.img);
        }) : [];

        this._totalAmount = totalAmount ? Number(totalAmount) : this.calcTotal();
    }

    get code() { return this._code; }
    get customerName() { return this._customerName; }
    get customerPhone() { return this._customerPhone; }
    get customerEmail() { return this._customerEmail; }
    get shippingAddress() { return this._shippingAddress; }
    get note() { return this._note; }
    get paymentMethod() { return this._paymentMethod; }
    get paymentStatus() { return this._paymentStatus; }
    get status() { return this._status; }
    get items() { return this._items; }
    get totalAmount() { return this._totalAmount; }
    get discountAmount() { return this._discountAmount; }

    calcSubTotal() {
        return this._items.reduce((sum, it) => sum + it.calcSubTotal(), 0);
    }

    calcTotalCost() {
        return this._items.reduce((sum, it) => sum + it.calcCostTotal(), 0);
    }

    calcTotal() {
        const sub = this.calcSubTotal();
        this._totalAmount = Math.max(0, sub - this._discountAmount);
        return this._totalAmount;
    }

    calcProfit() {
        return Math.max(0, this.calcTotal() - this.calcTotalCost());
    }

    /**
     * RANG BUOC NGHIEP VU PTTKHDT:
     * Don hang da o trang thai 'giaohang' (Done/Hoan tat) hoac 'huy' (Cancelled)
     * se bi KHOA HOAN TOAN khong duoc phep thay doi trang thai nua!
     */
    isLocked() {
        const s = (this._status || '').toLowerCase();
        return s === 'giaohang' || s === 'done' || s === 'huy';
    }

    canTransitionTo(newStatus) {
        const target = (newStatus || '').toLowerCase();
        if (this.isLocked()) {
            return {
                allowed: false,
                reason: 'Don hang da o trang thai HOAN TAT (DONE) hoac DA HUY nen da bi KHOA nghiem ngat!'
            };
        }
        if (target === this._status.toLowerCase()) {
            return {
                allowed: false,
                reason: 'Trang thai moi trung voi trang thai hien tai!'
            };
        }
        return { allowed: true };
    }

    transitionTo(newStatus) {
        const check = this.canTransitionTo(newStatus);
        if (!check.allowed) {
            return { success: false, message: check.reason, isLocked: this.isLocked() };
        }
        const prevStatus = this._status;
        this._status = newStatus.toLowerCase();
        if (this._status === 'giaohang') {
            this._paymentStatus = 'paid';
        }
        this.touch();
        return { 
            success: true, 
            prevStatus: prevStatus, 
            currentStatus: this._status 
        };
    }

    addItem(item) {
        if (this.isLocked()) return false;
        const existing = this._items.find(i => i.id === item.id);
        if (existing) {
            existing.quantity += item.quantity || 1;
        } else {
            this._items.push(item instanceof OrderItem ? item : new OrderItem(item.id, item.name, item.price, item.costPrice, item.quantity, item.img));
        }
        this.calcTotal();
        this.touch();
        return true;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            code: this._code,
            customerName: this._customerName,
            customerPhone: this._customerPhone,
            customerEmail: this._customerEmail,
            shippingAddress: this._shippingAddress,
            note: this._note,
            paymentMethod: this._paymentMethod,
            paymentStatus: this._paymentStatus,
            status: this._status,
            items: this._items.map(it => it.toJSON()),
            totalAmount: this._totalAmount,
            discountAmount: this._discountAmount,
            isLocked: this.isLocked()
        };
    }
}

/**
 * 8. SUPPLIER (Nha cung cap - Ke thua tu BaseEntity)
 */
class Supplier extends BaseEntity {
    constructor(id, name, phone, email, address = '', status = 'active') {
        super(id);
        this._name = (name || '').trim();
        this._phone = (phone || '').trim();
        this._email = (email || '').trim();
        this._address = (address || '').trim();
        this._status = status || 'active';
    }

    get name() { return this._name; }
    set name(val) { this._name = (val || '').trim(); this.touch(); }

    get phone() { return this._phone; }
    set phone(val) { this._phone = (val || '').trim(); this.touch(); }

    get email() { return this._email; }
    set email(val) { this._email = (val || '').trim(); this.touch(); }

    get address() { return this._address; }
    set address(val) { this._address = (val || '').trim(); this.touch(); }

    get status() { return this._status; }
    set status(val) { this._status = val; this.touch(); }

    toJSON() {
        return {
            ...super.toJSON(),
            name: this._name,
            phone: this._phone,
            email: this._email,
            address: this._address,
            status: this._status
        };
    }
}

/**
 * 9. WEBSITE CONFIG (Cau hinh nhan dien thuong hieu Website)
 */
class WebsiteConfig {
    constructor(data = {}) {
        this.shopName = data.shopName || 'GEARS Keycap Shop';
        this.brandTagline = data.brandTagline || 'The World of Premium Custom Keycaps';
        this.description = data.description || 'Chuyen cung cap Keycap cao cap, Keycap Anime, Keycap Artisan thu cong doc quyen.';
        this.logoUrl = data.logoUrl || './assets/img/ShortCut_Icon.png';
        this.hotline = data.hotline || '1800 6975 - 0987 654 321';
        this.email = data.email || 'cskh@gearskeycap.vn';
        this.address = data.address || '273 An Duong Vuong, Phuong 3, Quan 5, TP. Ho Chi Minh (DHD Sai Gon)';
        this.workingHours = data.workingHours || '08:00 - 22:00 tat ca cac ngay trong tuan';
        this.topBannerText = data.topBannerText || 'GIAM 10% CHO DON HANG ARTISAN DAU TIEN • MIEN PHI VAN CHUYEN TOAN QUOC DON TU 500K';
        this.facebookUrl = data.facebookUrl || 'https://facebook.com';
        this.instagramUrl = data.instagramUrl || 'https://instagram.com';
    }

    applyToDOM() {
        if (typeof document === 'undefined') return;
        // Cap nhat Tieu de Website
        document.title = `${this.shopName} - ${this.brandTagline}`;
        // Cap nhat Logo tren tat ca anh co class .brand-logo
        document.querySelectorAll('.brand-logo, .shop-logo, .sidebar-logo img').forEach(img => {
            img.src = this.logoUrl;
        });
        // Cap nhat Hotline
        document.querySelectorAll('.shop-hotline, #footer-hotline').forEach(el => {
            el.textContent = this.hotline;
        });
    }
}

// ============================================================================
// DESIGN PATTERNS IMPLEMENTATION (CAC MAU THIET KE HUONG DOI TUONG)
// ============================================================================

/**
 * STRATEGY PATTERN: XU LY THANH TOAN DA DANG
 * Lop Strategy truu tuong
 */
class PaymentStrategy {
    pay(order, context = {}) {
        throw new Error('Phuong thuc truu tuong pay() phai duoc lop con thuc thi!');
    }

    getStrategyName() {
        return 'Chua xac dinh';
    }
}

/**
 * Chien luoc thanh toan VietQR SePay tu dong
 */
class VietQRPaymentStrategy extends PaymentStrategy {
    constructor(bank = 'MBBank', acc = '0987654321', name = 'GEARS KEYCAP SHOP') {
        super();
        this._bank = bank;
        this._acc = acc;
        this._name = name;
    }

    getStrategyName() {
        return 'Thanh toan VietQR SePay Tu Dong';
    }

    generateQrUrl(amount, orderCode) {
        const amt = Math.round(Number(amount) || 0);
        const desc = encodeURIComponent(orderCode || 'GEARS ORDER');
        return `https://qr.sepay.vn/img?bank=${encodeURIComponent(this._bank)}&acc=${encodeURIComponent(this._acc)}&template=compact&amount=${amt}&des=${desc}`;
    }

    pay(order, context = {}) {
        const qrUrl = this.generateQrUrl(order.totalAmount, order.code);
        return {
            success: true,
            strategy: this.getStrategyName(),
            method: 'SePay',
            paymentStatus: 'pending',
            qrUrl: qrUrl,
            bankAccount: this._acc,
            bankName: this._bank,
            accountName: this._name,
            transferSyntax: order.code,
            message: 'Vui long quet ma VietQR bang ung dung Ngan hang hoac Vi dien tu de hoan tat giao dich.'
        };
    }
}

/**
 * Chien luoc thanh toan Tien mat (Cash / COD / Tai quay POS)
 */
class CashPaymentStrategy extends PaymentStrategy {
    getStrategyName() {
        return 'Thanh toan Tien mat (Cash / COD)';
    }

    pay(order, context = {}) {
        const cashGiven = Number(context.cashGiven) || order.totalAmount;
        const changeDue = Math.max(0, cashGiven - order.totalAmount);
        
        if (cashGiven < order.totalAmount) {
            return {
                success: false,
                strategy: this.getStrategyName(),
                message: `Tien khach dua chua du! Thieu ${new Intl.NumberFormat('vi-VN').format(order.totalAmount - cashGiven)} đ`
            };
        }

        return {
            success: true,
            strategy: this.getStrategyName(),
            method: context.channel === 'POS' ? 'POS' : 'COD',
            paymentStatus: context.channel === 'POS' ? 'paid' : 'unpaid',
            cashGiven: cashGiven,
            changeDue: changeDue,
            message: 'Thanh toan tien mat thanh cong!'
        };
    }
}

/**
 * Chien luoc thanh toan The tin dung / POS Card Terminal
 */
class CardPaymentStrategy extends PaymentStrategy {
    getStrategyName() {
        return 'Thanh toan The Pos Terminal (Visa / Master)';
    }

    pay(order, context = {}) {
        const traceId = 'POS' + Math.floor(100000 + Math.random() * 900000);
        return {
            success: true,
            strategy: this.getStrategyName(),
            method: 'Card',
            paymentStatus: 'paid',
            traceId: traceId,
            message: `Giao dich the thanh cong. Ma tham chieu: ${traceId}`
        };
    }
}

/**
 * FACTORY PATTERN: ENTITY FACTORY
 * Dong goi qua trinh khoi tao cac doi tuong thuc the voi kiem tra du lieu nghiem ngat
 */
class EntityFactory {
    static createProduct(data = {}) {
        return new Product(
            data.id,
            data.name,
            data.type,
            data.price,
            data.costPrice,
            data.stock,
            data.img,
            data.description,
            data.supplierId
        );
    }

    static createOrderItem(data = {}) {
        return new OrderItem(
            data.id,
            data.name,
            data.price,
            data.costPrice,
            data.quantity,
            data.img
        );
    }

    static createOrder(data = {}) {
        return new Order(
            data.id,
            data.code,
            data.customerName,
            data.customerPhone,
            data.customerEmail,
            data.shippingAddress,
            data.note,
            data.paymentMethod,
            data.paymentStatus,
            data.status,
            data.items,
            data.totalAmount,
            data.discountAmount
        );
    }

    static createCustomer(data = {}) {
        return new Customer(
            data.id,
            data.name,
            data.phone,
            data.email,
            data.address,
            data.rewardPoints,
            data.isLocked
        );
    }

    static createEmployee(data = {}) {
        return new Employee(
            data.id,
            data.name,
            data.username,
            data.phone,
            data.email,
            data.role,
            data.position,
            data.status
        );
    }

    static createSupplier(data = {}) {
        return new Supplier(
            data.id,
            data.name,
            data.phone,
            data.email,
            data.address,
            data.status
        );
    }

    static createPaymentStrategy(method = 'COD') {
        const m = (method || '').toUpperCase();
        switch (m) {
            case 'SEPAY':
            case 'VIETQR':
            case 'QR':
                return new VietQRPaymentStrategy();
            case 'CARD':
            case 'VISA':
            case 'MASTER':
                return new CardPaymentStrategy();
            case 'CASH':
            case 'POS':
            case 'COD':
            default:
                return new CashPaymentStrategy();
        }
    }
}


// ----------------------------------------------------------------------------
// 1. STORAGE SERVICE (SINGLETON)
// ----------------------------------------------------------------------------
class StorageService {
    constructor() {
        if (StorageService.instance) return StorageService.instance;
        this._subscribers = {};
        StorageService.instance = this;
    }

    static get Models() {
        return { BaseEntity, User, Customer, Employee, Product, OrderItem, Order, Supplier, WebsiteConfig };
    }

    static get Patterns() {
        return { EntityFactory, PaymentStrategy, VietQRPaymentStrategy, CashPaymentStrategy, CardPaymentStrategy };
    }

    static getInstance() {
        if (!StorageService.instance) StorageService.instance = new StorageService();
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
        if (!this._subscribers[key]) this._subscribers[key] = [];
        this._subscribers[key].push(callback);
    }

    _notifySubscribers(key, data) {
        if (this._subscribers[key]) {
            this._subscribers[key].forEach(cb => {
                try { cb(data); } catch (e) { console.error('Storage subscriber error:', e); }
            });
        }
    }
}

// ----------------------------------------------------------------------------
// 2. AUTH SERVICE (SINGLETON)
// ----------------------------------------------------------------------------
class AuthService {
    constructor(storage) {
        if (AuthService.instance) return AuthService.instance;
        this._storage = storage || StorageService.getInstance();
        AuthService.instance = this;
    }

    static getInstance(storage) {
        if (!AuthService.instance) AuthService.instance = new AuthService(storage);
        return AuthService.instance;
    }

    validatePasswordSecurity(password) {
        if (!password || typeof password !== 'string') {
            return { valid: false, message: 'Mật khẩu không được để trống!' };
        }
        if (password.length < 8) {
            return { valid: false, message: 'Mật khẩu phải có tối thiểu 8 ký tự để đảm bảo an toàn!' };
        }
        const hasUpperCase = /[A-Z]/.test(password);
        if (!hasUpperCase) {
            return { valid: false, message: 'Mật khẩu phải chứa ít nhất 1 chữ cái VIẾT HOA (A-Z)!' };
        }
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        if (!hasSpecialChar) {
            return { valid: false, message: 'Mật khẩu phải chứa ít nhất 1 ký tự ĐẶC BIỆT (!@#$%^&*...)!' };
        }
        return { valid: true, message: 'Mật khẩu đạt tiêu chuẩn an toàn cao!' };
    }

    loginAdmin(username, password) {
        const passCheck = this.validatePasswordSecurity(password);
        if (!passCheck.valid) return { success: false, message: passCheck.message };

        const employees = this._storage.get('employees', []);
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

        this._storage.set('currentAdminUser', sessionUser);
        return { success: true, user: sessionUser };
    }

    loginCustomer(username, password) {
        const users = this._storage.get('user', []);
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

        this._storage.set('currentUser', customerSession);
        return { success: true, user: customerSession };
    }

    registerCustomer(userData) {
        const passCheck = this.validatePasswordSecurity(userData.password);
        if (!passCheck.valid) return { success: false, message: passCheck.message };

        const users = this._storage.get('user', []);
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
        this._storage.set('user', users);
        return { success: true, user: newUser };
    }

    getCurrentAdminUser() {
        let user = this._storage.get('currentAdminUser', null) || this._storage.get('clientLoggedInUser', null);
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
        return this._storage.get('currentUser', null);
    }

    logoutAdmin() {
        this._storage.remove('currentAdminUser');
        if (typeof window !== 'undefined') window.location.href = 'login.html';
    }

    logoutCustomer() {
        this._storage.remove('currentUser');
        if (typeof window !== 'undefined') window.location.reload();
    }

    checkAuth(requiredRole = 'admin') {
        const currentUser = this.getCurrentAdminUser();
        if (!currentUser) {
            if (typeof window !== 'undefined') window.location.href = 'login.html';
            return false;
        }
        const isAdmin = currentUser.role === 'admin' || currentUser.userType === 'admin';
        if (requiredRole === 'admin' && !isAdmin) {
            alert('Bạn không có quyền truy cập chức năng này! Chuyển về POS.');
            if (typeof window !== 'undefined') window.location.href = 'pos.html';
            return false;
        }
        return true;
    }
}

// ----------------------------------------------------------------------------
// 3. PRODUCT SERVICE (SINGLETON)
// ----------------------------------------------------------------------------
class ProductService {
    constructor(storage) {
        if (ProductService.instance) return ProductService.instance;
        this._storage = storage || StorageService.getInstance();
        ProductService.instance = this;
    }

    static getInstance(storage) {
        if (!ProductService.instance) ProductService.instance = new ProductService(storage);
        return ProductService.instance;
    }

    getAll() {
        return this._storage.get('product', []);
    }

    getAllAsEntities() {
        return this.getAll().map(p => EntityFactory.createProduct(p));
    }

    getByIdAsEntity(id) {
        const p = this.getById(id);
        return p ? EntityFactory.createProduct(p) : null;
    }

    getById(id) {
        const products = this.getAll();
        return products.find(p => String(p.id) === String(id)) || null;
    }

    filterByCategory(category) {
        const products = this.getAll();
        if (!category || category === 'all' || category === 'ALL') return products;
        return products.filter(p => (p.type || '').toLowerCase() === category.toLowerCase());
    }

    search(keyword, category = null) {
        let products = this.getAll();
        if (category && category !== 'all' && category !== 'ALL') {
            products = products.filter(p => (p.type || '').toLowerCase() === category.toLowerCase());
        }
        if (!keyword || !keyword.trim()) return products;
        const q = keyword.toLowerCase().trim();
        return products.filter(p => 
            (p.name && p.name.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q)) ||
            (String(p.id).includes(q))
        );
    }

    add(productData) {
        const products = this.getAll();
        const maxId = products.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0);
        const newProduct = {
            id: maxId + 1,
            name: productData.name.trim(),
            type: productData.type || 'Other',
            price: Number(productData.price) || 0,
            costPrice: Number(productData.costPrice) || Math.round((Number(productData.price) || 0) * 0.65),
            stock: Number(productData.stock) || 0,
            img: productData.img || './assets/img/ShortCut_Icon.png',
            description: productData.description || '',
            supplierId: productData.supplierId || 1
        };

        products.push(newProduct);
        this._storage.set('product', products);
        return newProduct;
    }

    update(id, productData) {
        const products = this.getAll();
        const index = products.findIndex(p => String(p.id) === String(id));
        if (index === -1) return null;

        products[index] = {
            ...products[index],
            name: productData.name !== undefined ? productData.name.trim() : products[index].name,
            type: productData.type !== undefined ? productData.type : products[index].type,
            price: productData.price !== undefined ? Number(productData.price) : products[index].price,
            costPrice: productData.costPrice !== undefined ? Number(productData.costPrice) : products[index].costPrice,
            stock: productData.stock !== undefined ? Number(productData.stock) : products[index].stock,
            img: productData.img !== undefined ? productData.img : products[index].img,
            description: productData.description !== undefined ? productData.description : products[index].description,
            supplierId: productData.supplierId !== undefined ? productData.supplierId : products[index].supplierId
        };

        this._storage.set('product', products);
        return products[index];
    }

    delete(id) {
        const products = this.getAll();
        const filtered = products.filter(p => String(p.id) !== String(id));
        if (filtered.length !== products.length) {
            this._storage.set('product', filtered);
            return true;
        }
        return false;
    }

    adjustStock(id, delta) {
        const products = this.getAll();
        const product = products.find(p => String(p.id) === String(id));
        if (!product) return null;

        product.stock = Math.max(0, (product.stock || 0) + delta);
        this._storage.set('product', products);
        return product;
    }

    resolveImgPath(imgSrc, context = 'admin') {
        if (!imgSrc || typeof imgSrc !== 'string') {
            return context === 'admin' ? '../img/ShortCut_Icon.png' : './assets/img/ShortCut_Icon.png';
        }
        const trimmed = imgSrc.trim();
        if (trimmed.startsWith('data:image/') || trimmed.startsWith('blob:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
            return trimmed;
        }

        if (context === 'admin') {
            if (trimmed.startsWith('./assets/img/')) return trimmed.replace('./assets/img/', '../img/');
            if (trimmed.startsWith('assets/img/')) return trimmed.replace('assets/img/', '../img/');
            if (trimmed.startsWith('/assets/img/')) return trimmed.replace('/assets/img/', '../img/');
            if (trimmed.startsWith('./img/')) return trimmed.replace('./img/', '../img/');
            if (!trimmed.startsWith('../img/') && !trimmed.startsWith('./') && !trimmed.startsWith('../')) {
                return '../img/' + trimmed;
            }
            return trimmed;
        } else {
            if (trimmed.startsWith('../img/')) return trimmed.replace('../img/', './assets/img/');
            if (trimmed.startsWith('/assets/img/')) return '.' + trimmed;
            if (!trimmed.startsWith('./') && !trimmed.startsWith('../') && !trimmed.startsWith('assets/')) {
                return './assets/img/' + trimmed;
            }
            return trimmed;
        }
    }
}

// ----------------------------------------------------------------------------
// 4. CART SERVICE (SINGLETON)
// ----------------------------------------------------------------------------
class CartService {
    constructor(storage, productService) {
        if (CartService.instance) return CartService.instance;
        this._storage = storage || StorageService.getInstance();
        this._productService = productService || ProductService.getInstance();
        this._cartKey = 'cart';
        this._discountPercent = 0;
        CartService.instance = this;
    }

    static getInstance(storage, productService) {
        if (!CartService.instance) CartService.instance = new CartService(storage, productService);
        return CartService.instance;
    }

    getCart() {
        return this._storage.get(this._cartKey, []);
    }

    saveCart(cartItems) {
        return this._storage.set(this._cartKey, cartItems);
    }

    addItem(productId, quantity = 1) {
        const product = this._productService.getById(productId);
        if (!product) return { success: false, message: 'Không tìm thấy sản phẩm!' };

        const qtyToAdd = Math.max(1, Number(quantity) || 1);
        const cart = this.getCart();
        const existingIndex = cart.findIndex(item => String(item.id) === String(productId));

        if (existingIndex !== -1) {
            cart[existingIndex].quantity += qtyToAdd;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                costPrice: product.costPrice || Math.round(product.price * 0.65),
                img: product.img,
                type: product.type,
                quantity: qtyToAdd
            });
        }

        this.saveCart(cart);
        return { success: true, cart: cart, addedItem: product, totalCount: this.getTotalCount() };
    }

    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(i => String(i.id) === String(productId));
        if (!item) return false;

        const newQty = Number(quantity);
        if (newQty <= 0) {
            return this.removeItem(productId);
        } else {
            item.quantity = newQty;
            this.saveCart(cart);
            return true;
        }
    }

    removeItem(productId) {
        let cart = this.getCart();
        const initialLen = cart.length;
        cart = cart.filter(i => String(i.id) !== String(productId));
        if (cart.length !== initialLen) {
            this.saveCart(cart);
            return true;
        }
        return false;
    }

    clear() {
        this.saveCart([]);
        this._discountPercent = 0;
        return true;
    }

    getTotalCount() {
        const cart = this.getCart();
        return cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    }

    getSubtotal() {
        const cart = this.getCart();
        return cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
    }

    setDiscountPercent(percent) {
        this._discountPercent = Math.min(100, Math.max(0, Number(percent) || 0));
    }

    getDiscountAmount() {
        const subtotal = this.getSubtotal();
        return Math.round(subtotal * (this._discountPercent / 100));
    }

    getTotalAmount() {
        return Math.max(0, this.getSubtotal() - this.getDiscountAmount());
    }
}

// ----------------------------------------------------------------------------
// 5. ORDER SERVICE (SINGLETON)
// ----------------------------------------------------------------------------
class OrderService {
    constructor(storage) {
        if (OrderService.instance) return OrderService.instance;
        this._storage = storage || StorageService.getInstance();
        this._sePayBank = 'MBBank';
        this._sePayAcc = '0987654321';
        this._sePayName = 'GEARS KEYCAP SHOP';
        OrderService.instance = this;
    }

    static getInstance(storage) {
        if (!OrderService.instance) OrderService.instance = new OrderService(storage);
        return OrderService.instance;
    }

    getAll() {
        return this._storage.get('orders', []);
    }

    getAllAsEntities() {
        return this.getAll().map(o => EntityFactory.createOrder(o));
    }

    getByIdAsEntity(id) {
        const o = this.getById(id);
        return o ? EntityFactory.createOrder(o) : null;
    }

    getById(id) {
        const orders = this.getAll();
        return orders.find(o => String(o.id) === String(id) || String(o.code) === String(id)) || null;
    }

    createOrder(orderData) {
        const orders = this.getAll();
        const nextId = orders.length > 0 ? Math.max(...orders.map(o => Number(o.id) || 0)) + 1 : 1;
        const orderCode = 'DH' + String(nextId).padStart(4, '0');

        const newOrder = {
            id: nextId,
            code: orderCode,
            customerName: (orderData.customerName || 'Khách vãng lai').trim(),
            customerPhone: (orderData.customerPhone || '').trim(),
            customerEmail: (orderData.customerEmail || '').trim(),
            shippingAddress: (orderData.shippingAddress || 'Mua tại quầy').trim(),
            note: (orderData.note || '').trim(),
            paymentMethod: orderData.paymentMethod || 'COD',
            paymentStatus: orderData.paymentStatus || (orderData.paymentMethod === 'SePay' ? 'pending' : 'unpaid'),
            status: orderData.status || (orderData.paymentMethod === 'POS' ? 'giaohang' : 'choxuly'),
            items: (orderData.items || []).map(item => ({
                id: item.id,
                name: item.name,
                price: Number(item.price) || 0,
                costPrice: Number(item.costPrice) || Math.round((Number(item.price) || 0) * 0.65),
                quantity: Number(item.quantity) || 1,
                img: item.img || './assets/img/ShortCut_Icon.png'
            })),
            totalAmount: Number(orderData.totalAmount) || 0,
            discountAmount: Number(orderData.discountAmount) || 0,
            createdAt: new Date().toISOString()
        };

        orders.unshift(newOrder);
        this._storage.set('orders', orders);
        return newOrder;
    }

    updateStatus(orderId, newStatus) {
        const orders = this.getAll();
        const order = orders.find(o => String(o.id) === String(orderId) || String(o.code) === String(orderId));

        if (!order) {
            return { success: false, message: 'Không tìm thấy đơn hàng trong hệ thống!' };
        }

        const currentStatus = (order.status || '').toLowerCase();
        const targetStatus = (newStatus || '').toLowerCase();

        // RÀNG BUỘC NGHIỆP VỤ: ĐƠN ĐÃ HOÀN TẤT HOẶC HỦY THÌ KHÔNG ĐƯỢC ĐỔI
        if (currentStatus === 'giaohang' || currentStatus === 'done' || currentStatus === 'huy') {
            return {
                success: false,
                isLocked: true,
                message: 'LỖI NGHIỆP VỤ: Đơn hàng đã ở trạng thái HOÀN TẤT (DONE) hoặc ĐÃ HỦY nên KHÔNG ĐƯỢC PHÉP CẬP NHẬT TRẠNG THÁI NỮA!'
            };
        }

        order.status = targetStatus;
        if (targetStatus === 'giaohang') {
            order.paymentStatus = 'paid';
        }
        order.updatedAt = new Date().toISOString();

        this._storage.set('orders', orders);
        return {
            success: true,
            isLocked: false,
            message: `Cập nhật đơn hàng #${order.code || order.id} sang trạng thái "${targetStatus}" thành công!`,
            order: order
        };
    }

    generateSePayVietQR(order) {
        const amount = Number(order.totalAmount) || 0;
        const memo = order.code || `DH${order.id}`;
        const accountName = encodeURIComponent(this._sePayName);
        return `https://img.vietqr.io/image/MB-${this._sePayAcc}-compact2.png?amount=${amount}&addInfo=${memo}&accountName=${accountName}`;
    }

    simulateSePayWebhook(orderId) {
        const orders = this.getAll();
        const order = orders.find(o => String(o.id) === String(orderId) || String(o.code) === String(orderId));

        if (!order) return { success: false, message: 'Không tìm thấy đơn hàng!' };

        order.paymentStatus = 'paid';
        order.status = 'giaohang';
        order.paidAt = new Date().toISOString();

        this._storage.set('orders', orders);
        return {
            success: true,
            message: `SePay Webhook xác nhận đã nhận thanh toán thành công cho đơn #${order.code || order.id}!`,
            order: order
        };
    }
}

// ----------------------------------------------------------------------------
// 6. CUSTOMER SERVICE (SINGLETON)
// ----------------------------------------------------------------------------
class CustomerService {
    constructor(storage) {
        if (CustomerService.instance) return CustomerService.instance;
        this._storage = storage || StorageService.getInstance();
        CustomerService.instance = this;
    }

    static getInstance(storage) {
        if (!CustomerService.instance) CustomerService.instance = new CustomerService(storage);
        return CustomerService.instance;
    }

    getAll() {
        return this._storage.get('user', []);
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
        this._storage.set('user', users);
        return user;
    }

    update(userId, updateData) {
        const users = this.getAll();
        const index = users.findIndex(u => String(u.id) === String(userId) || u.username === userId);
        if (index === -1) return null;
        users[index] = { ...users[index], ...updateData };
        this._storage.set('user', users);
        return users[index];
    }

    delete(userId) {
        const users = this.getAll();
        const filtered = users.filter(u => String(u.id) !== String(userId) && u.username !== userId);
        if (filtered.length !== users.length) {
            this._storage.set('user', filtered);
            return true;
        }
        return false;
    }
}

// ----------------------------------------------------------------------------
// 7. SUPPLIER SERVICE (SINGLETON)
// ----------------------------------------------------------------------------
class SupplierService {
    constructor(storage) {
        if (SupplierService.instance) return SupplierService.instance;
        this._storage = storage || StorageService.getInstance();
        SupplierService.instance = this;
    }

    static getInstance(storage) {
        if (!SupplierService.instance) SupplierService.instance = new SupplierService(storage);
        return SupplierService.instance;
    }

    getAll() {
        return this._storage.get('suppliers', []);
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
        this._storage.set('suppliers', list);
        return newSupplier;
    }

    update(id, data) {
        const list = this.getAll();
        const index = list.findIndex(s => String(s.id) === String(id));
        if (index === -1) return null;
        list[index] = { ...list[index], ...data };
        this._storage.set('suppliers', list);
        return list[index];
    }

    delete(id) {
        const list = this.getAll();
        const filtered = list.filter(s => String(s.id) !== String(id));
        if (filtered.length !== list.length) {
            this._storage.set('suppliers', filtered);
            return true;
        }
        return false;
    }
}

// ----------------------------------------------------------------------------
// 8. EMPLOYEE SERVICE (SINGLETON)
// ----------------------------------------------------------------------------
class EmployeeService {
    constructor(storage, authService) {
        if (EmployeeService.instance) return EmployeeService.instance;
        this._storage = storage || StorageService.getInstance();
        this._authService = authService || AuthService.getInstance();
        EmployeeService.instance = this;
    }

    static getInstance(storage, authService) {
        if (!EmployeeService.instance) EmployeeService.instance = new EmployeeService(storage, authService);
        return EmployeeService.instance;
    }

    getAll() {
        return this._storage.get('employees', []);
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
        if (data.password) {
            const passCheck = this._authService.validatePasswordSecurity(data.password);
            if (!passCheck.valid) return { success: false, message: passCheck.message };
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
        this._storage.set('employees', list);
        return { success: true, employee: newEmp };
    }

    update(id, data) {
        const list = this.getAll();
        const index = list.findIndex(e => String(e.id) === String(id));
        if (index === -1) return { success: false, message: 'Không tìm thấy nhân viên!' };

        if (data.password) {
            const passCheck = this._authService.validatePasswordSecurity(data.password);
            if (!passCheck.valid) return { success: false, message: passCheck.message };
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

        this._storage.set('employees', list);
        return { success: true, employee: list[index] };
    }

    updateRole(id, newRole, newStatus) {
        const list = this.getAll();
        const index = list.findIndex(e => String(e.id) === String(id));
        if (index === -1) return null;

        list[index].role = newRole;
        list[index].roleName = newRole === 'admin' ? 'Quản trị viên / Quản lý' : 'Nhân viên POS / Thu ngân';
        if (newStatus) list[index].status = newStatus;

        this._storage.set('employees', list);
        return list[index];
    }

    delete(id) {
        const list = this.getAll();
        const filtered = list.filter(e => String(e.id) !== String(id));
        if (filtered.length !== list.length) {
            this._storage.set('employees', filtered);
            return true;
        }
        return false;
    }
}

// ----------------------------------------------------------------------------
// 9. REPORT SERVICE (SINGLETON)
// ----------------------------------------------------------------------------
class ReportService {
    constructor(storage, orderService) {
        if (ReportService.instance) return ReportService.instance;
        this._storage = storage || StorageService.getInstance();
        this._orderService = orderService || OrderService.getInstance();
        ReportService.instance = this;
    }

    static getInstance(storage, orderService) {
        if (!ReportService.instance) ReportService.instance = new ReportService(storage, orderService);
        return ReportService.instance;
    }

    getFinancialSummary() {
        const orders = this._orderService.getAll();
        const validOrders = orders.filter(o => o.status === 'giaohang' || o.paymentStatus === 'paid');

        let totalRevenue = 0;
        let totalCost = 0;

        validOrders.forEach(order => {
            const revenue = Number(order.totalAmount) || 0;
            totalRevenue += revenue;

            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    const costPrice = Number(item.costPrice) || Math.round((Number(item.price) || 0) * 0.65);
                    const qty = Number(item.quantity) || 1;
                    totalCost += costPrice * qty;
                });
            } else {
                totalCost += Math.round(revenue * 0.65);
            }
        });

        const grossProfit = Math.max(0, totalRevenue - totalCost);
        const marginPercent = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0;

        return {
            totalOrders: validOrders.length,
            allOrdersCount: orders.length,
            totalRevenue: totalRevenue,
            totalCost: totalCost,
            grossProfit: grossProfit,
            marginPercent: Number(marginPercent)
        };
    }

    getTopSellingProducts(limit = 5) {
        const orders = this._orderService.getAll();
        const salesMap = {};

        orders.forEach(order => {
            if (order.status !== 'huy' && order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    const pid = String(item.id);
                    if (!salesMap[pid]) {
                        salesMap[pid] = {
                            id: item.id,
                            name: item.name,
                            price: Number(item.price) || 0,
                            img: item.img || './assets/img/ShortCut_Icon.png',
                            quantitySold: 0,
                            revenue: 0
                        };
                    }
                    const q = Number(item.quantity) || 1;
                    salesMap[pid].quantitySold += q;
                    salesMap[pid].revenue += (Number(item.price) || 0) * q;
                });
            }
        });

        return Object.values(salesMap)
            .sort((a, b) => b.quantitySold - a.quantitySold)
            .slice(0, limit);
    }

    getCategoryDistribution() {
        const products = this._storage.get('product', []);
        const dist = { Artisan: 0, Anime: 0, Pudding: 0, Cherry: 0, Other: 0 };
        products.forEach(p => {
            const cat = p.type || 'Other';
            if (dist[cat] !== undefined) dist[cat]++;
            else dist['Other']++;
        });
        return dist;
    }
}

// ----------------------------------------------------------------------------
// 10. CONFIG SERVICE (SINGLETON)
// ----------------------------------------------------------------------------
class ConfigService {
    constructor(storage) {
        if (ConfigService.instance) return ConfigService.instance;
        this._storage = storage || StorageService.getInstance();
        this._configKey = 'website_config';
        ConfigService.instance = this;
    }

    static getInstance(storage) {
        if (!ConfigService.instance) ConfigService.instance = new ConfigService(storage);
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
        const stored = this._storage.get(this._configKey, null);
        if (!stored) {
            const defaults = this.getDefaultConfig();
            this._storage.set(this._configKey, defaults);
            return defaults;
        }
        return { ...this.getDefaultConfig(), ...stored };
    }

    saveConfig(newConfig) {
        const current = this.getConfig();
        const merged = { ...current, ...newConfig, updatedAt: new Date().toISOString() };
        this._storage.set(this._configKey, merged);
        return merged;
    }

    resetDefaults() {
        const defaults = this.getDefaultConfig();
        this._storage.set(this._configKey, defaults);
        return defaults;
    }
}

// ----------------------------------------------------------------------------
// 11. NOTIFICATION SERVICE (SINGLETON)
// ----------------------------------------------------------------------------
class NotificationService {
    constructor() {
        if (NotificationService.instance) return NotificationService.instance;
        this._containerId = 'gears-toast-container';
        NotificationService.instance = this;
    }

    static getInstance() {
        if (!NotificationService.instance) NotificationService.instance = new NotificationService();
        return NotificationService.instance;
    }

    show(message, type = 'info', duration = 3000) {
        if (typeof document === 'undefined') {
            console.log(`[Toast:${type}] ${message}`);
            return;
        }

        let container = document.getElementById(this._containerId);
        if (!container) {
            container = document.createElement('div');
            container.id = this._containerId;
            container.style.cssText = 'position:fixed;top:24px;right:24px;z-index:999999;display:flex;flex-direction:column;gap:10px;pointer-events:none;max-width:380px;';
            document.body.appendChild(container);
        }

        const colors = {
            success: { bg: '#10b981', icon: 'fa-check-circle', border: 'rgba(16, 185, 129, 0.4)' },
            error: { bg: '#ef4444', icon: 'fa-exclamation-circle', border: 'rgba(239, 68, 68, 0.4)' },
            warning: { bg: '#f59e0b', icon: 'fa-exclamation-triangle', border: 'rgba(245, 158, 11, 0.4)' },
            info: { bg: '#3b82f6', icon: 'fa-info-circle', border: 'rgba(59, 130, 246, 0.4)' }
        };
        const theme = colors[type] || colors.info;

        const toast = document.createElement('div');
        toast.className = `gears-toast toast-${type}`;
        toast.style.cssText = `background:#151822;color:#ffffff;border-left:4px solid ${theme.bg};border-top:1px solid ${theme.border};border-right:1px solid ${theme.border};border-bottom:1px solid ${theme.border};padding:14px 18px;border-radius:8px;box-shadow:0 10px 25px rgba(0,0,0,0.4);font-size:13.5px;font-weight:600;display:flex;align-items:center;gap:12px;pointer-events:auto;transform:translateX(100%);opacity:0;transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1);backdrop-filter:blur(8px);`;
        toast.innerHTML = `<i class="fas ${theme.icon}" style="color:${theme.bg};font-size:16px;"></i><span style="flex:1;line-height:1.4;">${message}</span><span style="cursor:pointer;opacity:0.6;font-size:14px;" onclick="this.parentElement.remove()">&times;</span>`;

        container.appendChild(toast);

        setTimeout(() => { toast.style.transform = 'translateX(0)'; toast.style.opacity = '1'; }, 10);
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            toast.style.opacity = '0';
            setTimeout(() => { if (toast.parentElement) toast.parentElement.removeChild(toast); }, 300);
        }, duration);
    }

    success(msg) { this.show(msg, 'success'); }
    error(msg) { this.show(msg, 'error'); }
    info(msg) { this.show(msg, 'info'); }
    warning(msg) { this.show(msg, 'warning'); }
}

// ----------------------------------------------------------------------------
// 12. CENTRAL GEARS APP CONTAINER (FACADE PATTERN)
// ----------------------------------------------------------------------------
class GearsApp {
    constructor() {
        this.storage = StorageService.getInstance();
        this.auth = AuthService.getInstance(this.storage);
        this.product = ProductService.getInstance(this.storage);
        this.cart = CartService.getInstance(this.storage, this.product);
        this.order = OrderService.getInstance(this.storage);
        this.customer = CustomerService.getInstance(this.storage);
        this.supplier = SupplierService.getInstance(this.storage);
        this.employee = EmployeeService.getInstance(this.storage, this.auth);
        this.report = ReportService.getInstance(this.storage, this.order);
        this.config = ConfigService.getInstance(this.storage);
        this.notify = NotificationService.getInstance();
        this.models = { BaseEntity, User, Customer, Employee, Product, OrderItem, Order, Supplier, WebsiteConfig };
        this.patterns = { EntityFactory, PaymentStrategy, VietQRPaymentStrategy, CashPaymentStrategy, CardPaymentStrategy };
    }

    static getInstance() {
        if (!GearsApp.instance) GearsApp.instance = new GearsApp();
        return GearsApp.instance;
    }

    static formatCurrency(amount) {
        if (amount === undefined || amount === null || isNaN(amount)) return '0 đ';
        return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
    }

    static escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}

// Khoi tao Global Singleton instance
const gearsApp = GearsApp.getInstance();

// Xuat ra moi truong trinh duyet & Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GearsApp,
        StorageService,
        AuthService,
        ProductService,
        CartService,
        OrderService,
        CustomerService,
        SupplierService,
        EmployeeService,
        ReportService,
        ConfigService,
        NotificationService,
        BaseEntity,
        User,
        Customer,
        Employee,
        Product,
        OrderItem,
        Order,
        Supplier,
        WebsiteConfig,
        EntityFactory,
        PaymentStrategy,
        VietQRPaymentStrategy,
        CashPaymentStrategy,
        CardPaymentStrategy,
        gearsApp
    };
}
if (typeof window !== 'undefined') {
    window.StorageService = StorageService;
    window.AuthService = AuthService;
    window.ProductService = ProductService;
    window.CartService = CartService;
    window.OrderService = OrderService;
    window.CustomerService = CustomerService;
    window.SupplierService = SupplierService;
    window.EmployeeService = EmployeeService;
    window.ReportService = ReportService;
    window.ConfigService = ConfigService;
    window.NotificationService = NotificationService;
    window.BaseEntity = BaseEntity;
    window.User = User;
    window.Customer = Customer;
    window.Employee = Employee;
    window.Product = Product;
    window.OrderItem = OrderItem;
    window.Order = Order;
    window.Supplier = Supplier;
    window.WebsiteConfig = WebsiteConfig;
    window.EntityFactory = EntityFactory;
    window.PaymentStrategy = PaymentStrategy;
    window.VietQRPaymentStrategy = VietQRPaymentStrategy;
    window.CashPaymentStrategy = CashPaymentStrategy;
    window.CardPaymentStrategy = CardPaymentStrategy;
    window.GearsApp = gearsApp;
    window.GearsClass = GearsApp;
}
