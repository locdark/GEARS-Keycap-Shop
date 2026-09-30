// ============================================================================
// EMPLOYEES & PERMISSIONS - Quản lý Nhân viên & Phân quyền (Nhánh BFD 6)
// Nhóm sinh viên: Danh, Quang, Lộc
// ============================================================================

let allEmployees = [];
let filteredEmployees = [];

document.addEventListener('DOMContentLoaded', function () {
    if (typeof AdminCommon !== 'undefined' && AdminCommon.checkAuth) {
        if (!AdminCommon.checkAuth('admin')) return;
    }
    loadEmployees();
    setupEmployeeEvents();
});

function loadEmployees() {
    allEmployees = AdminCommon.getLocalStorage('employees') || [];
    filteredEmployees = [...allEmployees];
    updateEmployeeKPIs();
    renderEmployeeTable();
}

function updateEmployeeKPIs() {
    const kpiTotal = document.getElementById('kpi-total-emp');
    const kpiAdmin = document.getElementById('kpi-admin-count');
    const kpiPos = document.getElementById('kpi-pos-count');
    const kpiActive = document.getElementById('kpi-active-count');

    if (kpiTotal) kpiTotal.innerText = allEmployees.length;
    if (kpiAdmin) kpiAdmin.innerText = allEmployees.filter(e => e.role === 'admin').length;
    if (kpiPos) kpiPos.innerText = allEmployees.filter(e => e.role === 'pos').length;
    if (kpiActive) kpiActive.innerText = allEmployees.filter(e => e.status === 'active').length;
}

function renderEmployeeTable() {
    const tbody = document.getElementById('employee-tbody');
    const totalCount = document.getElementById('total-employees-count');
    if (!tbody) return;

    if (totalCount) totalCount.innerText = filteredEmployees.length;

    if (filteredEmployees.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 35px; color: var(--text-muted); font-size: 14px;">
                    Không tìm thấy nhân viên nào phù hợp!
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredEmployees.map(emp => {
        const isAdmin = emp.role === 'admin';
        const isActive = emp.status === 'active';

        return `
            <tr>
                <td style="font-weight: 700; color: #38bdf8; font-family: monospace;">${AdminCommon.escapeHtml(emp.id)}</td>
                <td style="text-align: left; font-weight: 600; color: #ffffff;">${AdminCommon.escapeHtml(emp.name)}</td>
                <td>${AdminCommon.escapeHtml(emp.phone || '---')}</td>
                <td>${AdminCommon.escapeHtml(emp.email || '---')}</td>
                <td><code style="background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 4px; color: #c4b5fd;">${AdminCommon.escapeHtml(emp.username)}</code></td>
                <td>
                    <span class="badge ${isAdmin ? 'badge-primary' : 'badge-info'}">
                        <i class="fas ${isAdmin ? 'fa-crown' : 'fa-cash-register'}"></i> ${AdminCommon.escapeHtml(emp.roleName || (isAdmin ? 'Quản lý' : 'Thu ngân POS'))}
                    </span>
                </td>
                <td>
                    <span class="badge ${isActive ? 'badge-success' : 'badge-danger'}">
                        ${isActive ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                </td>
                <td style="text-align: right; white-space: nowrap;">
                    <button class="btn-table-action btn-table-stock" onclick="openRoleModal('${emp.id}')" title="Phân quyền tài khoản">
                        <i class="fas fa-shield-alt"></i> Quyền
                    </button>
                    <button class="btn-table-action btn-table-edit" onclick="openEditEmployee('${emp.id}')" title="Chỉnh sửa thông tin">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="btn-table-action btn-table-del" onclick="deleteEmployee('${emp.id}')" title="Xóa nhân viên">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function setupEmployeeEvents() {
    // Tìm kiếm
    const searchInput = document.getElementById('search-employee');
    const searchBtn = document.getElementById('btn-search-emp');
    const resetBtn = document.getElementById('btn-reset-emp');

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

    function executeSearch(showToast = false) {
        const rawQ = (searchInput.value || '').trim();
        const q = rawQ.toLowerCase();
        const unaccentQ = removeVietnameseTones(rawQ);

        if (!q) {
            filteredEmployees = [...allEmployees];
        } else {
            filteredEmployees = allEmployees.filter(e => {
                const nameUn = removeVietnameseTones(e.name || '');
                return (e.id && e.id.toLowerCase().includes(q)) ||
                    (e.name && (e.name.toLowerCase().includes(q) || nameUn.includes(unaccentQ))) ||
                    (e.username && e.username.toLowerCase().includes(q)) ||
                    (e.phone && e.phone.includes(q)) ||
                    (e.email && e.email.toLowerCase().includes(q));
            });
        }
        renderEmployeeTable();
        if (showToast) {
            AdminCommon.showToast(`Tìm thấy ${filteredEmployees.length} nhân viên phù hợp!`, 'info');
        }
    }

    if (searchBtn) searchBtn.addEventListener('click', () => executeSearch(true));
    if (searchInput) {
        searchInput.addEventListener('input', () => executeSearch(false));
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') executeSearch(true);
        });
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            filteredEmployees = [...allEmployees];
            renderEmployeeTable();
        });
    }

    // Nút mở form tạo nhân viên
    const addBtn = document.getElementById('btn-open-add-emp');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            document.getElementById('modal-emp-title').innerHTML = '<i class="fas fa-user-plus"></i> Tạo Nhân Viên Mới';
            document.getElementById('emp-mode').value = 'add';
            document.getElementById('emp-id').value = 'NV0' + (allEmployees.length + 1);
            document.getElementById('emp-id').readOnly = false;
            document.getElementById('emp-name').value = '';
            document.getElementById('emp-phone').value = '';
            document.getElementById('emp-email').value = '';
            document.getElementById('emp-username').value = '';
            document.getElementById('emp-password').value = '123456';
            document.getElementById('emp-role').value = 'pos';
            document.getElementById('employee-modal').classList.add('active');
        });
    }

    // Submit form nhân viên
    const form = document.getElementById('employeeForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            saveEmployeeData();
        });
    }

    // Xuất Excel
    const exportBtn = document.getElementById('btn-export-emp');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const dataToExport = filteredEmployees.map(e => ({
                "Mã NV": e.id,
                "Họ và Tên": e.name,
                "Số Điện Thoại": e.phone,
                "Email": e.email,
                "Tên Đăng Nhập": e.username,
                "Vai Trò Quyền": e.roleName || e.role,
                "Trạng Thái": e.status === 'active' ? 'Hoạt động' : 'Đã khóa'
            }));
            AdminCommon.exportTableToExcel(dataToExport, 'Danh_Sach_Nhan_Vien_Keycap', 'NhanVien');
        });
    }
}

function closeEmployeeModal() {
    const modal = document.getElementById('employee-modal');
    if (modal) modal.classList.remove('active');
}

function openEditEmployee(id) {
    const emp = allEmployees.find(e => e.id === id);
    if (!emp) return;

    document.getElementById('modal-emp-title').innerHTML = '<i class="fas fa-user-edit"></i> Cập Nhật Nhân Viên';
    document.getElementById('emp-mode').value = 'edit';
    document.getElementById('emp-id').value = emp.id;
    document.getElementById('emp-id').readOnly = true;
    document.getElementById('emp-name').value = emp.name || '';
    document.getElementById('emp-phone').value = emp.phone || '';
    document.getElementById('emp-email').value = emp.email || '';
    document.getElementById('emp-username').value = emp.username || '';
    document.getElementById('emp-password').value = emp.password || '';
    document.getElementById('emp-role').value = emp.role || 'pos';

    document.getElementById('employee-modal').classList.add('active');
}

function saveEmployeeData() {
    const mode = document.getElementById('emp-mode').value;
    const id = document.getElementById('emp-id').value.trim();
    const name = document.getElementById('emp-name').value.trim();
    const phone = document.getElementById('emp-phone').value.trim();
    const email = document.getElementById('emp-email').value.trim();
    const username = document.getElementById('emp-username').value.trim();
    const password = document.getElementById('emp-password').value.trim();
    const role = document.getElementById('emp-role').value;
    const roleName = role === 'admin' ? 'Quản trị viên / Quản lý' : 'Nhân viên Bán hàng / Thu ngân POS';

    if (!id || !name || !username || !password) {
        AdminCommon.showToast('Vui lòng điền các trường bắt buộc!', 'error');
        return;
    }

    if (mode === 'add') {
        const idExist = allEmployees.some(e => e.id.toLowerCase() === id.toLowerCase());
        const userExist = allEmployees.some(e => e.username.toLowerCase() === username.toLowerCase());
        if (idExist) {
            AdminCommon.showToast(`Mã nhân viên "${id}" đã tồn tại!`, 'error');
            return;
        }
        if (userExist) {
            AdminCommon.showToast(`Tên đăng nhập "${username}" đã có người sử dụng!`, 'error');
            return;
        }

        allEmployees.push({
            id, name, phone, email, username, password, role, roleName,
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0]
        });
        AdminCommon.showToast(`Tạo nhân viên "${name}" thành công!`, 'success');
    } else {
        const idx = allEmployees.findIndex(e => e.id === id);
        if (idx !== -1) {
            allEmployees[idx] = {
                ...allEmployees[idx],
                name, phone, email, username, password, role, roleName
            };
            AdminCommon.showToast(`Cập nhật nhân viên "${name}" thành công!`, 'success');
        }
    }

    AdminCommon.setLocalStorage('employees', allEmployees);
    closeEmployeeModal();
    loadEmployees();
}

// Phân quyền tài khoản riêng biệt (Use Case 2.4 - Sequence 3.3)
function openRoleModal(id) {
    const emp = allEmployees.find(e => e.id === id);
    if (!emp) return;

    document.getElementById('role-emp-id').value = emp.id;
    document.getElementById('role-emp-name').innerText = `${emp.name} (${emp.id})`;
    document.getElementById('role-select-box').value = emp.role || 'pos';
    document.getElementById('role-status-box').value = emp.status || 'active';

    document.getElementById('role-modal').classList.add('active');
}

function closeRoleModal() {
    const modal = document.getElementById('role-modal');
    if (modal) modal.classList.remove('active');
}

function saveRolePermission() {
    const id = document.getElementById('role-emp-id').value;
    const newRole = document.getElementById('role-select-box').value;
    const newStatus = document.getElementById('role-status-box').value;

    const idx = allEmployees.findIndex(e => e.id === id);
    if (idx !== -1) {
        allEmployees[idx].role = newRole;
        allEmployees[idx].roleName = newRole === 'admin' ? 'Quản trị viên / Quản lý' : 'Nhân viên Bán hàng / Thu ngân POS';
        allEmployees[idx].status = newStatus;

        AdminCommon.setLocalStorage('employees', allEmployees);
        AdminCommon.showToast(`Đã cập nhật phân quyền cho nhân viên "${allEmployees[idx].name}"!`, 'success');
        closeRoleModal();
        loadEmployees();
    }
}

function deleteEmployee(id) {
    const currentUser = AdminCommon.getLocalStorage('currentAdminUser');
    if (currentUser && currentUser.id === id) {
        alert('Bạn không thể tự xóa tài khoản của chính mình khi đang đăng nhập!');
        return;
    }

    if (confirm(`Bạn có chắc chắn muốn xóa nhân viên có mã "${id}" không?`)) {
        allEmployees = allEmployees.filter(e => e.id !== id);
        AdminCommon.setLocalStorage('employees', allEmployees);
        AdminCommon.showToast(`Đã xóa nhân viên "${id}" thành công!`, 'success');
        loadEmployees();
    }
}
