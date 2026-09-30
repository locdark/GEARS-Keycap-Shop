// ============================================================================
// REPORTS & ANALYTICS - Thống kê Báo cáo (Nhánh BFD: Doanh thu, Doanh số, Lợi nhuận)
// Nhóm sinh viên: Danh, Quang, Lộc
// ============================================================================

let revenueChartInstance = null;
let categoryChartInstance = null;

document.addEventListener('DOMContentLoaded', function () {
    if (typeof AdminCommon !== 'undefined' && AdminCommon.checkAuth) {
        if (!AdminCommon.checkAuth('admin')) return;
    }
    if (typeof Chart !== 'undefined') {
        Chart.defaults.color = '#94a3b8';
        Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.08)';
    }
    renderReportMetrics();
    renderCharts();
    renderTopSellingTable();
    setupReportEvents();
});

function loadAdminUserInfo() {
    const user = AdminCommon.getLocalStorage('currentAdminUser') || {
        name: "Nguyễn Công Danh",
        role: "admin",
        roleName: "Quản Trị Viên (SGU)"
    };

    const nameEl = document.getElementById('admin-user-name');
    const avatarEl = document.getElementById('admin-user-avatar');

    if (nameEl) nameEl.innerText = user.name;
    if (avatarEl) {
        const initials = user.name.split(' ').map(n => n[0]).slice(-2).join('').toUpperCase();
        avatarEl.innerText = initials || 'AD';
    }

    const orders = AdminCommon.getLocalStorage('orders') || [];
    const sidebarOrderBadge = document.getElementById('sidebar-order-count');
    if (sidebarOrderBadge) sidebarOrderBadge.innerText = `${orders.length} Đơn`;
}

function renderReportMetrics() {
    const orders = AdminCommon.getLocalStorage('orders') || [];
    
    // Chỉ tính các đơn đã hoàn thành hoặc đang xử lý (không tính đơn hủy)
    const validOrders = orders.filter(o => o.status !== 'huy');

    let totalRevenue = 0;
    let totalSalesVolume = 0;
    let totalCost = 0;

    validOrders.forEach(o => {
        totalRevenue += (o.total || 0);
        totalCost += (o.costTotal || Math.round((o.total || 0) * 0.62));
        if (o.items && o.items.length) {
            o.items.forEach(it => {
                totalSalesVolume += (it.quantity || 1);
            });
        }
    });

    const totalProfit = Math.max(0, totalRevenue - totalCost);
    const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;

    document.getElementById('stat-revenue').innerText = AdminCommon.formatCurrency(totalRevenue);
    document.getElementById('stat-sales-volume').innerText = `${totalSalesVolume} chiếc`;
    document.getElementById('stat-orders-count').innerText = validOrders.length;
    document.getElementById('stat-profit').innerText = AdminCommon.formatCurrency(totalProfit);
    document.getElementById('stat-profit-margin').innerText = `${profitMargin}%`;
}

function renderCharts() {
    const orders = AdminCommon.getLocalStorage('orders') || [];
    const validOrders = orders.filter(o => o.status !== 'huy');

    // 1. Dữ liệu Doanh thu & Lợi nhuận theo ngày
    const dateMap = {};
    validOrders.forEach(o => {
        const d = AdminCommon.formatDateOnly(o.date) || '25/03/2026';
        if (!dateMap[d]) {
            dateMap[d] = { revenue: 0, profit: 0 };
        }
        dateMap[d].revenue += (o.total || 0);
        dateMap[d].profit += (o.profit || Math.round((o.total || 0) * 0.38));
    });

    const labels = Object.keys(dateMap).slice(-7);
    const revenueData = labels.map(k => dateMap[k].revenue);
    const profitData = labels.map(k => dateMap[k].profit);

    const ctxRev = document.getElementById('revenueChart');
    if (ctxRev && typeof Chart !== 'undefined') {
        if (revenueChartInstance) revenueChartInstance.destroy();
        revenueChartInstance = new Chart(ctxRev, {
            type: 'bar',
            data: {
                labels: labels.length ? labels : ['25/03', '26/03', '27/03', '28/03', '29/03', '30/03'],
                datasets: [
                    {
                        label: 'Doanh thu (VNĐ)',
                        data: revenueData.length ? revenueData : [1175000, 1520000, 850000, 545000, 460000, 1200000],
                        backgroundColor: 'rgba(16, 185, 129, 0.75)',
                        borderColor: '#10b981',
                        borderWidth: 1,
                        borderRadius: 6
                    },
                    {
                        label: 'Lợi nhuận (VNĐ)',
                        data: profitData.length ? profitData : [465000, 510000, 320000, 195000, 185000, 480000],
                        backgroundColor: 'rgba(245, 158, 11, 0.75)',
                        borderColor: '#f59e0b',
                        borderWidth: 1,
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return (value / 1000).toLocaleString() + 'k';
                            }
                        }
                    }
                }
            }
        });
    }

    // 2. Dữ liệu Doanh số theo danh mục
    const catMap = { 'Artisan': 0, 'Anime': 0, 'Pudding': 0, 'Other': 0 };
    const products = AdminCommon.getLocalStorage('product') || [];

    validOrders.forEach(o => {
        if (o.items) {
            o.items.forEach(it => {
                const prod = products.find(p => p.id === it.id || p.name === it.name);
                const type = (prod && prod.type) ? prod.type : 'Other';
                if (!catMap[type]) catMap[type] = 0;
                catMap[type] += (it.quantity || 1);
            });
        }
    });

    const ctxCat = document.getElementById('categoryChart');
    if (ctxCat && typeof Chart !== 'undefined') {
        if (categoryChartInstance) categoryChartInstance.destroy();
        categoryChartInstance = new Chart(ctxCat, {
            type: 'doughnut',
            data: {
                labels: ['Artisan Keycap', 'Anime / Manga', 'Pudding LED', 'Dòng Khác'],
                datasets: [{
                    data: [catMap['Artisan'] || 4, catMap['Anime'] || 5, catMap['Pudding'] || 3, catMap['Other'] || 3],
                    backgroundColor: [
                        '#8b5cf6',
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right' }
                }
            }
        });
    }
}

function renderTopSellingTable() {
    const tbody = document.getElementById('top-products-tbody');
    if (!tbody) return;

    const orders = AdminCommon.getLocalStorage('orders') || [];
    const products = AdminCommon.getLocalStorage('product') || [];
    const validOrders = orders.filter(o => o.status !== 'huy');

    const productSales = {};

    validOrders.forEach(o => {
        if (o.items) {
            o.items.forEach(it => {
                const pId = it.id || it.name;
                if (!productSales[pId]) {
                    const foundP = products.find(p => p.id === it.id || p.name === it.name);
                    productSales[pId] = {
                        name: it.name,
                        type: foundP ? foundP.type : 'Keycap',
                        qty: 0,
                        revenue: 0,
                        profit: 0
                    };
                }
                const q = it.quantity || 1;
                productSales[pId].qty += q;
                productSales[pId].revenue += (it.price * q);
                const cost = (it.costPrice || Math.round(it.price * 0.65)) * q;
                productSales[pId].profit += Math.max(0, (it.price * q) - cost);
            });
        }
    });

    const sortedList = Object.values(productSales).sort((a, b) => b.qty - a.qty).slice(0, 5);

    if (sortedList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px; color: #94a3b8;">Chưa có dữ liệu thống kê bán hàng!</td>
            </tr>
        `;
        return;
    }

    const rankColors = ['#f59e0b', '#94a3b8', '#d97706', '#60a5fa', '#a855f7'];

    tbody.innerHTML = sortedList.map((item, idx) => {
        let badgeClass = 'badge-tech';
        if (item.type === 'Artisan') badgeClass = 'badge-hot';
        else if (item.type === 'Pudding') badgeClass = 'badge-new';
        else if (item.type === 'Cherry') badgeClass = 'badge-live';
        else if (item.type === 'Anime') badgeClass = 'badge-tech';

        return `
            <tr>
                <td>
                    <span class="sidebar-badge" style="background: rgba(255,255,255,0.06); border: 1px solid ${rankColors[idx]}; color: ${rankColors[idx]}; font-size: 11px;">
                        ${rankBadges[idx]}
                    </span>
                </td>
                <td style="font-weight: 700; color: #ffffff; text-align: left;">
                    ${AdminCommon.escapeHtml(item.name)}
                </td>
                <td><span class="sidebar-badge ${badgeClass}">${AdminCommon.escapeHtml(item.type)}</span></td>
                <td><strong style="color: #60a5fa; font-size: 13.5px;">${item.qty} chiếc</strong></td>
                <td style="font-weight: 700; color: #ffffff;">${AdminCommon.formatCurrency(item.revenue)}</td>
                <td style="color: #34d399; font-weight: 800;">+${AdminCommon.formatCurrency(item.profit)}</td>
            </tr>
        `;
    }).join('');
}

function setupReportEvents() {
    const exportBtn = document.getElementById('btn-export-report');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const orders = AdminCommon.getLocalStorage('orders') || [];
            const dataToExport = orders.map(o => ({
                "Mã ĐH": o.orderCode || o.id,
                "Khách Hàng": o.customerName,
                "Ngày Bán": AdminCommon.formatDate(o.date),
                "Kênh Bán": o.channel || 'POS',
                "Phương Thức TT": o.paymentMethodText || o.paymentMethod,
                "Thu Ngân": o.cashierName || 'Admin',
                "Doanh Thu": o.total,
                "Giá Vốn": o.costTotal,
                "Lợi Nhuận Gộp": o.profit,
                "Trạng Thái": o.status
            }));
            AdminCommon.exportTableToExcel(dataToExport, 'Bao_Cao_Doanh_Thu_Loi_Nhuan_Keycap', 'DoanhThu');
        });
    }
}
