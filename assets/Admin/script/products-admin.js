// ============================================================================
// PRODUCTS MANAGEMENT - Quản lý Sản phẩm Keycap (Nhánh BFD 5 - Dark Obsidian)
// Nhóm sinh viên: Danh, Quang, Lộc (PTTKHDT SGU)
// ============================================================================

let currentPage = 1;
const itemsPerPage = 8;
let allProducts = [];
let filteredProducts = [];
let allTypes = [];
let allSuppliers = [];

document.addEventListener('DOMContentLoaded', function () {
    loadAdminUserInfo();
    loadTypesAndSuppliers();
    loadProducts();
    setupProductEvents();
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

// 2. Tải danh mục và nhà cung cấp
function loadTypesAndSuppliers() {
    allTypes = AdminCommon.getLocalStorage('types') || [];
    allSuppliers = AdminCommon.getLocalStorage('suppliers') || [];

    // Filter dropdowns
    const filterCat = document.getElementById('filter-category');
    if (filterCat) {
        filterCat.innerHTML = `<option value="">Tất cả danh mục</option>`;
        allTypes.filter(t => t.id !== 'All').forEach(t => {
            filterCat.innerHTML += `<option value="${t.id}">${t.name}</option>`;
        });
    }

    const filterSup = document.getElementById('filter-supplier');
    if (filterSup) {
        filterSup.innerHTML = `<option value="">Tất cả nhà cung cấp</option>`;
        allSuppliers.forEach(s => {
            filterSup.innerHTML += `<option value="${s.id}">${s.name}</option>`;
        });
    }

    // Modal add dropdowns
    const addOpt = document.getElementById('AddOption');
    if (addOpt) {
        addOpt.innerHTML = '';
        allTypes.filter(t => t.id !== 'All').forEach(t => {
            addOpt.innerHTML += `<option value="${t.id}">${t.name}</option>`;
        });
    }

    const addSup = document.getElementById('AddSupplier');
    if (addSup) {
        addSup.innerHTML = '';
        allSuppliers.forEach(s => {
            addSup.innerHTML += `<option value="${s.id}">${s.name} (${s.id})</option>`;
        });
    }

    // Modal edit dropdowns
    const editOpt = document.getElementById('edit-prod-type');
    if (editOpt) {
        editOpt.innerHTML = '';
        allTypes.filter(t => t.id !== 'All').forEach(t => {
            editOpt.innerHTML += `<option value="${t.id}">${t.name}</option>`;
        });
    }

    const editSup = document.getElementById('edit-prod-supplier');
    if (editSup) {
        editSup.innerHTML = '';
        allSuppliers.forEach(s => {
            editSup.innerHTML += `<option value="${s.id}">${s.name} (${s.id})</option>`;
        });
    }
}

// 3. Tải danh sách sản phẩm và cập nhật KPI
function loadProducts() {
    allProducts = AdminCommon.getLocalStorage('product') || [];
    filteredProducts = [...allProducts];
    updateProductKPIs();
    displayProducts();
}

function updateProductKPIs() {
    const totalProdEl = document.getElementById('kpi-total-prod');
    if (totalProdEl) totalProdEl.innerText = allProducts.length;

    const totalStock = allProducts.reduce((sum, p) => sum + (parseInt(p.stock) || 0), 0);
    const totalStockEl = document.getElementById('kpi-total-stock');
    if (totalStockEl) totalStockEl.innerText = `${totalStock.toLocaleString('vi-VN')} nút`;

    const lowStockCount = allProducts.filter(p => (parseInt(p.stock) || 0) < 15).length;
    const lowStockEl = document.getElementById('kpi-low-stock');
    if (lowStockEl) lowStockEl.innerText = `${lowStockCount} mẫu`;

    const catKpiEl = document.getElementById('kpi-categories-count');
    if (catKpiEl) catKpiEl.innerText = `5 / ${allSuppliers.length}`;
}

// 4. Render danh sách sản phẩm ra bảng Dark Tech
function getCategoryBadge(type) {
    switch (type) {
        case 'Artisan': return '<span class="sidebar-badge badge-hot">Artisan</span>';
        case 'Anime': return '<span class="sidebar-badge badge-tech">Anime</span>';
        case 'Pudding': return '<span class="sidebar-badge badge-new">Pudding</span>';
        case 'Cherry': return '<span class="sidebar-badge badge-live">Cherry</span>';
        default: return `<span class="sidebar-badge badge-count">${AdminCommon.escapeHtml(type || 'Other')}</span>`;
    }
}

function displayProducts() {
    const tableElement = document.getElementById('product-list');
    const totalCountEl = document.getElementById('total-products');
    if (!tableElement) return;

    if (totalCountEl) totalCountEl.innerText = filteredProducts.length;

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
    const productsToDisplay = filteredProducts.slice(startIndex, endIndex);

    let tableHTML = `
        <thead>
            <tr>
                <th style="width: 70px;">ID</th>
                <th style="width: 80px;">Hình Ảnh</th>
                <th>Tên Sản Phẩm Keycap</th>
                <th style="width: 110px;">Danh Mục</th>
                <th style="width: 170px;">Nhà Cung Cấp</th>
                <th style="width: 120px;">Giá Vốn</th>
                <th style="width: 120px;">Giá Bán</th>
                <th style="width: 125px;">Tồn Kho</th>
                <th style="width: 190px;">Thao Tác</th>
            </tr>
        </thead>
        <tbody>
    `;

    if (productsToDisplay.length === 0) {
        tableHTML += `
            <tr>
                <td colspan="9" style="text-align: center; padding: 45px 20px; color: var(--text-muted); font-size: 14px;">
                    <i class="fas fa-search" style="font-size: 28px; margin-bottom: 10px; display: block; opacity: 0.4;"></i>
                    Không tìm thấy sản phẩm Keycap nào phù hợp với bộ lọc hiện tại!
                </td>
            </tr>
        `;
    } else {
        productsToDisplay.forEach((product) => {
            const imgSrc = AdminCommon.resolveAdminImgPath(product.img);
            const sup = allSuppliers.find(s => s.id === product.supplierId);
            const supName = sup ? sup.name : (product.supplierId || 'Chưa gắn');

            const isLowStock = (parseInt(product.stock) || 0) < 15;
            const isOut = (parseInt(product.stock) || 0) <= 0;
            const stockBadgeClass = isOut ? 'badge-hot' : (isLowStock ? 'badge-count' : 'badge-live');
            const stockText = isOut ? 'Hết hàng (0)' : (isLowStock ? `${product.stock} nút (Sắp hết)` : `${product.stock} nút`);

            tableHTML += `
                <tr>
                    <td>
                        <span style="font-weight: 800; color: #60a5fa; font-family: 'Roboto', sans-serif;">#${String(product.id).padStart(3, '0')}</span>
                    </td>
                    <td>
                        <img src="${imgSrc}" class="prod-table-thumb" onerror="this.src='../img/ShortCut_Icon.png'" alt="${AdminCommon.escapeHtml(product.name)}">
                    </td>
                    <td style="text-align: left;">
                        <div style="font-weight: 700; color: #ffffff; font-size: 14px; margin-bottom: 3px;">
                            ${AdminCommon.escapeHtml(product.name)}
                        </div>
                        <div style="font-size: 11.5px; color: var(--text-muted); max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${AdminCommon.escapeHtml(product.description || '')}
                        </div>
                    </td>
                    <td>${getCategoryBadge(product.type)}</td>
                    <td style="font-size: 12px; color: var(--text-secondary);">
                        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px;" title="${AdminCommon.escapeHtml(supName)}">
                            <i class="fas fa-truck-loading" style="font-size: 10px; margin-right: 4px; opacity: 0.7;"></i> ${AdminCommon.escapeHtml(supName)}
                        </div>
                    </td>
                    <td style="color: #f59e0b; font-weight: 600;">${AdminCommon.formatCurrency(product.costPrice || 0)}</td>
                    <td style="font-weight: 800; color: #34d399; font-size: 14px;">${AdminCommon.formatCurrency(product.price)}</td>
                    <td>
                        <span class="sidebar-badge ${stockBadgeClass}" style="cursor: pointer; padding: 4px 10px; font-size: 11px;" onclick="quickUpdateStock('${product.id}')" title="Nhấp để cập nhật tồn kho nhanh">
                            ${stockText} <i class="fas fa-edit" style="font-size: 9px; margin-left: 4px;"></i>
                        </span>
                    </td>
                    <td>
                        <div style="display: flex; gap: 5px;">
                            <button class="btn-table-action btn-table-stock" onclick="quickUpdateStock('${product.id}')" title="Cập nhật nhanh số lượng tồn kho">
                                <i class="fas fa-boxes-stacked"></i> Kho
                            </button>
                            <button class="btn-table-action btn-table-edit" onclick="openEditProduct('${product.id}')" title="Sửa thông tin sản phẩm">
                                <i class="fas fa-edit"></i> Sửa
                            </button>
                            <button class="btn-table-action btn-table-del" onclick="deleteProduct('${product.id}')" title="Xóa sản phẩm">
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
    if (startEl) startEl.innerText = filteredProducts.length === 0 ? 0 : startIndex + 1;
    if (endEl) endEl.innerText = endIndex;

    renderPagination(totalPages);
}

// 5. Phân trang giao diện Dark Tech
function renderPagination(totalPages) {
    const paginEl = document.getElementById('pagination-products');
    if (!paginEl) return;

    if (totalPages <= 1) {
        paginEl.innerHTML = '';
        return;
    }

    let html = '';

    // Nút Trước
    html += `
        <button class="pagination-btn-dark" ${currentPage === 1 ? 'disabled style="opacity:0.35; cursor:not-allowed;"' : `onclick="changePage(${currentPage - 1})"`}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;

    let pages = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (currentPage > 3) pages.push('...');
        const s = Math.max(2, currentPage - 1);
        const e = Math.min(totalPages - 1, currentPage + 1);
        for (let i = s; i <= e; i++) {
            if (!pages.includes(i)) pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push('...');
        if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    pages.forEach(p => {
        if (p === '...') {
            html += `<span style="padding: 0 6px; font-weight: 700; color: var(--text-muted);">...</span>`;
        } else {
            html += `
                <button class="pagination-btn-dark ${p === currentPage ? 'active' : ''}" onclick="changePage(${p})">
                    ${p}
                </button>
            `;
        }
    });

    // Nút Sau
    html += `
        <button class="pagination-btn-dark" ${currentPage === totalPages ? 'disabled style="opacity:0.35; cursor:not-allowed;"' : `onclick="changePage(${currentPage + 1})"`}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;

    paginEl.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    displayProducts();
}

// 6. Xử lý các sự kiện tương tác
function setupProductEvents() {
    const searchInput = document.getElementById('search-product');
    const filterCat = document.getElementById('filter-category');
    const filterSup = document.getElementById('filter-supplier');
    const searchBtn = document.getElementById('btn-search-product');
    const resetBtn = document.getElementById('btn-reset-filter');

    function executeFilter() {
        const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
        const cat = filterCat ? filterCat.value : '';
        const sup = filterSup ? filterSup.value : '';

        filteredProducts = allProducts.filter(p => {
            const matchQ = !query || 
                (p.name && p.name.toLowerCase().includes(query)) ||
                (p.type && p.type.toLowerCase().includes(query)) ||
                String(p.id).includes(query);
            const matchCat = !cat || p.type === cat;
            const matchSup = !sup || p.supplierId === sup;
            return matchQ && matchCat && matchSup;
        });

        currentPage = 1;
        displayProducts();
    }

    if (searchBtn) searchBtn.addEventListener('click', executeFilter);
    if (filterCat) filterCat.addEventListener('change', executeFilter);
    if (filterSup) filterSup.addEventListener('change', executeFilter);
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') executeFilter();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (filterCat) filterCat.value = '';
            if (filterSup) filterSup.value = '';
            filteredProducts = [...allProducts];
            currentPage = 1;
            displayProducts();
        });
    }

    // Modal Thêm sản phẩm
    const btnOpenAdd = document.querySelector('.js-addProduct');
    const addWrap = document.querySelector('.AddProduct_Wrap');
    const closeAddBtns = document.querySelectorAll('.js-close-btn');

    if (btnOpenAdd) {
        btnOpenAdd.addEventListener('click', () => {
            const preview = document.getElementById('add-prod-preview');
            if (preview) preview.src = '../img/ShortCut_Icon.png';
            const fileName = document.getElementById('add-file-name');
            if (fileName) fileName.innerText = 'Chưa chọn tệp ảnh';
            const fileInput = document.getElementById('add-prod-file');
            if (fileInput) fileInput.value = '';
            const form = document.getElementById('addProduct');
            if (form) form.reset();
            if (addWrap) addWrap.classList.add('isOpenAP');
        });
    }

    closeAddBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (addWrap) addWrap.classList.remove('isOpenAP');
        });
    });

    // Lưu sản phẩm mới
    const btnSaveAdd = document.getElementById('js-btn-product');
    if (btnSaveAdd) {
        btnSaveAdd.addEventListener('click', () => {
            const name = document.getElementById('js-item-name').value.trim();
            const type = document.getElementById('AddOption').value;
            const supplierId = document.getElementById('AddSupplier').value;
            const costPrice = parseFloat(document.getElementById('js-item-cost').value) || 0;
            const price = parseFloat(document.getElementById('js-item-price').value) || 0;
            const stock = parseInt(document.getElementById('js-item-stock').value) || 0;
            let img = document.getElementById('js-item-image-url').value.trim();
            const desc = document.getElementById('js-item-desc').value.trim();

            if (!name || name.length < 3) {
                AdminCommon.showToast('Tên sản phẩm Keycap phải có ít nhất 3 ký tự!', 'error');
                return;
            }

            if (costPrice <= 0) {
                AdminCommon.showToast('Giá vốn nhập hàng phải lớn hơn 0!', 'error');
                return;
            }

            if (price <= 0) {
                AdminCommon.showToast('Giá bán niêm yết phải lớn hơn 0!', 'error');
                return;
            }

            if (price < costPrice) {
                if (!confirm(`Cảnh báo: Giá bán (${AdminCommon.formatCurrency(price)}) đang THẤP HƠN giá vốn (${AdminCommon.formatCurrency(costPrice)}). Bán sản phẩm này sẽ bị lỗ. Bạn có chắc chắn muốn tiếp tục lưu không?`)) {
                    return;
                }
            }

            if (stock < 0) {
                AdminCommon.showToast('Số lượng tồn kho ban đầu không thể âm!', 'error');
                return;
            }

            if (!img) {
                img = `./assets/img/Products/${type}/001.jpg`;
            }

            const maxId = allProducts.reduce((max, p) => p.id > max ? p.id : max, 0);
            const newProd = {
                id: maxId + 1,
                name,
                type,
                supplierId,
                costPrice,
                price,
                stock,
                img,
                description: desc || `Sản phẩm Keycap ${name} thuộc dòng ${type} chính hãng.`
            };

            allProducts.unshift(newProd);
            AdminCommon.setLocalStorage('product', allProducts);
            AdminCommon.showToast(`Đã thêm sản phẩm Keycap "${name}" thành công!`, 'success');

            if (addWrap) addWrap.classList.remove('isOpenAP');
            loadProducts();
        });
    }

    // Modal Sửa sản phẩm
    const editWrap = document.querySelector('.ChangeProduct_Wrap');
    const closeEditBtns = document.querySelectorAll('.js-close-btn2');

    closeEditBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (editWrap) editWrap.classList.remove('isOpenAP');
        });
    });

    const btnSaveEdit = document.getElementById('btn-save-edit-product');
    if (btnSaveEdit) {
        btnSaveEdit.addEventListener('click', () => {
            const id = parseInt(document.getElementById('edit-prod-id').value);
            const name = document.getElementById('edit-prod-name').value.trim();
            const type = document.getElementById('edit-prod-type').value;
            const supplierId = document.getElementById('edit-prod-supplier').value;
            const costPrice = parseFloat(document.getElementById('edit-prod-cost').value) || 0;
            const price = parseFloat(document.getElementById('edit-prod-price').value) || 0;
            const stock = parseInt(document.getElementById('edit-prod-stock').value) || 0;
            const img = document.getElementById('edit-prod-img').value.trim();

            if (!name || name.length < 3) {
                AdminCommon.showToast('Tên sản phẩm phải có ít nhất 3 ký tự!', 'error');
                return;
            }

            if (costPrice <= 0 || price <= 0) {
                AdminCommon.showToast('Giá vốn và giá bán phải lớn hơn 0!', 'error');
                return;
            }

            if (stock < 0) {
                AdminCommon.showToast('Số lượng tồn kho không thể âm!', 'error');
                return;
            }

            const idx = allProducts.findIndex(p => p.id === id);
            if (idx !== -1) {
                allProducts[idx] = {
                    ...allProducts[idx],
                    name, type, supplierId, costPrice, price, stock,
                    img: img || allProducts[idx].img
                };
                AdminCommon.setLocalStorage('product', allProducts);
                AdminCommon.showToast(`Đã cập nhật sản phẩm "${name}" thành công!`, 'success');
                if (editWrap) editWrap.classList.remove('isOpenAP');
                loadProducts();
            }
        });
    }

    // Xuất Excel
    const exportBtn = document.getElementById('btn-export-products');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const dataToExport = filteredProducts.map(p => {
                const sup = allSuppliers.find(s => s.id === p.supplierId);
                return {
                    "Mã SP": p.id,
                    "Tên Sản Phẩm Keycap": p.name,
                    "Danh Mục": p.type,
                    "Mã NCC": p.supplierId || '',
                    "Tên Nhà Cung Cấp": sup ? sup.name : '',
                    "Giá Vốn Nhập (VNĐ)": p.costPrice || 0,
                    "Giá Bán Niêm Yết (VNĐ)": p.price,
                    "Số Lượng Tồn Kho": p.stock || 0,
                    "Mô Tả": p.description || ''
                };
            });
            AdminCommon.exportTableToExcel(dataToExport, 'Danh_Sach_SanPham_Keycap', 'SanPham');
        });
    }
}

// 7. Mở Modal Chỉnh Sửa Sản Phẩm
function openEditProduct(id) {
    const prod = allProducts.find(p => String(p.id) === String(id));
    if (!prod) {
        AdminCommon.showToast('Không tìm thấy sản phẩm mã #' + id, 'error');
        return;
    }

    document.getElementById('edit-prod-id').value = prod.id;
    document.getElementById('edit-prod-name').value = prod.name;
    document.getElementById('edit-prod-type').value = prod.type;
    document.getElementById('edit-prod-supplier').value = prod.supplierId || (allSuppliers[0] ? allSuppliers[0].id : '');
    document.getElementById('edit-prod-cost').value = prod.costPrice || 0;
    document.getElementById('edit-prod-price').value = prod.price;
    document.getElementById('edit-prod-stock').value = prod.stock || 0;
    document.getElementById('edit-prod-img').value = prod.img || '';

    const editFileName = document.getElementById('edit-file-name');
    if (editFileName) editFileName.innerText = 'Chưa chọn tệp ảnh mới';
    const editFileInput = document.getElementById('edit-prod-file');
    if (editFileInput) editFileInput.value = '';

    const preview = document.getElementById('edit-prod-preview');
    if (preview) {
        preview.src = AdminCommon.resolveAdminImgPath(prod.img);
        preview.onerror = function() { this.src = '../img/ShortCut_Icon.png'; };
    }

    const editWrap = document.querySelector('.ChangeProduct_Wrap');
    if (editWrap) editWrap.classList.add('isOpenAP');
}

// 8. Xử lý upload ảnh tệp máy tính cho Thêm / Sửa sản phẩm
function handleProductFileUpload(input, mode) {
    if (!input || !input.files || input.files.length === 0) return;
    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
        AdminCommon.showToast('Vui lòng chọn một tệp hình ảnh hợp lệ (PNG, JPG, WEBP)!', 'error');
        return;
    }

    const fileNameEl = document.getElementById(mode === 'add' ? 'add-file-name' : 'edit-file-name');
    if (fileNameEl) fileNameEl.innerText = file.name;

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Data = e.target.result;
        if (mode === 'add') {
            const urlInput = document.getElementById('js-item-image-url');
            if (urlInput) urlInput.value = base64Data;
            const preview = document.getElementById('add-prod-preview');
            if (preview) preview.src = base64Data;
        } else {
            const urlInput = document.getElementById('edit-prod-img');
            if (urlInput) urlInput.value = base64Data;
            const preview = document.getElementById('edit-prod-preview');
            if (preview) preview.src = base64Data;
        }
        AdminCommon.showToast(`Đã tải lên tệp ảnh "${file.name}" thành công!`, 'success');
    };
    reader.readAsDataURL(file);
}

// 9. Cập nhật xem trước ảnh khi người dùng gõ / dán URL ảnh
function updateImagePreviewFromInput(mode) {
    const urlInput = document.getElementById(mode === 'add' ? 'js-item-image-url' : 'edit-prod-img');
    const preview = document.getElementById(mode === 'add' ? 'add-prod-preview' : 'edit-prod-preview');
    if (!urlInput || !preview) return;

    const val = urlInput.value.trim();
    if (val) {
        preview.src = AdminCommon.resolveAdminImgPath(val);
        preview.onerror = function() { this.src = '../img/ShortCut_Icon.png'; };
    } else {
        preview.src = '../img/ShortCut_Icon.png';
    }
}

// 10. Cập nhật nhanh số lượng tồn kho qua Modal Hiện Đại
let currentEditingStockProductId = null;

function quickUpdateStock(productId) {
    const prod = allProducts.find(p => String(p.id) === String(productId));
    if (!prod) {
        AdminCommon.showToast('Không tìm thấy sản phẩm có mã ' + productId, 'error');
        return;
    }

    currentEditingStockProductId = prod.id;
    const modal = document.getElementById('quickStockModal');
    if (!modal) {
        // Fallback prompt nếu modal chưa nạp
        const val = prompt(`Cập nhật tồn kho sản phẩm "${prod.name}":`, prod.stock || 0);
        if (val !== null && !isNaN(parseInt(val))) {
            prod.stock = Math.max(0, parseInt(val));
            AdminCommon.setLocalStorage('product', allProducts);
            AdminCommon.showToast(`Đã cập nhật tồn kho "${prod.name}": ${prod.stock} nút!`, 'success');
            updateProductKPIs();
            displayProducts();
        }
        return;
    }

    document.getElementById('stock-modal-name').innerText = prod.name;
    document.getElementById('stock-modal-id').innerText = '#' + String(prod.id).padStart(3, '0');
    document.getElementById('stock-modal-current').innerText = (prod.stock || 0) + ' nút';
    document.getElementById('stock-modal-input').value = prod.stock || 0;
    
    const imgEl = document.getElementById('stock-modal-img');
    if (imgEl) {
        imgEl.src = AdminCommon.resolveAdminImgPath(prod.img);
        imgEl.onerror = function() { this.src = '../img/ShortCut_Icon.png'; };
    }

    modal.style.display = 'flex';
    setTimeout(() => {
        const inp = document.getElementById('stock-modal-input');
        if (inp) {
            inp.focus();
            inp.select();
        }
    }, 100);
}

function closeQuickStockModal() {
    const modal = document.getElementById('quickStockModal');
    if (modal) modal.style.display = 'none';
    currentEditingStockProductId = null;
}

function adjustStockModal(delta) {
    const inp = document.getElementById('stock-modal-input');
    if (!inp) return;
    let val = parseInt(inp.value, 10);
    if (isNaN(val)) val = 0;
    val = Math.max(0, val + delta);
    inp.value = val;
}

async function saveQuickStockModal() {
    if (!currentEditingStockProductId) return;
    const prod = allProducts.find(p => String(p.id) === String(currentEditingStockProductId));
    if (!prod) return;

    const inp = document.getElementById('stock-modal-input');
    const newStock = parseInt(inp.value, 10);
    if (isNaN(newStock) || newStock < 0) {
        AdminCommon.showToast('Số lượng tồn kho phải là số nguyên >= 0!', 'error');
        return;
    }

    const oldStock = prod.stock || 0;
    prod.stock = newStock;
    AdminCommon.setLocalStorage('product', allProducts);

    // Đồng bộ nếu có backend
    try {
        if (typeof GearsApp !== 'undefined' && GearsApp.getInstance) {
            const app = GearsApp.getInstance();
            if (app.productService) app.productService.update(prod.id, { stock: newStock });
        }
    } catch(e) {}

    closeQuickStockModal();
    AdminCommon.showToast(`Đã cập nhật tồn kho "${prod.name}": ${oldStock} -> ${newStock} nút!`, 'success');
    updateProductKPIs();
    displayProducts();
}

// 11. Xóa sản phẩm với ràng buộc nghiệp vụ PTTKHDT
function deleteProduct(id) {
    const prod = allProducts.find(p => String(p.id) === String(id));
    if (!prod) return;

    const orders = AdminCommon.getLocalStorage('orders') || [];
    const relatedOrders = orders.filter(o => (o.items || []).some(it => String(it.id) === String(id)));

    if (relatedOrders.length > 0) {
        alert(`KHÔNG THỂ XÓA SẢN PHẨM NÀY!\n\nSản phẩm: "${prod.name}" (Mã SP #${id})\nĐã tồn tại trong ${relatedOrders.length} đơn hàng trong hệ thống.\n\nQuy tắc nghiệp vụ chuẩn PTTKHDT: Sản phẩm đã phát sinh giao dịch lịch sử không được phép xóa nhằm bảo đảm toàn vẹn dữ liệu kế toán và đối soát đơn hàng.`);
        return;
    }

    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm Keycap "${prod.name}" ra khỏi hệ thống không?`)) {
        allProducts = allProducts.filter(p => String(p.id) !== String(id));
        AdminCommon.setLocalStorage('product', allProducts);
        AdminCommon.showToast(`Đã xóa sản phẩm "${prod.name}" thành công!`, 'success');
        updateProductKPIs();
        loadProducts();
    }
}

// ============================================================================
// 12. QUẢN LÝ DANH MỤC KEYCAP (THÊM, SỬA, XÓA DANH MỤC)
// ============================================================================

function openCategoryManageModal() {
    const modal = document.getElementById('categoryManageModal');
    if (!modal) return;
    resetCategoryForm();
    renderCategoryTable();
    modal.style.display = 'flex';
}

function closeCategoryManageModal() {
    const modal = document.getElementById('categoryManageModal');
    if (modal) modal.style.display = 'none';
}

function clearCatInputErrors() {
    ['cat-input-id', 'cat-input-name'].forEach(id => {
        const el = document.getElementById(id);
        const err = document.getElementById('error-' + id);
        if (el) {
            el.style.borderColor = '#2b3147';
            el.style.backgroundColor = '#0f111a';
        }
        if (err) {
            err.innerText = '';
            err.style.display = 'none';
        }
    });
}

function setCatInputError(id, msg) {
    const el = document.getElementById(id);
    const err = document.getElementById('error-' + id);
    if (el) {
        el.style.borderColor = '#ef4444';
        el.style.backgroundColor = '#1f1315';
    }
    if (err) {
        err.innerText = msg;
        err.style.display = 'block';
    }
}

function resetCategoryForm() {
    clearCatInputErrors();
    document.getElementById('cat-edit-mode').value = 'add';
    document.getElementById('cat-edit-original-id').value = '';
    const idInp = document.getElementById('cat-input-id');
    const nameInp = document.getElementById('cat-input-name');
    const descInp = document.getElementById('cat-input-desc');
    if (idInp) { idInp.value = ''; idInp.readOnly = false; }
    if (nameInp) nameInp.value = '';
    if (descInp) descInp.value = '';

    document.getElementById('cat-form-title').innerHTML = '<i class="fas fa-plus-circle"></i> Thêm Danh Mục Keycap Mới';
    document.getElementById('btn-save-cat-text').innerText = 'Lưu Danh Mục';
    document.getElementById('btn-cancel-edit-cat').style.display = 'none';
}

function renderCategoryTable() {
    allTypes = AdminCommon.getLocalStorage('types') || [];
    const tbody = document.getElementById('category-table-body');
    const badge = document.getElementById('cat-count-badge');
    if (!tbody) return;

    const validTypes = allTypes.filter(t => t.id !== 'All');
    if (badge) badge.innerText = `${validTypes.length} danh mục`;

    if (validTypes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px; color:#94a3b8;">Chưa có danh mục nào.</td></tr>`;
        return;
    }

    tbody.innerHTML = validTypes.map(t => {
        const prodCount = allProducts.filter(p => (p.type || '').toLowerCase() === t.id.toLowerCase()).length;
        return `
            <tr style="border-bottom: 1px solid #232738;">
                <td style="padding: 10px 14px; font-weight: 700; color: #38bdf8; font-family: monospace;">${AdminCommon.escapeHtml(t.id)}</td>
                <td style="padding: 10px 14px; font-weight: 600; color: #ffffff;">
                    ${AdminCommon.escapeHtml(t.name)}
                    ${t.description ? `<div style="font-size: 11.5px; color: #94a3b8; font-weight: normal;">${AdminCommon.escapeHtml(t.description)}</div>` : ''}
                </td>
                <td style="padding: 10px 14px; text-align: center;">
                    <span style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 12px;">
                        ${prodCount} sản phẩm
                    </span>
                </td>
                <td style="padding: 10px 14px; text-align: right; white-space: nowrap;">
                    <button class="btn-table-action btn-table-edit" onclick="editCategory('${t.id}')" title="Sửa danh mục">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="btn-table-action btn-table-del" onclick="deleteCategory('${t.id}')" title="Xóa danh mục">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function saveCategory() {
    clearCatInputErrors();
    const mode = document.getElementById('cat-edit-mode').value;
    const origId = document.getElementById('cat-edit-original-id').value;
    const idInp = document.getElementById('cat-input-id');
    const nameInp = document.getElementById('cat-input-name');
    const descInp = document.getElementById('cat-input-desc');

    const catId = (idInp ? idInp.value : '').trim();
    const catName = (nameInp ? nameInp.value : '').trim();
    const catDesc = (descInp ? descInp.value : '').trim();

    let firstInvalid = null;

    if (!catId) {
        setCatInputError('cat-input-id', 'Vui lòng nhập mã danh mục (không dấu, VD: Artisan, Custom)!');
        if (!firstInvalid) firstInvalid = 'cat-input-id';
    } else if (/\s/.test(catId)) {
        setCatInputError('cat-input-id', 'Mã danh mục không được chứa khoảng cách!');
        if (!firstInvalid) firstInvalid = 'cat-input-id';
    }

    if (!catName) {
        setCatInputError('cat-input-name', 'Vui lòng nhập tên hiển thị danh mục!');
        if (!firstInvalid) firstInvalid = 'cat-input-name';
    }

    if (firstInvalid) {
        document.getElementById(firstInvalid).focus();
        AdminCommon.showToast('Vui lòng kiểm tra các ô màu đỏ còn thiếu hoặc sai định dạng!', 'error');
        return;
    }

    let types = AdminCommon.getLocalStorage('types') || [];

    if (mode === 'add') {
        const exist = types.some(t => t.id.toLowerCase() === catId.toLowerCase());
        if (exist) {
            setCatInputError('cat-input-id', 'Mã danh mục này đã tồn tại!');
            idInp.focus();
            return;
        }

        types.push({
            id: catId,
            name: catName,
            description: catDesc
        });
        AdminCommon.setLocalStorage('types', types);
        AdminCommon.showToast(`Đã thêm mới danh mục "${catName}" thành công!`, 'success');
    } else {
        const idx = types.findIndex(t => t.id === origId);
        if (idx !== -1) {
            types[idx].name = catName;
            types[idx].description = catDesc;
            AdminCommon.setLocalStorage('types', types);
            AdminCommon.showToast(`Đã cập nhật danh mục "${catName}" thành công!`, 'success');
        }
    }

    resetCategoryForm();
    renderCategoryTable();
    loadTypesAndSuppliers();
    updateProductKPIs();
}

function editCategory(catId) {
    clearCatInputErrors();
    const types = AdminCommon.getLocalStorage('types') || [];
    const cat = types.find(t => t.id === catId);
    if (!cat) return;

    document.getElementById('cat-edit-mode').value = 'edit';
    document.getElementById('cat-edit-original-id').value = cat.id;

    const idInp = document.getElementById('cat-input-id');
    const nameInp = document.getElementById('cat-input-name');
    const descInp = document.getElementById('cat-input-desc');

    if (idInp) { idInp.value = cat.id; idInp.readOnly = true; }
    if (nameInp) nameInp.value = cat.name;
    if (descInp) descInp.value = cat.description || '';

    document.getElementById('cat-form-title').innerHTML = `<i class="fas fa-edit"></i> Chỉnh Sửa Danh Mục: ${cat.name}`;
    document.getElementById('btn-save-cat-text').innerText = 'Lưu Cập Nhật';
    document.getElementById('btn-cancel-edit-cat').style.display = 'inline-flex';
    nameInp.focus();
}

function deleteCategory(catId) {
    let types = AdminCommon.getLocalStorage('types') || [];
    const cat = types.find(t => t.id === catId);
    if (!cat) return;

    const prodCount = allProducts.filter(p => (p.type || '').toLowerCase() === catId.toLowerCase()).length;
    if (prodCount > 0) {
        if (!confirm(`CẢNH BÁO TOÀN VẸN DỮ LIỆU:\nDanh mục "${cat.name}" hiện đang có ${prodCount} sản phẩm Keycap.\n\nNếu bạn xóa danh mục này, các sản phẩm liên quan sẽ được tự động chuyển sang danh mục "Other" (Khác) để tránh mồ côi dữ liệu.\n\nBạn có chắc chắn muốn xóa danh mục này không?`)) {
            return;
        }

        allProducts.forEach(p => {
            if ((p.type || '').toLowerCase() === catId.toLowerCase()) {
                p.type = 'Other';
            }
        });
        AdminCommon.setLocalStorage('product', allProducts);
    } else {
        if (!confirm(`Bạn có chắc chắn muốn xóa danh mục "${cat.name}" (${catId}) không?`)) {
            return;
        }
    }

    types = types.filter(t => t.id !== catId);
    AdminCommon.setLocalStorage('types', types);
    AdminCommon.showToast(`Đã xóa danh mục "${cat.name}" thành công!`, 'success');

    resetCategoryForm();
    renderCategoryTable();
    loadTypesAndSuppliers();
    updateProductKPIs();
    displayProducts();
}

['cat-input-id', 'cat-input-name'].forEach(id => {
    document.addEventListener('input', (e) => {
        if (e.target && e.target.id === id) {
            e.target.style.borderColor = '#2b3147';
            e.target.style.backgroundColor = '#0f111a';
            const err = document.getElementById('error-' + id);
            if (err) { err.innerText = ''; err.style.display = 'none'; }
        }
    });
});

window.openCategoryManageModal = openCategoryManageModal;
window.closeCategoryManageModal = closeCategoryManageModal;
window.saveCategory = saveCategory;
window.editCategory = editCategory;
window.deleteCategory = deleteCategory;
window.resetCategoryForm = resetCategoryForm;
