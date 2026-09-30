// --------------------------------------------------------------------------- //
// khởi tạo user
function createAccount() {
    var userArray = [];
    if (localStorage.getItem('user') == null) {
        var admin = {
            username: 'admin',
            password: '987',
            gmail: 'admin1704@gmail.com',
            RegisterDay: `1-1-1999`,
            userType: 'admin',
        };
        userArray.push(admin);

        // Tạo thêm 3 tài khoản ảo để test
        for (var i = 1; i <= 3; i++) {
            var temp = {
                username: `user${i}`,
                password: `${124 + i}`,
                gmail: `user${i}@gmail.com`,
                RegisterDay: `${i}-1-1999`,
                userType: 'user',
                status: 'active',
            };
            userArray.push(temp);
        }
        localStorage.setItem('user', JSON.stringify(userArray)); // đẩy dữ liệu lên Local Storage
    }
}

// --------------------------------------------------------------------------- //
//  khởi tạo dữ liệu sản phẩm
function createProducts() {
    var stored = localStorage.getItem('product');
    var parsed = null;
    try {
        parsed = stored ? JSON.parse(stored) : null;
    } catch (e) {
        parsed = null;
    }

    if (!parsed || parsed.length < 100 || !parsed[0].supplierId) {
        if (typeof window !== 'undefined' && window.KEYCAP_100_PRODUCTS && window.KEYCAP_100_PRODUCTS.length >= 100) {
            localStorage.setItem('product', JSON.stringify(window.KEYCAP_100_PRODUCTS));
            return;
        }
        if (typeof KEYCAP_100_PRODUCTS !== 'undefined' && KEYCAP_100_PRODUCTS.length >= 100) {
            localStorage.setItem('product', JSON.stringify(KEYCAP_100_PRODUCTS));
            return;
        }
    }
}



// --------------------------------------------------------------------------- //
// khởi tạo cartList rỗng
function createCartListEmpty() {
    if (localStorage.getItem('cartList') === null) {
        var CartEmpty = [];
        localStorage.setItem('cartList', JSON.stringify(CartEmpty));
    }
}


// ===== Gọi hàm để khởi tạo khi load trang =====

createAccount();
createProducts();
createCartListEmpty();
