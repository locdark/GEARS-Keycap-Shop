// ============================================================================
// STOREFRONT CONTROLLER - GEARS KEYCAP SHOP (CLIENT WEB STORE)
// Tích hợp: Giỏ hàng khách vãng lai, Thanh toán SePay VietQR, Giả lập Webhook
// ============================================================================

let clientProducts = [];
let displayedProducts = [];
let clientCart = [];
let currentClientCategory = 'all';
let clientCurrentPage = 1;
let clientPageSize = 'all';
let clientSortBy = 'default';
let currentPendingOrder = null;
let sepayCountdownTimer = null;

document.addEventListener('DOMContentLoaded', function() {
    // 1. Khởi tạo hệ thống dữ liệu chuẩn
    if (window.AdminCommon && window.AdminCommon.initializeSystemData) {
        window.AdminCommon.initializeSystemData();
    }

    // 2. Áp dụng nhận diện thương hiệu từ Admin
    if (window.AdminCommon && window.AdminCommon.applyWebsiteConfigToPage) {
        window.AdminCommon.applyWebsiteConfigToPage();
    }

    // 3. Khởi tạo giỏ hàng & sản phẩm
    loadClientCart();
    loadClientProducts();
    checkClientLoginStatus();
    setupClientEvents();
});

// ----------------------------------------------------------------------------
// I. QUẢN LÝ SẢN PHẨM & TÌM KIẾM, PHÂN TRANG
// ----------------------------------------------------------------------------

function setupClientEvents() {
    // 1. Lắng nghe ô tìm kiếm
    const searchInput = document.getElementById('client-search-input');
    const searchBtn = document.getElementById('client-search-btn');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clientCurrentPage = 1;
            applyFiltersAndSort();
        });
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                clientCurrentPage = 1;
                applyFiltersAndSort();
                const showcase = document.getElementById('product-showcase');
                if (showcase) showcase.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            clientCurrentPage = 1;
            applyFiltersAndSort();
            const showcase = document.getElementById('product-showcase');
            if (showcase) showcase.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // 2. Tự động xóa viền đỏ khi người dùng gõ vào ô nhập liệu
    const inputPairs = [
        ['login-username', 'error-login-username'],
        ['login-password', 'error-login-password'],
        ['reg-fullname', 'error-reg-fullname'],
        ['reg-phone', 'error-reg-phone'],
        ['reg-username', 'error-reg-username'],
        ['reg-email', 'error-reg-email'],
        ['reg-password', 'error-reg-password']
    ];
    inputPairs.forEach(([inpId, errId]) => {
        const inp = document.getElementById(inpId);
        if (inp) {
            inp.addEventListener('input', function() {
                clearInputError(inpId, errId);
            });
        }
    });

    // 3. Nút tài khoản trên Header
    const userBtn = document.getElementById('gear-user-action-btn');
    if (userBtn) {
        userBtn.addEventListener('click', function() {
            const user = AdminCommon.getLocalStorage('clientLoggedInUser');
            if (user) {
                openUserProfileModal();
            } else {
                openLoginModal('login');
            }
        });
    }
}

function loadClientProducts() {
    clientProducts = AdminCommon.getLocalStorage('product') || [];
    applyFiltersAndSort();
}

function filterCategory(cat, element, shouldScroll = true) {
    currentClientCategory = cat;
    clientCurrentPage = 1;

    // Cập nhật trạng thái active trên thanh navigation
    const navLinks = document.querySelectorAll('.gear-nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    if (element) {
        element.classList.add('active');
    } else {
        navLinks.forEach(link => {
            if (cat === 'all' && link.getAttribute('data-cat') === 'all') link.classList.add('active');
            else if (link.getAttribute('data-cat') === cat) link.classList.add('active');
        });
    }

    // Đóng dropdown nếu đang mở
    const dropdown = document.getElementById('gear-category-menu');
    const catBtn = document.getElementById('btn-category-toggle');
    if (dropdown) {
        dropdown.classList.remove('show');
        dropdown.style.display = 'none';
    }
    if (catBtn) catBtn.classList.remove('active');

    applyFiltersAndSort();

    // Tự động cuộn từ từ, mượt mà xuống danh sách sản phẩm (không bị giật nhanh)
    if (shouldScroll) {
        const showcase = document.getElementById('product-showcase');
        if (showcase) {
            smoothScrollToElement(showcase, 850);
        }
    }
}

// Hàm cuộn mượt tự nhiên với gia tốc Easing (Quadratic Ease In-Out)
function smoothScrollToElement(targetEl, duration = 850) {
    if (!targetEl) return;
    const headerOffset = 80;
    const targetY = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    const startY = window.pageYOffset;
    const diff = targetY - startY;
    if (Math.abs(diff) < 10) return;

    let startTime = null;

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const ease = easeInOutCubic(progress);
        window.scrollTo(0, startY + diff * ease);

        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    }

    window.requestAnimationFrame(step);
}

function toggleCategoryDropdown(event) {
    if (event) {
        event.stopPropagation();
    }
    const dropdown = document.getElementById('gear-category-menu');
    const btn = document.getElementById('btn-category-toggle');
    if (!dropdown) return;
    
    const isOpen = dropdown.classList.contains('show') || dropdown.style.display === 'block';
    if (isOpen) {
        dropdown.classList.remove('show');
        dropdown.style.display = 'none';
        if (btn) btn.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        dropdown.style.display = 'block';
        if (btn) btn.classList.add('active');
    }
}
window.toggleCategoryDropdown = toggleCategoryDropdown;

function toggleCategorySidebarOrDropdown(event) {
    if (event) event.stopPropagation();
    const sidebar = document.getElementById('gear-category-sidebar');
    if (sidebar && window.getComputedStyle(sidebar).display !== 'none') {
        sidebar.scrollIntoView({ behavior: 'smooth', block: 'center' });
        sidebar.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
        sidebar.style.boxShadow = '0 0 20px rgba(227, 0, 25, 0.4)';
        sidebar.style.borderColor = 'var(--gear-red)';
        setTimeout(() => {
            sidebar.style.boxShadow = '';
            sidebar.style.borderColor = '';
        }, 1200);
    } else {
        const showcase = document.getElementById('product-showcase');
        if (showcase) smoothScrollToElement(showcase, 850);
    }
}
window.toggleCategorySidebarOrDropdown = toggleCategorySidebarOrDropdown;

// Đóng dropdown khi click bên ngoài
document.addEventListener('click', function(e) {
    const wrap = document.getElementById('gear-cat-wrapper');
    const menu = document.getElementById('gear-category-menu');
    const btn = document.getElementById('btn-category-toggle');
    if (wrap && !wrap.contains(e.target)) {
        if (menu) {
            menu.classList.remove('show');
            menu.style.display = 'none';
        }
        if (btn) btn.classList.remove('active');
    }
});

function changeSort(sortBy, btn) {
    clientSortBy = sortBy;
    clientCurrentPage = 1;

    document.querySelectorAll('.gear-sort-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    applyFiltersAndSort();
}

function changePageSize(size) {
    clientPageSize = size === 'all' ? 'all' : (parseInt(size) || 12);
    clientCurrentPage = 1;
    applyFiltersAndSort();
}

function applyFiltersAndSort() {
    const searchInput = document.getElementById('client-search-input');
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

    let result = [...clientProducts];

    // Lọc theo danh mục
    if (currentClientCategory !== 'all') {
        result = result.filter(p => p.type === currentClientCategory);
    }

    // Lọc theo từ khóa tìm kiếm
    if (query) {
        result = result.filter(p =>
            (p.name && p.name.toLowerCase().includes(query)) ||
            (p.type && p.type.toLowerCase().includes(query)) ||
            (p.description && p.description.toLowerCase().includes(query))
        );
    }

    // Sắp xếp
    if (clientSortBy === 'price-asc') {
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (clientSortBy === 'price-desc') {
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (clientSortBy === 'name-asc') {
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    displayedProducts = result;
    renderClientProducts();
}

function renderClientProducts() {
    const container = document.getElementById('gear-products-container');
    const countDisplay = document.getElementById('product-count-display');
    const paginContainer = document.getElementById('client-pagination');
    const paginInfo = document.getElementById('pagination-info');
    if (!container) return;

    const total = displayedProducts.length;
    if (countDisplay) countDisplay.innerText = total;

    if (total === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #9ca3af; font-size: 1.5rem; background: #fff; border-radius: 8px; border: 1px dashed #cbd5e1;">
                <i class="fas fa-search" style="font-size: 3.5rem; color: #cbd5e1; margin-bottom: 14px; display: block;"></i>
                Không tìm thấy sản phẩm Keycap nào phù hợp với yêu cầu tìm kiếm!
            </div>
        `;
        if (paginInfo) paginInfo.innerText = 'Không có sản phẩm nào để hiển thị';
        if (paginContainer) paginContainer.innerHTML = '';
        return;
    }

    const isShowAll = (clientPageSize === 'all');
    const totalPages = isShowAll ? 1 : (Math.ceil(total / clientPageSize) || 1);
    if (clientCurrentPage > totalPages) clientCurrentPage = totalPages;
    if (clientCurrentPage < 1) clientCurrentPage = 1;

    const startIndex = isShowAll ? 0 : (clientCurrentPage - 1) * clientPageSize;
    const endIndex = isShowAll ? total : Math.min(startIndex + clientPageSize, total);
    const pageItems = isShowAll ? displayedProducts : displayedProducts.slice(startIndex, endIndex);

    container.innerHTML = pageItems.map(p => {
        let imgSrc = p.img || './assets/img/Products/Artisan/001.jpg';
        if (imgSrc.startsWith('/img/')) imgSrc = '.' + imgSrc;
        else if (imgSrc.startsWith('img/')) imgSrc = './assets/' + imgSrc;

        const originalPrice = Math.round(p.price * 1.25);
        const discountPercent = 20;
        const isOutOfStock = (p.stock || 0) <= 0;

        return `
            <div class="gear-product-card">
                <span class="gear-discount-tag">-${discountPercent}%</span>
                
                <div class="gear-card-img-wrap">
                    <img src="${imgSrc}" class="gear-card-img" onerror="this.src='./assets/img/ShortCut_Icon.png'" alt="${AdminCommon.escapeHtml(p.name)}">
                </div>

                <div class="gear-card-brand">${AdminCommon.escapeHtml(p.type || 'Keycap')}</div>
                <h3 class="gear-card-title" title="${AdminCommon.escapeHtml(p.name)}">
                    ${AdminCommon.escapeHtml(p.name)}
                </h3>

                <div class="gear-rating-box">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <span style="color: #64748b; font-size: 1.1rem; margin-left: 4px;">(5.0)</span>
                </div>

                <div class="gear-card-prices">
                    <span class="gear-price-sale">${AdminCommon.formatCurrency(p.price)}</span>
                    <span class="gear-price-old">${AdminCommon.formatCurrency(originalPrice)}</span>
                </div>

                <div class="gear-stock-status">
                    <span class="gear-stock-dot" style="background: ${isOutOfStock ? '#ef4444' : '#10b981'};"></span>
                    <span style="color: ${isOutOfStock ? '#ef4444' : '#10b981'};">
                        ${isOutOfStock ? 'Tạm hết hàng' : `Còn hàng (Kho: ${p.stock})`}
                    </span>
                </div>

                <div class="gear-card-bottom">
                    <div class="gear-card-qty-row">
                        <span class="gear-qty-label">Số lượng:</span>
                        <div class="card-stepper">
                            <button type="button" class="btn-card-step" onclick="stepProductQty(${p.id}, -1)" title="Giảm số lượng">-</button>
                            <span class="card-step-val" id="prod-qty-${p.id}">1</span>
                            <button type="button" class="btn-card-step" onclick="stepProductQty(${p.id}, 1)" title="Tăng số lượng">+</button>
                        </div>
                    </div>
                    <button type="button" class="gear-card-btn-add" ${isOutOfStock ? 'disabled' : `onclick="addToClientCartWithQty(${p.id})"`} title="${isOutOfStock ? 'Sản phẩm tạm hết hàng' : 'Thêm sản phẩm vào giỏ hàng'}">
                        <i class="fas ${isOutOfStock ? 'fa-ban' : 'fa-cart-plus'}"></i> <span>${isOutOfStock ? 'HẾT HÀNG' : 'THÊM VÀO GIỎ'}</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    if (paginInfo) {
        if (isShowAll || totalPages <= 1) {
            paginInfo.innerText = `Hiển thị toàn bộ ${total} sản phẩm Keycap`;
        } else {
            paginInfo.innerText = `Hiển thị ${startIndex + 1} - ${endIndex} trên tổng số ${total} sản phẩm Keycap (Trang ${clientCurrentPage}/${totalPages})`;
        }
    }

    renderClientPagination(totalPages);
}

function renderClientPagination(totalPages) {
    const paginEl = document.getElementById('client-pagination');
    if (!paginEl) return;

    if (totalPages <= 1) {
        paginEl.innerHTML = '';
        return;
    }

    let html = `
        <button type="button" class="gear-page-btn" ${clientCurrentPage === 1 ? 'disabled' : ''} onclick="changeClientPage(${clientCurrentPage - 1})">
            <i class="fas fa-chevron-left"></i> Trước
        </button>
    `;

    let pagesToShow = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pagesToShow.push(i);
    } else {
        pagesToShow.push(1);
        if (clientCurrentPage > 3) pagesToShow.push('...');
        
        const start = Math.max(2, clientCurrentPage - 1);
        const end = Math.min(totalPages - 1, clientCurrentPage + 1);
        for (let i = start; i <= end; i++) {
            if (!pagesToShow.includes(i)) pagesToShow.push(i);
        }

        if (clientCurrentPage < totalPages - 2) pagesToShow.push('...');
        if (!pagesToShow.includes(totalPages)) pagesToShow.push(totalPages);
    }

    pagesToShow.forEach(item => {
        if (item === '...') {
            html += `<span class="gear-page-ellipsis">...</span>`;
        } else {
            html += `
                <button type="button" class="gear-page-btn ${item === clientCurrentPage ? 'active' : ''}" onclick="changeClientPage(${item})">
                    ${item}
                </button>
            `;
        }
    });

    html += `
        <button type="button" class="gear-page-btn" ${clientCurrentPage === totalPages ? 'disabled' : ''} onclick="changeClientPage(${clientCurrentPage + 1})">
            Sau <i class="fas fa-chevron-right"></i>
        </button>
    `;

    paginEl.innerHTML = html;
}

function changeClientPage(page) {
    clientCurrentPage = page;
    renderClientProducts();

    const targetEl = document.getElementById('product-showcase');
    if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function setupClientEvents() {
    const searchInput = document.getElementById('client-search-input');
    const searchBtn = document.getElementById('client-search-btn');

    if (searchBtn) searchBtn.addEventListener('click', () => {
        clientCurrentPage = 1;
        applyFiltersAndSort();
    });

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clientCurrentPage = 1;
            applyFiltersAndSort();
        });
    }

    ['order-cust-name', 'order-cust-phone', 'order-cust-address'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => clearInputError(id, 'error-' + id));
        }
    });
}

// ----------------------------------------------------------------------------
// II. QUẢN LÝ GIỎ HÀNG KHÁCH HÀNG (CHO PHÉP CHƯA ĐĂNG NHẬP VẪN THÊM ĐƯỢC)
// ----------------------------------------------------------------------------

function loadClientCart() {
    clientCart = AdminCommon.getLocalStorage('clientCart') || [];
    updateCartBadge();
}

function updateCartBadge() {
    const countBadge = document.getElementById('client-cart-count');
    const totalQty = clientCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (countBadge) {
        countBadge.innerText = totalQty;
        countBadge.classList.add('bump');
        setTimeout(() => countBadge.classList.remove('bump'), 300);
    }
}

// Thêm vào giỏ hàng HOÀN TOÀN KHÔNG BẮT ĐĂNG NHẬP
function addToClientCart(productId, quantity = 1) {
    const p = clientProducts.find(item => item.id == productId || String(item.id) === String(productId));
    if (!p) {
        console.error('Không tìm thấy sản phẩm:', productId);
        return;
    }

    if ((p.stock || 0) <= 0) {
        AdminCommon.showToast('Sản phẩm này hiện đang tạm hết hàng!', 'error');
        return;
    }

    const qtyToAdd = Math.max(1, parseInt(quantity) || 1);
    const existingIndex = clientCart.findIndex(item => item.id == productId || String(item.id) === String(productId));
    const currentInCart = existingIndex !== -1 ? clientCart[existingIndex].quantity : 0;

    if (currentInCart + qtyToAdd > (p.stock || 0)) {
        AdminCommon.showToast(`Kho chỉ còn ${p.stock} sản phẩm! Không thể thêm vượt quá số lượng tồn kho.`, 'error');
        return;
    }

    if (existingIndex !== -1) {
        clientCart[existingIndex].quantity += qtyToAdd;
    } else {
        clientCart.push({
            id: p.id,
            name: p.name,
            price: p.price,
            costPrice: p.costPrice || Math.round(p.price * 0.65),
            quantity: qtyToAdd,
            type: p.type,
            img: p.img
        });
    }

    AdminCommon.setLocalStorage('clientCart', clientCart);
    updateCartBadge();
    AdminCommon.showToast(`Đã thêm ${qtyToAdd}x "${p.name}" vào giỏ hàng thành công!`, 'success');
}

function stepProductQty(productId, delta) {
    const valEl = document.getElementById(`prod-qty-${productId}`);
    if (!valEl) return;
    const p = clientProducts.find(item => item.id == productId || String(item.id) === String(productId));
    const maxStock = p ? (p.stock || 99) : 99;
    let current = parseInt(valEl.innerText) || 1;
    current += delta;
    if (current < 1) current = 1;
    if (current > maxStock) {
        current = maxStock;
        AdminCommon.showToast(`Số lượng đã đạt giới hạn tồn kho (${maxStock} nút)!`, 'info');
    }
    valEl.innerText = current;
}

function addToClientCartWithQty(productId) {
    const valEl = document.getElementById(`prod-qty-${productId}`);
    const qty = valEl ? (parseInt(valEl.innerText) || 1) : 1;
    addToClientCart(productId, qty);
    if (valEl) valEl.innerText = '1';
}

function openCartModal() {
    const modal = document.getElementById('cart-modal');
    const itemsContainer = document.getElementById('cart-modal-items');
    const totalEl = document.getElementById('cart-modal-total');
    const checkoutForm = document.getElementById('cart-checkout-form');
    const proceedBtn = document.getElementById('btn-proceed-checkout');

    if (!modal || !itemsContainer) return;

    // Tự động điền thông tin nếu đã đăng nhập
    const loggedUser = AdminCommon.getLocalStorage('clientLoggedInUser');
    if (loggedUser) {
        const nameField = document.getElementById('order-cust-name');
        const phoneField = document.getElementById('order-cust-phone');
        const addrField = document.getElementById('order-cust-address');
        if (nameField && !nameField.value) nameField.value = loggedUser.name || '';
        if (phoneField && !phoneField.value) phoneField.value = loggedUser.phone || '';
        if (addrField && !addrField.value) addrField.value = loggedUser.address || '';
    }

    if (clientCart.length === 0) {
        itemsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #9ca3af;">
                <i class="fas fa-shopping-basket" style="font-size: 3.5rem; margin-bottom: 12px; display: block; color: #cbd5e1;"></i>
                <div style="font-size: 1.5rem; font-weight: 700; color: #334155;">Giỏ hàng của bạn đang trống!</div>
                <p style="font-size: 1.3rem; margin-top: 6px;">Hãy lựa chọn các mẫu Keycap ưng ý từ bộ sưu tập.</p>
            </div>
        `;
        if (totalEl) totalEl.innerText = '0 đ';
        if (checkoutForm) checkoutForm.style.display = 'none';
        if (proceedBtn) proceedBtn.style.display = 'none';
    } else {
        let total = 0;
        itemsContainer.innerHTML = clientCart.map((item, idx) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                    <div style="flex: 1; padding-right: 15px;">
                        <div style="font-weight: 700; font-size: 1.35rem; color: #1e293b; margin-bottom: 4px;">
                            ${AdminCommon.escapeHtml(item.name)}
                        </div>
                        <div style="color: #64748b; font-size: 1.25rem;">
                            Đơn giá: <strong style="color: #e30019;">${AdminCommon.formatCurrency(item.price)}</strong>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <!-- Bộ đếm số lượng -->
                        <div class="cart-qty-stepper">
                            <button type="button" class="cart-qty-btn" onclick="updateCartItemQty(${idx}, -1)">-</button>
                            <span class="cart-qty-val">${item.quantity}</span>
                            <button type="button" class="cart-qty-btn" onclick="updateCartItemQty(${idx}, 1)">+</button>
                        </div>

                        <!-- Thành tiền -->
                        <span style="font-weight: 800; color: #e30019; font-size: 1.45rem; min-width: 90px; text-align: right;">
                            ${AdminCommon.formatCurrency(itemTotal)}
                        </span>

                        <!-- Nút xóa -->
                        <button type="button" onclick="removeCartItem(${idx})" title="Xóa món này" style="background: #fee2e2; border: none; color: #ef4444; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-trash-alt" style="font-size: 1.1rem;"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        if (totalEl) totalEl.innerText = AdminCommon.formatCurrency(total);
        if (checkoutForm) checkoutForm.style.display = 'block';
        if (proceedBtn) {
            proceedBtn.style.display = 'inline-flex';
            updateProceedButtonText();
        }
    }

    modal.classList.add('active');
}

function updateProceedButtonText() {
    const payMethod = document.getElementById('order-pay-method')?.value || 'SePay';
    const btn = document.getElementById('btn-proceed-checkout');
    if (!btn) return;

    if (payMethod === 'SePay') {
        btn.innerHTML = '<i class="fas fa-qrcode"></i> THANH TOÁN SEPAY (VIETQR)';
        btn.style.background = '#059669';
    } else {
        btn.innerHTML = '<i class="fas fa-truck"></i> XÁC NHẬN ĐẶT HÀNG (COD)';
        btn.style.background = '#e30019';
    }
}

function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.classList.remove('active');
}

function updateCartItemQty(idx, change) {
    if (!clientCart[idx]) return;
    clientCart[idx].quantity += change;

    if (clientCart[idx].quantity <= 0) {
        clientCart.splice(idx, 1);
    }

    AdminCommon.setLocalStorage('clientCart', clientCart);
    updateCartBadge();
    openCartModal();
}

function removeCartItem(idx) {
    clientCart.splice(idx, 1);
    AdminCommon.setLocalStorage('clientCart', clientCart);
    updateCartBadge();
    openCartModal();
    AdminCommon.showToast('Đã xóa sản phẩm khỏi giỏ hàng.', 'info');
}

// ----------------------------------------------------------------------------
// III. TIẾN HÀNH ĐẶT HÀNG & TÍCH HỢP SEPAY VIETQR
// ----------------------------------------------------------------------------

function handleCheckoutButton() {
    if (clientCart.length === 0) return;

    const nameInp = document.getElementById('order-cust-name');
    const phoneInp = document.getElementById('order-cust-phone');
    const addressInp = document.getElementById('order-cust-address');
    const payMethod = document.getElementById('order-pay-method').value;

    const name = (nameInp ? nameInp.value : '').trim();
    const phone = (phoneInp ? phoneInp.value : '').trim();
    const address = (addressInp ? addressInp.value : '').trim();

    clearInputError('order-cust-name', 'error-order-cust-name');
    clearInputError('order-cust-phone', 'error-order-cust-phone');
    clearInputError('order-cust-address', 'error-order-cust-address');

    let firstInvalid = null;

    if (!name) {
        setInputError('order-cust-name', 'error-order-cust-name', 'Vui lòng nhập họ và tên người nhận hàng!');
        if (!firstInvalid) firstInvalid = 'order-cust-name';
    }

    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!phone) {
        setInputError('order-cust-phone', 'error-order-cust-phone', 'Vui lòng nhập số điện thoại người nhận!');
        if (!firstInvalid) firstInvalid = 'order-cust-phone';
    } else if (!phoneRegex.test(phone)) {
        setInputError('order-cust-phone', 'error-order-cust-phone', 'Số điện thoại không hợp lệ (cần 10 số, bắt đầu bằng 03, 05, 07, 08, 09)!');
        if (!firstInvalid) firstInvalid = 'order-cust-phone';
    }

    if (!address) {
        setInputError('order-cust-address', 'error-order-cust-address', 'Vui lòng nhập địa chỉ giao hàng cụ thể!');
        if (!firstInvalid) firstInvalid = 'order-cust-address';
    } else if (address.length < 6) {
        setInputError('order-cust-address', 'error-order-cust-address', 'Địa chỉ giao hàng quá ngắn, vui lòng ghi rõ số nhà, tên đường, phường/xã!');
        if (!firstInvalid) firstInvalid = 'order-cust-address';
    }

    if (firstInvalid) {
        document.getElementById(firstInvalid).focus();
        AdminCommon.showToast('Vui lòng kiểm tra các ô màu đỏ còn thiếu hoặc sai định dạng!', 'error');
        return;
    }

    const total = clientCart.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const costTotal = clientCart.reduce((sum, it) => sum + (it.costPrice || Math.round(it.price * 0.65)) * it.quantity, 0);
    const orderId = Date.now();
    const orderCode = 'DH-WEB-' + (orderId.toString().slice(-4));
    const clientUser = AdminCommon.getLocalStorage('clientLoggedInUser');

    // Khởi tạo đơn hàng mới
    const newOrder = {
        id: orderId,
        orderCode: orderCode,
        customerId: clientUser ? (clientUser.id || clientUser.customerId || 'KH01') : null,
        customerUsername: clientUser ? clientUser.username : null,
        customerName: name,
        customerPhone: phone,
        customerEmail: (clientUser && (clientUser.gmail || clientUser.email)) || '',
        address: address,
        date: new Date().toISOString(),
        status: payMethod === 'SePay' ? 'xuly' : 'moi',
        paymentMethod: payMethod,
        paymentStatus: 'pending',
        paymentMethodText: payMethod === 'SePay' ? 'Chuyển khoản SePay (VietQR)' : 'Thanh toán khi nhận hàng (COD)',
        cashierName: 'Hệ thống Web',
        channel: 'Online',
        items: clientCart.map(it => ({
            id: it.id,
            name: it.name,
            img: it.img || '',
            quantity: it.quantity,
            costPrice: it.costPrice,
            price: it.price
        })),
        subTotal: total,
        discountPercent: 0,
        discountAmount: 0,
        total: total,
        costTotal: costTotal,
        profit: Math.max(0, total - costTotal),
        note: 'Khách đặt trực tuyến từ Web Store'
    };

    // Lưu vào CSDL đơn hàng
    const orders = AdminCommon.getLocalStorage('orders') || [];
    orders.unshift(newOrder);
    AdminCommon.setLocalStorage('orders', orders);

    // Trừ tồn kho sản phẩm
    clientCart.forEach(it => {
        const prod = clientProducts.find(p => p.id === it.id);
        if (prod) {
            prod.stock = Math.max(0, (prod.stock || 0) - it.quantity);
        }
    });
    AdminCommon.setLocalStorage('product', clientProducts);

    // Xóa giỏ hàng hiện tại
    clientCart = [];
    AdminCommon.setLocalStorage('clientCart', []);
    updateCartBadge();
    closeCartModal();
    renderClientProducts();

    // Rẽ nhánh: Nếu chọn SePay -> Mở Modal VietQR SePay
    if (payMethod === 'SePay') {
        currentPendingOrder = newOrder;
        openSepayModal(newOrder);
    } else {
        // Thanh toán COD truyền thống
        alert(`ĐẶT HÀNG THÀNH CÔNG (COD)!\n\nMã đơn hàng của bạn là: #${orderCode}\nTổng giá trị: ${AdminCommon.formatCurrency(total)}\n\nCửa hàng GEARS sẽ liên hệ bạn qua SĐT ${phone} để giao hàng.`);
    }
}

// Mở Modal Quét Mã QR SePay
function openSepayModal(order) {
    const modal = document.getElementById('sepay-qr-modal');
    if (!modal) return;

    // Reset màn hình thành công về chế độ quét mã
    document.getElementById('sepay-scan-screen').style.display = 'block';
    document.getElementById('sepay-success-screen').style.display = 'none';

    // Đổ dữ liệu đơn hàng
    document.getElementById('sepay-order-code').innerText = `#${order.orderCode}`;
    document.getElementById('sepay-amount').innerText = AdminCommon.formatCurrency(order.total);
    document.getElementById('sepay-acc-number').innerText = '0987654321';
    document.getElementById('sepay-acc-name').innerText = 'GEARS KEYCAP SHOP';
    document.getElementById('sepay-bank-name').innerText = 'MBBank (Quân Đội)';
    document.getElementById('sepay-transfer-content').innerText = order.orderCode;

    // Sinh mã QR VietQR / SePay động
    // Sử dụng chuẩn VietQR API của SePay / Napas:
    const qrUrl = `https://img.vietqr.io/image/MB-0987654321-compact2.png?amount=${order.total}&addInfo=${order.orderCode}&accountName=GEARS%20KEYCAP%20SHOP`;
    document.getElementById('sepay-qr-image').src = qrUrl;

    // Đếm ngược 10 phút
    startSepayCountdown(10 * 60);

    modal.classList.add('active');
}

function closeSepayModal() {
    const modal = document.getElementById('sepay-qr-modal');
    if (modal) modal.classList.remove('active');
    if (sepayCountdownTimer) clearInterval(sepayCountdownTimer);
}

function startSepayCountdown(durationSeconds) {
    if (sepayCountdownTimer) clearInterval(sepayCountdownTimer);
    let remaining = durationSeconds;
    const countdownEl = document.getElementById('sepay-countdown');

    sepayCountdownTimer = setInterval(() => {
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        if (countdownEl) {
            countdownEl.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        remaining--;
        if (remaining < 0) {
            clearInterval(sepayCountdownTimer);
            if (countdownEl) countdownEl.innerText = '00:00 (Hết hạn)';
        }
    }, 1000);
}

// GIẢ LẬP KHÁCH QUÉT MÃ & SEPAY WEBHOOK TỰ ĐỘNG XÁC NHẬN THANH TOÁN
function simulateSepayPayment() {
    if (!currentPendingOrder) {
        AdminCommon.showToast('Không tìm thấy thông tin đơn hàng cần thanh toán!', 'error');
        return;
    }

    const btn = document.getElementById('btn-simulate-sepay');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SePay đang kiểm tra giao dịch ngân hàng...';
    }

    setTimeout(() => {
        // 1. Cập nhật đơn hàng trong CSDL sang ĐÃ HOÀN TẤT (giaohang / Done)
        const orders = AdminCommon.getLocalStorage('orders') || [];
        const orderIdx = orders.findIndex(o => o.id === currentPendingOrder.id || o.orderCode === currentPendingOrder.orderCode);

        if (orderIdx !== -1) {
            orders[orderIdx].status = 'giaohang'; // Đã thanh toán và sẵn sàng bàn giao (Done - Khóa trạng thái)
            orders[orderIdx].paymentStatus = 'paid';
            orders[orderIdx].paymentMethodText = 'Chuyển khoản SePay (Đã thanh toán thành công)';
            orders[orderIdx].paidAt = new Date().toISOString();
            AdminCommon.setLocalStorage('orders', orders);
        }

        if (sepayCountdownTimer) clearInterval(sepayCountdownTimer);

        // 2. Chuyển giao diện sang màn hình THANH TOÁN THÀNH CÔNG
        document.getElementById('sepay-scan-screen').style.display = 'none';
        document.getElementById('sepay-success-screen').style.display = 'block';
        document.getElementById('sepay-success-code').innerText = `#${currentPendingOrder.orderCode}`;
        document.getElementById('sepay-success-amount').innerText = AdminCommon.formatCurrency(currentPendingOrder.total);

        AdminCommon.showToast('SEPAY: ĐÃ XÁC NHẬN THANH TOÁN THÀNH CÔNG!', 'success');
    }, 1200);
}

// Tiện ích sao chép thông tin chuyển khoản vào clipboard
function copyToClipboard(elementId, label) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const text = el.innerText.replace('#', '').trim();

    navigator.clipboard.writeText(text).then(() => {
        AdminCommon.showToast(`Đã sao chép ${label}: ${text}`, 'info');
    }).catch(() => {
        AdminCommon.showToast(`Nội dung: ${text}`, 'info');
    });
}

// ----------------------------------------------------------------------------
// IV. ĐĂNG NHẬP, ĐĂNG KÝ VÀ QUẢN LÝ PHIÊN
// ----------------------------------------------------------------------------

function openLoginModal(tab = 'login') {
    switchAuthTab(tab);
    document.getElementById('client-login-modal').classList.add('active');
}

function closeLoginModal() {
    document.getElementById('client-login-modal').classList.remove('active');
}

function switchAuthTab(tab) {
    const tabLoginBtn = document.getElementById('tab-btn-login');
    const tabRegBtn = document.getElementById('tab-btn-register');
    const formLogin = document.getElementById('form-login-tab');
    const formReg = document.getElementById('form-register-tab');

    if (tab === 'login') {
        tabLoginBtn.classList.add('active');
        tabRegBtn.classList.remove('active');
        formLogin.style.display = 'block';
        formReg.style.display = 'none';
    } else {
        tabLoginBtn.classList.remove('active');
        tabRegBtn.classList.add('active');
        formLogin.style.display = 'none';
        formReg.style.display = 'block';
    }
}

function toggleClientPassword(inputId, iconId) {
    const passInput = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!passInput || !icon) return;

    if (passInput.type === 'password') {
        passInput.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        passInput.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

function setInputError(inputId, errorId, message) {
    const el = document.getElementById(inputId);
    const err = document.getElementById(errorId);
    if (el) {
        el.style.border = '1.5px solid #ef4444';
        el.style.backgroundColor = '#fef2f2';
    }
    if (err) {
        err.innerText = message;
        err.style.display = 'block';
    }
}

function clearInputError(inputId, errorId) {
    const el = document.getElementById(inputId);
    const err = document.getElementById(errorId);
    if (el) {
        el.style.border = '1px solid #cbd5e1';
        el.style.backgroundColor = '#ffffff';
    }
    if (err) {
        err.innerText = '';
        err.style.display = 'none';
    }
    // 4. Bấm phím Enter để Đăng Nhập, Đăng Ký và Đổi Mật Khẩu
    const loginInputs = ['login-username', 'login-password'];
    loginInputs.forEach(id => {
        const inp = document.getElementById(id);
        if (inp) {
            inp.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    submitClientLogin();
                }
            });
        }
    });

    const regInputs = ['reg-fullname', 'reg-phone', 'reg-username', 'reg-email', 'reg-password', 'reg-confirm-pass'];
    regInputs.forEach(id => {
        const inp = document.getElementById(id);
        if (inp) {
            inp.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    submitClientRegister();
                }
            });
        }
    });

    const profInputs = ['prof-old-pass', 'prof-new-pass', 'prof-confirm-pass'];
    profInputs.forEach(id => {
        const inp = document.getElementById(id);
        if (inp) {
            inp.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    submitChangePassword();
                }
            });
        }
    });
}

function submitClientLogin() {
    const userInp = document.getElementById('login-username');
    const passInp = document.getElementById('login-password');
    const alertBox = document.getElementById('client-login-alert');

    if (alertBox) { alertBox.style.display = 'none'; alertBox.innerText = ''; }
    clearInputError('login-username', 'error-login-username');
    clearInputError('login-password', 'error-login-password');

    const u = userInp.value.trim();
    const p = passInp.value.trim();

    let firstInvalid = null;

    if (!u) {
        setInputError('login-username', 'error-login-username', 'Vui lòng nhập tên tài khoản hoặc email!');
        if (!firstInvalid) firstInvalid = 'login-username';
    }

    if (!p) {
        setInputError('login-password', 'error-login-password', 'Vui lòng nhập mật khẩu tài khoản!');
        if (!firstInvalid) firstInvalid = 'login-password';
    }

    if (firstInvalid) {
        document.getElementById(firstInvalid).focus();
        AdminCommon.showToast('Vui lòng điền các ô bắt buộc có viền đỏ!', 'error');
        return;
    }

    const users = AdminCommon.getLocalStorage('user') || [];
    const employees = AdminCommon.getLocalStorage('employees') || [];

    // Tìm trong danh sách nhân viên trước (để lấy quyền chuẩn nếu là nhân viên/admin)
    let matchedUser = employees.find(e => (e.username.toLowerCase() === u.toLowerCase() || (e.email && e.email.toLowerCase() === u.toLowerCase())) && e.password === p);
    let isStaff = false;

    if (matchedUser) {
        isStaff = true;
    } else {
        matchedUser = users.find(item => (item.username.toLowerCase() === u.toLowerCase() || (item.gmail && item.gmail.toLowerCase() === u.toLowerCase())) && item.password === p);
        if (matchedUser && (matchedUser.userType === 'admin' || matchedUser.username === 'admin')) {
            isStaff = true;
            matchedUser.role = 'admin';
            matchedUser.roleName = matchedUser.roleName || 'Quản Trị Viên (Admin)';
        }
    }

    if (matchedUser) {
        if (matchedUser.status === 'locked') {
            if (alertBox) {
                alertBox.innerText = 'Tài khoản này đang bị KHÓA! Vui lòng liên hệ quản trị viên.';
                alertBox.style.display = 'block';
            }
            AdminCommon.showToast('Tài khoản đã bị khóa!', 'error');
            return;
        }

        // Đảm bảo chuẩn hóa role cho admin / pos
        if (matchedUser.userType === 'admin' || matchedUser.username === 'admin') {
            matchedUser.role = 'admin';
            matchedUser.roleName = matchedUser.roleName || 'Quản Trị Viên (Admin)';
        } else if (matchedUser.role === 'pos' || matchedUser.role === 'cashier' || matchedUser.username === 'cashier') {
            matchedUser.role = 'pos';
            matchedUser.roleName = matchedUser.roleName || 'Thu Ngân / POS Quầy';
        }

        // Lưu thông tin phiên đăng nhập vào cả localStorage và sessionStorage để không bao giờ bị mất session
        AdminCommon.setLocalStorage('clientLoggedInUser', matchedUser);
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('clientLoggedInUser', JSON.stringify(matchedUser));
        }
        
        if (isStaff || matchedUser.role === 'admin' || matchedUser.role === 'pos') {
            AdminCommon.setLocalStorage('currentAdminUser', matchedUser);
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.setItem('currentAdminUser', JSON.stringify(matchedUser));
            }
            AdminCommon.showToast(`Chào mừng ${matchedUser.name} (${matchedUser.roleName || matchedUser.role})! Đang chuyển hướng...`, 'success');
            setTimeout(() => {
                if (matchedUser.role === 'pos') {
                    window.location.href = './assets/Admin/pos.html';
                } else {
                    window.location.href = './assets/Admin/dashboard.html';
                }
            }, 600);
            return;
        }

        checkClientLoginStatus();
        closeLoginModal();
        AdminCommon.showToast(`Đăng nhập thành công! Xin chào ${matchedUser.name || matchedUser.username}`, 'success');
    } else {
        setInputError('login-username', 'error-login-username', 'Tên tài khoản hoặc mật khẩu không đúng!');
        setInputError('login-password', 'error-login-password', 'Tên tài khoản hoặc mật khẩu không đúng!');
        userInp.focus();
        if (alertBox) {
            alertBox.innerText = 'Sai tên tài khoản hoặc mật khẩu! Vui lòng kiểm tra lại.';
            alertBox.style.display = 'block';
        }
        AdminCommon.showToast('Sai tên đăng nhập hoặc mật khẩu!', 'error');
    }
}

// Đăng ký tài khoản khách hàng mới
function submitClientRegister() {
    const fullnameInp = document.getElementById('reg-fullname');
    const phoneInp = document.getElementById('reg-phone');
    const usernameInp = document.getElementById('reg-username');
    const emailInp = document.getElementById('reg-email');
    const passInp = document.getElementById('reg-password');
    const alertBox = document.getElementById('client-register-alert');

    if (alertBox) { alertBox.style.display = 'none'; alertBox.innerText = ''; }

    // Xóa lỗi cũ
    clearInputError('reg-fullname', 'error-reg-fullname');
    clearInputError('reg-phone', 'error-reg-phone');
    clearInputError('reg-username', 'error-reg-username');
    clearInputError('reg-email', 'error-reg-email');
    clearInputError('reg-password', 'error-reg-password');

    const fullname = fullnameInp.value.trim();
    const phone = phoneInp.value.trim();
    const username = usernameInp.value.trim();
    const email = emailInp.value.trim();
    const password = passInp.value.trim();

    let firstInvalid = null;

    // 1. Kiểm tra Họ và tên
    if (!fullname) {
        setInputError('reg-fullname', 'error-reg-fullname', 'Vui lòng nhập họ và tên của bạn!');
        if (!firstInvalid) firstInvalid = 'reg-fullname';
    }

    // 2. Kiểm tra Số điện thoại
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!phone) {
        setInputError('reg-phone', 'error-reg-phone', 'Vui lòng nhập số điện thoại liên hệ!');
        if (!firstInvalid) firstInvalid = 'reg-phone';
    } else if (!phoneRegex.test(phone)) {
        setInputError('reg-phone', 'error-reg-phone', 'Số điện thoại không hợp lệ (Cần đúng 10 số, đầu số 03, 05, 07, 08, 09)!');
        if (!firstInvalid) firstInvalid = 'reg-phone';
    }

    // 3. Kiểm tra Tên tài khoản
    const users = AdminCommon.getLocalStorage('user') || [];
    const employees = AdminCommon.getLocalStorage('employees') || [];
    if (!username) {
        setInputError('reg-username', 'error-reg-username', 'Vui lòng nhập tên tài khoản đăng nhập!');
        if (!firstInvalid) firstInvalid = 'reg-username';
    } else if (username.length < 3) {
        setInputError('reg-username', 'error-reg-username', 'Tên tài khoản phải từ 3 ký tự trở lên!');
        if (!firstInvalid) firstInvalid = 'reg-username';
    } else if (/\s/.test(username)) {
        setInputError('reg-username', 'error-reg-username', 'Tên tài khoản không được chứa khoảng cách!');
        if (!firstInvalid) firstInvalid = 'reg-username';
    } else if (users.some(u => u.username && u.username.toLowerCase() === username.toLowerCase()) ||
               employees.some(e => e.username && e.username.toLowerCase() === username.toLowerCase())) {
        setInputError('reg-username', 'error-reg-username', 'Tên tài khoản này đã có người sử dụng!');
        if (!firstInvalid) firstInvalid = 'reg-username';
    }

    // 4. Kiểm tra Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        setInputError('reg-email', 'error-reg-email', 'Vui lòng nhập địa chỉ email liên hệ!');
        if (!firstInvalid) firstInvalid = 'reg-email';
    } else if (!emailRegex.test(email)) {
        setInputError('reg-email', 'error-reg-email', 'Địa chỉ email không đúng định dạng (VD: example@gmail.com)!');
        if (!firstInvalid) firstInvalid = 'reg-email';
    } else if (users.some(u => u.gmail && u.gmail.toLowerCase() === email.toLowerCase())) {
        setInputError('reg-email', 'error-reg-email', 'Địa chỉ email này đã được sử dụng!');
        if (!firstInvalid) firstInvalid = 'reg-email';
    }

    // 5. Kiểm tra Mật khẩu
    if (!password) {
        setInputError('reg-password', 'error-reg-password', 'Vui lòng nhập mật khẩu tài khoản!');
        if (!firstInvalid) firstInvalid = 'reg-password';
    } else {
        const passCheck = AdminCommon.validatePasswordSecurity(password);
        if (!passCheck.valid) {
            setInputError('reg-password', 'error-reg-password', passCheck.message);
            if (!firstInvalid) firstInvalid = 'reg-password';
        }
    }

    // Nếu có ô lỗi -> Con trỏ nhảy vào ô sai đầu tiên
    if (firstInvalid) {
        document.getElementById(firstInvalid).focus();
        AdminCommon.showToast('Vui lòng kiểm tra các ô có viền đỏ thông báo lỗi!', 'error');
        return;
    }

    // Tạo tài khoản khách hàng mới hợp lệ
    const newUser = {
        id: users.length + 1,
        name: fullname,
        username: username,
        password: password,
        phone: phone,
        gmail: email,
        userType: 'customer',
        status: 'active',
        rewardPoints: 50,
        address: 'Hồ Chí Minh'
    };

    users.push(newUser);
    AdminCommon.setLocalStorage('user', users);

    // Tự động đăng nhập
    AdminCommon.setLocalStorage('clientLoggedInUser', newUser);
    checkClientLoginStatus();
    closeLoginModal();
    AdminCommon.showToast(`Đăng ký thành công! Chào mừng ${fullname} đến với GEARS Shop!`, 'success');
}

function clientLogout() {
    localStorage.removeItem('clientLoggedInUser');
    localStorage.removeItem('currentAdminUser');
    checkClientLoginStatus();
    AdminCommon.showToast('Đã đăng xuất tài khoản thành công.', 'info');
}

function checkClientLoginStatus() {
    const user = AdminCommon.getLocalStorage('clientLoggedInUser');
    const display = document.getElementById('client-user-display');
    const userActionBtn = document.getElementById('gear-user-action-btn');
    const portalWrap = document.getElementById('gear-role-portal-wrap');

    if (!display) return;

    if (user) {
        display.innerText = user.name || user.username;
        if (userActionBtn) {
            userActionBtn.onclick = function() {
                openUserProfileModal();
            };
        }

        // Kiểm tra quyền để thêm nút Admin hoặc Thu Ngân POS vào Header
        if (portalWrap) {
            const isAdmin = user.role === 'admin' || user.userType === 'admin' || (user.roleName && (user.roleName.toLowerCase().includes('quản trị') || user.roleName.toLowerCase().includes('admin')));
            const isPos = user.role === 'pos' || user.role === 'cashier' || user.userType === 'pos' || (user.roleName && (user.roleName.toLowerCase().includes('pos') || user.roleName.toLowerCase().includes('thu ngân')));

            if (isAdmin) {
                portalWrap.style.display = 'flex';
                portalWrap.innerHTML = `
                    <a href="./assets/Admin/dashboard.html" class="gear-portal-btn gear-portal-admin" title="Vào Bảng Điều Khiển Quản Trị Admin">
                        <i class="fas fa-shield-alt" style="font-size: 1.8rem; color: #60a5fa;"></i>
                        <div style="line-height: 1.15; text-align: left;">
                            <div style="font-size: 1.05rem; color: #93c5fd; font-weight: 600;">Quản Trị</div>
                            <div style="font-size: 1.25rem; font-weight: 800; color: #ffffff;">ADMIN</div>
                        </div>
                    </a>
                `;
            } else if (isPos) {
                portalWrap.style.display = 'flex';
                portalWrap.innerHTML = `
                    <a href="./assets/Admin/pos.html" class="gear-portal-btn gear-portal-pos" title="Vào Màn Hình Bán Hàng & Xử Lý Đơn Thu Ngân">
                        <i class="fas fa-cash-register" style="font-size: 1.8rem; color: #34d399;"></i>
                        <div style="line-height: 1.15; text-align: left;">
                            <div style="font-size: 1.05rem; color: #6ee7b7; font-weight: 600;">Bán Hàng</div>
                            <div style="font-size: 1.25rem; font-weight: 800; color: #ffffff;">POS QUẦY</div>
                        </div>
                    </a>
                `;
            } else {
                portalWrap.style.display = 'none';
                portalWrap.innerHTML = '';
            }
        }
    } else {
        display.innerText = 'Đăng Nhập';
        if (userActionBtn) {
            userActionBtn.onclick = function() {
                openLoginModal('login');
            };
        }
        if (portalWrap) {
            portalWrap.style.display = 'none';
            portalWrap.innerHTML = '';
        }
    }
}

function syncAdminSessionBeforeNav(e, targetUrl) {
    if (e) e.preventDefault();
    let user = AdminCommon.getLocalStorage('clientLoggedInUser') || AdminCommon.getLocalStorage('currentAdminUser');
    if (!user && typeof sessionStorage !== 'undefined') {
        try {
            user = JSON.parse(sessionStorage.getItem('clientLoggedInUser') || sessionStorage.getItem('currentAdminUser') || 'null');
        } catch(err) {}
    }
    if (user) {
        if (user.userType === 'admin' || user.username === 'admin') {
            user.role = 'admin';
            user.roleName = user.roleName || 'Quản Trị Viên (Admin)';
        } else if (user.role === 'pos' || user.role === 'cashier' || user.username === 'cashier') {
            user.role = 'pos';
            user.roleName = user.roleName || 'Thu Ngân / POS Quầy';
        }
        AdminCommon.setLocalStorage('currentAdminUser', user);
        AdminCommon.setLocalStorage('clientLoggedInUser', user);
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('currentAdminUser', JSON.stringify(user));
            sessionStorage.setItem('clientLoggedInUser', JSON.stringify(user));
        }
    }
    window.location.href = targetUrl;
}

let customerOrderFilterStatus = 'all';
let customerOrderSearchQuery = '';

function openMyOrdersModal() {
    openUserProfileModal('orders');
}

function switchProfileTab(tab) {
    const tabOrders = document.getElementById('prof-tab-orders');
    const tabInfo = document.getElementById('prof-tab-info');
    const btnOrders = document.getElementById('prof-tab-btn-orders');
    const btnInfo = document.getElementById('prof-tab-btn-info');
    const titleEl = document.getElementById('prof-modal-title');

    if (tab === 'orders') {
        if (tabOrders) tabOrders.style.display = 'block';
        if (tabInfo) tabInfo.style.display = 'none';
        if (btnOrders) btnOrders.classList.add('active');
        if (btnInfo) btnInfo.classList.remove('active');
        if (titleEl) titleEl.innerHTML = '<i class="fas fa-boxes"></i> Lịch Sử Đơn Hàng Của Khách Hàng';
        renderCustomerOrders();
    } else {
        if (tabOrders) tabOrders.style.display = 'none';
        if (tabInfo) tabInfo.style.display = 'block';
        if (btnOrders) btnOrders.classList.remove('active');
        if (btnInfo) btnInfo.classList.add('active');
        if (titleEl) titleEl.innerHTML = '<i class="fas fa-id-card"></i> Thông Tin Cá Nhân &amp; Đổi Mật Khẩu';
    }
}

function filterCustomerOrders(status, btnElement) {
    customerOrderFilterStatus = status;
    const filterBtns = document.querySelectorAll('.prof-status-filter');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
    renderCustomerOrders();
}

function handleCustomerOrderSearch() {
    const searchInp = document.getElementById('prof-order-search');
    customerOrderSearchQuery = searchInp ? searchInp.value.trim() : '';
    renderCustomerOrders();
}

function renderCustomerOrders() {
    const container = document.getElementById('prof-orders-container');
    const badgeCount = document.getElementById('prof-orders-count-badge');
    const allCountBadge = document.getElementById('count-all-orders');
    if (!container) return;

    const user = AdminCommon.getLocalStorage('clientLoggedInUser');
    const allOrders = AdminCommon.getLocalStorage('orders') || [];

    // Lấy tất cả đơn của khách này
    let userOrders = [];
    if (user) {
        userOrders = allOrders.filter(o => {
            const oCustId = o.customerId || o.custId;
            const oUser = o.customerUsername || o.username;
            const oPhone = (o.customerPhone || o.phone || '').toString().replace(/\D/g, '');
            const uPhone = (user.phone || '').toString().replace(/\D/g, '');
            const oName = (o.customerName || '').toLowerCase().trim();
            const uName = (user.name || '').toLowerCase().trim();
            const uUser = (user.username || '').toLowerCase().trim();

            if (user.id && oCustId && String(oCustId) === String(user.id)) return true;
            if (uUser && oUser && oUser.toLowerCase() === uUser) return true;
            if (uPhone && oPhone && uPhone === oPhone) return true;
            if (uName && oName && (oName === uName || oName.includes(uName) || uName.includes(oName))) return true;
            if (uUser && oName && oName.includes(uUser)) return true;
            return false;
        });
    }

    if (badgeCount) badgeCount.innerText = userOrders.length;
    if (allCountBadge) allCountBadge.innerText = userOrders.length;

    // Lọc theo search và status
    let displayList = user ? [...userOrders] : [];
    if (customerOrderSearchQuery) {
        const q = customerOrderSearchQuery.toLowerCase();
        const qDigits = customerOrderSearchQuery.replace(/\D/g, '');
        if (!user) {
            displayList = allOrders.filter(o => {
                const code = (o.orderCode || o.id || '').toString().toLowerCase();
                const phone = (o.customerPhone || o.phone || '').toString().replace(/\D/g, '');
                return code.includes(q) || (qDigits && phone.includes(qDigits));
            });
        } else {
            displayList = displayList.filter(o => {
                const code = (o.orderCode || o.id || '').toString().toLowerCase();
                const phone = (o.customerPhone || o.phone || '').toString();
                return code.includes(q) || phone.includes(q);
            });
        }
    }

    if (customerOrderFilterStatus && customerOrderFilterStatus !== 'all') {
        displayList = displayList.filter(o => (o.status || 'moi') === customerOrderFilterStatus);
    }

    // Nếu khách chưa đăng nhập và không tìm kiếm
    if (!user && !customerOrderSearchQuery) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 10px;">
                <i class="fas fa-search-location" style="font-size: 3.5rem; color: #94a3b8; margin-bottom: 12px; display: block;"></i>
                <div style="font-size: 1.55rem; font-weight: 800; color: #1e293b; margin-bottom: 6px;">Tra Cứu Đơn Hàng Nhanh</div>
                <p style="font-size: 1.3rem; color: #64748b; margin-bottom: 16px;">
                    Vui lòng nhập <strong>Số Điện Thoại</strong> hoặc <strong>Mã Đơn Hàng</strong> vào ô tìm kiếm bên trên để tra cứu lịch sử mua sắm.
                </p>
                <button type="button" class="confirm-btn" style="background: #2563eb; padding: 10px 20px; font-size: 1.3rem;" onclick="closeUserProfileModal(); openLoginModal('login');">
                    <i class="fas fa-sign-in-alt"></i> ĐĂNG NHẬP ĐỂ XEM ĐẦY ĐỦ LỊCH SỬ
                </button>
            </div>
        `;
        return;
    }

    if (displayList.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 10px;">
                <i class="fas fa-box-open" style="font-size: 3.5rem; color: #cbd5e1; margin-bottom: 12px; display: block;"></i>
                <div style="font-size: 1.5rem; font-weight: 700; color: #334155; margin-bottom: 6px;">Không tìm thấy đơn hàng nào!</div>
                <p style="font-size: 1.3rem; color: #64748b; margin-bottom: 16px;">
                    ${customerOrderSearchQuery || customerOrderFilterStatus !== 'all' ? 'Thử chọn bộ lọc khác hoặc kiểm tra lại từ khóa tìm kiếm.' : 'Bạn chưa có đơn đặt hàng nào trong hệ thống.'}
                </p>
                <button type="button" class="confirm-btn" style="background: var(--gear-red, #e30019); padding: 10px 20px; font-size: 1.3rem;" onclick="closeUserProfileModal(); smoothScrollToElement(document.getElementById('product-showcase'), 850);">
                    <i class="fas fa-shopping-bag"></i> MUA SẮM KEYCAP NGAY
                </button>
            </div>
        `;
        return;
    }

    // Hiển thị danh sách card đơn hàng
    container.innerHTML = displayList.map(order => {
        const orderCode = order.orderCode || ('DH-' + order.id);
        const orderDate = order.date ? new Date(order.date).toLocaleString('vi-VN') : '---';
        const total = parseFloat(order.total || order.totalAmount) || 0;
        const status = order.status || 'moi';
        const payMethod = order.paymentMethod || 'COD';
        const isPaid = order.paymentStatus === 'paid' || status === 'giaohang';

        let statusText = 'Chờ xác nhận';
        let statusBg = '#fef3c7';
        let statusColor = '#b45309';
        let statusIcon = 'fa-clock';

        if (status === 'xuly') {
            statusText = 'Đang đóng gói / Xử lý';
            statusBg = '#dbeafe';
            statusColor = '#1d4ed8';
            statusIcon = 'fa-dolly';
        } else if (status === 'giaohang' || status === 'done') {
            statusText = 'Đã giao hàng thành công';
            statusBg = '#d1fae5';
            statusColor = '#047857';
            statusIcon = 'fa-check-circle';
        } else if (status === 'huy' || status === 'cancel') {
            statusText = 'Đã hủy đơn';
            statusBg = '#fee2e2';
            statusColor = '#b91c1c';
            statusIcon = 'fa-times-circle';
        }

        // Render từng item
        const items = Array.isArray(order.items) ? order.items : [];
        const itemsHtml = items.map(it => {
            const prod = (clientProducts || []).find(p => p.id == it.id || p.id == it.productId) || {};
            const imgUrl = it.img || prod.img || './assets/img/Products/Artisan/001.jpg';
            const price = parseFloat(it.price) || 0;
            const qty = parseInt(it.quantity, 10) || 1;
            const sub = price * qty;

            return `
                <div class="prof-order-item">
                    <img src="${imgUrl}" alt="${AdminCommon.escapeHtml(it.name || 'Keycap')}" class="prof-order-thumb" onerror="this.src='./assets/img/Products/Artisan/001.jpg'">
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-size: 1.35rem; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${AdminCommon.escapeHtml(it.name || 'Keycap Custom')}
                        </div>
                        <div style="font-size: 1.2rem; color: #64748b;">
                            Số lượng: <strong>x${qty}</strong> &bull; Đơn giá: ${AdminCommon.formatCurrency(price)}
                        </div>
                    </div>
                    <div style="font-size: 1.35rem; font-weight: 800; color: #e30019; min-width: 90px; text-align: right;">
                        ${AdminCommon.formatCurrency(sub)}
                    </div>
                </div>
            `;
        }).join('');

        // Action buttons
        const canCancel = (status === 'moi' || (status === 'xuly' && !isPaid));
        const canRePay = (payMethod === 'SePay' && !isPaid && status !== 'huy');

        return `
            <div class="prof-order-card">
                <div class="prof-order-header">
                    <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                        <span style="font-size: 1.45rem; font-weight: 800; color: #0f172a;">#${orderCode}</span>
                        <span style="font-size: 1.2rem; color: #64748b;"><i class="fas fa-calendar-alt"></i> ${orderDate}</span>
                        <span style="font-size: 1.15rem; padding: 2px 8px; border-radius: 4px; background: ${order.channel === 'POS' ? '#f3e8ff' : '#eff6ff'}; color: ${order.channel === 'POS' ? '#7e22ce' : '#2563eb'}; font-weight: 700;">
                            ${order.channel === 'POS' ? 'Bán tại quầy POS' : 'Đặt qua Web'}
                        </span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 1.2rem; font-weight: 700; background: ${statusBg}; color: ${statusColor};">
                            <i class="fas ${statusIcon}"></i> ${statusText}
                        </span>
                    </div>
                </div>

                <div class="prof-order-body">
                    ${itemsHtml || '<div style="color: #94a3b8; font-size: 1.25rem;">(Chi tiết sản phẩm đang được cập nhật)</div>'}
                </div>

                <div class="prof-order-footer">
                    <div style="font-size: 1.25rem; color: #475569; max-width: 450px;">
                        <div><i class="fas fa-map-marker-alt" style="color: var(--gear-red, #e30019);"></i> Giao tới: <strong>${AdminCommon.escapeHtml(order.address || 'Nhận tại cửa hàng')}</strong></div>
                        <div style="margin-top: 3px; font-size: 1.15rem; color: #64748b;">
                            <span>Người nhận: <strong>${AdminCommon.escapeHtml(order.customerName || 'Khách Hàng')}</strong> (${order.customerPhone || order.phone || '---'})</span>
                            &bull; <span>PTTT: <strong style="color: #0284c7;">${payMethod}</strong> (${isPaid ? '<span style="color:#059669;font-weight:700;">Đã thanh toán</span>' : '<span style="color:#d97706;font-weight:700;">Chưa thanh toán</span>'})</span>
                        </div>
                    </div>

                    <div style="display: flex; align-items: center; gap: 12px; margin-left: auto;">
                        <div style="text-align: right;">
                            <div style="font-size: 1.15rem; color: #64748b;">Tổng tiền:</div>
                            <div style="font-size: 1.6rem; font-weight: 800; color: #e30019;">
                                ${AdminCommon.formatCurrency(total)}
                            </div>
                        </div>

                        ${canRePay ? `
                            <button type="button" class="confirm-btn" style="background: #059669; padding: 7px 12px; font-size: 1.2rem;" onclick="reopenSepayForOrder('${order.id || order.orderCode}')">
                                <i class="fas fa-qrcode"></i> Quét VietQR
                            </button>
                        ` : ''}

                        ${canCancel ? `
                            <button type="button" class="confirm-btn" style="background: #f1f5f9; color: #ef4444; border: 1px solid #fecaca; padding: 7px 12px; font-size: 1.2rem;" onclick="cancelCustomerOrder('${order.id || order.orderCode}')">
                                <i class="fas fa-ban"></i> Hủy Đơn
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function cancelCustomerOrder(orderIdentifier) {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;

    const orders = AdminCommon.getLocalStorage('orders') || [];
    const idx = orders.findIndex(o => String(o.id) === String(orderIdentifier) || String(o.orderCode) === String(orderIdentifier));
    if (idx === -1) {
        AdminCommon.showToast('Không tìm thấy đơn hàng cần hủy!', 'error');
        return;
    }

    const order = orders[idx];
    if (order.status === 'giaohang') {
        AdminCommon.showToast('Đơn hàng đã được giao thành công, không thể hủy!', 'error');
        return;
    }

    // Hoàn trả tồn kho
    if (Array.isArray(order.items)) {
        order.items.forEach(it => {
            const prod = clientProducts.find(p => p.id === it.id);
            if (prod) {
                prod.stock = (prod.stock || 0) + (it.quantity || 1);
            }
        });
        AdminCommon.setLocalStorage('product', clientProducts);
        renderClientProducts();
    }

    order.status = 'huy';
    AdminCommon.setLocalStorage('orders', orders);
    AdminCommon.showToast(`Đã hủy thành công đơn hàng #${order.orderCode || order.id}!`, 'success');
    renderCustomerOrders();
}

function reopenSepayForOrder(orderIdentifier) {
    const orders = AdminCommon.getLocalStorage('orders') || [];
    const order = orders.find(o => String(o.id) === String(orderIdentifier) || String(o.orderCode) === String(orderIdentifier));
    if (!order) return;
    currentPendingOrder = order;
    openSepayModal(order);
}

function openUserProfileModal(defaultTab = 'orders') {
    const user = AdminCommon.getLocalStorage('clientLoggedInUser');
    const modal = document.getElementById('user-profile-modal');
    if (!modal) return;

    const nameEl = document.getElementById('prof-display-name');
    const userEl = document.getElementById('prof-display-username');
    const roleEl = document.getElementById('prof-display-role');
    const phoneEl = document.getElementById('prof-display-phone');
    const emailEl = document.getElementById('prof-display-email');
    const ptsEl = document.getElementById('prof-display-points');
    const staffPortal = document.getElementById('prof-staff-portal');

    if (user) {
        const isAdmin = user.role === 'admin' || user.userType === 'admin' || (user.roleName && (user.roleName.toLowerCase().includes('quản trị') || user.roleName.toLowerCase().includes('admin')));
        const isPos = user.role === 'pos' || user.role === 'cashier' || user.userType === 'pos' || (user.roleName && (user.roleName.toLowerCase().includes('pos') || user.roleName.toLowerCase().includes('thu ngân')));

        if (nameEl) nameEl.innerText = user.name || user.username;
        if (userEl) userEl.innerText = `@${user.username}`;
        if (roleEl) {
            if (isAdmin) {
                roleEl.innerText = 'Quản Trị Viên (Admin)';
                roleEl.style.background = '#dbeafe';
                roleEl.style.color = '#1d4ed8';
            } else if (isPos) {
                roleEl.innerText = 'Thu Ngân / POS Bán Hàng';
                roleEl.style.background = '#d1fae5';
                roleEl.style.color = '#047857';
            } else {
                roleEl.innerText = 'Khách Hàng Thân Thiết';
                roleEl.style.background = '#e0f2fe';
                roleEl.style.color = '#0369a1';
            }
        }
        if (phoneEl) phoneEl.innerText = user.phone || 'Chưa cập nhật';
        if (emailEl) emailEl.innerText = user.gmail || user.email || 'Chưa cập nhật';
        if (ptsEl) ptsEl.innerText = user.rewardPoints || '50';

        // Cung cấp nút Portal trực tiếp từ Modal tài khoản
        if (staffPortal) {
            if (isAdmin) {
                staffPortal.style.display = 'block';
                staffPortal.innerHTML = `
                    <div style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 8px;">
                        <i class="fas fa-shield-alt" style="color: #2563eb;"></i> Cổng Quản Trị Hệ Thống:
                    </div>
                    <a href="./assets/Admin/dashboard.html" onclick="syncAdminSessionBeforeNav(event, './assets/Admin/dashboard.html')" class="confirm-btn" style="display:flex;align-items:center;justify-content:center;gap:10px;background:linear-gradient(135deg, #2563eb, #4f46e5);width:100%;padding:12px;font-size:1.35rem;text-decoration:none;border-radius:8px;color:#fff;font-weight:700;box-shadow:0 4px 12px rgba(37,99,235,0.3);">
                        <i class="fas fa-tachometer-alt"></i> VÀO TRANG QUẢN TRỊ ADMIN (DASHBOARD)
                    </a>
                `;
            } else if (isPos) {
                staffPortal.style.display = 'block';
                staffPortal.innerHTML = `
                    <div style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 8px;">
                        <i class="fas fa-cash-register" style="color: #059669;"></i> Cổng Bán Hàng & Xử Lý Đơn:
                    </div>
                    <a href="./assets/Admin/pos.html" onclick="syncAdminSessionBeforeNav(event, './assets/Admin/pos.html')" class="confirm-btn" style="display:flex;align-items:center;justify-content:center;gap:10px;background:linear-gradient(135deg, #059669, #10b981);width:100%;padding:12px;font-size:1.35rem;text-decoration:none;border-radius:8px;color:#fff;font-weight:700;box-shadow:0 4px 12px rgba(16,185,129,0.3);">
                        <i class="fas fa-shopping-cart"></i> VÀO MÀN HÌNH BÁN HÀNG &amp; XỬ LÝ ĐƠN (POS)
                    </a>
                `;
            } else {
                staffPortal.style.display = 'none';
                staffPortal.innerHTML = '';
            }
        }
    } else {
        if (nameEl) nameEl.innerText = 'Khách Chưa Đăng Nhập';
        if (userEl) userEl.innerText = 'Vãng lai';
        if (roleEl) {
            roleEl.innerText = 'Khách Vãng Lai';
            roleEl.style.background = '#f1f5f9';
            roleEl.style.color = '#64748b';
        }
        if (phoneEl) phoneEl.innerText = 'Chưa cập nhật';
        if (emailEl) emailEl.innerText = 'Chưa cập nhật';
        if (ptsEl) ptsEl.innerText = '0';
        if (staffPortal) { staffPortal.style.display = 'none'; staffPortal.innerHTML = ''; }
    }

    // Xóa form và lỗi cũ
    ['prof-old-pass', 'prof-new-pass', 'prof-confirm-pass'].forEach(id => {
        const inp = document.getElementById(id);
        if (inp) inp.value = '';
    });
    ['error-prof-old-pass', 'error-prof-new-pass', 'error-prof-confirm-pass'].forEach(id => {
        clearInputError(id.replace('error-', ''), id);
    });
    const alertBox = document.getElementById('prof-pass-alert');
    if (alertBox) { alertBox.style.display = 'none'; alertBox.innerText = ''; }

    switchProfileTab(defaultTab);
    modal.classList.add('active');
}

function closeUserProfileModal() {
    const modal = document.getElementById('user-profile-modal');
    if (modal) modal.classList.remove('active');
}

function submitChangePassword() {
    const user = AdminCommon.getLocalStorage('clientLoggedInUser');
    if (!user) {
        AdminCommon.showToast('Vui lòng đăng nhập để đổi mật khẩu!', 'error');
        return;
    }

    const oldPassInp = document.getElementById('prof-old-pass');
    const newPassInp = document.getElementById('prof-new-pass');
    const confirmPassInp = document.getElementById('prof-confirm-pass');
    const alertBox = document.getElementById('prof-pass-alert');

    if (alertBox) { alertBox.style.display = 'none'; alertBox.innerText = ''; }
    clearInputError('prof-old-pass', 'error-prof-old-pass');
    clearInputError('prof-new-pass', 'error-prof-new-pass');
    clearInputError('prof-confirm-pass', 'error-prof-confirm-pass');

    const oldPass = oldPassInp.value;
    const newPass = newPassInp.value;
    const confirmPass = confirmPassInp.value;

    let firstInvalid = null;

    // 1. Kiểm tra mật khẩu cũ
    if (!oldPass) {
        setInputError('prof-old-pass', 'error-prof-old-pass', 'Vui lòng nhập mật khẩu hiện tại!');
        if (!firstInvalid) firstInvalid = 'prof-old-pass';
    } else if (oldPass !== user.password) {
        setInputError('prof-old-pass', 'error-prof-old-pass', 'Mật khẩu hiện tại không chính xác!');
        if (!firstInvalid) firstInvalid = 'prof-old-pass';
    }

    // 2. Kiểm tra mật khẩu mới
    if (!newPass) {
        setInputError('prof-new-pass', 'error-prof-new-pass', 'Vui lòng nhập mật khẩu mới!');
        if (!firstInvalid) firstInvalid = 'prof-new-pass';
    } else if (newPass === oldPass) {
        setInputError('prof-new-pass', 'error-prof-new-pass', 'Mật khẩu mới không được trùng với mật khẩu cũ!');
        if (!firstInvalid) firstInvalid = 'prof-new-pass';
    } else {
        const passCheck = AdminCommon.validatePasswordSecurity(newPass);
        if (!passCheck.valid) {
            setInputError('prof-new-pass', 'error-prof-new-pass', passCheck.message);
            if (!firstInvalid) firstInvalid = 'prof-new-pass';
        }
    }

    // 3. Kiểm tra xác nhận mật khẩu mới
    if (!confirmPass) {
        setInputError('prof-confirm-pass', 'error-prof-confirm-pass', 'Vui lòng nhập lại mật khẩu mới!');
        if (!firstInvalid) firstInvalid = 'prof-confirm-pass';
    } else if (confirmPass !== newPass) {
        setInputError('prof-confirm-pass', 'error-prof-confirm-pass', 'Xác nhận mật khẩu mới không khớp!');
        if (!firstInvalid) firstInvalid = 'prof-confirm-pass';
    }

    if (firstInvalid) {
        document.getElementById(firstInvalid).focus();
        AdminCommon.showToast('Vui lòng kiểm tra các ô có viền đỏ thông báo lỗi!', 'error');
        return;
    }

    // Cập nhật mật khẩu trong CSDL
    user.password = newPass;

    // Cập nhật danh sách user (khách hàng)
    const users = AdminCommon.getLocalStorage('user') || [];
    const uIdx = users.findIndex(u => u.username === user.username);
    if (uIdx !== -1) {
        users[uIdx].password = newPass;
        AdminCommon.setLocalStorage('user', users);
    }

    // Cập nhật danh sách employees (nhân sự nếu đăng nhập)
    const employees = AdminCommon.getLocalStorage('employees') || [];
    const eIdx = employees.findIndex(e => e.username === user.username);
    if (eIdx !== -1) {
        employees[eIdx].password = newPass;
        AdminCommon.setLocalStorage('employees', employees);
    }

    // Cập nhật phiên đăng nhập
    AdminCommon.setLocalStorage('clientLoggedInUser', user);
    const adminUser = AdminCommon.getLocalStorage('currentAdminUser');
    if (adminUser && adminUser.username === user.username) {
        adminUser.password = newPass;
        AdminCommon.setLocalStorage('currentAdminUser', adminUser);
    }

    AdminCommon.showToast('Đổi mật khẩu thành công! Mật khẩu mới đã được cập nhật an toàn.', 'success');
    closeUserProfileModal();
}

// Xuất các hàm ra window để truy cập từ HTML
window.filterCategory = filterCategory;
window.toggleCategoryDropdown = toggleCategoryDropdown;
window.changeSort = changeSort;
window.changePageSize = changePageSize;
window.changeClientPage = changeClientPage;
window.addToClientCart = addToClientCart;
window.stepProductQty = stepProductQty;
window.addToClientCartWithQty = addToClientCartWithQty;
window.openCartModal = openCartModal;
window.closeCartModal = closeCartModal;
window.updateCartItemQty = updateCartItemQty;
window.removeCartItem = removeCartItem;
window.updateProceedButtonText = updateProceedButtonText;
window.handleCheckoutButton = handleCheckoutButton;
window.openSepayModal = openSepayModal;
window.closeSepayModal = closeSepayModal;
window.simulateSepayPayment = simulateSepayPayment;
window.copyToClipboard = copyToClipboard;
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.switchAuthTab = switchAuthTab;
window.toggleClientPassword = toggleClientPassword;
window.submitClientLogin = submitClientLogin;
window.submitClientRegister = submitClientRegister;
window.clientLogout = clientLogout;
window.openUserProfileModal = openUserProfileModal;
window.closeUserProfileModal = closeUserProfileModal;
window.submitChangePassword = submitChangePassword;
window.openMyOrdersModal = openMyOrdersModal;
window.switchProfileTab = switchProfileTab;
window.filterCustomerOrders = filterCustomerOrders;
window.handleCustomerOrderSearch = handleCustomerOrderSearch;
window.renderCustomerOrders = renderCustomerOrders;
window.cancelCustomerOrder = cancelCustomerOrder;
window.reopenSepayForOrder = reopenSepayForOrder;

