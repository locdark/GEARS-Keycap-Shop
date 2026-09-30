// ============================================================================
// POINT OF SALES (POS) - Điểm bán lẻ tại quầy (Nhánh BFD: Tạo đơn hàng)
// Nhóm sinh viên: Danh, Quang, Lộc
// ============================================================================

let posProducts = [];
let filteredPosProducts = [];
let posCart = [];
let selectedCartIndex = -1;
let numpadMode = 'qty'; // 'qty' hoặc 'disc'
let numpadBuffer = '';
let currentDiscountPercent = 0;
let selectedPayMethod = 'Cash';
let lastCompletedOrder = null;

document.addEventListener('DOMContentLoaded', function () {
    initPos();
});

function initPos() {
    // Tải thông tin thu ngân đang đăng nhập
    const currentUser = AdminCommon.getLocalStorage('currentAdminUser') || {
        name: "Nguyễn Công Danh",
        roleName: "Quản trị viên / Quản lý"
    };
    const cashierEl = document.getElementById('pos-cashier-name');
    if (cashierEl) cashierEl.innerText = currentUser.name;

    // Load danh sách khách hàng vào select
    loadCustomersToSelect();

    // Load danh sách sản phẩm
    posProducts = AdminCommon.getLocalStorage('product') || [];
    filteredPosProducts = [...posProducts];
    renderPosProducts();

    // Lắng nghe sự kiện tìm kiếm
    const searchInput = document.getElementById('pos-search');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();
            if (!query) {
                filteredPosProducts = [...posProducts];
            } else {
                filteredPosProducts = posProducts.filter(p => p.name.toLowerCase().includes(query));
            }
            renderPosProducts();
        });
    }

    renderPosCart();
}

function loadCustomersToSelect() {
    const custSelect = document.getElementById('pos-customer');
    if (!custSelect) return;

    const users = AdminCommon.getLocalStorage('user') || [];
    custSelect.innerHTML = `<option value="guest">Khách Hàng Vãng Lai</option>`;

    users.forEach(u => {
        const displayName = u.name || u.username;
        const phone = u.phone ? ` - ${u.phone}` : '';
        custSelect.innerHTML += `<option value="${u.id || u.username}">${AdminCommon.escapeHtml(displayName)}${phone}</option>`;
    });
}

function openQuickAddCustomerModal() {
    const modal = document.getElementById('quickCustomerModal');
    if (!modal) return;
    document.getElementById('pos-new-cust-name').value = '';
    document.getElementById('pos-new-cust-phone').value = '';
    document.getElementById('pos-new-cust-email').value = '';
    document.getElementById('pos-new-cust-address').value = '';
    clearPosCustErrors();
    modal.style.display = 'flex';
    setTimeout(() => {
        const inp = document.getElementById('pos-new-cust-name');
        if (inp) inp.focus();
    }, 100);
}

function closeQuickAddCustomerModal() {
    const modal = document.getElementById('quickCustomerModal');
    if (modal) modal.style.display = 'none';
    clearPosCustErrors();
}

function clearPosCustErrors() {
    ['pos-new-cust-name', 'pos-new-cust-phone'].forEach(id => {
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

function setPosCustError(id, msg) {
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

function handleQuickCreateCustomer(event) {
    if (event) event.preventDefault();
    clearPosCustErrors();

    const nameInp = document.getElementById('pos-new-cust-name');
    const phoneInp = document.getElementById('pos-new-cust-phone');
    const emailInp = document.getElementById('pos-new-cust-email');
    const addressInp = document.getElementById('pos-new-cust-address');

    const name = (nameInp ? nameInp.value : '').trim();
    const phone = (phoneInp ? phoneInp.value : '').trim();
    const email = (emailInp ? emailInp.value : '').trim();
    const address = (addressInp ? addressInp.value : '').trim();

    let firstInvalid = null;

    if (!name) {
        setPosCustError('pos-new-cust-name', 'Vui lòng nhập họ và tên khách hàng!');
        if (!firstInvalid) firstInvalid = 'pos-new-cust-name';
    }

    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!phone) {
        setPosCustError('pos-new-cust-phone', 'Vui lòng nhập số điện thoại khách hàng!');
        if (!firstInvalid) firstInvalid = 'pos-new-cust-phone';
    } else if (!phoneRegex.test(phone)) {
        setPosCustError('pos-new-cust-phone', 'Số điện thoại không đúng định dạng (cần 10 số, bắt đầu bằng 03, 05, 07, 08, 09)!');
        if (!firstInvalid) firstInvalid = 'pos-new-cust-phone';
    }

    if (firstInvalid) {
        document.getElementById(firstInvalid).focus();
        AdminCommon.showToast('Vui lòng kiểm tra các ô màu đỏ còn thiếu hoặc sai định dạng!', 'error');
        return;
    }

    let users = AdminCommon.getLocalStorage('user') || [];
    const existCust = users.find(u => u.phone === phone);
    if (existCust) {
        loadCustomersToSelect();
        const custSelect = document.getElementById('pos-customer');
        if (custSelect) custSelect.value = existCust.id || existCust.username;
        closeQuickAddCustomerModal();
        AdminCommon.showToast(`Khách hàng "${existCust.name}" (SĐT ${phone}) đã có trong hệ thống! Đã tự động chọn.`, 'info');
        return;
    }

    const newId = 'KH' + Date.now().toString().slice(-4);
    const newCustomer = {
        id: newId,
        name: name,
        phone: phone,
        gmail: email || `${phone}@gearskeycap.vn`,
        address: address || 'Tại cửa hàng',
        username: phone,
        password: 'User@123',
        role: 'customer',
        status: 'active',
        createdAt: new Date().toISOString()
    };

    users.push(newCustomer);
    AdminCommon.setLocalStorage('user', users);

    loadCustomersToSelect();
    const custSelect = document.getElementById('pos-customer');
    if (custSelect) custSelect.value = newId;

    closeQuickAddCustomerModal();
    AdminCommon.showToast(`Đã tạo thành công khách hàng "${name}" và chọn vào đơn POS!`, 'success');
}

// Lắng nghe xóa lỗi khi gõ
['pos-new-cust-name', 'pos-new-cust-phone'].forEach(id => {
    document.addEventListener('input', (e) => {
        if (e.target && e.target.id === id) {
            e.target.style.borderColor = '#2b3147';
            e.target.style.backgroundColor = '#0f111a';
            const err = document.getElementById('error-' + id);
            if (err) { err.innerText = ''; err.style.display = 'none'; }
        }
    });
});

window.openQuickAddCustomerModal = openQuickAddCustomerModal;
window.closeQuickAddCustomerModal = closeQuickAddCustomerModal;
window.handleQuickCreateCustomer = handleQuickCreateCustomer;

function filterPosCategory(type) {
    const chips = document.querySelectorAll('.cat-chip');
    chips.forEach(c => c.classList.remove('active'));

    const activeChip = Array.from(chips).find(c => c.textContent.toLowerCase().includes(type.toLowerCase()) || (type === 'all' && c.textContent.includes('Tất cả')));
    if (activeChip) activeChip.classList.add('active');

    if (type === 'all') {
        filteredPosProducts = [...posProducts];
    } else {
        filteredPosProducts = posProducts.filter(p => p.type === type);
    }
    renderPosProducts();
}

function renderPosProducts() {
    const container = document.getElementById('pos-products-container');
    if (!container) return;

    if (filteredPosProducts.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 40px; font-size: 1.4rem;">
                Không tìm thấy sản phẩm Keycap nào phù hợp!
            </div>
        `;
        return;
    }

    container.innerHTML = filteredPosProducts.map(p => {
        const imgSrc = AdminCommon.resolveAdminImgPath(p.img);
        const isOutOfStock = (p.stock || 0) <= 0;

        return `
            <div class="pos-product-card" onclick="${isOutOfStock ? `alert('Sản phẩm đã hết hàng!')` : `addToPosCart(${p.id})`}">
                <img src="${imgSrc}" class="pos-product-img" onerror="this.src='../img/ShortCut_Icon.png'" alt="${AdminCommon.escapeHtml(p.name)}">
                <div class="pos-product-info">
                    <div class="pos-product-name" title="${AdminCommon.escapeHtml(p.name)}">${AdminCommon.escapeHtml(p.name)}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
                        <span class="pos-product-price">${AdminCommon.formatCurrency(p.price)}</span>
                        <span class="pos-product-stock" style="color: ${isOutOfStock ? '#ef4444' : '#64748b'};">
                            ${isOutOfStock ? 'Hết hàng' : `Kho: ${p.stock}`}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function addToPosCart(productId) {
    const product = posProducts.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = posCart.findIndex(item => item.id === productId);
    if (existingIndex !== -1) {
        posCart[existingIndex].quantity += 1;
        selectedCartIndex = existingIndex;
    } else {
        posCart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            costPrice: product.costPrice || Math.round(product.price * 0.65),
            quantity: 1,
            discount: 0
        });
        selectedCartIndex = posCart.length - 1;
    }

    numpadBuffer = '';
    renderPosCart();
}

function selectCartRow(index) {
    selectedCartIndex = index;
    numpadBuffer = '';
    renderPosCart();
}

function renderPosCart() {
    const listEl = document.getElementById('pos-cart-list');
    const itemsCountEl = document.getElementById('pos-items-count');
    const subtotalEl = document.getElementById('pos-subtotal');
    const totalAmountEl = document.getElementById('pos-total-amount');
    const discountTextEl = document.getElementById('pos-discount-text');

    if (!listEl) return;

    if (posCart.length === 0) {
        listEl.innerHTML = `
            <div style="text-align: center; color: #94a3b8; padding-top: 50px; font-size: 1.4rem;">
                <i class="fas fa-shopping-basket" style="font-size: 3rem; margin-bottom: 10px; display: block;"></i>
                Chưa có sản phẩm nào trong đơn hàng.<br>Vui lòng click chọn Keycap bên phải!
            </div>
        `;
        selectedCartIndex = -1;
        if (itemsCountEl) itemsCountEl.innerText = '0';
        if (subtotalEl) subtotalEl.innerText = '0 đ';
        if (totalAmountEl) totalAmountEl.innerText = '0 đ';
        if (discountTextEl) discountTextEl.innerText = '0% (0 đ)';
        return;
    }

    let subTotal = 0;
    let totalItems = 0;

    listEl.innerHTML = posCart.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        subTotal += itemTotal;
        totalItems += item.quantity;
        const isSelected = index === selectedCartIndex;

        return `
            <div class="pos-item-row ${isSelected ? 'selected' : ''}" onclick="selectCartRow(${index})">
                <div style="flex: 1;">
                    <div class="pos-item-name">${AdminCommon.escapeHtml(item.name)}</div>
                    <div class="pos-item-sub">
                        ${item.quantity} x ${AdminCommon.formatCurrency(item.price)}
                        ${item.discount > 0 ? `<span style="color: #ef4444;">(-${item.discount}%)</span>` : ''}
                    </div>
                </div>
                <div class="pos-item-price">
                    ${AdminCommon.formatCurrency(itemTotal)}
                </div>
            </div>
        `;
    }).join('');

    const discountAmount = Math.round(subTotal * (currentDiscountPercent / 100));
    const grandTotal = Math.max(0, subTotal - discountAmount);

    if (itemsCountEl) itemsCountEl.innerText = totalItems;
    if (subtotalEl) subtotalEl.innerText = AdminCommon.formatCurrency(subTotal);
    if (discountTextEl) discountTextEl.innerText = `${currentDiscountPercent}% (-${AdminCommon.formatCurrency(discountAmount)})`;
    if (totalAmountEl) totalAmountEl.innerText = AdminCommon.formatCurrency(grandTotal);
}

function clearCart() {
    if (posCart.length === 0) return;
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng hiện tại không?')) {
        posCart = [];
        selectedCartIndex = -1;
        currentDiscountPercent = 0;
        numpadBuffer = '';
        renderPosCart();
    }
}

// Bàn phím số Numpad
function setNumpadMode(mode) {
    numpadMode = mode;
    numpadBuffer = '';
    document.getElementById('btn-mode-qty').classList.toggle('active-mode', mode === 'qty');
    document.getElementById('btn-mode-disc').classList.toggle('active-mode', mode === 'disc');
}

function pressNumpad(val) {
    if (selectedCartIndex === -1 && posCart.length > 0) {
        selectedCartIndex = 0;
    }
    if (selectedCartIndex === -1) return;

    if (val === 'backspace') {
        numpadBuffer = numpadBuffer.slice(0, -1);
    } else if (val === '+/-') {
        // Toggle dấu
        return;
    } else {
        if (numpadBuffer.length < 5) {
            numpadBuffer += val;
        }
    }

    const numVal = parseInt(numpadBuffer) || 0;

    if (numpadMode === 'qty') {
        if (numVal > 0) {
            posCart[selectedCartIndex].quantity = numVal;
        } else if (numpadBuffer === '') {
            posCart[selectedCartIndex].quantity = 1;
        }
    } else if (numpadMode === 'disc') {
        currentDiscountPercent = Math.min(100, Math.max(0, numVal));
    }

    renderPosCart();
}

function removeSelectedItem() {
    if (selectedCartIndex >= 0 && selectedCartIndex < posCart.length) {
        posCart.splice(selectedCartIndex, 1);
        selectedCartIndex = posCart.length - 1;
        numpadBuffer = '';
        renderPosCart();
    }
}

// Thanh toán (Payment Modal)
function openPaymentModal() {
    if (posCart.length === 0) {
        AdminCommon.showToast('Vui lòng chọn ít nhất 1 sản phẩm Keycap trước khi thanh toán!', 'error');
        return;
    }

    let subTotal = posCart.reduce((sum, it) => sum + it.price * it.quantity, 0);
    let discountAmount = Math.round(subTotal * (currentDiscountPercent / 100));
    let grandTotal = Math.max(0, subTotal - discountAmount);

    document.getElementById('modal-pay-amount').innerText = AdminCommon.formatCurrency(grandTotal);
    document.getElementById('pos-cash-given').value = grandTotal;
    calculateChange();

    selectPayMethod('Cash');
    document.getElementById('pos-payment-modal').classList.add('active');
}

function closePaymentModal() {
    document.getElementById('pos-payment-modal').classList.remove('active');
}

function selectPayMethod(method) {
    selectedPayMethod = method;
    const btnCash = document.getElementById('pay-cash');
    const btnBank = document.getElementById('pay-bank');
    const btnAcc = document.getElementById('pay-account');
    const cashBox = document.getElementById('cash-calculator-box');
    const bankQrBox = document.getElementById('pos-bank-qr-box');

    [btnCash, btnBank, btnAcc].forEach(btn => {
        if (btn) {
            btn.style.background = '#64748b';
            btn.classList.remove('active');
        }
    });

    const subTotal = posCart.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const discountAmount = Math.round(subTotal * (currentDiscountPercent / 100));
    const grandTotal = Math.max(0, subTotal - discountAmount);

    if (method === 'Cash') {
        btnCash.style.background = '#10b981';
        btnCash.classList.add('active');
        if (cashBox) cashBox.style.display = 'block';
        if (bankQrBox) bankQrBox.style.display = 'none';
    } else if (method === 'Bank') {
        btnBank.style.background = '#2563eb';
        btnBank.classList.add('active');
        if (cashBox) cashBox.style.display = 'block';
        if (bankQrBox) {
            bankQrBox.style.display = 'block';
            const tempOrderCode = 'DH-POS-' + (Date.now().toString().slice(-4));
            const qrUrl = `https://img.vietqr.io/image/MB-0987654321-compact2.png?amount=${grandTotal}&addInfo=${encodeURIComponent(tempOrderCode)}&accountName=GEARS%20KEYCAP%20SHOP`;
            const qrImg = document.getElementById('pos-payment-modal-qr');
            const qrAmt = document.getElementById('pos-payment-qr-amount');
            const qrMemo = document.getElementById('pos-payment-qr-memo');

            if (qrImg) {
                qrImg.src = qrUrl;
                qrImg.onerror = function() {
                    this.onerror = null;
                    this.src = `https://qr.sepay.vn/img?bank=MBBank&acc=0987654321&template=compact&amount=${grandTotal}&des=${encodeURIComponent(tempOrderCode)}`;
                };
            }
            if (qrAmt) qrAmt.innerText = AdminCommon.formatCurrency(grandTotal);
            if (qrMemo) qrMemo.innerText = tempOrderCode;
        }
        // Khi chuyển khoản thì mặc định số tiền khách đưa bằng đúng tổng đơn
        const cashGivenInp = document.getElementById('pos-cash-given');
        if (cashGivenInp) {
            cashGivenInp.value = grandTotal;
            calculateChange();
        }
    } else {
        btnAcc.style.background = '#8b5cf6';
        btnAcc.classList.add('active');
        if (cashBox) cashBox.style.display = 'block';
        if (bankQrBox) bankQrBox.style.display = 'none';
    }
}

function calculateChange() {
    const subTotal = posCart.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const discountAmount = Math.round(subTotal * (currentDiscountPercent / 100));
    const grandTotal = Math.max(0, subTotal - discountAmount);

    const cashGiven = parseFloat(document.getElementById('pos-cash-given').value) || 0;
    const change = Math.max(0, cashGiven - grandTotal);
    document.getElementById('pos-cash-change').innerText = AdminCommon.formatCurrency(change);
}

function quickCash(amount) {
    const current = parseFloat(document.getElementById('pos-cash-given').value) || 0;
    document.getElementById('pos-cash-given').value = current + amount;
    calculateChange();
}

function quickCashExact() {
    const subTotal = posCart.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const discountAmount = Math.round(subTotal * (currentDiscountPercent / 100));
    const grandTotal = Math.max(0, subTotal - discountAmount);

    document.getElementById('pos-cash-given').value = grandTotal;
    calculateChange();
}

// Xác nhận đơn hàng & Tạo biên lai
function confirmOrderPayment() {
    const subTotal = posCart.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const discountAmount = Math.round(subTotal * (currentDiscountPercent / 100));
    const grandTotal = Math.max(0, subTotal - discountAmount);
    const cashGiven = parseFloat(document.getElementById('pos-cash-given').value) || grandTotal;

    if (cashGiven < grandTotal && selectedPayMethod === 'Cash') {
        AdminCommon.showToast('Số tiền khách đưa chưa đủ để thanh toán đơn hàng!', 'error');
        return;
    }

    const custSelect = document.getElementById('pos-customer');
    const custVal = custSelect ? custSelect.value : 'guest';
    const custName = custSelect && custSelect.selectedOptions[0] ? custSelect.selectedOptions[0].text : 'Khách Hàng Vãng Lai';

    const currentUser = AdminCommon.getLocalStorage('currentAdminUser') || { name: 'Nguyễn Công Danh' };
    const orderId = Date.now();
    const orderCode = 'DH-POS-' + (orderId.toString().slice(-4));
    const costTotal = posCart.reduce((sum, it) => sum + (it.costPrice || 0) * it.quantity, 0);
    const profit = Math.max(0, grandTotal - costTotal);

    const newOrder = {
        id: orderId,
        orderCode: orderCode,
        customerName: custName,
        customerPhone: '',
        customerEmail: '',
        address: 'Bán tại quầy (Điểm bán lẻ POS)',
        date: new Date().toISOString(),
        status: 'giaohang', // Đơn tại quầy thanh toán xong xem như đã hoàn tất
        paymentMethod: selectedPayMethod,
        paymentMethodText: selectedPayMethod === 'Cash' ? 'Tiền mặt tại quầy' : (selectedPayMethod === 'Bank' ? 'Chuyển khoản Ngân hàng' : 'Tài khoản Khách hàng'),
        cashierName: currentUser.name,
        channel: 'POS',
        items: posCart.map(it => ({
            id: it.id,
            name: it.name,
            quantity: it.quantity,
            costPrice: it.costPrice,
            price: it.price
        })),
        subTotal: subTotal,
        discountPercent: currentDiscountPercent,
        discountAmount: discountAmount,
        total: grandTotal,
        costTotal: costTotal,
        profit: profit,
        cashGiven: cashGiven,
        change: Math.max(0, cashGiven - grandTotal),
        note: `Đơn hàng bán lẻ tại quầy POS bởi ${currentUser.name}`
    };

    // 1. Lưu vào bảng orders
    const orders = AdminCommon.getLocalStorage('orders') || [];
    orders.unshift(newOrder);
    AdminCommon.setLocalStorage('orders', orders);

    // 2. Trừ số lượng tồn kho sản phẩm (stock)
    posCart.forEach(item => {
        const prod = posProducts.find(p => p.id === item.id);
        if (prod) {
            prod.stock = Math.max(0, (prod.stock || 0) - item.quantity);
        }
    });
    AdminCommon.setLocalStorage('product', posProducts);

    lastCompletedOrder = newOrder;
    closePaymentModal();
    showReceiptModal(newOrder);
}

function showReceiptModal(order) {
    document.getElementById('receipt-order-id').innerText = `Mã ĐH: #${order.orderCode || order.id}`;
    document.getElementById('receipt-datetime').innerText = `Thời gian: ${AdminCommon.formatDate(order.date)}`;
    document.getElementById('receipt-cashier').innerText = `Thu ngân: ${order.cashierName}`;
    document.getElementById('receipt-customer').innerText = `Khách hàng: ${order.customerName}`;

    const tbody = document.getElementById('receipt-items-tbody');
    tbody.innerHTML = order.items.map(it => `
        <tr>
            <td style="padding: 3px 0;">${AdminCommon.escapeHtml(it.name)}</td>
            <td style="text-align: center;">${it.quantity}</td>
            <td style="text-align: right;">${AdminCommon.formatCurrency(it.price)}</td>
            <td style="text-align: right; font-weight: bold;">${AdminCommon.formatCurrency(it.price * it.quantity)}</td>
        </tr>
    `).join('');

    document.getElementById('receipt-subtotal').innerText = AdminCommon.formatCurrency(order.subTotal);
    document.getElementById('receipt-discount').innerText = `${order.discountPercent}% (-${AdminCommon.formatCurrency(order.discountAmount)})`;
    document.getElementById('receipt-total').innerText = AdminCommon.formatCurrency(order.total);
    document.getElementById('receipt-payment-method').innerText = order.paymentMethodText;
    document.getElementById('receipt-cash-given').innerText = AdminCommon.formatCurrency(order.cashGiven || order.total);
    document.getElementById('receipt-change').innerText = AdminCommon.formatCurrency(order.change || 0);

    // XỬ LÝ IN MÃ QR VIETQR NẾU THANH TOÁN BẰNG CHUYỂN KHOẢN (CK / BANK / SEPAY)
    const qrSection = document.getElementById('receipt-qr-section');
    if (qrSection) {
        const method = (order.paymentMethod || '').toLowerCase();
        const methodText = (order.paymentMethodText || '').toLowerCase();
        const isBankTransfer = method === 'bank' || method === 'ck' || method === 'transfer' || method === 'sepay' ||
                               methodText.includes('chuyển khoản') || methodText.includes('ngân hàng') || methodText.includes('vietqr') || methodText.includes('sepay');

        if (isBankTransfer) {
            qrSection.style.display = 'block';
            const orderCode = order.orderCode || ('DH' + order.id);
            const amount = order.total || 0;
            const memoEl = document.getElementById('receipt-qr-memo');
            const amtEl = document.getElementById('receipt-qr-amount');
            const imgEl = document.getElementById('receipt-qr-image');

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

    document.getElementById('pos-receipt-modal').classList.add('active');
}

function printReceiptDirectly() {
    window.print();
}

function finishAndNewOrder() {
    document.getElementById('pos-receipt-modal').classList.remove('active');
    posCart = [];
    selectedCartIndex = -1;
    currentDiscountPercent = 0;
    numpadBuffer = '';
    renderPosCart();
    renderPosProducts();
    AdminCommon.showToast('Đã hoàn thành đơn hàng và sẵn sàng cho đơn tiếp theo!', 'success');
}
