// ============================================================================
// DASHBOARD CONTROLLER - Dark Tech Admin Dashboard (PTTKHDT SGU)
// ============================================================================

let allProducts = [];
let filteredProducts = [];
let selectedProductId = 1;
let currentMasterCategory = 'all';

document.addEventListener('DOMContentLoaded', function () {
    if (window.AdminCommon && window.AdminCommon.checkAuth) {
        AdminCommon.checkAuth('admin');
    }

    loadAdminUserInfo();
    loadDashboardStats();
    loadMasterProductList();
    renderCategoryBreakdown();
    loadRecentOrders();
});

// 1. Tải thông tin người dùng quản trị hiện tại
function loadAdminUserInfo() {
    let user = AdminCommon.getLocalStorage('currentAdminUser') || AdminCommon.getLocalStorage('clientLoggedInUser');
    if (!user && typeof sessionStorage !== 'undefined') {
        try {
            user = JSON.parse(sessionStorage.getItem('currentAdminUser') || sessionStorage.getItem('clientLoggedInUser') || 'null');
        } catch (e) {}
    }
    if (!user) {
        user = {
            name: "Nguyễn Công Danh",
            role: "admin",
            roleName: "Quản Trị Viên (Admin)"
        };
    }

    const nameEl = document.getElementById('admin-user-name');
    const avatarEl = document.getElementById('admin-user-avatar');

    if (nameEl) nameEl.innerText = user.name;
    if (avatarEl) {
        const initials = user.name.split(' ').map(n => n[0]).slice(-2).join('').toUpperCase();
        avatarEl.innerText = initials || 'AD';
    }
}

// 2. Thống kê KPI cốt lõi
function loadDashboardStats() {
    const products = AdminCommon.getLocalStorage('product') || [];
    const suppliers = AdminCommon.getLocalStorage('suppliers') || [];
    const users = AdminCommon.getLocalStorage('user') || [];
    const orders = AdminCommon.getLocalStorage('orders') || [];

    // Tổng sản phẩm
    const prodEl = document.getElementById('total-products');
    if (prodEl) prodEl.innerText = products.length;

    // Tổng số lượng tồn kho cộng dồn
    const totalStock = products.reduce((sum, p) => sum + (parseInt(p.stock) || 0), 0);
    const stockEl = document.getElementById('total-stock-count');
    if (stockEl) stockEl.innerText = `${totalStock.toLocaleString('vi-VN')} nút khả dụng`;

    // Tổng nhà cung cấp
    const supEl = document.getElementById('total-suppliers');
    if (supEl) supEl.innerText = suppliers.length;

    // Tổng khách hàng
    const custEl = document.getElementById('total-customers');
    const validCustomers = users.filter(u => u.userType !== 'admin');
    if (custEl) custEl.innerText = validCustomers.length > 0 ? validCustomers.length : users.length;

    // Tổng đơn hàng
    const ordEl = document.getElementById('total-orders');
    if (ordEl) ordEl.innerText = orders.length;

    // Số đơn hoàn thành (Done)
    const completedCount = orders.filter(o => o.status === 'giaohang').length;
    const completedEl = document.getElementById('order-completed-count');
    if (completedEl) completedEl.innerText = `${completedCount} đơn đã Done`;

    // Cập nhật badge số đơn trên sidebar
    const sidebarOrderBadge = document.getElementById('sidebar-order-count');
    if (sidebarOrderBadge) sidebarOrderBadge.innerText = `${orders.length} Đơn`;

    // Tổng doanh thu (không tính đơn hủy)
    const revEl = document.getElementById('total-revenue');
    const totalRev = orders.filter(o => o.status !== 'huy').reduce((sum, o) => sum + (o.total || 0), 0);
    if (revEl) revEl.innerText = AdminCommon.formatCurrency(totalRev);
}

// 3. Tải và quản lý Danh sách Master Panel (Cột trái)
function loadMasterProductList() {
    allProducts = AdminCommon.getLocalStorage('product') || [];
    filteredProducts = [...allProducts];

    // Mặc định chọn sản phẩm đầu tiên nếu chưa chọn
    if (filteredProducts.length > 0) {
        if (!selectedProductId || !allProducts.find(p => p.id === selectedProductId)) {
            selectedProductId = filteredProducts[0].id;
        }
    }

    renderMasterList();
    loadSelectedProductDetails(selectedProductId);
}

function renderMasterList() {
    const container = document.getElementById('master-item-list-container');
    if (!container) return;

    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 30px 10px; color: var(--text-muted); font-size: 13px;">
                <i class="fas fa-search" style="font-size: 24px; margin-bottom: 8px; display: block; opacity: 0.5;"></i>
                Không tìm thấy Keycap phù hợp!
            </div>
        `;
        return;
    }

    container.innerHTML = filteredProducts.map(p => {
        const isSelected = p.id === selectedProductId;
        const isLow = (parseInt(p.stock) || 0) < 15;
        const stockBadgeClass = isLow ? 'stock-low' : 'stock-ok';
        const stockText = isLow ? `Kho: ${p.stock} (Sắp hết)` : `Kho: ${p.stock}`;
        const imgSrc = AdminCommon.resolveAdminImgPath(p.img);

        return `
            <div class="master-item-card ${isSelected ? 'active' : ''}" onclick="selectMasterProduct(${p.id})">
                <img src="${AdminCommon.escapeHtml(imgSrc)}" alt="${AdminCommon.escapeHtml(p.name)}" class="master-item-thumb" onerror="this.src='../img/ShortCut_Icon.png'">
                <div class="master-item-info">
                    <div class="master-item-name" title="${AdminCommon.escapeHtml(p.name)}">${AdminCommon.escapeHtml(p.name)}</div>
                    <div class="master-item-sub">
                        <span class="master-item-price">${AdminCommon.formatCurrency(p.price)}</span>
                        <span class="stock-badge-pill ${stockBadgeClass}">${stockText}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function selectMasterProduct(id) {
    selectedProductId = id;
    renderMasterList();
    loadSelectedProductDetails(id);
}

function loadSelectedProductDetails(id) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    const imgPreview = document.getElementById('det-img-preview');
    if (imgPreview) {
        imgPreview.src = AdminCommon.resolveAdminImgPath(product.img);
        imgPreview.onerror = function() { this.src = '../img/ShortCut_Icon.png'; };
    }

    const heroName = document.getElementById('det-hero-name');
    if (heroName) heroName.innerText = product.name || 'Keycap';

    const heroDesc = document.getElementById('det-hero-desc');
    if (heroDesc) {
        heroDesc.innerText = product.description || `Keycap ${product.name} chính hãng chất liệu cao cấp, phù hợp switch cơ học Cherry/Gateron.`;
    }

    const heroTag = document.getElementById('det-hero-tag');
    if (heroTag) heroTag.innerText = product.type || 'Keycap';

    document.getElementById('det-name').value = product.name || '';
    document.getElementById('det-type').value = product.type || 'Keycap';
    document.getElementById('det-id').value = `#${product.id}`;
    document.getElementById('det-cost').value = AdminCommon.formatCurrency(product.costPrice || 0);
    document.getElementById('det-price').value = AdminCommon.formatCurrency(product.price || 0);

    const profit = (product.price || 0) - (product.costPrice || 0);
    document.getElementById('det-profit').value = `${AdminCommon.formatCurrency(profit)} (${Math.round((profit / (product.price || 1)) * 100)}%)`;

    document.getElementById('det-stock-val').innerText = `${product.stock || 0} sản phẩm`;
    document.getElementById('selected-product-badge').innerText = `Đang chọn: #${product.id} (${product.type})`;
}

// Xử lý upload ảnh trực tiếp từ Dashboard
function handleDashboardImageUpload(input) {
    if (!input || !input.files || input.files.length === 0) return;
    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
        AdminCommon.showToast('Vui lòng chọn một tệp hình ảnh hợp lệ (PNG, JPG, WEBP)!', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Data = e.target.result;
        const product = allProducts.find(p => p.id === selectedProductId);
        if (product) {
            product.img = base64Data;
            AdminCommon.setLocalStorage('product', allProducts);

            const imgPreview = document.getElementById('det-img-preview');
            if (imgPreview) imgPreview.src = base64Data;

            renderMasterList();
            AdminCommon.showToast(`Đã tải lên và cập nhật ảnh mới cho "${product.name}" thành công!`, 'success');
        }
    };
    reader.readAsDataURL(file);
    input.value = '';
}

// 4. Lọc & Tìm kiếm Master List
function setMasterCategory(cat, btn) {
    currentMasterCategory = cat;
    document.querySelectorAll('.filter-tag-pill').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    filterMasterList();
}

function filterMasterList() {
    const keyword = (document.getElementById('master-search-input').value || '').toLowerCase().trim();

    filteredProducts = allProducts.filter(p => {
        // Lọc theo category
        let matchCat = true;
        if (currentMasterCategory === 'lowStock') {
            matchCat = (parseInt(p.stock) || 0) < 15;
        } else if (currentMasterCategory !== 'all') {
            matchCat = p.type === currentMasterCategory;
        }

        // Lọc theo từ khóa
        let matchKey = true;
        if (keyword) {
            matchKey = (p.name && p.name.toLowerCase().includes(keyword)) ||
                       (p.type && p.type.toLowerCase().includes(keyword)) ||
                       String(p.id).includes(keyword);
        }

        return matchCat && matchKey;
    });

    renderMasterList();
}

function reloadMasterList() {
    document.getElementById('master-search-input').value = '';
    currentMasterCategory = 'all';
    document.querySelectorAll('.filter-tag-pill').forEach((b, idx) => {
        b.classList.toggle('active', idx === 0);
    });
    loadMasterProductList();
    AdminCommon.showToast('Đã tải lại danh sách Keycap từ kho dữ liệu!', 'info');
}

// 5. Điều chỉnh nhanh tồn kho từ Dashboard (+X / -X)
function quickStockAdjust(amount) {
    const product = allProducts.find(p => p.id === selectedProductId);
    if (!product) return;

    let currentStock = parseInt(product.stock) || 0;
    let newStock = currentStock + amount;

    if (newStock < 0) {
        AdminCommon.showToast('Lỗi: Số lượng tồn kho không thể âm!', 'error');
        return;
    }

    product.stock = newStock;
    AdminCommon.setLocalStorage('product', allProducts);

    // Cập nhật lại giao diện
    loadSelectedProductDetails(selectedProductId);
    renderMasterList();
    loadDashboardStats();
    renderCategoryBreakdown();

    const sign = amount > 0 ? `+${amount}` : `${amount}`;
    AdminCommon.showToast(`Đã cập nhật tồn kho cho "${product.name}": ${sign} nút (Còn lại: ${newStock})`, 'success');
}

function goToFullEditProduct() {
    window.location.href = `products.html?highlightId=${selectedProductId}`;
}

// 6. Phân bổ thể loại và tiến độ
function renderCategoryBreakdown() {
    const container = document.getElementById('category-breakdown-container');
    if (!container) return;

    const products = allProducts;
    const total = products.length || 1;

    const categories = [
        { name: 'Artisan', label: 'Keycap Thủ Công (Artisan)', color: '#e30019' },
        { name: 'Anime', label: 'Anime / Manga Custom', color: '#8b5cf6' },
        { name: 'Pudding', label: 'PBT Pudding Xuyên LED', color: '#3b82f6' },
        { name: 'Cherry', label: 'Cherry Profile Tiêu Chuẩn', color: '#10b981' },
        { name: 'Other', label: 'Phụ Kiện & Khác', color: '#f59e0b' }
    ];

    container.innerHTML = categories.map(cat => {
        const count = products.filter(p => p.type === cat.name).length;
        const percent = Math.round((count / total) * 100);
        const stockInCat = products.filter(p => p.type === cat.name).reduce((sum, p) => sum + (parseInt(p.stock) || 0), 0);

        return `
            <li class="cat-item-row">
                <div class="cat-header-info">
                    <span style="color: #ffffff;"><i class="fas fa-circle" style="color: ${cat.color}; font-size: 8px; margin-right: 6px;"></i> ${cat.label}</span>
                    <span style="color: var(--text-muted);">${count} mẫu (${percent}%) • Kho: ${stockInCat}</span>
                </div>
                <div class="progress-bar-wrap">
                    <div class="progress-fill" style="width: ${percent}%; background-color: ${cat.color};"></div>
                </div>
            </li>
        `;
    }).join('');
}

// 7. Bảng đơn hàng gần đây (Tuân thủ ràng buộc khóa trạng thái Done)
function loadRecentOrders() {
    const tbody = document.getElementById('recent-orders-tbody');
    if (!tbody) return;

    const orders = AdminCommon.getLocalStorage('orders') || [];
    const recent = orders.slice(0, 6);

    if (recent.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 25px; color: var(--text-muted);">
                    Chưa có đơn hàng nào trong hệ thống!
                </td>
            </tr>
        `;
        return;
    }

    const statusMap = {
        'moi': { text: 'Mới đặt', badgeClass: 'badge-new', icon: 'fa-clock' },
        'xuly': { text: 'Đang xử lý', badgeClass: 'badge-count', icon: 'fa-spinner fa-spin' },
        'giaohang': { text: 'Đã hoàn thành (Done)', badgeClass: 'badge-live', icon: 'fa-lock' },
        'huy': { text: 'Đã hủy', badgeClass: 'badge-hot', icon: 'fa-ban' }
    };

    tbody.innerHTML = recent.map(o => {
        const st = statusMap[o.status] || { text: o.status, badgeClass: 'badge-tech', icon: 'fa-info-circle' };
        const isDoneOrCancel = o.status === 'giaohang' || o.status === 'huy';

        return `
            <tr>
                <td style="font-weight: 700; color: #60a5fa;">#${AdminCommon.escapeHtml(o.orderCode || o.id)}</td>
                <td style="font-weight: 600; color: #ffffff;">${AdminCommon.escapeHtml(o.customerName || 'Khách vãng lai')}</td>
                <td>${AdminCommon.formatDate(o.date)}</td>
                <td>
                    <span class="sidebar-badge ${o.channel === 'POS' ? 'badge-hot' : 'badge-new'}">
                        ${o.channel || 'POS'}
                    </span>
                </td>
                <td style="font-weight: 700; color: #34d399;">${AdminCommon.formatCurrency(o.total)}</td>
                <td>
                    <span class="sidebar-badge ${st.badgeClass}">
                        <i class="fas ${st.icon}"></i> ${st.text}
                    </span>
                    ${isDoneOrCancel ? '<span style="font-size: 10px; color: var(--text-muted); margin-left: 4px;">(Khóa sửa)</span>' : ''}
                </td>
            </tr>
        `;
    }).join('');
}

// Reload Dashboard button handler
document.addEventListener('DOMContentLoaded', function () {
    const reloadBtn = document.getElementById('btn-reload-dashboard');
    if (reloadBtn) {
        reloadBtn.addEventListener('click', () => {
            loadDashboardStats();
            loadMasterProductList();
            renderCategoryBreakdown();
            loadRecentOrders();
            AdminCommon.showToast('Đã tải lại toàn bộ số liệu Dashboard mới nhất!', 'success');
        });
    }
});

// Tự động đồng bộ thời gian thực khi có đơn hàng mới từ tab khác
window.addEventListener('storage', function (e) {
    if (e.key === 'orders' || e.key === 'cartList' || e.key === 'product') {
        loadDashboardStats();
        loadRecentOrders();
        renderCategoryBreakdown();
    }
});

window.addEventListener('focus', function () {
    loadDashboardStats();
    loadRecentOrders();
});

setInterval(function () {
    loadDashboardStats();
    loadRecentOrders();
}, 4000);
