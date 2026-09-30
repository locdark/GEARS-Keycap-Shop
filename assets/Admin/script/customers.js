// ============================================================================
// CUSTOMERS MANAGEMENT - Quản lý Khách hàng (Nhánh BFD 4)
// Nhóm sinh viên: Danh, Quang, Lộc
// ============================================================================

let currentPage = 1;
const itemsPerPage = 8;
let allCustomers = [];
let filteredCustomers = [];

document.addEventListener('DOMContentLoaded', function () {
    loadCustomers();
    setupCustomerEvents();
});

function loadCustomers() {
    allCustomers = AdminCommon.getLocalStorage('user') || [];
    filteredCustomers = [...allCustomers];
    displayCustomers();
}

function displayCustomers() {
    const tableElement = document.getElementById('customer-list');
    const totalCountEl = document.getElementById('total-customers');
    if (!tableElement) return;

    if (totalCountEl) totalCountEl.innerText = filteredCustomers.length;

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredCustomers.length);
    const customersToDisplay = filteredCustomers.slice(startIndex, endIndex);

    const orders = AdminCommon.getLocalStorage('orders') || [];

    let tableHTML = `
        <thead>
            <tr>
                <th>Mã KH</th>
                <th>Họ và Tên</th>
                <th>Tài Khoản</th>
                <th>Số Điện Thoại</th>
                <th>Email</th>
                <th>Địa Chỉ</th>
                <th>Tổng Chi Tiêu</th>
                <th>Trạng Thái</th>
                <th>Hành Động</th>
            </tr>
        </thead>
        <tbody>
    `;

    if (customersToDisplay.length === 0) {
        tableHTML += `
            <tr>
                <td colspan="9" style="text-align: center; padding: 25px; color: #94a3b8; font-size: 1.4rem;">
                    Không tìm thấy khách hàng nào phù hợp!
                </td>
            </tr>
        `;
    } else {
        customersToDisplay.forEach((cust, index) => {
            const actualIndex = startIndex + index;
            const isActive = cust.status !== 'locked';

            // Tính chi tiêu thực tế từ các đơn hàng
            const userOrders = getCustomerOrders(cust, orders);
            const calcSpent = userOrders.reduce((sum, o) => sum + (parseFloat(o.total || o.totalAmount) || 0), 0);
            const totalSpent = calcSpent > 0 ? calcSpent : (cust.totalSpent || 0);

            tableHTML += `
                <tr>
                    <td style="font-weight: 700; color: #ec4899;">${AdminCommon.escapeHtml(cust.id || `KH0${actualIndex + 1}`)}</td>
                    <td style="text-align: left; font-weight: 600;">${AdminCommon.escapeHtml(cust.name || cust.username)}</td>
                    <td><code>${AdminCommon.escapeHtml(cust.username)}</code></td>
                    <td>${AdminCommon.escapeHtml(cust.phone || '---')}</td>
                    <td>${AdminCommon.escapeHtml(cust.gmail || cust.email || '---')}</td>
                    <td style="text-align: left; font-size: 1.25rem;">${AdminCommon.escapeHtml(cust.address || '---')}</td>
                    <td style="font-weight: 700; color: #10b981;">${AdminCommon.formatCurrency(totalSpent)}</td>
                    <td>
                        <span class="badge ${isActive ? 'badge-success' : 'badge-danger'}">
                            ${isActive ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                    </td>
                    <td>
                        <button class="btn-Product" onclick="openCustomerOrderHistory('${cust.username || cust.id}')" style="background: #10b981; margin-right: 4px;" title="Xem lịch sử đơn hàng">
                            <i class="fas fa-receipt"></i> Đơn Hàng
                        </button>
                        <button class="btn-Product" onclick="openEditCustomer('${cust.username}')" style="background: #2563eb; margin-right: 4px;" title="Chỉnh sửa thông tin">
                            <i class="fas fa-edit"></i> Sửa
                        </button>
                        <button class="btn-Product" onclick="toggleLockCustomer('${cust.username}')" 
                            style="background: ${isActive ? '#f59e0b' : '#10b981'};" title="${isActive ? 'Khóa tài khoản' : 'Mở khóa'}">
                            <i class="fas ${isActive ? 'fa-lock' : 'fa-unlock'}"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    tableHTML += `</tbody>`;
    tableElement.innerHTML = tableHTML;

    document.getElementById('showing-start').innerText = filteredCustomers.length === 0 ? 0 : startIndex + 1;
    document.getElementById('showing-end').innerText = endIndex;
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const paginEl = document.getElementById('pagination-customers');
    if (!paginEl) return;

    if (totalPages <= 1) {
        paginEl.innerHTML = '';
        return;
    }

    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `
            <button class="confirm-btn" onclick="changePage(${i})" 
                style="background: ${i === currentPage ? '#ec4899' : '#cbd5e1'}; color: ${i === currentPage ? '#fff' : '#1e293b'}; min-width: 36px; padding: 0 10px; margin: 0;">
                ${i}
            </button>
        `;
    }
    paginEl.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    displayCustomers();
}

function setupCustomerEvents() {
    const searchInput = document.getElementById('search-customer');
    const searchBtn = document.getElementById('btn-search-customer');
    const resetBtn = document.getElementById('btn-reset-filter');

    function executeSearch() {
        const query = (searchInput.value || '').toLowerCase().trim();
        if (!query) {
            filteredCustomers = [...allCustomers];
        } else {
            filteredCustomers = allCustomers.filter(c => 
                (c.name && c.name.toLowerCase().includes(query)) ||
                (c.username && c.username.toLowerCase().includes(query)) ||
                (c.phone && c.phone.includes(query)) ||
                (c.gmail && c.gmail.toLowerCase().includes(query)) ||
                (c.email && c.email.toLowerCase().includes(query))
            );
        }
        currentPage = 1;
        displayCustomers();
    }

    if (searchBtn) searchBtn.addEventListener('click', executeSearch);
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') executeSearch();
        });
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            searchInput.value = '';
            filteredCustomers = [...allCustomers];
            currentPage = 1;
            displayCustomers();
        });
    }

    // Nút mở modal tạo khách hàng mới
    const addBtn = document.getElementById('btn-open-add-cust');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            document.getElementById('modal-cust-title').innerHTML = '<i class="fas fa-user-plus"></i> Tạo Khách Hàng Mới';
            document.getElementById('cust-mode').value = 'add';
            document.getElementById('cust-id').value = 'KH0' + (allCustomers.length + 1);
            document.getElementById('cust-id').readOnly = false;
            document.getElementById('cust-name').value = '';
            document.getElementById('cust-phone').value = '';
            document.getElementById('cust-email').value = '';
            document.getElementById('cust-address').value = '';
            document.getElementById('cust-username').value = '';
            document.getElementById('cust-username').readOnly = false;
            document.getElementById('customer-modal').classList.add('active');
        });
    }

    // Submit form Khách hàng
    const form = document.getElementById('customerForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            saveCustomerData();
        });
    }

    // Xuất Excel
    const exportBtn = document.getElementById('btn-export-customers');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const dataToExport = filteredCustomers.map(c => ({
                "Mã KH": c.id || '',
                "Họ và Tên": c.name || c.username,
                "Tên Đăng Nhập": c.username,
                "Số Điện Thoại": c.phone || '',
                "Email": c.gmail || c.email || '',
                "Địa Chỉ": c.address || '',
                "Ngày Đăng Ký": c.RegisterDay || '',
                "Trạng Thái": c.status === 'locked' ? 'Đã khóa' : 'Hoạt động'
            }));
            AdminCommon.exportTableToExcel(dataToExport, 'Danh_Sach_Khach_Hang_Keycap', 'KhachHang');
        });
    }
}

function closeCustomerModal() {
    const modal = document.getElementById('customer-modal');
    if (modal) modal.classList.remove('active');
}

function openEditCustomer(username) {
    const cust = allCustomers.find(c => c.username === username);
    if (!cust) return;

    document.getElementById('modal-cust-title').innerHTML = '<i class="fas fa-user-edit"></i> Cập Nhật Khách Hàng';
    document.getElementById('cust-mode').value = 'edit';
    document.getElementById('cust-id').value = cust.id || 'KH01';
    document.getElementById('cust-id').readOnly = true;
    document.getElementById('cust-name').value = cust.name || cust.username;
    document.getElementById('cust-phone').value = cust.phone || '';
    document.getElementById('cust-email').value = cust.gmail || cust.email || '';
    document.getElementById('cust-address').value = cust.address || '';
    document.getElementById('cust-username').value = cust.username;
    document.getElementById('cust-username').readOnly = true;

    document.getElementById('customer-modal').classList.add('active');
}

function saveCustomerData() {
    const mode = document.getElementById('cust-mode').value;
    const id = document.getElementById('cust-id').value.trim();
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const email = document.getElementById('cust-email').value.trim();
    const address = document.getElementById('cust-address').value.trim();
    const username = document.getElementById('cust-username').value.trim();

    if (!username || !name) {
        AdminCommon.showToast('Vui lòng điền họ tên và tên tài khoản!', 'error');
        return;
    }

    if (mode === 'add') {
        const exist = allCustomers.some(c => c.username.toLowerCase() === username.toLowerCase());
        if (exist) {
            AdminCommon.showToast(`Tên tài khoản "${username}" đã tồn tại!`, 'error');
            return;
        }

        allCustomers.push({
            id: id || ('KH0' + (allCustomers.length + 1)),
            username: username,
            name: name,
            phone: phone,
            gmail: email,
            address: address,
            password: '123',
            RegisterDay: new Date().toISOString().split('T')[0],
            userType: 'client',
            status: 'active',
            totalSpent: 0
        });
        AdminCommon.showToast(`Tạo khách hàng "${name}" thành công!`, 'success');
    } else {
        const idx = allCustomers.findIndex(c => c.username === username);
        if (idx !== -1) {
            allCustomers[idx] = {
                ...allCustomers[idx],
                name: name,
                phone: phone,
                gmail: email,
                address: address
            };
            AdminCommon.showToast(`Cập nhật khách hàng "${name}" thành công!`, 'success');
        }
    }

    AdminCommon.setLocalStorage('user', allCustomers);
    closeCustomerModal();
    loadCustomers();
}

function toggleLockCustomer(username) {
    const idx = allCustomers.findIndex(c => c.username === username);
    if (idx === -1) return;

    const currentStatus = allCustomers[idx].status || 'active';
    const newStatus = currentStatus === 'active' ? 'locked' : 'active';

    allCustomers[idx].status = newStatus;
    AdminCommon.setLocalStorage('user', allCustomers);
    AdminCommon.showToast(`Đã ${newStatus === 'locked' ? 'khóa' : 'mở khóa'} tài khoản "${username}"!`, 'success');
    loadCustomers();
}

// Helper: Lấy danh sách đơn hàng thuộc về một khách hàng cụ thể
function getCustomerOrders(cust, orders) {
    if (!cust) return [];
    return orders.filter(o => {
        const oCustId = o.customerId || o.custId || o.ID_KH;
        const oUser = o.customerUsername || o.username;
        const oPhone = (o.customerPhone || o.phone || o.SDT_KH || '').toString().replace(/\D/g, '');
        const cPhone = (cust.phone || cust.SDT_KH || '').toString().replace(/\D/g, '');
        const oName = (o.customerName || o.Ten_KH || '').toLowerCase().trim();
        const cName = (cust.name || cust.Ten_KH || '').toLowerCase().trim();
        const cUser = (cust.username || '').toLowerCase().trim();

        if (cust.id && oCustId && String(oCustId) === String(cust.id)) return true;
        if (cUser && oUser && oUser.toLowerCase() === cUser) return true;
        if (cPhone && oPhone && cPhone === oPhone) return true;
        if (cName && oName && (oName === cName || oName.includes(cName) || cName.includes(oName))) return true;
        if (cUser && oName && oName.includes(cUser)) return true;
        return false;
    });
}

// 7. Xem lịch sử đơn hàng của khách hàng
function openCustomerOrderHistory(customerIdentifier) {
    const cust = allCustomers.find(c => c.username === customerIdentifier || c.id === customerIdentifier);
    if (!cust) {
        AdminCommon.showToast('Không tìm thấy thông tin khách hàng!', 'error');
        return;
    }

    const orders = AdminCommon.getLocalStorage('orders') || [];
    // Tìm các đơn thuộc về khách này qua helper chuẩn
    const custOrders = getCustomerOrders(cust, orders);

    const nameEl = document.getElementById('hist-customer-name');
    if (nameEl) nameEl.innerText = `${cust.name || cust.username} (@${cust.username || cust.id})`;

    const countEl = document.getElementById('hist-total-orders');
    if (countEl) countEl.innerText = custOrders.length;

    const totalSpent = custOrders.reduce((sum, o) => sum + (parseFloat(o.total || o.totalAmount) || 0), 0);
    const spentEl = document.getElementById('hist-total-spent');
    if (spentEl) spentEl.innerText = AdminCommon.formatCurrency(totalSpent);

    const tbody = document.getElementById('hist-orders-tbody');
    if (tbody) {
        if (custOrders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 30px; color: var(--text-muted);">
                        <i class="fas fa-box-open" style="font-size: 24px; margin-bottom: 8px; display: block; opacity: 0.5;"></i>
                        Khách hàng này chưa phát sinh giao dịch đơn hàng nào trong hệ thống!
                    </td>
                </tr>
            `;
        } else {
            let rowsHtml = '';
            custOrders.forEach(o => {
                const orderId = o.orderCode || ('DH-' + o.id);
                const dateStr = o.date ? new Date(o.date).toLocaleString('vi-VN') : '---';
                const total = parseFloat(o.total || o.totalAmount) || 0;
                const payMethod = o.paymentMethod || o.payMethod || 'COD';
                const status = o.status || 'moi';
                
                let statusBadge = '<span class="badge badge-warning">Chờ xử lý</span>';
                if (status === 'xuly') {
                    statusBadge = '<span class="badge" style="background:#2563eb;color:#fff;">Đang xử lý</span>';
                } else if (status === 'giaohang' || status === 'done' || status === 'completed') {
                    statusBadge = '<span class="badge badge-success"><i class="fas fa-check"></i> Hoàn tất</span>';
                } else if (status === 'huy' || status === 'cancel') {
                    statusBadge = '<span class="badge badge-danger">Đã hủy</span>';
                }

                // Chi tiết sản phẩm
                let itemsDesc = '---';
                if (Array.isArray(o.items) && o.items.length > 0) {
                    itemsDesc = o.items.map(it => `&bull; ${AdminCommon.escapeHtml(it.name || ('SP #' + (it.id || it.productId)))} (x${it.quantity || 1})`).join('<br>');
                }

                rowsHtml += `
                    <tr style="border-bottom: 1px solid #1e2433;">
                        <td style="font-weight: 700; color: #60a5fa;">#${orderId}</td>
                        <td style="color: #cbd5e1; font-size: 12px;">${dateStr}</td>
                        <td style="color: #fff; font-size: 12px; line-height: 1.5;">${itemsDesc}</td>
                        <td style="font-weight: 700; color: #34d399;">${AdminCommon.formatCurrency(total)}</td>
                        <td><span style="font-size: 11px; padding: 2px 6px; border-radius: 4px; background: rgba(59,130,246,0.15); color: #93c5fd;">${payMethod}</span></td>
                        <td>${statusBadge}</td>
                    </tr>
                `;
            });
            tbody.innerHTML = rowsHtml;
        }
    }

    const modal = document.getElementById('customer-order-history-modal');
    if (modal) modal.style.display = 'flex';
}

function closeCustomerOrderHistoryModal() {
    const modal = document.getElementById('customer-order-history-modal');
    if (modal) modal.style.display = 'none';
}
