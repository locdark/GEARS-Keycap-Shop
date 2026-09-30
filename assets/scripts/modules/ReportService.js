// ============================================================================
// GEARS KEYCAP SHOP - REPORT SERVICE (OOP SINGLETON)
// Tinh toan thong ke tai chinh, doanh thu, gia von, loi nhuan, Top ban chay
// ============================================================================

class ReportService {
    constructor(storageService, orderService) {
        if (ReportService.instance) {
            return ReportService.instance;
        }
        this._storage = storageService || (typeof StorageService !== 'undefined' ? StorageService.getInstance() : null);
        this._orderService = orderService || (typeof OrderService !== 'undefined' ? OrderService.getInstance() : null);
        ReportService.instance = this;
    }

    static getInstance(storageService, orderService) {
        if (!ReportService.instance) {
            ReportService.instance = new ReportService(storageService, orderService);
        }
        return ReportService.instance;
    }

    getFinancialSummary() {
        const orders = this._getOrderService().getAll();
        // Chi tinh cac don hang da hoan tat (giaohang / paid)
        const validOrders = orders.filter(o => 
            o.status === 'giaohang' || o.paymentStatus === 'paid'
        );

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
        const orders = this._getOrderService().getAll();
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
        const products = this._getStorage().get('product', []);
        const dist = {
            Artisan: 0,
            Anime: 0,
            Pudding: 0,
            Cherry: 0,
            Other: 0
        };

        products.forEach(p => {
            const cat = p.type || 'Other';
            if (dist[cat] !== undefined) {
                dist[cat]++;
            } else {
                dist['Other']++;
            }
        });

        return dist;
    }

    _getStorage() {
        if (!this._storage) {
            this._storage = (typeof StorageService !== 'undefined') ? StorageService.getInstance() : {
                get: (k, def) => {
                    try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : def; } catch (e) { return def; }
                }
            };
        }
        return this._storage;
    }

    _getOrderService() {
        if (!this._orderService) {
            this._orderService = (typeof OrderService !== 'undefined') ? OrderService.getInstance() : {
                getAll: () => this._getStorage().get('orders', [])
            };
        }
        return this._orderService;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReportService;
}
if (typeof window !== 'undefined') {
    window.ReportService = ReportService;
}
