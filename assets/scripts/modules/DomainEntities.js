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

// Xuat bien toan cuc va module Node.js
if (typeof window !== 'undefined') {
    window.GearsDomain = {
        BaseEntity,
        User,
        Customer,
        Employee,
        Product,
        OrderItem,
        Order,
        Supplier,
        WebsiteConfig,
        PaymentStrategy,
        VietQRPaymentStrategy,
        CashPaymentStrategy,
        CardPaymentStrategy,
        EntityFactory
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BaseEntity,
        User,
        Customer,
        Employee,
        Product,
        OrderItem,
        Order,
        Supplier,
        WebsiteConfig,
        PaymentStrategy,
        VietQRPaymentStrategy,
        CashPaymentStrategy,
        CardPaymentStrategy,
        EntityFactory
    };
}
