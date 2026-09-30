// ============================================================================
// GEARS KEYCAP SHOP - ORDER SERVICE (OOP SINGLETON)
// Quan ly don hang, quy trinh xu ly trang thai nghiem ngat, SePay VietQR
// ============================================================================

class OrderService {
    constructor(storageService) {
        if (OrderService.instance) {
            return OrderService.instance;
        }
        this._storage = storageService || (typeof StorageService !== 'undefined' ? StorageService.getInstance() : null);
        this._sePayBank = 'MBBank';
        this._sePayAcc = '0987654321';
        this._sePayName = 'GEARS KEYCAP SHOP';
        OrderService.instance = this;
    }

    static getInstance(storageService) {
        if (!OrderService.instance) {
            OrderService.instance = new OrderService(storageService);
        }
        return OrderService.instance;
    }

    getAll() {
        return this._getStorage().get('orders', []);
    }

    getById(id) {
        const orders = this.getAll();
        return orders.find(o => String(o.id) === String(id) || String(o.code) === String(id)) || null;
    }

    /**
     * Tao don hang moi
     */
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
        this._getStorage().set('orders', orders);
        return newOrder;
    }

    /**
     * RANG BUOC NGHIEP VU QUAN TRONG:
     * Don da o trang thai 'giaohang' (Done/Hoan tat) hoac 'huy' (Cancelled)
     * KHONG DUOC PHEP DOI TRANG THAI NUA!
     */
    updateStatus(orderId, newStatus) {
        const orders = this.getAll();
        const order = orders.find(o => String(o.id) === String(orderId) || String(o.code) === String(orderId));

        if (!order) {
            return {
                success: false,
                message: 'Không tìm thấy đơn hàng trong hệ thống!'
            };
        }

        const currentStatus = (order.status || '').toLowerCase();
        const targetStatus = (newStatus || '').toLowerCase();

        // Kiem tra trang thai khoa
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

        this._getStorage().set('orders', orders);
        return {
            success: true,
            isLocked: false,
            message: `Cập nhật đơn hàng #${order.code || order.id} sang trạng thái "${targetStatus}" thành công!`,
            order: order
        };
    }

    /**
     * Sinh duong dan VietQR SePay
     */
    generateSePayVietQR(order) {
        const amount = Number(order.totalAmount) || 0;
        const memo = order.code || `DH${order.id}`;
        const accountName = encodeURIComponent(this._sePayName);
        return `https://img.vietqr.io/image/MB-${this._sePayAcc}-compact2.png?amount=${amount}&addInfo=${memo}&accountName=${accountName}`;
    }

    /**
     * Gia lap SePay Webhook xac nhan thanh toan tu dong
     */
    simulateSePayWebhook(orderId) {
        const orders = this.getAll();
        const order = orders.find(o => String(o.id) === String(orderId) || String(o.code) === String(orderId));

        if (!order) {
            return { success: false, message: 'Không tìm thấy đơn hàng!' };
        }

        order.paymentStatus = 'paid';
        order.status = 'giaohang'; // Chuyen sang Da hoan tat
        order.paidAt = new Date().toISOString();

        this._getStorage().set('orders', orders);
        return {
            success: true,
            message: `SePay Webhook xác nhận đã nhận thanh toán thành công cho đơn #${order.code || order.id}!`,
            order: order
        };
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
    module.exports = OrderService;
}
if (typeof window !== 'undefined') {
    window.OrderService = OrderService;
}
