// ============================================================================
// SUPPLIERS MANAGEMENT - Quản lý Nhà cung cấp (Nhánh BFD 2 & Use Case 2.1)
// Nhóm sinh viên: Danh, Quang, Lộc
// ============================================================================

let allSuppliers = [];
let filteredSuppliers = [];

document.addEventListener('DOMContentLoaded', function () {
    loadAdminUserInfo();
    loadSuppliers();
    setupSupplierEvents();
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

function loadSuppliers() {
    allSuppliers = AdminCommon.getLocalStorage('suppliers') || [];
    filteredSuppliers = [...allSuppliers];
    renderSupplierTable();
}

function renderSupplierTable() {
    const tbody = document.getElementById('supplier-tbody');
    const totalCount = document.getElementById('total-suppliers-count');
    if (!tbody) return;

    const products = AdminCommon.getLocalStorage('product') || [];

    if (totalCount) totalCount.innerText = filteredSuppliers.length;

    if (filteredSuppliers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 45px 20px; color: var(--text-muted); font-size: 14px;">
                    <i class="fas fa-truck-loading" style="font-size: 28px; margin-bottom: 10px; display: block; opacity: 0.4;"></i>
                    Không tìm thấy nhà cung cấp nào phù hợp!
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredSuppliers.map((ncc) => {
        const linkedProducts = products.filter(p => p.supplierId === ncc.id);
        const countSP = linkedProducts.length;

        return `
            <tr>
                <td>
                    <span style="font-weight: 800; color: #c084fc; font-family: monospace;">${AdminCommon.escapeHtml(ncc.id)}</span>
                </td>
                <td style="text-align: left; font-weight: 700; color: #ffffff;">
                    ${AdminCommon.escapeHtml(ncc.name)}
                </td>
                <td style="color: var(--text-secondary);">${AdminCommon.escapeHtml(ncc.phone || '---')}</td>
                <td style="color: #60a5fa;">${AdminCommon.escapeHtml(ncc.email || '---')}</td>
                <td style="text-align: left; font-size: 12.5px; color: var(--text-secondary); max-width: 220px;">
                    <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${AdminCommon.escapeHtml(ncc.address || '')}">
                        ${AdminCommon.escapeHtml(ncc.address || '---')}
                    </div>
                </td>
                <td><span class="sidebar-badge badge-tech">${AdminCommon.escapeHtml(ncc.productTypes || 'Keycap')}</span></td>
                <td>
                    <span class="sidebar-badge ${countSP > 0 ? 'badge-live' : 'badge-count'}">
                        ${countSP} sản phẩm
                    </span>
                </td>
                <td>
                    <div style="display: flex; gap: 6px;">
                        <button class="btn-table-action btn-table-edit" onclick="openEditSupplier('${ncc.id}')" title="Chỉnh sửa thông tin NCC">
                            <i class="fas fa-edit"></i> Sửa
                        </button>
                        <button class="btn-table-action btn-table-del" onclick="deleteSupplier('${ncc.id}')" title="Xóa nhà cung cấp">
                            <i class="fas fa-trash-alt"></i> Xóa
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function setupSupplierEvents() {
    // Tìm kiếm
    const searchInput = document.getElementById('search-supplier');
    const searchBtn = document.getElementById('btn-search-supplier');
    const resetBtn = document.getElementById('btn-reset-supplier');

    function executeSearch() {
        const query = (searchInput.value || '').toLowerCase().trim();
        if (!query) {
            filteredSuppliers = [...allSuppliers];
        } else {
            filteredSuppliers = allSuppliers.filter(s => 
                (s.id && s.id.toLowerCase().includes(query)) ||
                (s.name && s.name.toLowerCase().includes(query)) ||
                (s.phone && s.phone.includes(query))
            );
        }
        renderSupplierTable();
    }

    if (searchBtn) searchBtn.addEventListener('click', executeSearch);
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') executeSearch();
        });
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            filteredSuppliers = [...allSuppliers];
            renderSupplierTable();
        });
    }

    // Nút mở form tạo NCC mới
    const addBtn = document.getElementById('btn-open-add-supplier');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            document.getElementById('modal-supplier-title').innerHTML = '<i class="fas fa-plus-circle"></i> Tạo Nhà Cung Cấp Mới';
            document.getElementById('supplier-mode').value = 'add';
            document.getElementById('supplier-id').value = 'NCC0' + (allSuppliers.length + 1);
            document.getElementById('supplier-id').readOnly = false;
            document.getElementById('supplier-name').value = '';
            document.getElementById('supplier-phone').value = '';
            document.getElementById('supplier-email').value = '';
            document.getElementById('supplier-address').value = '';
            document.getElementById('supplier-types').value = 'Artisan, Anime, Pudding';
            document.getElementById('supplier-note').value = '';
            document.getElementById('supplier-modal').classList.add('active');
        });
    }

    // Submit form Lưu/Tạo NCC
    const form = document.getElementById('supplierForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            saveSupplierData();
        });
    }

    // Xuất Excel
    const exportBtn = document.getElementById('btn-export-supplier');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const dataToExport = filteredSuppliers.map(s => ({
                "Mã NCC": s.id,
                "Tên Nhà Cung Cấp": s.name,
                "Số Điện Thoại": s.phone,
                "Email": s.email,
                "Địa Chỉ": s.address,
                "Mặt Hàng Cung Cấp": s.productTypes,
                "Ghi Chú": s.note
            }));
            AdminCommon.exportTableToExcel(dataToExport, 'Danh_Sach_Nha_Cung_Cap_Keycap', 'NhaCungCap');
        });
    }
}

function closeSupplierModal() {
    const modal = document.getElementById('supplier-modal');
    if (modal) modal.classList.remove('active');
}

function openEditSupplier(id) {
    const ncc = allSuppliers.find(s => s.id === id);
    if (!ncc) return;

    document.getElementById('modal-supplier-title').innerHTML = '<i class="fas fa-edit"></i> Cập Nhật Nhà Cung Cấp';
    document.getElementById('supplier-mode').value = 'edit';
    document.getElementById('supplier-id').value = ncc.id;
    document.getElementById('supplier-id').readOnly = true;
    document.getElementById('supplier-name').value = ncc.name || '';
    document.getElementById('supplier-phone').value = ncc.phone || '';
    document.getElementById('supplier-email').value = ncc.email || '';
    document.getElementById('supplier-address').value = ncc.address || '';
    document.getElementById('supplier-types').value = ncc.productTypes || '';
    document.getElementById('supplier-note').value = ncc.note || '';

    document.getElementById('supplier-modal').classList.add('active');
}

function saveSupplierData() {
    const mode = document.getElementById('supplier-mode').value;
    const id = document.getElementById('supplier-id').value.trim();
    const name = document.getElementById('supplier-name').value.trim();
    const phone = document.getElementById('supplier-phone').value.trim();
    const email = document.getElementById('supplier-email').value.trim();
    const address = document.getElementById('supplier-address').value.trim();
    const productTypes = document.getElementById('supplier-types').value.trim();
    const note = document.getElementById('supplier-note').value.trim();

    if (!id || !name || !phone) {
        AdminCommon.showToast('Vui lòng điền đầy đủ các thông tin bắt buộc!', 'error');
        return;
    }

    if (mode === 'add') {
        const exist = allSuppliers.some(s => s.id.toLowerCase() === id.toLowerCase());
        if (exist) {
            AdminCommon.showToast(`Mã nhà cung cấp "${id}" đã tồn tại!`, 'error');
            return;
        }
        allSuppliers.push({ id, name, phone, email, address, productTypes, note });
        AdminCommon.showToast(`Tạo nhà cung cấp "${name}" thành công!`, 'success');
    } else {
        const idx = allSuppliers.findIndex(s => s.id === id);
        if (idx !== -1) {
            allSuppliers[idx] = { ...allSuppliers[idx], name, phone, email, address, productTypes, note };
            AdminCommon.showToast(`Cập nhật nhà cung cấp "${name}" thành công!`, 'success');
        }
    }

    AdminCommon.setLocalStorage('suppliers', allSuppliers);
    closeSupplierModal();
    loadSuppliers();
}

// Xóa nhà cung cấp - kiểm tra ràng buộc theo đặc tả PTTKHDT
function deleteSupplier(id) {
    const products = AdminCommon.getLocalStorage('product') || [];
    const linked = products.filter(p => p.supplierId === id);

    if (linked.length > 0) {
        alert(`Không thể xóa nhà cung cấp "${id}"!\n\nLý do: Đang có ${linked.length} sản phẩm Keycap thuộc nhà cung cấp này trong hệ thống. Vui lòng chuyển hoặc xóa sản phẩm liên kết trước.`);
        return;
    }

    if (confirm(`Bạn có chắc chắn muốn xóa nhà cung cấp có mã "${id}" không? Thao tác này không thể hoàn tác.`)) {
        allSuppliers = allSuppliers.filter(s => s.id !== id);
        AdminCommon.setLocalStorage('suppliers', allSuppliers);
        AdminCommon.showToast(`Đã xóa nhà cung cấp "${id}" thành công!`, 'success');
        loadSuppliers();
    }
}
