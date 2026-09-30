// ============================================================================
// ORDERS MANAGEMENT - Quản lý đơn hàng (Nhánh BFD: Quản lý đơn hàng - Dark Obsidian)
// Nhóm sinh viên: Danh, Quang, Lộc (PTTKHDT SGU)
// ============================================================================

let currentPage = 1;
const itemsPerPage = 8;
let allOrders = [];
let filteredOrders = [];

document.addEventListener('DOMContentLoaded', function () {
    loadAdminUserInfo();
    syncOrdersWithCartList();
    loadOrders();
    setupOrderEvents();
});

// 1. Tải thông tin người dùng quản trị hiện tại
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

// 2. Đồng bộ đơn hàng đặt từ web client (cartList) vào orders của Admin
function syncOrdersWithCartList() {
    let orders = AdminCommon.getLocalStorage('orders') || [];
    const cartList = AdminCommon.getLocalStorage('cartList') || [];

    let hasChange = false;
    cartList.forEach(cl => {
        const exist = orders.some(o => o.id === cl.maHD || o.orderCode === `DH-${cl.maHD}`);
        if (!exist) {
            orders.unshift({
                id: cl.maHD,
                orderCode: `DH-WEB-${cl.maHD.toString().slice(-4)}`,
                customerName: cl.maKH || 'Khách hàng Web',
                customerPhone: '',
                customerEmail: '',
                address: cl.diaChiNhanHang || 'Giao hàng tận nơi',
                date: new Date().toISOString(),
                status: 'moi',
                paymentMethod: cl.paymentMethod || 'Online',
                paymentMethodText: cl.paymentMethod || 'Đặt hàng Web Online',
                cashierName: 'Hệ thống Web',
                channel: 'Online',
                items: cl.totalProducts ? cl.totalProducts.map(tp => ({
                    id: tp.id,
                    name: tp.name,
                    quantity: tp.quantity || 1,
                    price: tp.price,
                    costPrice: Math.round(tp.price * 0.65)
                })) : [],
                subTotal: cl.tongTien,
                discountPercent: 0,
                discountAmount: 0,
                total: cl.tongTien,
                costTotal: Math.round(cl.tongTien * 0.65),
                profit: Math.round(cl.tongTien * 0.35),
                note: 'Khách hàng đặt qua Website Client'
            });
            hasChange = true;
        }
    });

    if (hasChange) {
        AdminCommon.setLocalStorage('orders', orders);
    }
}

// 3. Tải danh sách đơn hàng và KPI
function loadOrders() {
    allOrders = AdminCommon.getLocalStorage('orders') || [];
    filteredOrders = [...allOrders];
    updateOrderKPIs();
    displayOrders();
}

function updateOrderKPIs() {
    const totalOrdersEl = document.getElementById('kpi-total-orders');
    if (totalOrdersEl) totalOrdersEl.innerText = allOrders.length;

    const doneCount = allOrders.filter(o => o.status === 'giaohang').length;
    const doneOrdersEl = document.getElementById('kpi-done-orders');
    if (doneOrdersEl) doneOrdersEl.innerText = `${doneCount} đơn`;

    const pendingCount = allOrders.filter(o => o.status === 'moi' || o.status === 'xuly').length;
    const pendingOrdersEl = document.getElementById('kpi-pending-orders');
    if (pendingOrdersEl) pendingOrdersEl.innerText = `${pendingCount} đơn`;

    const totalRev = allOrders.filter(o => o.status !== 'huy').reduce((sum, o) => sum + (o.total || 0), 0);
    const revEl = document.getElementById('kpi-orders-revenue');
    if (revEl) revEl.innerText = AdminCommon.formatCurrency(totalRev);
}

// 4. Render danh sách đơn hàng vào bảng Dark Tech
function displayOrders() {
    const tableElement = document.getElementById('orders-list');
    const totalCountEl = document.getElementById('total-orders-count');
    if (!tableElement) return;

    if (totalCountEl) totalCountEl.innerText = filteredOrders.length;

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredOrders.length);
    const ordersToDisplay = filteredOrders.slice(startIndex, endIndex);

    let tableHTML = `
        <thead>
            <tr>
                <th style="width: 120px;">Mã ĐH</th>
                <th>Khách Hàng</th>
                <th style="width: 130px;">Ngày Đặt</th>
                <th style="width: 100px;">Kênh Bán</th>
                <th style="width: 140px;">Hình Thức TT</th>
                <th style="width: 130px;">Tổng Tiền</th>
                <th style="width: 180px;">Trạng Thái Nghiệp Vụ</th>
                <th style="width: 140px;">Thao Tác</th>
            </tr>
        </thead>
        <tbody>
    `;

    if (ordersToDisplay.length === 0) {
        tableHTML += `
            <tr>
                <td colspan="8" style="text-align: center; padding: 45px 20px; color: var(--text-muted); font-size: 14px;">
                    <i class="fas fa-receipt" style="font-size: 28px; margin-bottom: 10px; display: block; opacity: 0.4;"></i>
                    Không tìm thấy đơn hàng nào phù hợp với bộ lọc!
                </td>
            </tr>
        `;
    } else {
        ordersToDisplay.forEach((order) => {
            const isDone = order.status === 'giaohang';
            const isCancel = order.status === 'huy';

            tableHTML += `
                <tr>
                    <td>
                        <span style="font-weight: 800; color: #60a5fa; font-family: 'Roboto', sans-serif;">
                            #${AdminCommon.escapeHtml(order.orderCode || order.id)}
                        </span>
                    </td>
                    <td style="text-align: left; font-weight: 700; color: #ffffff;">
                        ${AdminCommon.escapeHtml(order.customerName || 'Khách vãng lai')}
                    </td>
                    <td style="color: var(--text-secondary); font-size: 12.5px;">
                        ${AdminCommon.formatDate(order.date)}
                    </td>
                    <td>
                        <span class="sidebar-badge ${order.channel === 'POS' ? 'badge-hot' : 'badge-new'}">
                            ${order.channel === 'POS' ? '<i class="fas fa-cash-register"></i> POS' : '<i class="fas fa-globe"></i> Web'}
                        </span>
                    </td>
                    <td style="color: var(--text-secondary); font-size: 12.5px;">
                        ${AdminCommon.escapeHtml(order.paymentMethodText || order.paymentMethod || 'Tiền mặt')}
                    </td>
                    <td>
                        <strong style="color: #34d399; font-size: 14px; font-family: 'Roboto', sans-serif;">
                            ${AdminCommon.formatCurrency(order.total || 0)}
                        </strong>
                    </td>
                    <td>
                        ${isDone ? `
                            <span class="sidebar-badge badge-live" style="padding: 5px 10px;" title="Đơn hàng đã hoàn tất - Khóa trạng thái">
                                <i class="fas fa-lock"></i> Đã hoàn thành (Done)
                            </span>
                        ` : isCancel ? `
                            <span class="sidebar-badge badge-hot" style="padding: 5px 10px;" title="Đơn hàng đã hủy - Khóa trạng thái">
                                <i class="fas fa-ban"></i> Đã hủy
                            </span>
                        ` : `
                            <select class="select-dark" onchange="updateOrderStatus('${order.id}', this.value)" style="padding: 4px 8px; font-size: 12px; font-weight: 600;">
                                <option value="moi" ${order.status === 'moi' ? 'selected' : ''}>Mới đặt</option>
                                <option value="xuly" ${order.status === 'xuly' ? 'selected' : ''}>Đang xử lý</option>
                                <option value="giaohang">Duyệt hoàn thành (Done)</option>
                                <option value="huy">Hủy đơn</option>
                            </select>
                        `}
                    </td>
                    <td>
                        <div style="display: flex; gap: 6px;">
                            <button class="btn-table-action btn-table-edit" onclick="viewOrderDetail('${order.id}')" title="Xem chi tiết đơn hàng">
                                <i class="fas fa-eye"></i> Xem
                            </button>
                            <button class="btn-table-action" style="background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.4); color: #60a5fa;" onclick="openEditOrderModal('${order.id}')" title="Chỉnh sửa đơn hàng & sản phẩm">
                                <i class="fas fa-edit"></i> Sửa
                            </button>
                            <button class="btn-table-action btn-table-del" onclick="deleteOrder('${order.id}')" title="Xóa đơn hàng">
                                <i class="fas fa-trash-alt"></i> Xóa
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    }

    tableHTML += `</tbody>`;
    tableElement.innerHTML = tableHTML;

    const startEl = document.getElementById('showing-start');
    const endEl = document.getElementById('showing-end');
    if (startEl) startEl.innerText = filteredOrders.length === 0 ? 0 : startIndex + 1;
    if (endEl) endEl.innerText = endIndex;

    renderPagination(totalPages);
}

// 5. Phân trang Dark Tech
function renderPagination(totalPages) {
    const paginEl = document.getElementById('pagination-orders');
    if (!paginEl) return;

    if (totalPages <= 1) {
        paginEl.innerHTML = '';
        return;
    }

    let html = '';
    html += `
        <button class="pagination-btn-dark" ${currentPage === 1 ? 'disabled style="opacity:0.35; cursor:not-allowed;"' : `onclick="changePage(${currentPage - 1})"`}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        html += `
            <button class="pagination-btn-dark ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }

    html += `
        <button class="pagination-btn-dark" ${currentPage === totalPages ? 'disabled style="opacity:0.35; cursor:not-allowed;"' : `onclick="changePage(${currentPage + 1})"`}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;

    paginEl.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    displayOrders();
}

// 6. Cập nhật trạng thái đơn hàng có ràng buộc nghiệp vụ Done Lock
function updateOrderStatus(orderId, newStatus) {
    const idx = allOrders.findIndex(o => o.id == orderId);
    if (idx === -1) return;
    const order = allOrders[idx];

    // QUY TẮC NGHIỆP VỤ BẮT BUỘC: ĐÃ DONE (HOÀN TẤT) HOẶC ĐÃ HỦY THÌ KHÔNG ĐƯỢC PHÉP CẬP NHẬT TRẠNG THÁI
    if (order.status === 'giaohang' || order.status === 'done') {
        alert(`LỖI NGHIỆP VỤ:\nĐơn hàng #${order.orderCode || orderId} đã ở trạng thái ĐÃ HOÀN TẤT (DONE) nên KHÔNG ĐƯỢC PHÉP CẬP NHẬT TRẠNG THÁI NỮA!`);
        loadOrders();
        return;
    }

    if (order.status === 'huy') {
        alert(`LỖI NGHIỆP VỤ:\nĐơn hàng #${order.orderCode || orderId} đã BỊ HỦY nên không thể thay đổi trạng thái!`);
        loadOrders();
        return;
    }

    if (newStatus === 'giaohang') {
        if (!confirm(`Xác nhận duyệt HOÀN TẤT (DONE) đơn hàng #${order.orderCode || orderId}?\n\nLƯU Ý NGHIỆP VỤ:\n- Sau khi duyệt, trạng thái đơn hàng sẽ ĐƯỢC KHÓA VĨNH VIỄN và không thể chỉnh sửa trạng thái nữa.\n- Doanh thu và chi phí sẽ được ghi nhận vào báo cáo tài chính.`)) {
            loadOrders();
            return;
        }
    } else if (newStatus === 'huy') {
        if (!confirm(`Bạn có chắc chắn muốn HỦY đơn hàng #${order.orderCode || orderId} không? Đơn sau khi hủy cũng sẽ bị khóa trạng thái.`)) {
            loadOrders();
            return;
        }
    }

    order.status = newStatus;
    AdminCommon.setLocalStorage('orders', allOrders);
    AdminCommon.showToast(`Đã cập nhật trạng thái đơn #${order.orderCode || orderId} sang "${newStatus}"!`, 'success');
    loadOrders();
}

let currentViewingOrder = null;

// 7. Xem chi tiết đơn hàng
function viewOrderDetail(orderId) {
    const order = allOrders.find(o => o.id == orderId);
    if (!order) return;
    currentViewingOrder = order;

    document.getElementById('modal-order-code').innerText = order.orderCode || order.id;
    document.getElementById('modal-cust-name').innerText = order.customerName || 'Khách vãng lai';
    document.getElementById('modal-cust-phone').innerText = order.customerPhone || 'Không cung cấp';
    document.getElementById('modal-cust-address').innerText = order.address || 'Tại cửa hàng';

    document.getElementById('modal-order-date').innerText = AdminCommon.formatDate(order.date);
    document.getElementById('modal-order-channel').innerText = order.channel || 'POS';
    document.getElementById('modal-order-payment').innerText = order.paymentMethodText || order.paymentMethod || 'Tiền mặt';

    const tbody = document.getElementById('modal-order-items-tbody');
    if (tbody) {
        if (order.items && order.items.length) {
            tbody.innerHTML = order.items.map(it => `
                <tr>
                    <td style="font-weight: 700; color: #fff;">${AdminCommon.escapeHtml(it.name)}</td>
                    <td style="text-align: center; color: #60a5fa; font-weight: 700;">${it.quantity}</td>
                    <td style="text-align: right; color: var(--text-secondary);">${AdminCommon.formatCurrency(it.price)}</td>
                    <td style="text-align: right; color: #34d399; font-weight: 800;">${AdminCommon.formatCurrency(it.price * it.quantity)}</td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 15px; color: var(--text-muted);">Không có chi tiết sản phẩm</td></tr>`;
        }
    }

    const subTotal = order.subTotal || order.total || 0;
    const discount = order.discountAmount || 0;
    const total = order.total || 0;

    document.getElementById('modal-order-subtotal').innerText = AdminCommon.formatCurrency(subTotal);
    document.getElementById('modal-order-discount').innerText = `-${AdminCommon.formatCurrency(discount)}`;
    document.getElementById('modal-order-total').innerText = AdminCommon.formatCurrency(total);
    document.getElementById('modal-order-note').innerText = order.note || 'Không có ghi chú';

    const modal = document.getElementById('order-detail-modal');
    if (modal) modal.classList.add('active');
}

function closeOrderDetailModal() {
    const modal = document.getElementById('order-detail-modal');
    if (modal) modal.classList.remove('active');
}

// In hóa đơn từ modal chi tiết đơn hàng (hỗ trợ mã VietQR khi chuyển khoản)
function printCurrentOrderInvoice() {
    if (!currentViewingOrder) return;
    const order = currentViewingOrder;

    const codeEl = document.getElementById('orders-receipt-code');
    const dateEl = document.getElementById('orders-receipt-date');
    const cashierEl = document.getElementById('orders-receipt-cashier');
    const custEl = document.getElementById('orders-receipt-customer');
    const phoneEl = document.getElementById('orders-receipt-phone');
    const subtotalEl = document.getElementById('orders-receipt-subtotal');
    const discountEl = document.getElementById('orders-receipt-discount');
    const totalEl = document.getElementById('orders-receipt-total');
    const payEl = document.getElementById('orders-receipt-payment-method');
    const tbody = document.getElementById('orders-receipt-items-tbody');

    if (codeEl) codeEl.innerText = `Số: #${order.orderCode || order.id}`;
    if (dateEl) dateEl.innerText = `Ngày: ${AdminCommon.formatDate(order.date)}`;
    if (cashierEl) cashierEl.innerText = `Thu ngân / Kênh: ${order.cashierName || order.channel || 'POS'}`;
    if (custEl) custEl.innerText = `Khách hàng: ${order.customerName || 'Khách Vãng Lai'}`;
    if (phoneEl) phoneEl.innerText = `SĐT: ${order.customerPhone || 'Không cung cấp'}`;

    if (tbody) {
        if (order.items && order.items.length) {
            tbody.innerHTML = order.items.map(it => `
                <tr>
                    <td style="padding: 3px 0;">${AdminCommon.escapeHtml(it.name)}</td>
                    <td style="text-align: center;">${it.quantity}</td>
                    <td style="text-align: right;">${AdminCommon.formatCurrency(it.price)}</td>
                    <td style="text-align: right; font-weight: bold;">${AdminCommon.formatCurrency(it.price * it.quantity)}</td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 6px;">Không có chi tiết sản phẩm</td></tr>`;
        }
    }

    const subTotal = order.subTotal || order.total || 0;
    const discount = order.discountAmount || 0;
    const total = order.total || 0;

    if (subtotalEl) subtotalEl.innerText = AdminCommon.formatCurrency(subTotal);
    if (discountEl) discountEl.innerText = `-${AdminCommon.formatCurrency(discount)}`;
    if (totalEl) totalEl.innerText = AdminCommon.formatCurrency(total);
    if (payEl) payEl.innerText = order.paymentMethodText || order.paymentMethod || 'Tiền mặt';

    // XỬ LÝ MÃ QR NẾU CHUYỂN KHOẢN (CK / BANK / SEPAY)
    const qrSection = document.getElementById('orders-receipt-qr-section');
    if (qrSection) {
        const method = (order.paymentMethod || '').toLowerCase();
        const methodText = (order.paymentMethodText || '').toLowerCase();
        const isBankTransfer = method === 'bank' || method === 'ck' || method === 'transfer' || method === 'sepay' ||
                               methodText.includes('chuyển khoản') || methodText.includes('ngân hàng') || methodText.includes('vietqr') || methodText.includes('sepay');

        if (isBankTransfer) {
            qrSection.style.display = 'block';
            const orderCode = order.orderCode || ('DH' + order.id);
            const amount = order.total || 0;
            const memoEl = document.getElementById('orders-receipt-qr-memo');
            const amtEl = document.getElementById('orders-receipt-qr-amount');
            const imgEl = document.getElementById('orders-receipt-qr-image');

            if (memoEl) memoEl.innerText = orderCode;
            if (amtEl) amtEl.innerText = AdminCommon.formatCurrency(amount);
            if (imgEl) {
                const qrUrl = `https://img.vietqr.io/image/MB-0987654321-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(orderCode)}&accountName=GEARS%20KEYCAP%20SHOP`;
                imgEl.src = qrUrl;
                imgEl.onerror = function() {
                    this.onerror = null;
                    this.src = `https://qr.sepay.vn/img?bank=MBBank&acc=0987654321&template=compact&amount=${amount}&des=${encodeURIComponent(orderCode)}`;
                };
            }
        } else {
            qrSection.style.display = 'none';
        }
    }

    window.print();
}

// 8. Xóa đơn hàng
function deleteOrder(orderId) {
    const order = allOrders.find(o => o.id == orderId);
    if (!order) return;

    if (order.status === 'giaohang') {
        alert(`KHÔNG THỂ XÓA ĐƠN HÀNG!\n\nĐơn hàng #${order.orderCode || orderId} đã ở trạng thái ĐÃ HOÀN TẤT (DONE).\nTheo quy tắc toàn vẹn kế toán nghiệp vụ PTTKHDT, đơn hàng đã hoàn tất không được phép xóa.`);
        return;
    }

    if (confirm(`Bạn có chắc chắn muốn xóa đơn hàng #${order.orderCode || orderId} ra khỏi hệ thống không?`)) {
        allOrders = allOrders.filter(o => o.id != orderId);
        AdminCommon.setLocalStorage('orders', allOrders);
        AdminCommon.showToast(`Đã xóa đơn hàng #${order.orderCode || orderId} thành công!`, 'success');
        loadOrders();
    }
}

// 9. Lọc & Tìm kiếm
function setupOrderEvents() {
    const searchInput = document.getElementById('search-order');
    const filterStatus = document.getElementById('filter-status');
    const filterChannel = document.getElementById('filter-channel');
    const searchBtn = document.getElementById('btn-search-order');
    const resetBtn = document.getElementById('btn-reset-order');

    function removeVietnameseTones(str) {
        if (!str) return '';
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        return str;
    }

    function executeFilter(showToast = false) {
        const rawQ = (searchInput ? searchInput.value : '').trim();
        const query = rawQ.toLowerCase();
        const unaccentQ = removeVietnameseTones(rawQ);
        const status = filterStatus ? filterStatus.value : '';
        const channel = filterChannel ? filterChannel.value : '';

        filteredOrders = allOrders.filter(o => {
            const custName = o.customerName || '';
            const unaccentName = removeVietnameseTones(custName);
            const orderCode = (o.orderCode || '').toLowerCase();
            const phone = o.customerPhone || '';
            const idStr = String(o.id || '');

            const matchQ = !query ||
                orderCode.includes(query) ||
                custName.toLowerCase().includes(query) ||
                unaccentName.includes(unaccentQ) ||
                phone.includes(query) ||
                idStr.includes(query);

            let matchStatus = true;
            if (status) {
                const s = (o.status || '').toLowerCase();
                if (status === 'giaohang') {
                    matchStatus = (s === 'giaohang' || s === 'done' || s === 'completed' || s === 'đã giao');
                } else if (status === 'xuly') {
                    matchStatus = (s === 'xuly' || s === 'choxuly' || s === 'pending' || s === 'danggiao' || s === 'đã xử lý');
                } else if (status === 'moi') {
                    matchStatus = (s === 'moi' || s === 'new' || s === 'mới đặt');
                } else if (status === 'huy') {
                    matchStatus = (s === 'huy' || s === 'cancel' || s === 'cancelled');
                } else {
                    matchStatus = (s === status);
                }
            }

            let matchChannel = true;
            if (channel) {
                const ch = (o.channel || '').toUpperCase();
                if (channel === 'POS') {
                    matchChannel = (ch === 'POS');
                } else if (channel === 'Online') {
                    matchChannel = (ch === 'ONLINE' || ch === 'WEB');
                } else {
                    matchChannel = (ch === channel.toUpperCase());
                }
            }

            return matchQ && matchStatus && matchChannel;
        });

        currentPage = 1;
        displayOrders();

        if (showToast) {
            AdminCommon.showToast(`Đã lọc: Tìm thấy ${filteredOrders.length} đơn hàng phù hợp!`, 'info');
        }
    }

    if (searchBtn) searchBtn.addEventListener('click', () => executeFilter(true));
    if (filterStatus) filterStatus.addEventListener('change', () => executeFilter(false));
    if (filterChannel) filterChannel.addEventListener('change', () => executeFilter(false));
    if (searchInput) {
        searchInput.addEventListener('input', () => executeFilter(false));
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') executeFilter(true);
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (filterStatus) filterStatus.value = '';
            if (filterChannel) filterChannel.value = '';
            filteredOrders = [...allOrders];
            currentPage = 1;
            displayOrders();
            AdminCommon.showToast('Đã đặt lại bộ lọc danh sách đơn hàng!', 'info');
        });
    }

    // Xuất Excel
    const exportBtn = document.getElementById('btn-export-orders');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const dataToExport = filteredOrders.map(o => ({
                "Mã ĐH": o.orderCode || o.id,
                "Khách Hàng": o.customerName,
                "SĐT": o.customerPhone || '',
                "Địa Chỉ": o.address || '',
                "Ngày Đặt": AdminCommon.formatDate(o.date),
                "Kênh Bán": o.channel || 'POS',
                "Phương Thức TT": o.paymentMethodText || o.paymentMethod,
                "Tổng Tiền (VNĐ)": o.total,
                "Trạng Thái": o.status,
                "Ghi Chú": o.note || ''
            }));
            AdminCommon.exportTableToExcel(dataToExport, 'Danh_Sach_Don_Hang_Keycap', 'DonHang');
        });
    }
}

// ============================================================================
// CHỈNH SỬA ĐƠN HÀNG VÀ SẢN PHẨM TRONG ĐƠN HÀNG (PTTKHDT BFD)
// ============================================================================
let editingOrderData = null;

function openEditOrderModal(orderId) {
    const order = allOrders.find(o => String(o.id) === String(orderId));
    if (!order) {
        AdminCommon.showToast('Không tìm thấy đơn hàng mã #' + orderId, 'error');
        return;
    }

    // Nghiệp vụ PTTKHDT: Cảnh báo nếu đơn đã hoàn thành hoặc đã hủy
    if (order.status === 'giaohang') {
        if (!confirm(`Đơn hàng #${order.orderCode || order.id} đã ở trạng thái ĐÃ HOÀN TẤT (DONE).\nBạn có chắc chắn muốn mở để chỉnh sửa thông tin hoặc sản phẩm của đơn hàng này không?`)) {
            return;
        }
    } else if (order.status === 'huy') {
        if (!confirm(`Đơn hàng #${order.orderCode || order.id} đã BỊ HỦY.\nBạn có chắc chắn muốn chỉnh sửa lại đơn hàng này không?`)) {
            return;
        }
    }

    // Clone dữ liệu đơn hàng
    editingOrderData = JSON.parse(JSON.stringify(order));
    if (!editingOrderData.items) editingOrderData.items = [];

    // Điền thông tin cơ bản
    const idInput = document.getElementById('edit-order-id');
    const codeEl = document.getElementById('edit-order-modal-code');
    const nameInput = document.getElementById('edit-order-cust-name');
    const phoneInput = document.getElementById('edit-order-cust-phone');
    const addressInput = document.getElementById('edit-order-cust-address');
    const statusSelect = document.getElementById('edit-order-status');
    const paymentSelect = document.getElementById('edit-order-payment');
    const noteInput = document.getElementById('edit-order-note');
    const discountInput = document.getElementById('edit-order-discount');

    if (idInput) idInput.value = editingOrderData.id;
    if (codeEl) codeEl.innerText = editingOrderData.orderCode || editingOrderData.id;
    if (nameInput) nameInput.value = editingOrderData.customerName || '';
    if (phoneInput) phoneInput.value = editingOrderData.customerPhone || '';
    if (addressInput) addressInput.value = editingOrderData.address || '';
    if (statusSelect) statusSelect.value = editingOrderData.status || 'moi';
    if (paymentSelect) paymentSelect.value = editingOrderData.paymentMethodText || editingOrderData.paymentMethod || 'Tiền mặt';
    if (noteInput) noteInput.value = editingOrderData.note || '';
    if (discountInput) discountInput.value = editingOrderData.discountAmount || 0;

    // Nạp danh sách sản phẩm có thể thêm vào dropdown
    populateProductSelectForOrderEdit();

    // Render danh sách sản phẩm trong đơn
    renderEditingOrderItems();
    recalcEditingOrderTotals();

    const modal = document.getElementById('edit-order-modal');
    if (modal) modal.style.display = 'flex';
}

function closeEditOrderModal() {
    const modal = document.getElementById('edit-order-modal');
    if (modal) modal.style.display = 'none';
    editingOrderData = null;
}

function populateProductSelectForOrderEdit() {
    const sel = document.getElementById('edit-order-add-product-select');
    if (!sel) return;
    const prods = AdminCommon.getLocalStorage('product') || [];
    let opts = '<option value="">-- Chọn Keycap để thêm vào đơn hàng --</option>';
    prods.forEach(p => {
        opts += `<option value="${p.id}" data-name="${AdminCommon.escapeHtml(p.name)}" data-price="${p.price}" data-cost="${p.costPrice || Math.round(p.price * 0.65)}" data-img="${p.img || ''}">${AdminCommon.escapeHtml(p.name)} - ${AdminCommon.formatCurrency(p.price)} (Kho: ${p.stock || 0})</option>`;
    });
    sel.innerHTML = opts;
}

function renderEditingOrderItems() {
    const tbody = document.getElementById('edit-order-items-tbody');
    if (!tbody || !editingOrderData) return;

    if (!editingOrderData.items || editingOrderData.items.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 18px; color: var(--text-muted);">Đơn hàng chưa có sản phẩm nào. Vui lòng thêm sản phẩm bên dưới!</td></tr>`;
        return;
    }

    tbody.innerHTML = editingOrderData.items.map((it, idx) => {
        const itemTotal = (it.price || 0) * (it.quantity || 1);
        const imgPath = AdminCommon.resolveAdminImgPath(it.img || '');
        return `
            <tr>
                <td style="text-align: center;">
                    <img src="${imgPath}" onerror="this.src='../img/ShortCut_Icon.png'" style="width: 34px; height: 34px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color);">
                </td>
                <td style="font-weight: 700; color: #fff;">
                    ${AdminCommon.escapeHtml(it.name)}
                </td>
                <td style="text-align: right; color: var(--text-secondary);">
                    ${AdminCommon.formatCurrency(it.price || 0)}
                </td>
                <td style="text-align: center;">
                    <div style="display: inline-flex; align-items: center; gap: 4px; background: #0f172a; border: 1px solid var(--border-color); border-radius: 6px; padding: 2px 4px;">
                        <button type="button" onclick="changeEditingOrderItemQty(${idx}, -1)" style="background: none; border: none; color: #fff; cursor: pointer; padding: 2px 6px; font-weight: bold;">-</button>
                        <input type="number" min="1" value="${it.quantity || 1}" onchange="setEditingOrderItemQty(${idx}, this.value)" style="width: 44px; text-align: center; background: transparent; border: none; color: #60a5fa; font-weight: 700; outline: none;">
                        <button type="button" onclick="changeEditingOrderItemQty(${idx}, 1)" style="background: none; border: none; color: #fff; cursor: pointer; padding: 2px 6px; font-weight: bold;">+</button>
                    </div>
                </td>
                <td style="text-align: right; color: #34d399; font-weight: 800;">
                    ${AdminCommon.formatCurrency(itemTotal)}
                </td>
                <td style="text-align: center;">
                    <button type="button" onclick="removeEditingOrderItem(${idx})" title="Xóa sản phẩm này khỏi đơn" style="background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.4); color: #f87171; border-radius: 4px; padding: 4px 8px; cursor: pointer;">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function changeEditingOrderItemQty(idx, delta) {
    if (!editingOrderData || !editingOrderData.items[idx]) return;
    const item = editingOrderData.items[idx];
    const newQty = (item.quantity || 1) + delta;
    if (newQty <= 0) {
        removeEditingOrderItem(idx);
        return;
    }
    item.quantity = newQty;
    renderEditingOrderItems();
    recalcEditingOrderTotals();
}

function setEditingOrderItemQty(idx, val) {
    if (!editingOrderData || !editingOrderData.items[idx]) return;
    const parsed = parseInt(val, 10);
    if (isNaN(parsed) || parsed <= 0) {
        editingOrderData.items[idx].quantity = 1;
    } else {
        editingOrderData.items[idx].quantity = parsed;
    }
    renderEditingOrderItems();
    recalcEditingOrderTotals();
}

function removeEditingOrderItem(idx) {
    if (!editingOrderData || !editingOrderData.items[idx]) return;
    const item = editingOrderData.items[idx];
    if (confirm(`Xác nhận xóa sản phẩm "${item.name}" ra khỏi đơn hàng?`)) {
        editingOrderData.items.splice(idx, 1);
        renderEditingOrderItems();
        recalcEditingOrderTotals();
    }
}

function addProductToEditingOrder() {
    if (!editingOrderData) return;
    const sel = document.getElementById('edit-order-add-product-select');
    const qtyInput = document.getElementById('edit-order-add-product-qty');
    if (!sel || !sel.value) {
        AdminCommon.showToast('Vui lòng chọn một sản phẩm Keycap để thêm!', 'error');
        return;
    }

    const prodId = sel.value;
    const opt = sel.options[sel.selectedIndex];
    const name = opt.getAttribute('data-name');
    const price = parseFloat(opt.getAttribute('data-price')) || 0;
    const costPrice = parseFloat(opt.getAttribute('data-cost')) || Math.round(price * 0.65);
    const img = opt.getAttribute('data-img') || '';
    const qty = Math.max(1, parseInt(qtyInput ? qtyInput.value : 1, 10) || 1);

    const exist = editingOrderData.items.find(it => String(it.id) === String(prodId));
    if (exist) {
        exist.quantity += qty;
        AdminCommon.showToast(`Đã tăng số lượng "${name}" thêm ${qty}!`, 'info');
    } else {
        editingOrderData.items.push({
            id: prodId,
            name: name,
            price: price,
            costPrice: costPrice,
            quantity: qty,
            img: img
        });
        AdminCommon.showToast(`Đã thêm "${name}" vào đơn hàng!`, 'success');
    }

    sel.value = '';
    if (qtyInput) qtyInput.value = '1';
    renderEditingOrderItems();
    recalcEditingOrderTotals();
}

function recalcEditingOrderTotals() {
    if (!editingOrderData) return;
    const subTotal = (editingOrderData.items || []).reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0);
    const discountInput = document.getElementById('edit-order-discount');
    const discount = Math.max(0, parseFloat(discountInput ? discountInput.value : 0) || 0);
    const total = Math.max(0, subTotal - discount);

    editingOrderData.subTotal = subTotal;
    editingOrderData.discountAmount = discount;
    editingOrderData.total = total;

    const subTotalEl = document.getElementById('edit-order-subtotal');
    const totalEl = document.getElementById('edit-order-total');
    if (subTotalEl) subTotalEl.innerText = AdminCommon.formatCurrency(subTotal);
    if (totalEl) totalEl.innerText = AdminCommon.formatCurrency(total);
}

function saveEditingOrder() {
    if (!editingOrderData) return;

    const custName = document.getElementById('edit-order-cust-name').value.trim();
    const custPhone = document.getElementById('edit-order-cust-phone').value.trim();
    const custAddress = document.getElementById('edit-order-cust-address').value.trim();
    const status = document.getElementById('edit-order-status').value;
    const payment = document.getElementById('edit-order-payment').value;
    const note = document.getElementById('edit-order-note').value.trim();

    if (!custName) {
        AdminCommon.showToast('Tên khách hàng không được để trống!', 'error');
        document.getElementById('edit-order-cust-name').focus();
        return;
    }

    if (!editingOrderData.items || editingOrderData.items.length === 0) {
        AdminCommon.showToast('Đơn hàng phải có ít nhất 1 sản phẩm!', 'error');
        return;
    }

    recalcEditingOrderTotals();

    const idx = allOrders.findIndex(o => String(o.id) === String(editingOrderData.id));
    if (idx === -1) {
        AdminCommon.showToast('Không tìm thấy đơn hàng để lưu!', 'error');
        return;
    }

    const order = allOrders[idx];
    order.customerName = custName;
    order.customerPhone = custPhone;
    order.address = custAddress;
    order.status = status;
    order.paymentMethodText = payment;
    order.paymentMethod = payment;
    order.note = note;
    order.items = editingOrderData.items;
    order.subTotal = editingOrderData.subTotal;
    order.discountAmount = editingOrderData.discountAmount;
    order.total = editingOrderData.total;
    order.costTotal = (editingOrderData.items || []).reduce((sum, it) => sum + (it.costPrice || Math.round((it.price || 0) * 0.65)) * (it.quantity || 1), 0);
    order.profit = Math.max(0, order.total - order.costTotal);

    AdminCommon.setLocalStorage('orders', allOrders);

    // Đồng bộ ngược vào cartList nếu là đơn web
    try {
        const cartList = AdminCommon.getLocalStorage('cartList') || [];
        const clIdx = cartList.findIndex(cl => cl.maHD == order.id);
        if (clIdx !== -1) {
            cartList[clIdx].tongTien = order.total;
            cartList[clIdx].diaChiNhanHang = order.address;
            cartList[clIdx].totalProducts = order.items.map(it => ({
                id: it.id,
                name: it.name,
                price: it.price,
                quantity: it.quantity,
                img: it.img
            }));
            AdminCommon.setLocalStorage('cartList', cartList);
        }
    } catch(e) {}

    closeEditOrderModal();
    AdminCommon.showToast(`Đã lưu thay đổi cho đơn hàng #${order.orderCode || order.id} thành công!`, 'success');
    updateOrderKPIs();
    displayOrders();
}
