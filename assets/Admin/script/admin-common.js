// ============================================================================
// GEARS KEYCAP SHOP - HỆ THỐNG QUẢN LÝ CỬA HÀNG BÁN KEYCAP
// Môn học: Phân tích Thiết kế Hướng Đối tượng (PTTKHDT) - ĐH Sài Gòn (SGU)
// Nhóm sinh viên thực hiện:
// - 3124410032 - Nguyễn Công Danh
// - 3124410293 - Trần Nhật Quang
// - 3122560041 - Lê Hoài Lộc
// ============================================================================

// ---------------------------------------------------------------------------
// 1. TẦNG DATA ACCESS / STORAGE UTILITIES (OOP INTEGRATED)
// ---------------------------------------------------------------------------

if (typeof require !== 'undefined' && (typeof GearsApp === 'undefined' || !GearsApp)) {
    try {
        const gears = require('../../scripts/modules/GearsApp.js');
        if (typeof global !== 'undefined') {
            global.GearsApp = gears.gearsApp;
            global.StorageService = gears.StorageService;
            global.AuthService = gears.AuthService;
            global.ProductService = gears.ProductService;
            global.CartService = gears.CartService;
            global.OrderService = gears.OrderService;
            global.CustomerService = gears.CustomerService;
            global.SupplierService = gears.SupplierService;
            global.EmployeeService = gears.EmployeeService;
            global.ReportService = gears.ReportService;
            global.ConfigService = gears.ConfigService;
            global.NotificationService = gears.NotificationService;
            global.BaseEntity = gears.BaseEntity;
            global.User = gears.User;
            global.Customer = gears.Customer;
            global.Employee = gears.Employee;
            global.Product = gears.Product;
            global.OrderItem = gears.OrderItem;
            global.Order = gears.Order;
            global.Supplier = gears.Supplier;
            global.WebsiteConfig = gears.WebsiteConfig;
            global.EntityFactory = gears.EntityFactory;
            global.PaymentStrategy = gears.PaymentStrategy;
            global.VietQRPaymentStrategy = gears.VietQRPaymentStrategy;
            global.CashPaymentStrategy = gears.CashPaymentStrategy;
            global.CardPaymentStrategy = gears.CardPaymentStrategy;
        }
    } catch (e) {
        try {
            const gears = require('./assets/scripts/modules/GearsApp.js');
            if (typeof global !== 'undefined') {
                global.GearsApp = gears.gearsApp;
                global.StorageService = gears.StorageService;
                global.AuthService = gears.AuthService;
                global.ProductService = gears.ProductService;
                global.CartService = gears.CartService;
                global.OrderService = gears.OrderService;
                global.CustomerService = gears.CustomerService;
                global.SupplierService = gears.SupplierService;
                global.EmployeeService = gears.EmployeeService;
                global.ReportService = gears.ReportService;
                global.ConfigService = gears.ConfigService;
                global.NotificationService = gears.NotificationService;
                global.BaseEntity = gears.BaseEntity;
                global.User = gears.User;
                global.Customer = gears.Customer;
                global.Employee = gears.Employee;
                global.Product = gears.Product;
                global.OrderItem = gears.OrderItem;
                global.Order = gears.Order;
                global.Supplier = gears.Supplier;
                global.WebsiteConfig = gears.WebsiteConfig;
                global.EntityFactory = gears.EntityFactory;
                global.PaymentStrategy = gears.PaymentStrategy;
                global.VietQRPaymentStrategy = gears.VietQRPaymentStrategy;
                global.CashPaymentStrategy = gears.CashPaymentStrategy;
                global.CardPaymentStrategy = gears.CardPaymentStrategy;
            }
        } catch (e2) {}
    }
}

function getLocalStorage(key) {
    if (typeof GearsApp !== 'undefined' && GearsApp && GearsApp.storage) {
        return GearsApp.storage.get(key, null);
    }
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Error getting ${key} from localStorage:`, error);
        return null;
    }
}

function setLocalStorage(key, data) {
    if (typeof GearsApp !== 'undefined' && GearsApp && GearsApp.storage) {
        return GearsApp.storage.set(key, data);
    }
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(`Error setting ${key} to localStorage:`, error);
        return false;
    }
}

// ---------------------------------------------------------------------------
// 2. KHỞI TẠO DỮ LIỆU MẪU CHUẨN CƠ SỞ DỮ LIỆU PTTKHDT & BFD
// ---------------------------------------------------------------------------

function initializeSystemData() {
    // 1. Danh mục Keycap (types)
    if (!getLocalStorage('types')) {
        const defaultTypes = [
            { id: "Artisan", name: "Artisan Keycap Thủ Công", desc: "Keycap đúc nhựa resin thủ công nghệ thuật cao cấp" },
            { id: "Anime", name: "Anime / Manga Keycap", desc: "Keycap in nhiệt PBT theo chủ đề nhân vật Anime Nhật Bản" },
            { id: "Pudding", name: "Pudding Keycap Xuyên LED", desc: "Keycap 2 lớp PBT doubleshot xuyên sáng LED RGB rực rỡ" },
            { id: "Cherry", name: "Cherry / OEM Profile Set", desc: "Bộ keycap fullset chuẩn công thái học văn phòng và gaming" },
            { id: "Other", name: "Keycap Custom Độc Bản", desc: "Các dòng keycap nút lẻ, spacebar, novelty đặc biệt" }
        ];
        setLocalStorage('types', defaultTypes);
    }

    // 2. Nhà cung cấp (suppliers)
    if (!getLocalStorage('suppliers') || getLocalStorage('suppliers').length === 0) {
        const defaultSuppliers = [
            {
                id: "NCC01",
                name: "Akko Gear Official Vietnam",
                phone: "0903123456",
                email: "contact@akkogear.vn",
                address: "Số 123 Đường 3/2, Quận 10, TP. Hồ Chí Minh",
                productTypes: "Anime, Cherry",
                note: "Nhà phân phối chính hãng keycap Akko PBT Dyesub"
            },
            {
                id: "NCC02",
                name: "Keychron & Glorious Studio",
                phone: "0918765432",
                email: "supplier@keychron.vn",
                address: "Tòa nhà IPC, Quận 7, TP. Hồ Chí Minh",
                productTypes: "Pudding, Cherry",
                note: "Chuyên keycap PBT Doubleshot và OEM layout chuẩn"
            },
            {
                id: "NCC03",
                name: "Jelly Key Artisan Vietnam",
                phone: "0934567890",
                email: "hello@jellykey.com",
                address: "Khu Công nghệ cao, TP. Thủ Đức, TP. HCM",
                productTypes: "Artisan",
                note: "Nghệ nhân đúc keycap thủ công resin cao cấp xuất khẩu"
            },
            {
                id: "NCC04",
                name: "HolyOOPS & Novelty Maker",
                phone: "0978112233",
                email: "support@holyoops.asia",
                address: "Khu Chế Xuất Tân Thuận, Quận 7, TP. HCM",
                productTypes: "Other, Artisan",
                note: "Chuyên keycap nhôm CNC và anime kim loại cao cấp"
            }
        ];
        setLocalStorage('suppliers', defaultSuppliers);
    }

    // 3. Nhân viên & Phân quyền (employees)
    if (!getLocalStorage('employees') || getLocalStorage('employees').length === 0 || getLocalStorage('employees')[0].password === 'admin123') {
        const defaultEmployees = [
            {
                id: "NV01",
                name: "Nguyễn Công Danh",
                phone: "0912345678",
                email: "danh.nguyen@gearskeycap.com",
                address: "273 An Dương Vương, Phường 3, Quận 5, TP.HCM",
                role: "admin",
                roleName: "Quản trị viên / Quản lý",
                username: "admin",
                password: "Admin@123",
                status: "active",
                createdAt: "2026-01-10"
            },
            {
                id: "NV02",
                name: "Trần Nhật Quang",
                phone: "0923456789",
                email: "quang.tran@gearskeycap.com",
                address: "Quận 10, TP. Hồ Chí Minh",
                role: "admin",
                roleName: "Quản trị viên / Quản lý",
                username: "quangtran",
                password: "QuangTran@123",
                status: "active",
                createdAt: "2026-01-15"
            },
            {
                id: "NV03",
                name: "Lê Hoài Lộc",
                phone: "0934567891",
                email: "loc.le@gearskeycap.com",
                address: "Quận 8, TP. Hồ Chí Minh",
                role: "admin",
                roleName: "Quản trị viên / Quản lý",
                username: "hoailoc",
                password: "HoaiLoc@123",
                status: "active",
                createdAt: "2026-01-20"
            },
            {
                id: "NV04",
                name: "Phạm Thu Ngân",
                phone: "0945678902",
                email: "thungan.pos@gearskeycap.com",
                address: "Quận 5, TP. Hồ Chí Minh",
                role: "pos",
                roleName: "Nhân viên Bán hàng / Thu ngân POS",
                username: "cashier",
                password: "Cashier@123",
                status: "active",
                createdAt: "2026-02-01"
            }
        ];
        setLocalStorage('employees', defaultEmployees);
    }

    // 4. Khách hàng (user / customers)
    let currentUsers = getLocalStorage('user');
    if (!currentUsers || currentUsers.length === 0 || currentUsers[0].password === 'admin123') {
        const defaultUsers = [
            {
                id: "KH01",
                username: "admin",
                name: "Nguyễn Công Danh (Admin)",
                gmail: "admin@gearskeycap.com",
                phone: "0912345678",
                address: "TP. Hồ Chí Minh",
                password: "Admin@123",
                RegisterDay: "2026-01-10",
                userType: "admin",
                status: "active",
                totalSpent: 4500000
            },
            {
                id: "KH02",
                username: "vanhai",
                name: "Nguyễn Văn Hải",
                gmail: "vanhai99@gmail.com",
                phone: "0987654321",
                address: "45 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM",
                password: "VanHai@123",
                RegisterDay: "2026-02-14",
                userType: "client",
                status: "active",
                totalSpent: 1850000
            },
            {
                id: "KH03",
                username: "minhtri",
                name: "Trần Minh Trí",
                gmail: "minhtri.dev@gmail.com",
                phone: "0908112233",
                address: "78 Nguyễn Trãi, Phường 2, Quận 5, TP.HCM",
                password: "MinhTri@123",
                RegisterDay: "2026-03-01",
                userType: "client",
                status: "active",
                totalSpent: 2450000
            },
            {
                id: "KH04",
                username: "thanhha",
                name: "Lê Thanh Hà",
                gmail: "thanhha.design@gmail.com",
                phone: "0933445566",
                address: "12 Võ Văn Kiệt, Quận 1, TP.HCM",
                password: "ThanhHa@123",
                RegisterDay: "2026-03-10",
                userType: "client",
                status: "active",
                totalSpent: 920000
            }
        ];
        setLocalStorage('user', defaultUsers);
    }

    // 5. Sản phẩm Keycap chuẩn (product) - Nạp trọn bộ 100 sản phẩm Keycap
    let currentProducts = getLocalStorage('product');
    let dataset100 = (typeof window !== 'undefined' && window.KEYCAP_100_PRODUCTS) || (typeof KEYCAP_100_PRODUCTS !== 'undefined' && KEYCAP_100_PRODUCTS);
    if (dataset100 && dataset100.length >= 100) {
        if (!currentProducts || currentProducts.length < 100 || !currentProducts[0].supplierId) {
            setLocalStorage('product', dataset100);
        }
    } else if (!currentProducts || currentProducts.length === 0 || !currentProducts[0].supplierId) {
        const defaultProducts = [
            {
                id: 1,
                name: "Sun Goddess Shrine Artisan Keycap",
                type: "Artisan",
                supplierId: "NCC03",
                costPrice: 500000,
                price: 825000,
                stock: 12,
                img: "./assets/img/Products/Artisan/001.jpg",
                description: "Keycap nghệ thuật đền thần mặt trời đúc nhựa resin thủ công"
            },
            {
                id: 2,
                name: "Galaxy Space Nebula Artisan Keycap",
                type: "Artisan",
                supplierId: "NCC03",
                costPrice: 520000,
                price: 800000,
                stock: 8,
                img: "./assets/img/Products/Artisan/002.jpg",
                description: "Keycap hiệu ứng dải ngân hà huyền ảo đúc bằng resin cao cấp"
            },
            {
                id: 3,
                name: "Koi Fish Natural Pond Artisan Keycap",
                type: "Artisan",
                supplierId: "NCC03",
                costPrice: 350000,
                price: 545000,
                stock: 15,
                img: "./assets/img/Products/Artisan/003.jpg",
                description: "Keycap hồ cá Koi bơi lội sống động, hiệu ứng 3D siêu chân thực"
            },
            {
                id: 4,
                name: "Interstellar Spacecraft Keycap",
                type: "Artisan",
                supplierId: "NCC03",
                costPrice: 600000,
                price: 930000,
                stock: 6,
                img: "./assets/img/Products/Artisan/004.jpg",
                description: "Tác phẩm viễn tưởng vũ trụ thám hiểm Interstellar tinh xảo"
            },
            {
                id: 5,
                name: "Devil Fruit One Piece Resin Keycap",
                type: "Artisan",
                supplierId: "NCC04",
                costPrice: 620000,
                price: 940000,
                stock: 10,
                img: "./assets/img/Products/Artisan/007.jpg",
                description: "Keycap trái ác quỷ Mera Mera no Mi đúc resin trong suốt phát sáng"
            },
            {
                id: 6,
                name: "Kimetsu no Yaiba PBT Dyesub Fullset",
                type: "Anime",
                supplierId: "NCC01",
                costPrice: 480000,
                price: 745000,
                stock: 20,
                img: "./assets/img/Products/Anime/014.png",
                description: "Bộ keycap 108 phím chủ đề Thanh Gươm Diệt Quỷ in nhiệt PBT bền bỉ"
            },
            {
                id: 7,
                name: "Pokemon Bulbasaur & Pikachu Keycap Set",
                type: "Anime",
                supplierId: "NCC01",
                costPrice: 500000,
                price: 790000,
                stock: 18,
                img: "./assets/img/Products/Anime/016.png",
                description: "Bộ keycap phong cách Pokemon song ngữ Nhật - Anh cực đẹp"
            },
            {
                id: 8,
                name: "Hatsune Miku Vocaloid Keycap Set",
                type: "Anime",
                supplierId: "NCC01",
                costPrice: 450000,
                price: 690000,
                stock: 14,
                img: "./assets/img/Products/Anime/019.jpeg",
                description: "Set keycap phối màu xanh ngọc Hatsune Miku siêu độc đáo"
            },
            {
                id: 9,
                name: "Keycap PBT Pudding Black LED",
                type: "Pudding",
                supplierId: "NCC02",
                costPrice: 210000,
                price: 350000,
                stock: 25,
                img: "./assets/img/Products/Pudding/011.jpg",
                description: "Set keycap Pudding chân trắng nắp đen tôn vinh dàn đèn LED phím cơ"
            },
            {
                id: 10,
                name: "Keycap PBT Pudding White LED",
                type: "Pudding",
                supplierId: "NCC02",
                costPrice: 210000,
                price: 350000,
                stock: 30,
                img: "./assets/img/Products/Pudding/012.jpg",
                description: "Set keycap Pudding trắng tinh khôi chuẩn Doubleshot không mòn chữ"
            },
            {
                id: 11,
                name: "Keycap PBT Pudding Blue Sky",
                type: "Pudding",
                supplierId: "NCC02",
                costPrice: 210000,
                price: 350000,
                stock: 16,
                img: "./assets/img/Products/Pudding/blue.jpg",
                description: "Keycap Pudding phối màu xanh dương pastel xuyên sáng cực êm dịu"
            },
            {
                id: 12,
                name: "TypeWriter Retro Round Keycap Set",
                type: "Other",
                supplierId: "NCC04",
                costPrice: 160000,
                price: 270000,
                stock: 22,
                img: "./assets/img/Products/Other/023.jpg",
                description: "Bộ phím tròn phong cách máy đánh chữ cổ điển viền bạc sang trọng"
            },
            {
                id: 13,
                name: "OSU! Rhythm Game Custom Keycap",
                type: "Other",
                supplierId: "NCC04",
                costPrice: 25000,
                price: 55000,
                stock: 45,
                img: "./assets/img/Products/Other/020.jpg",
                description: "Nút keycap lẻ in logo OSU chuyên dụng cho game thủ bấm nhịp"
            },
            {
                id: 14,
                name: "CS:GO Counter Strike Metal Keycap",
                type: "Other",
                supplierId: "NCC04",
                costPrice: 65000,
                price: 110000,
                stock: 19,
                img: "./assets/img/Products/Other/022.jpg",
                description: "Keycap biểu tượng CS:GO hầm hố cho game thủ FPS"
            }
        ];
        setLocalStorage('product', defaultProducts);
    }

    // 6. Đơn hàng (orders)
    let currentOrders = getLocalStorage('orders');
    if (!currentOrders || currentOrders.length === 0) {
        const defaultOrders = [
            {
                id: 1001,
                orderCode: "DH-2601",
                customerName: "Nguyễn Văn Hải",
                customerPhone: "0987654321",
                customerEmail: "vanhai99@gmail.com",
                address: "45 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM",
                date: "2026-03-25T09:30:00",
                status: "giaohang",
                paymentMethod: "Cash",
                paymentMethodText: "Tiền mặt tại quầy (POS)",
                cashierName: "Phạm Thu Ngân",
                channel: "POS",
                items: [
                    { id: 1, name: "Sun Goddess Shrine Artisan Keycap", quantity: 1, costPrice: 500000, price: 825000 },
                    { id: 9, name: "Keycap PBT Pudding Black LED", quantity: 1, costPrice: 210000, price: 350000 }
                ],
                subTotal: 1175000,
                discountPercent: 0,
                discountAmount: 0,
                total: 1175000,
                costTotal: 710000,
                profit: 465000,
                note: "Đơn mua trực tiếp tại quầy POS"
            },
            {
                id: 1002,
                orderCode: "DH-2602",
                customerName: "Trần Minh Trí",
                customerPhone: "0908112233",
                customerEmail: "minhtri.dev@gmail.com",
                address: "78 Nguyễn Trãi, Phường 2, Quận 5, TP.HCM",
                date: "2026-03-26T14:15:00",
                status: "giaohang",
                paymentMethod: "Bank",
                paymentMethodText: "Chuyển khoản Ngân hàng",
                cashierName: "Nguyễn Công Danh",
                channel: "POS",
                items: [
                    { id: 6, name: "Kimetsu no Yaiba PBT Dyesub Fullset", quantity: 2, costPrice: 480000, price: 745000 },
                    { id: 13, name: "OSU! Rhythm Game Custom Keycap", quantity: 2, costPrice: 25000, price: 55000 }
                ],
                subTotal: 1600000,
                discountPercent: 5,
                discountAmount: 80000,
                total: 1520000,
                costTotal: 1010000,
                profit: 510000,
                note: "Áp dụng khuyến mãi khách thân thiết 5%"
            },
            {
                id: 1003,
                orderCode: "DH-2603",
                customerName: "Lê Thanh Hà",
                customerPhone: "0933445566",
                customerEmail: "thanhha.design@gmail.com",
                address: "12 Võ Văn Kiệt, Quận 1, TP.HCM",
                date: "2026-03-28T16:45:00",
                status: "xuly",
                paymentMethod: "Online",
                paymentMethodText: "Đặt hàng Web Online",
                cashierName: "Hệ thống Web",
                channel: "Online",
                items: [
                    { id: 3, name: "Koi Fish Natural Pond Artisan Keycap", quantity: 1, costPrice: 350000, price: 545000 }
                ],
                subTotal: 545000,
                discountPercent: 0,
                discountAmount: 0,
                total: 545000,
                costTotal: 350000,
                profit: 195000,
                note: "Giao giờ hành chính"
            },
            {
                id: 1004,
                orderCode: "DH-2604",
                customerName: "Khách vãng lai",
                customerPhone: "0911223344",
                customerEmail: "",
                address: "Mua trực tiếp tại cửa hàng",
                date: "2026-03-29T11:20:00",
                status: "moi",
                paymentMethod: "Cash",
                paymentMethodText: "Tiền mặt tại quầy (POS)",
                cashierName: "Phạm Thu Ngân",
                channel: "POS",
                items: [
                    { id: 10, name: "Keycap PBT Pudding White LED", quantity: 1, costPrice: 210000, price: 350000 },
                    { id: 14, name: "CS:GO Counter Strike Metal Keycap", quantity: 1, costPrice: 65000, price: 110000 }
                ],
                subTotal: 460000,
                discountPercent: 0,
                discountAmount: 0,
                total: 460000,
                costTotal: 275000,
                profit: 185000,
                note: "Khách đang thanh toán tại quầy"
            }
        ];
        setLocalStorage('orders', defaultOrders);
    }

    // 7. POS Sessions (Phiên bán hàng POS)
    if (!getLocalStorage('pos_sessions')) {
        const defaultSession = {
            sessionId: "SES-" + Date.now().toString().slice(-6),
            openedAt: new Date().toISOString(),
            closedAt: null,
            cashierName: "Nguyễn Công Danh",
            status: "open",
            startingCash: 2000000,
            totalSales: 0,
            orderCount: 0
        };
        setLocalStorage('pos_sessions', [defaultSession]);
    }

    // 8. Đăng nhập hiện tại (Session Auth)
    // KHÔNG tự động tạo user - phải đăng nhập trước mới vào được admin

    // 9. Cấu hình Website (websiteConfig)
    if (!getLocalStorage('websiteConfig')) {
        const defaultConfig = {
            shopName: "GEARS SHOP",
            brandTagline: "Chuyên cung cấp keycap giá rẻ và chất lượng tốt",
            description: "GEARS Shop là cửa hàng chuyên cung cấp keycap giá rẻ và chất lượng tốt, chúng tôi cam kết bán hàng chính hãng, đảm bảo yêu cầu của người tiêu dùng.",
            logoUrl: "", // Base64 or image URL
            faviconUrl: "./assets/img/ShortCut_Icon.png",
            hotline: "1800 6975",
            email: "cskh@gearskeycap.vn",
            address: "273 An Dương Vương, Phường 3, Quận 5, TP. Hồ Chí Minh",
            workingHours: "08:00 - 21:30 (Thứ 2 - Chủ Nhật)",
            topBannerText: "ƯU ĐÃI ĐỘC QUYỀN THÁNG 03/2026 - BỘ SƯU TẬP KEYCAP CUSTOM CAO CẤP",
            facebookUrl: "https://facebook.com",
            instagramUrl: "https://instagram.com",
            githubUrl: "https://github.com"
        };
        setLocalStorage('websiteConfig', defaultConfig);
    }
}

// ---------------------------------------------------------------------------
// 3. TIỆN ÍCH ĐỊNH DẠNG & THÔNG BÁO (UI HELPERS)
// ---------------------------------------------------------------------------

function formatCurrency(amount) {
    if (isNaN(amount) || amount === null || amount === undefined) amount = 0;
    return Number(amount).toLocaleString('vi-VN') + ' đ';
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function formatDateOnly(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            top: 25px;
            right: 25px;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const icon = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle');
    const bgColor = type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#3b82f6');

    toast.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        background: ${bgColor};
        color: white;
        padding: 14px 22px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.18);
        font-size: 14px;
        font-weight: 500;
        min-width: 280px;
        max-width: 420px;
        animation: toastIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: 'Quicksand', 'Roboto', sans-serif;
    `;

    toast.innerHTML = `<i class="fas ${icon}" style="font-size: 18px;"></i> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// ---------------------------------------------------------------------------
// 4. KIỂM TRA PHÂN QUYỀN & XÁC THỰC (AUTHENTICATION & AUTHORIZATION)
// ---------------------------------------------------------------------------

function checkAuth(requiredRole = null) {
    let currentUser = getLocalStorage('currentAdminUser') || getLocalStorage('clientLoggedInUser');
    if (!currentUser && typeof sessionStorage !== 'undefined') {
        try {
            currentUser = JSON.parse(sessionStorage.getItem('currentAdminUser') || sessionStorage.getItem('clientLoggedInUser') || 'null');
        } catch(e) {}
    }

    if (!currentUser) {
        // Chưa đăng nhập -> Chuyển về login
        if (typeof window !== 'undefined' && !window.location.pathname.toLowerCase().includes('login')) {
            const p = window.location.pathname.toLowerCase();
            const loginUrl = (p.includes('/assets/admin') || p.includes('/assets/Admin')) ? '/assets/Admin/login.html' : 'login.html';
            window.location.replace(loginUrl);
        }
        return false;
    }

    // Đảm bảo chuẩn hóa role nếu là tài khoản quản trị
    if (!currentUser.role && (currentUser.userType === 'admin' || currentUser.username === 'admin')) {
        currentUser.role = 'admin';
        currentUser.roleName = currentUser.roleName || 'Quản Trị Viên (Admin)';
    }

    // Đồng bộ ngược lại session để các tab khác luôn nhận diện đúng
    setLocalStorage('currentAdminUser', currentUser);
    if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('currentAdminUser', JSON.stringify(currentUser));
    }

    const isAdmin = currentUser.role === 'admin' || currentUser.userType === 'admin' || (currentUser.roleName && currentUser.roleName.toLowerCase().includes('quản trị'));
    const isPos = currentUser.role === 'pos' || currentUser.role === 'cashier' || currentUser.userType === 'pos' || (currentUser.roleName && (currentUser.roleName.toLowerCase().includes('pos') || currentUser.roleName.toLowerCase().includes('thu ngân')));

    // Kiểm tra nếu là tài khoản Khách hàng mua sắm thông thường (không phải admin/pos)
    const isCustomer = (currentUser.userType === 'client' || currentUser.userType === 'customer' || (!isAdmin && !isPos));
    if (isCustomer && !isAdmin && !isPos) {
        alert('Tài khoản Khách Hàng không có quyền truy cập khu vực Quản Trị & Bán Hàng!');
        window.location.replace('../../index.html');
        return false;
    }

    if (typeof document !== 'undefined') {
        // 1. Đồng bộ thông tin người dùng lên Topbar
        const nameEl = document.getElementById('admin-user-name');
        const roleEl = document.getElementById('admin-user-role');
        const avatarEl = document.getElementById('admin-user-avatar');
        if (nameEl) nameEl.innerText = currentUser.name || currentUser.username;
        if (roleEl) {
            roleEl.innerText = isPos ? 'Thu Ngân / POS Bán Hàng' : (currentUser.roleName || 'Quản Trị Viên (Admin)');
            if (isPos) {
                roleEl.style.color = '#34d399';
                roleEl.style.fontWeight = '700';
            }
        }
        if (avatarEl) {
            const initials = (currentUser.name || currentUser.username || 'NV')
                .split(' ')
                .map(w => w[0])
                .slice(-2)
                .join('')
                .toUpperCase();
            avatarEl.innerText = initials;
        }

        // 2. Giới hạn quyền truy cập hệ thống của Thu Ngân so với Admin
        // Thu ngân chỉ được vào: pos.html (bán hàng), orders.html (xử lý đơn), products.html (tra cứu keycap), customers.html (khách hàng)
        // Bị cấm vào: dashboard.html, reports.html, database.html, employees.html, settings.html, suppliers.html
        const currentPath = window.location.pathname.toLowerCase();
        const adminOnlyPages = ['dashboard.html', 'reports.html', 'database.html', 'employees.html', 'settings.html', 'suppliers.html'];
        const isAccessingAdminOnly = adminOnlyPages.some(page => currentPath.includes(page));

        if (isPos) {
            if (isAccessingAdminOnly || requiredRole === 'admin') {
                alert(`Tài khoản Thu Ngân POS (${currentUser.name || currentUser.username}) chỉ có quyền Bán Hàng và Xử Lý Đơn.\nTrang này thuộc quyền Quản Lý Admin tối cao.\nĐang chuyển bạn về Điểm Bán Lẻ POS.`);
                window.location.replace('pos.html');
                return false;
            }
        }
    }

    if (requiredRole === 'admin' && !isAdmin) {
        alert('Bạn không có quyền quản trị tối cao (Admin)! Quyền hiện tại: ' + (currentUser.roleName || currentUser.role));
        if (typeof window !== 'undefined') window.location.replace('pos.html');
        return false;
    }

    return true;
}

function logoutAdmin() {
    try {
        localStorage.removeItem('currentAdminUser');
        localStorage.removeItem('clientLoggedInUser');
        localStorage.removeItem('currentUser');
        sessionStorage.clear();
    } catch (e) {
        console.error('Logout error:', e);
    }

    if (typeof showToast === 'function') {
        showToast('Đang đăng xuất khỏi hệ thống...', 'info');
    }

    let loginUrl = 'login.html';
    if (typeof window !== 'undefined' && window.location) {
        const p = window.location.pathname.toLowerCase();
        if (p.includes('/assets/admin') || p.includes('/assets/Admin')) {
            loginUrl = '/assets/Admin/login.html';
        } else if (p.includes('admin')) {
            loginUrl = 'login.html';
        } else {
            loginUrl = '/assets/Admin/login.html';
        }
        window.location.replace(loginUrl);
    }
}
window.logoutAdmin = logoutAdmin;

// ---------------------------------------------------------------------------
// 5. XUẤT DỮ LIỆU EXCEL (.XLSX / .CSV) THEO ĐẶC TẢ
// ---------------------------------------------------------------------------

function exportTableToExcel(data, filename, sheetName = 'Sheet1') {
    if (typeof XLSX === 'undefined') {
        // Fallback: Xuất CSV nếu chưa load kịp thư viện SheetJS
        exportToCSV(data, filename + '.csv');
        return;
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${filename}.xlsx`);
    showToast(`Đã xuất file ${filename}.xlsx thành công!`);
}

function exportToCSV(data, filename) {
    if (!data || !data.length) {
        showToast('Không có dữ liệu để xuất!', 'error');
        return;
    }
    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','),
        ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName] || '')).join(','))
    ];
    const csvString = '\uFEFF' + csvRows.join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Đã xuất file ${filename} thành công!`);
}

// ---------------------------------------------------------------------------
// 6. RENDER THANH NAVBAR CHUẨN ĐỒ ÁN CHO TẤT CẢ CÁC TRANG ADMIN
// ---------------------------------------------------------------------------

function renderStandardNavbar(activeTab = 'dashboard') {
    const currentUser = getLocalStorage('currentAdminUser') || {
        name: "Nguyễn Công Danh",
        roleName: "Quản trị viên / Quản lý",
        role: "admin"
    };

    const header = document.querySelector('.header') || document.querySelector('.top-navbar');
    if (!header) return;

    header.innerHTML = `
        <div class="custom-navbar">
            <div class="navbar-left">
                <a href="app-launcher.html" class="nav-brand" title="Màn hình ứng dụng chính PTTKHDT">
                    <i class="fas fa-keyboard brand-icon"></i>
                    <div class="brand-text">
                        <span class="brand-title">GEARS KEYCAP</span>
                        <span class="brand-sub">Hệ thống Quản lý Bán Keycap</span>
                    </div>
                </a>
            </div>

            <div class="navbar-center">
                <a href="app-launcher.html" class="nav-item ${activeTab === 'launcher' ? 'active' : ''}" title="Cổng ứng dụng ERP">
                    <i class="fas fa-th-large"></i> <span>Cổng ứng dụng</span>
                </a>
                <a href="dashboard.html" class="nav-item ${activeTab === 'dashboard' ? 'active' : ''}">
                    <i class="fas fa-tachometer-alt"></i> <span>Tổng quan</span>
                </a>
                <a href="pos.html" class="nav-item ${activeTab === 'pos' ? 'active' : ''} highlight-pos" title="Điểm bán lẻ tại quầy">
                    <i class="fas fa-cash-register"></i> <span>Điểm bán lẻ (POS)</span>
                </a>
                <a href="orders.html" class="nav-item ${activeTab === 'orders' ? 'active' : ''}">
                    <i class="fas fa-receipt"></i> <span>Đơn hàng</span>
                </a>
                <a href="products.html" class="nav-item ${activeTab === 'products' ? 'active' : ''}">
                    <i class="fas fa-cube"></i> <span>Sản phẩm</span>
                </a>
                <a href="suppliers.html" class="nav-item ${activeTab === 'suppliers' ? 'active' : ''}">
                    <i class="fas fa-truck-loading"></i> <span>Nhà cung cấp</span>
                </a>
                <a href="customers.html" class="nav-item ${activeTab === 'customers' ? 'active' : ''}">
                    <i class="fas fa-users"></i> <span>Khách hàng</span>
                </a>
                <a href="employees.html" class="nav-item ${activeTab === 'employees' ? 'active' : ''}">
                    <i class="fas fa-user-shield"></i> <span>Nhân viên</span>
                </a>
                <a href="reports.html" class="nav-item ${activeTab === 'reports' ? 'active' : ''}">
                    <i class="fas fa-chart-line"></i> <span>Thống kê</span>
                </a>
            </div>

            <div class="navbar-right">
                <a href="../../index.html" class="nav-btn-store" target="_blank" title="Xem cửa hàng Online cho khách">
                    <i class="fas fa-store"></i> <span>Web Khách hàng</span>
                </a>
                <div class="user-profile-badge" title="Tài khoản: ${escapeHtml(currentUser.name)}">
                    <i class="fas fa-user-circle user-avatar"></i>
                    <div class="user-meta">
                        <span class="user-name">${escapeHtml(currentUser.name)}</span>
                        <span class="user-role">${escapeHtml(currentUser.roleName || currentUser.role)}</span>
                    </div>
                </div>
                <button onclick="logoutAdmin()" class="btn-logout" title="Đăng xuất khỏi hệ thống">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        </div>
    `;
}

// ---------------------------------------------------------------------------
// 7. KIỂM TRA MẬT KHẨU BẢO MẬT (ĐỦ 8 KÝ TỰ, VIẾT HOA, KÝ TỰ ĐẶC BIỆT)
// ---------------------------------------------------------------------------

function validatePasswordSecurity(password) {
    if (!password || password.length < 8) {
        return {
            valid: false,
            message: 'Mật khẩu phải có độ dài tối thiểu 8 ký tự!'
        };
    }
    if (!/[A-Z]/.test(password)) {
        return {
            valid: false,
            message: 'Mật khẩu phải chứa ít nhất 1 chữ cái VIẾT HOA (A-Z)!'
        };
    }
    if (!/[!@#$%^&*(),.?":{}|<>_+\-=~`]/.test(password)) {
        return {
            valid: false,
            message: 'Mật khẩu phải chứa ít nhất 1 ký tự ĐẶC BIỆT (ví dụ: @, #, $, %, !...)!'
        };
    }
    return { valid: true };
}

// ---------------------------------------------------------------------------
// 8. TIỆN ÍCH CẤU HÌNH WEBSITE & GIAO DIỆN
// ---------------------------------------------------------------------------

function getWebsiteConfig() {
    let conf = getLocalStorage('websiteConfig');
    if (!conf) {
        initializeSystemData();
        conf = getLocalStorage('websiteConfig');
    }
    return conf;
}

function applyWebsiteConfigToPage() {
    const config = getWebsiteConfig();
    if (!config) return;

    // Cập nhật Hotline
    const hotlineEls = document.querySelectorAll('.gear-hotline');
    hotlineEls.forEach(el => { el.innerText = config.hotline || '1800 6975'; });

    // Cập nhật Logo nếu có upload logo
    const logoContainers = document.querySelectorAll('.gear-logo-box, .header-logo, .brand-logo-custom');
    logoContainers.forEach(logoEl => {
        if (config.logoUrl) {
            logoEl.innerHTML = `<img src="${config.logoUrl}" alt="${config.shopName || 'GEARS'}" style="max-height: 38px; max-width: 160px; object-fit: contain; vertical-align: middle; border-radius: 4px;">`;
        }
    });

    // Cập nhật tên cửa hàng trong header & footer
    const brandNameEls = document.querySelectorAll('.gear-shop-brand-name, #footer-shop-name');
    brandNameEls.forEach(el => { el.innerText = config.shopName || 'GEARS SHOP'; });

    // Cập nhật Top Banner
    const topBannerEl = document.getElementById('gear-top-banner-text');
    if (topBannerEl && config.topBannerText) {
        topBannerEl.innerText = config.topBannerText;
    }

    // Cập nhật Địa chỉ Showroom
    const addressEl = document.getElementById('footer-address');
    if (addressEl && config.address) {
        addressEl.innerText = config.address;
    }

    // Cập nhật mô tả Footer
    const footerDescEl = document.getElementById('footer-shop-desc');
    if (footerDescEl && config.description) {
        footerDescEl.innerText = config.description;
    }

    // Cập nhật Social links
    const fbLink = document.getElementById('footer-fb-link');
    if (fbLink && config.facebookUrl) fbLink.href = config.facebookUrl;

    const instaLink = document.getElementById('footer-insta-link');
    if (instaLink && config.instagramUrl) instaLink.href = config.instagramUrl;

    const ghLink = document.getElementById('footer-gh-link');
    if (ghLink && config.githubUrl) ghLink.href = config.githubUrl;
}

function resolveAdminImgPath(imgSrc) {
    if (!imgSrc || typeof imgSrc !== 'string') {
        return '../img/ShortCut_Icon.png';
    }
    const trimmed = imgSrc.trim();
    if (!trimmed) {
        return '../img/ShortCut_Icon.png';
    }
    if (trimmed.startsWith('data:image/') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('blob:')) {
        return trimmed;
    }
    if (trimmed.startsWith('./assets/img/')) {
        return '../img/' + trimmed.substring('./assets/img/'.length);
    }
    if (trimmed.startsWith('assets/img/')) {
        return '../img/' + trimmed.substring('assets/img/'.length);
    }
    if (trimmed.startsWith('./assets/')) {
        return '../../' + trimmed.substring(2);
    }
    if (trimmed.startsWith('assets/')) {
        return '../../' + trimmed;
    }
    if (trimmed.startsWith('/assets/')) {
        return '../..' + trimmed;
    }
    if (trimmed.startsWith('../img/') || trimmed.startsWith('./img/') || trimmed.startsWith('../')) {
        return trimmed;
    }
    return trimmed;
}

// ---------------------------------------------------------------------------
// 9. QUẢN LÝ ĐỔI MẬT KHẨU TÀI KHOẢN (ADMIN / THU NGÂN)
// ---------------------------------------------------------------------------

function openAdminChangePasswordModal() {
    const user = getLocalStorage('currentAdminUser') || getLocalStorage('clientLoggedInUser');
    if (!user) {
        showToast('Vui lòng đăng nhập trước!', 'error');
        return;
    }

    let modal = document.getElementById('admin-change-pass-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'admin-change-pass-modal';
        modal.className = 'modal-backdrop-dark';
        modal.style.cssText = 'display: flex; position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 999999; align-items: center; justify-content: center; backdrop-filter: blur(6px);';
        modal.innerHTML = `
            <div style="background: #151822; border: 1px solid #2b3248; border-radius: 12px; width: 100%; max-width: 460px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); overflow: hidden;">
                <div style="padding: 16px 20px; background: #11141e; border-bottom: 1px solid #2b3248; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: #ffffff; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-key" style="color: #3b82f6;"></i> Thông Tin &amp; Đổi Mật Khẩu
                    </h3>
                    <button type="button" onclick="AdminCommon.closeAdminChangePasswordModal()" style="background: none; border: none; color: #94a3b8; font-size: 16px; cursor: pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div style="padding: 20px;">
                    <!-- User info card -->
                    <div style="background: #10121a; border: 1px solid #23283a; border-radius: 8px; padding: 12px 14px; margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
                        <div style="width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700;">
                            <i class="fas fa-user-shield"></i>
                        </div>
                        <div style="flex: 1; min-width: 0;">
                            <div style="font-size: 14px; font-weight: 700; color: #ffffff;" id="admin-pass-modal-name">Admin</div>
                            <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">
                                <span id="admin-pass-modal-user">@admin</span> &bull; 
                                <span style="color: #34d399; font-weight: 600;" id="admin-pass-modal-role">Quản lý</span>
                            </div>
                        </div>
                    </div>

                    <div id="admin-pass-alert" style="display: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; margin-bottom: 12px;"></div>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <div>
                            <label style="display: block; font-size: 12px; font-weight: 700; color: #cbd5e1; margin-bottom: 4px;">
                                Mật khẩu hiện tại: <span style="color: #ef4444;">*</span>
                            </label>
                            <input type="password" id="adm-old-pass" class="input-dark" placeholder="Nhập mật khẩu đang dùng..." style="width: 100%; height: 38px; font-size: 13px;">
                            <small id="error-adm-old-pass" style="color: #ef4444; font-size: 11px; display: none; margin-top: 4px;"></small>
                        </div>

                        <div>
                            <label style="display: block; font-size: 12px; font-weight: 700; color: #cbd5e1; margin-bottom: 4px;">
                                Mật khẩu mới: <span style="color: #ef4444;">*</span>
                            </label>
                            <input type="password" id="adm-new-pass" class="input-dark" placeholder="Tối thiểu 8 ký tự, chữ hoa, ký tự đặc biệt..." style="width: 100%; height: 38px; font-size: 13px;">
                            <small id="error-adm-new-pass" style="color: #ef4444; font-size: 11px; display: none; margin-top: 4px;"></small>
                        </div>

                        <div>
                            <label style="display: block; font-size: 12px; font-weight: 700; color: #cbd5e1; margin-bottom: 4px;">
                                Nhập lại mật khẩu mới: <span style="color: #ef4444;">*</span>
                            </label>
                            <input type="password" id="adm-confirm-pass" class="input-dark" placeholder="Nhập lại chính xác mật khẩu mới..." style="width: 100%; height: 38px; font-size: 13px;">
                            <small id="error-adm-confirm-pass" style="color: #ef4444; font-size: 11px; display: none; margin-top: 4px;"></small>
                        </div>

                        <div style="font-size: 11px; color: #94a3b8; line-height: 1.4;">
                            <i class="fas fa-shield-alt" style="color: #3b82f6;"></i> Tiêu chuẩn bảo mật: Tối thiểu 8 ký tự, có ít nhất 1 chữ in hoa và 1 ký tự đặc biệt.
                        </div>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; border-top: 1px solid #23283a; padding-top: 14px;">
                        <button type="button" class="btn-tech btn-tech-reset" onclick="AdminCommon.closeAdminChangePasswordModal()">
                            Hủy Bỏ
                        </button>
                        <button type="button" class="btn-tech btn-tech-blue" onclick="AdminCommon.submitAdminChangePassword()" style="font-weight: 700;">
                            <i class="fas fa-save"></i> Cập Nhật Mật Khẩu
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    document.getElementById('admin-pass-modal-name').innerText = user.name || user.username;
    document.getElementById('admin-pass-modal-user').innerText = `@${user.username}`;
    document.getElementById('admin-pass-modal-role').innerText = user.roleName || (user.role === 'admin' ? 'Quản trị viên' : 'Thu ngân');

    ['adm-old-pass', 'adm-new-pass', 'adm-confirm-pass'].forEach(id => {
        const inp = document.getElementById(id);
        if (inp) {
            inp.value = '';
            inp.style.borderColor = '#2b3248';
            inp.style.backgroundColor = '#121520';
        }
    });
    ['error-adm-old-pass', 'error-adm-new-pass', 'error-adm-confirm-pass'].forEach(id => {
        const err = document.getElementById(id);
        if (err) { err.innerText = ''; err.style.display = 'none'; }
    });
    const alertBox = document.getElementById('admin-pass-alert');
    if (alertBox) { alertBox.style.display = 'none'; alertBox.innerText = ''; }

    modal.style.display = 'flex';
}

function closeAdminChangePasswordModal() {
    const modal = document.getElementById('admin-change-pass-modal');
    if (modal) modal.style.display = 'none';
}

function submitAdminChangePassword() {
    const user = getLocalStorage('currentAdminUser') || getLocalStorage('clientLoggedInUser');
    if (!user) {
        showToast('Vui lòng đăng nhập trước!', 'error');
        return;
    }

    const oldInp = document.getElementById('adm-old-pass');
    const newInp = document.getElementById('adm-new-pass');
    const confInp = document.getElementById('adm-confirm-pass');
    const alertBox = document.getElementById('admin-pass-alert');

    const oldErr = document.getElementById('error-adm-old-pass');
    const newErr = document.getElementById('error-adm-new-pass');
    const confErr = document.getElementById('error-adm-confirm-pass');

    // Reset styles
    [oldInp, newInp, confInp].forEach(inp => {
        if (inp) {
            inp.style.borderColor = '#2b3248';
            inp.style.backgroundColor = '#121520';
        }
    });
    [oldErr, newErr, confErr].forEach(err => {
        if (err) { err.innerText = ''; err.style.display = 'none'; }
    });
    if (alertBox) { alertBox.style.display = 'none'; alertBox.innerText = ''; }

    const oldPass = oldInp.value;
    const newPass = newInp.value;
    const confPass = confInp.value;

    let firstInvalid = null;

    if (!oldPass) {
        oldInp.style.borderColor = '#ef4444';
        oldInp.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        oldErr.innerText = 'Vui lòng nhập mật khẩu hiện tại!';
        oldErr.style.display = 'block';
        if (!firstInvalid) firstInvalid = oldInp;
    } else if (oldPass !== user.password) {
        oldInp.style.borderColor = '#ef4444';
        oldInp.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        oldErr.innerText = 'Mật khẩu hiện tại không chính xác!';
        oldErr.style.display = 'block';
        if (!firstInvalid) firstInvalid = oldInp;
    }

    if (!newPass) {
        newInp.style.borderColor = '#ef4444';
        newInp.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        newErr.innerText = 'Vui lòng nhập mật khẩu mới!';
        newErr.style.display = 'block';
        if (!firstInvalid) firstInvalid = newInp;
    } else if (newPass === oldPass) {
        newInp.style.borderColor = '#ef4444';
        newInp.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        newErr.innerText = 'Mật khẩu mới không được trùng mật khẩu cũ!';
        newErr.style.display = 'block';
        if (!firstInvalid) firstInvalid = newInp;
    } else {
        const passCheck = validatePasswordSecurity(newPass);
        if (!passCheck.valid) {
            newInp.style.borderColor = '#ef4444';
            newInp.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            newErr.innerText = passCheck.message;
            newErr.style.display = 'block';
            if (!firstInvalid) firstInvalid = newInp;
        }
    }

    if (!confPass) {
        confInp.style.borderColor = '#ef4444';
        confInp.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        confErr.innerText = 'Vui lòng nhập lại mật khẩu mới!';
        confErr.style.display = 'block';
        if (!firstInvalid) firstInvalid = confInp;
    } else if (confPass !== newPass) {
        confInp.style.borderColor = '#ef4444';
        confInp.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        confErr.innerText = 'Xác nhận mật khẩu không khớp!';
        confErr.style.display = 'block';
        if (!firstInvalid) firstInvalid = confInp;
    }

    if (firstInvalid) {
        firstInvalid.focus();
        showToast('Vui lòng kiểm tra các ô có viền đỏ thông báo lỗi!', 'error');
        return;
    }

    // Cập nhật CSDL
    user.password = newPass;

    const employees = getLocalStorage('employees') || [];
    const empIdx = employees.findIndex(e => e.username === user.username);
    if (empIdx !== -1) {
        employees[empIdx].password = newPass;
        setLocalStorage('employees', employees);
    }

    const users = getLocalStorage('user') || [];
    const uIdx = users.findIndex(u => u.username === user.username);
    if (uIdx !== -1) {
        users[uIdx].password = newPass;
        setLocalStorage('user', users);
    }

    setLocalStorage('currentAdminUser', user);
    setLocalStorage('clientLoggedInUser', user);

    showToast('Đổi mật khẩu thành công! Mật khẩu mới đã được cập nhật an toàn.', 'success');
    closeAdminChangePasswordModal();
}

// ---------------------------------------------------------------------------
// 9. MODAL CẤU HÌNH CSDL MYSQL CHUẨN NAVICAT (LƯU VÀO .ENV)
// ---------------------------------------------------------------------------

function openDbConfigModal() {
    let modal = document.getElementById('navicat-conn-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'navicat-conn-modal';
        modal.className = 'modal-backdrop-dark';
        modal.style.cssText = 'display: flex; position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 9999999; align-items: center; justify-content: center; backdrop-filter: blur(8px); padding: 15px;';
        modal.innerHTML = `
            <div style="background: #141724; border: 1px solid #2b334d; border-radius: 12px; width: 100%; max-width: 540px; box-shadow: 0 25px 50px rgba(0,0,0,0.7); overflow: hidden;">
                <div style="padding: 16px 20px; background: #0f121d; border-bottom: 1px solid #232a3f; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-database" style="color: #10b981; font-size: 16px;"></i>
                        <h3 style="margin: 0; font-size: 15px; font-weight: 800; color: #ffffff;">
                            Navicat Connection Manager (MySQL / .env)
                        </h3>
                    </div>
                    <button type="button" onclick="AdminCommon.closeDbConfigModal()" style="background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div style="padding: 20px; max-height: 82vh; overflow-y: auto;">
                    <!-- Banner thong bao ket qua test -->
                    <div id="modal-navicat-alert" style="display: none; padding: 12px 14px; border-radius: 8px; margin-bottom: 16px; font-size: 12.5px; line-height: 1.5;"></div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                        <div>
                            <label style="display: block; font-size: 12px; font-weight: 700; color: #cbd5e1; margin-bottom: 4px;">
                                Host Name / IP: <span style="color: #ef4444;">*</span>
                            </label>
                            <input type="text" id="m-db-host" class="input-dark" value="127.0.0.1" style="width: 100%; height: 36px; font-size: 12.5px;">
                        </div>

                        <div>
                            <label style="display: block; font-size: 12px; font-weight: 700; color: #cbd5e1; margin-bottom: 4px;">
                                Port: <span style="color: #ef4444;">*</span>
                            </label>
                            <input type="number" id="m-db-port" class="input-dark" value="3306" style="width: 100%; height: 36px; font-size: 12.5px;">
                        </div>

                        <div>
                            <label style="display: block; font-size: 12px; font-weight: 700; color: #cbd5e1; margin-bottom: 4px;">
                                User Name: <span style="color: #ef4444;">*</span>
                            </label>
                            <input type="text" id="m-db-user" class="input-dark" value="root" style="width: 100%; height: 36px; font-size: 12.5px;">
                        </div>

                        <div>
                            <label style="display: block; font-size: 12px; font-weight: 700; color: #cbd5e1; margin-bottom: 4px;">
                                Password:
                            </label>
                            <div style="position: relative;">
                                <input type="password" id="m-db-pass" class="input-dark" value="" placeholder="Mặc định để trống" style="width: 100%; height: 36px; font-size: 12.5px; padding-right: 32px;">
                                <span onclick="AdminCommon.toggleModalDbPass()" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #94a3b8; font-size: 12px;">
                                    <i id="m-eye-icon" class="fas fa-eye"></i>
                                </span>
                            </div>
                        </div>

                        <div style="grid-column: span 2;">
                            <label style="display: block; font-size: 12px; font-weight: 700; color: #cbd5e1; margin-bottom: 4px;">
                                Database Name: <span style="color: #ef4444;">*</span>
                            </label>
                            <input type="text" id="m-db-name" class="input-dark" value="gears_keycap_shop" style="width: 100%; height: 36px; font-size: 12.5px;">
                            <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">
                                <i class="fas fa-info-circle" style="color: #38bdf8;"></i> Cấu hình sẽ được lưu trực tiếp vào file <strong>.env</strong> trên máy chủ.
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; border-top: 1px solid #232a3f; padding-top: 16px; flex-wrap: wrap; gap: 10px;">
                        <button type="button" class="btn-tech" style="background: #0284c7; color: #fff; font-weight: 700; font-size: 12.5px;" onclick="AdminCommon.testModalDbConnection()">
                            <i class="fas fa-plug"></i> Test Connection
                        </button>

                        <div style="display: flex; gap: 8px;">
                            <button type="button" class="btn-tech btn-tech-reset" onclick="AdminCommon.closeDbConfigModal()" style="font-size: 12.5px;">
                                Hủy Bỏ
                            </button>
                            <button type="button" class="btn-tech" style="background: #10b981; color: #fff; font-weight: 800; font-size: 12.5px;" onclick="AdminCommon.saveModalDbConfig()">
                                <i class="fas fa-save"></i> Lưu .env &amp; Kết Nối
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Tải cấu hình từ server nếu có
    if (typeof fetch !== 'undefined') {
        fetch('/api/db/config')
            .then(res => res.json())
            .then(cfg => {
                if (cfg) {
                    if (document.getElementById('m-db-host')) document.getElementById('m-db-host').value = cfg.host || '127.0.0.1';
                    if (document.getElementById('m-db-port')) document.getElementById('m-db-port').value = cfg.port || 3306;
                    if (document.getElementById('m-db-user')) document.getElementById('m-db-user').value = cfg.user || 'root';
                    if (document.getElementById('m-db-name')) document.getElementById('m-db-name').value = cfg.database || 'gears_keycap_shop';
                }
            })
            .catch(() => {});
    }

    const alertBox = document.getElementById('modal-navicat-alert');
    if (alertBox) { alertBox.style.display = 'none'; alertBox.innerHTML = ''; }
    modal.style.display = 'flex';
}

function closeDbConfigModal() {
    const modal = document.getElementById('navicat-conn-modal');
    if (modal) modal.style.display = 'none';
}

function toggleModalDbPass() {
    const inp = document.getElementById('m-db-pass');
    const icon = document.getElementById('m-eye-icon');
    if (!inp) return;
    if (inp.type === 'password') {
        inp.type = 'text';
        if (icon) icon.className = 'fas fa-eye-slash';
    } else {
        inp.type = 'password';
        if (icon) icon.className = 'fas fa-eye';
    }
}

async function testModalDbConnection() {
    const h = document.getElementById('m-db-host').value.trim();
    const p = parseInt(document.getElementById('m-db-port').value.trim(), 10) || 3306;
    const u = document.getElementById('m-db-user').value.trim();
    const pw = document.getElementById('m-db-pass').value;
    const db = document.getElementById('m-db-name').value.trim();
    const alertBox = document.getElementById('modal-navicat-alert');

    showToast('Đang kiểm tra kết nối MySQL...', 'info');

    try {
        const res = await fetch('/api/db/test-connection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ host: h, port: p, user: u, password: pw, database: db })
        });
        const data = await res.json();

        if (alertBox) {
            alertBox.style.display = 'block';
            if (data.success) {
                alertBox.style.background = 'rgba(16, 185, 129, 0.15)';
                alertBox.style.border = '1px solid rgba(16, 185, 129, 0.4)';
                alertBox.style.color = '#34d399';
                alertBox.innerHTML = `
                    <div style="font-weight: 800; display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
                        <i class="fas fa-check-circle"></i> Connection Successful! (Kết nối thành công)
                    </div>
                    <div>MySQL Version: <strong>${data.version}</strong> &bull; Database: <strong>${data.database}</strong> (${data.tablesCount || 0} bảng)</div>
                `;
                showToast('Test Connection thành công!', 'success');
            } else {
                alertBox.style.background = 'rgba(239, 68, 68, 0.15)';
                alertBox.style.border = '1px solid rgba(239, 68, 68, 0.4)';
                alertBox.style.color = '#f87171';
                alertBox.innerHTML = `
                    <div style="font-weight: 800; display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
                        <i class="fas fa-times-circle"></i> Connection Failed! (Kết nối thất bại)
                    </div>
                    <div>${data.error}</div>
                `;
                showToast('Test Connection thất bại!', 'error');
            }
        }
    } catch (e) {
        if (alertBox) {
            alertBox.style.display = 'block';
            alertBox.style.background = 'rgba(239, 68, 68, 0.15)';
            alertBox.style.color = '#f87171';
            alertBox.innerHTML = `Lỗi mạng: ${e.message}`;
        }
    }
}

async function saveModalDbConfig() {
    const h = document.getElementById('m-db-host').value.trim();
    const p = parseInt(document.getElementById('m-db-port').value.trim(), 10) || 3306;
    const u = document.getElementById('m-db-user').value.trim();
    const pw = document.getElementById('m-db-pass').value;
    const db = document.getElementById('m-db-name').value.trim();

    showToast('Đang lưu cấu hình vào file .env và kết nối...', 'info');

    try {
        const res = await fetch('/api/db/save-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ host: h, port: p, user: u, password: pw, database: db })
        });
        const data = await res.json();

        if (data.success) {
            showToast('Đã lưu vào file .env và kết nối CSDL thành công!', 'success');
            closeDbConfigModal();
            updateDbStatusBadge();
        } else {
            showToast(data.message || 'Lỗi khi lưu cấu hình', 'error');
        }
    } catch (e) {
        showToast('Lỗi: ' + e.message, 'error');
    }
}

function updateDbStatusBadge() {
    if (typeof fetch === 'undefined') return;
    fetch('/api/db/status')
        .then(res => res.json())
        .then(data => {
            const statusPill = document.querySelector('.status-pill') || document.getElementById('topbar-db-badge');
            if (statusPill) {
                statusPill.style.cursor = 'pointer';
                statusPill.title = 'Nhấn để mở Cấu Hình CSDL (Chuẩn Navicat - File .env)';
                statusPill.onclick = function() {
                    AdminCommon.openDbConfigModal();
                };

                const dot = statusPill.querySelector('.status-dot');
                const span = statusPill.querySelector('span:not(.status-dot)');
                if (data && data.connected) {
                    if (dot) {
                        dot.style.background = '#10b981';
                        dot.style.boxShadow = '0 0 8px #10b981';
                    }
                    if (span) span.innerText = `MySQL ${data.database} (Online)`;
                } else {
                    if (dot) {
                        dot.style.background = '#ef4444';
                        dot.style.boxShadow = '0 0 8px #ef4444';
                    }
                    if (span) span.innerText = 'MySQL Offline (Mở .env)';
                }
            }
        })
        .catch(() => {});
}

// ---------------------------------------------------------------------------
// 10. KHOI CHAY HE THONG KHI TAI TRANG & DONG BO SIDEBAR TABS
// ---------------------------------------------------------------------------

// Kiem tra xac thuc TRUOC KHI khoi tao du lieu
(function() {
    if (typeof window === 'undefined') return;
    const pathname = window.location.pathname.toLowerCase();
    const isLoginPage = pathname.includes('login') || pathname.endsWith('index.html') || pathname === '/' || pathname === '';
    const isAdminPath = pathname.includes('/assets/admin') || pathname.includes('admin');
    if (!isLoginPage && isAdminPath) {
        let user = getLocalStorage('currentAdminUser') || getLocalStorage('clientLoggedInUser');
        if (!user && typeof sessionStorage !== 'undefined') {
            try {
                user = JSON.parse(sessionStorage.getItem('currentAdminUser') || sessionStorage.getItem('clientLoggedInUser') || 'null');
            } catch (e) {}
        }

        // Tự động chuẩn hóa và lưu lại phiên nếu là tài khoản admin hoặc pos
        if (user) {
            if (user.userType === 'admin' || user.username === 'admin') {
                user.role = 'admin';
                user.roleName = user.roleName || 'Quản Trị Viên (Admin)';
            }
            setLocalStorage('currentAdminUser', user);
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.setItem('currentAdminUser', JSON.stringify(user));
            }
        } else {
            const loginUrl = pathname.includes('/assets/admin') ? '/assets/Admin/login.html' : 'login.html';
            window.location.replace(loginUrl);
            return;
        }
    }
})();

initializeSystemData();

function attachLogoutEvents() {
    document.querySelectorAll('.btn-sidebar-logout, .btn-logout-circle, [data-action="logout"]').forEach(btn => {
        btn.onclick = function(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            logoutAdmin();
        };
    });
}

function syncTopbar() {
    const topbarActions = document.querySelector('.topbar-actions');
    if (topbarActions) {
        if (!topbarActions.querySelector('.btn-logout-circle')) {
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'btn-logout-circle';
            logoutBtn.title = 'Đăng xuất khỏi hệ thống';
            logoutBtn.type = 'button';
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
            logoutBtn.onclick = function(e) {
                if (e) e.preventDefault();
                logoutAdmin();
            };
            topbarActions.appendChild(logoutBtn);
        }
    }
}

function renderStandardSidebar(explicitKey = null) {
    const sidebar = document.querySelector('.admin-sidebar');
    if (!sidebar) return;

    // Xac dinh tab active
    const pathname = (window.location.pathname || '').toLowerCase();
    let currentKey = explicitKey;
    if (!currentKey) {
        if (pathname.includes('pos')) currentKey = 'pos';
        else if (pathname.includes('order')) currentKey = 'orders';
        else if (pathname.includes('product')) currentKey = 'products';
        else if (pathname.includes('supplier')) currentKey = 'suppliers';
        else if (pathname.includes('customer')) currentKey = 'customers';
        else if (pathname.includes('employee')) currentKey = 'employees';
        else if (pathname.includes('report')) currentKey = 'reports';
        else if (pathname.includes('database')) currentKey = 'database';
        else if (pathname.includes('setting')) currentKey = 'settings';
        else currentKey = 'dashboard';
    }

    const orderCount = (getLocalStorage('orders') || getLocalStorage('order') || []).length || 5;
    const prodCount = (getLocalStorage('product') || []).length || 100;

    // Kiem tra quyen han thu ngan POS / Admin
    const currentUser = getLocalStorage('currentAdminUser') || getLocalStorage('clientLoggedInUser') || {};
    const isPosCashier = currentUser.role === 'pos' || currentUser.role === 'cashier' || currentUser.userType === 'pos';

    const brandIcon = isPosCashier ? 'fa-cash-register' : 'fa-keyboard';
    const brandIconColor = isPosCashier ? 'style="color:#34d399;"' : '';
    const brandTitleText = isPosCashier ? 'BÁN HÀNG &amp; POS' : 'QUẢN TRỊ HỆ THỐNG';
    const brandBadgeText = isPosCashier ? 'THU NGÂN' : 'v2.6';
    const brandBadgeStyle = isPosCashier ? 'style="background:rgba(16,185,129,0.2);color:#34d399;border-color:rgba(16,185,129,0.4);"' : '';

    sidebar.innerHTML = `
        <!-- Brand Header -->
        <div class="sidebar-brand">
            <div class="sidebar-brand-title">
                <i class="fas ${brandIcon}" ${brandIconColor}></i>
                <span>${brandTitleText}</span>
            </div>
            <span class="version-badge" ${brandBadgeStyle}>${brandBadgeText}</span>
            <button class="sidebar-toggle-btn" title="Thu gọn / Mở rộng sidebar" type="button">
                <i class="fas fa-bars"></i>
            </button>
        </div>

        <!-- Quick Actions (Được đưa lên trên ngay sau logo) -->
        <div class="sidebar-quick-actions" style="padding:8px 12px;display:flex;gap:6px;border-bottom:1px solid var(--border-color,#232738);">
            <a href="../../index.html" target="_blank" class="btn-sidebar-store" style="flex:1;padding:7px 10px;font-size:12px;gap:6px;" title="Xem cửa hàng khách hàng">
                <i class="fas fa-store"></i> <span class="sidebar-link-text">Web KH</span>
            </a>
            <button type="button" class="btn-sidebar-logout" style="flex:1;padding:7px 10px;font-size:12px;gap:6px;" onclick="AdminCommon.logoutAdmin()" title="Đăng xuất khỏi hệ thống">
                <i class="fas fa-sign-out-alt"></i> <span class="sidebar-link-text">Đăng Xuất</span>
            </button>
        </div>

        <!-- Navigation Menu -->
        <div class="sidebar-nav">
            <!-- Nhóm 1: Nghiệp Vụ Bán Hàng -->
            <div class="nav-section-title">
                <i class="fas fa-bolt"></i> ${isPosCashier ? 'Nghiệp Vụ Thu Ngân' : 'Nghiệp Vụ Bán Hàng'}
            </div>
            <ul class="sidebar-menu">
                <li class="sidebar-item" style="${isPosCashier ? 'display:none;' : ''}">
                    <a href="dashboard.html" class="sidebar-link ${currentKey === 'dashboard' ? 'active' : ''}">
                        <div class="sidebar-link-left">
                            <i class="fas fa-tachometer-alt"></i>
                            <span class="sidebar-link-text">Tổng Quan Dashboard</span>
                        </div>
                        <span class="sidebar-badge badge-live">Live</span>
                    </a>
                </li>
                <li class="sidebar-item">
                    <a href="pos.html" class="sidebar-link ${currentKey === 'pos' ? 'active' : ''}">
                        <div class="sidebar-link-left">
                            <i class="fas fa-cash-register"></i>
                            <span class="sidebar-link-text">Điểm Bán Lẻ (POS)</span>
                        </div>
                        <span class="sidebar-badge badge-hot">HOT</span>
                    </a>
                </li>
                <li class="sidebar-item">
                    <a href="orders.html" class="sidebar-link ${currentKey === 'orders' ? 'active' : ''}">
                        <div class="sidebar-link-left">
                            <i class="fas fa-receipt"></i>
                            <span class="sidebar-link-text">Quản Lý Đơn Hàng</span>
                        </div>
                        <span class="sidebar-badge badge-new" id="sidebar-order-count">${orderCount} Đơn</span>
                    </a>
                </li>
                <li class="sidebar-item">
                    <a href="products.html" class="sidebar-link ${currentKey === 'products' ? 'active' : ''}">
                        <div class="sidebar-link-left">
                            <i class="fas fa-cubes"></i>
                            <span class="sidebar-link-text">Sản Phẩm Keycap</span>
                        </div>
                        <span class="sidebar-badge badge-count" id="sidebar-product-count">${prodCount}+</span>
                    </a>
                </li>
            </ul>

            <!-- Nhóm 2: Đối Tác & Nhân Sự -->
            <div class="nav-section-title">
                <i class="fas fa-users-cog"></i> ${isPosCashier ? 'Khách Hàng & Đối Tác' : 'Đối Tác &amp; Nhân Sự'}
            </div>
            <ul class="sidebar-menu">
                <li class="sidebar-item" style="${isPosCashier ? 'display:none;' : ''}">
                    <a href="suppliers.html" class="sidebar-link ${currentKey === 'suppliers' ? 'active' : ''}">
                        <div class="sidebar-link-left">
                            <i class="fas fa-truck-loading"></i>
                            <span class="sidebar-link-text">Nhà Cung Cấp</span>
                        </div>
                        <span class="sidebar-badge badge-tech">Partner</span>
                    </a>
                </li>
                <li class="sidebar-item">
                    <a href="customers.html" class="sidebar-link ${currentKey === 'customers' ? 'active' : ''}">
                        <div class="sidebar-link-left">
                            <i class="fas fa-users"></i>
                            <span class="sidebar-link-text">Khách Hàng</span>
                        </div>
                        <span class="sidebar-badge badge-tech">CRM</span>
                    </a>
                </li>
                <li class="sidebar-item" style="${isPosCashier ? 'display:none;' : ''}">
                    <a href="employees.html" class="sidebar-link ${currentKey === 'employees' ? 'active' : ''}">
                        <div class="sidebar-link-left">
                            <i class="fas fa-user-shield"></i>
                            <span class="sidebar-link-text">Nhân Viên &amp; Phân Quyền</span>
                        </div>
                        <span class="sidebar-badge badge-tech">Auth</span>
                    </a>
                </li>
            </ul>

            <!-- Nhóm 3: Báo Cáo & Cấu Hình -->
            <div class="nav-section-title">
                <i class="${isPosCashier ? 'fas fa-file-code' : 'fas fa-sliders-h'}"></i> ${isPosCashier ? 'Tài Liệu Đồ Án' : 'Báo Cáo &amp; Cấu Hình'}
            </div>
            <ul class="sidebar-menu">
                <li class="sidebar-item" style="${isPosCashier ? 'display:none;' : ''}">
                    <a href="reports.html" class="sidebar-link ${currentKey === 'reports' ? 'active' : ''}">
                        <div class="sidebar-link-left">
                            <i class="fas fa-chart-line"></i>
                            <span class="sidebar-link-text">Thống Kê Báo Cáo</span>
                        </div>
                        <span class="sidebar-badge badge-tech">Chart</span>
                    </a>
                </li>
                <li class="sidebar-item" style="${isPosCashier ? 'display:none;' : ''}">
                    <a href="database.html" class="sidebar-link ${currentKey === 'database' ? 'active' : ''}">
                        <div class="sidebar-link-left">
                            <i class="fas fa-database" style="color: #10b981;"></i>
                            <span class="sidebar-link-text">Cấu Hình CSDL (Navicat)</span>
                        </div>
                        <span class="sidebar-badge badge-tech" style="background: rgba(16,185,129,0.25); color: #34d399;">.env</span>
                    </a>
                </li>
                <li class="sidebar-item" style="${isPosCashier ? 'display:none;' : ''}">
                    <a href="settings.html" class="sidebar-link ${currentKey === 'settings' ? 'active' : ''}">
                        <div class="sidebar-link-left">
                            <i class="fas fa-cog"></i>
                            <span class="sidebar-link-text">Cấu Hình Website</span>
                        </div>
                        <span class="sidebar-badge badge-new">Logo</span>
                    </a>
                </li>
                <li class="sidebar-item">
                    <a href="/so-do-canvas" target="_blank" class="sidebar-link">
                        <div class="sidebar-link-left">
                            <i class="fas fa-project-diagram"></i>
                            <span class="sidebar-link-text">Sơ Đồ PTTKHDT</span>
                        </div>
                        <span class="sidebar-badge badge-tech">UML</span>
                    </a>
                </li>
            </ul>
        </div>
    `;

    // Toggle button logic
    const toggleBtn = sidebar.querySelector('.sidebar-toggle-btn');
    const mainWrapper = document.querySelector('.admin-main-wrapper');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            sidebar.classList.toggle('collapsed');
            if (mainWrapper) mainWrapper.classList.toggle('sidebar-collapsed');
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed') ? '1' : '0');
        });
    }

    // Khi collapsed, click brand sẽ mở lại
    const brandTitle = sidebar.querySelector('.sidebar-brand-title');
    if (brandTitle) {
        brandTitle.style.cursor = 'pointer';
        brandTitle.addEventListener('click', function() {
            if (sidebar.classList.contains('collapsed')) {
                sidebar.classList.remove('collapsed');
                if (mainWrapper) mainWrapper.classList.remove('sidebar-collapsed');
                localStorage.setItem('sidebarCollapsed', '0');
            }
        });
    }

    // Khôi phục trạng thái thu gọn
    if (localStorage.getItem('sidebarCollapsed') === '1') {
        sidebar.classList.add('collapsed');
        if (mainWrapper) mainWrapper.classList.add('sidebar-collapsed');
    }

    // Gắn sự kiện đăng xuất
    attachLogoutEvents();
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        const pathname = window.location.pathname.toLowerCase();
        const isLoginPage = pathname.includes('login') || pathname.endsWith('index.html') || pathname === '/' || pathname === '';

        if (!isLoginPage) {
            checkAuth();
            renderStandardSidebar();
            syncTopbar();
        }

        setTimeout(updateDbStatusBadge, 300);
    });

    // Lắng nghe phím Enter toàn cục để Lưu trên các Modal / Form
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            if (e.target && e.target.tagName === 'TEXTAREA') return;

            // 1. Modal đổi mật khẩu Admin
            const changePassModal = document.getElementById('admin-change-pass-modal');
            if (changePassModal && changePassModal.style.display !== 'none' && changePassModal.contains(e.target)) {
                e.preventDefault();
                submitAdminChangePassword();
                return;
            }

            // 2. Modal CSDL Navicat
            const dbModal = document.getElementById('navicat-conn-modal');
            if (dbModal && dbModal.style.display !== 'none' && dbModal.contains(e.target)) {
                e.preventDefault();
                saveModalDbConfig();
                return;
            }

            // 3. Các modal quản trị nghiệp vụ khác (Sản phẩm, Nhân viên, Khách hàng, Nhà cung cấp...)
            const activeModal = document.querySelector('.modal.show, .modal-backdrop-dark:not([style*="none"]), .modal-overlay.active, .modal-box:not([style*="none"])');
            if (activeModal && activeModal.contains(e.target)) {
                const saveBtn = activeModal.querySelector('.btn-tech-blue, .btn-save, .btn-primary, button[onclick*="save"], button[onclick*="Save"], button[onclick*="submit"], .confirm-btn');
                if (saveBtn) {
                    e.preventDefault();
                    saveBtn.click();
                    return;
                }
            }
        }
    });
}

window.AdminCommon = {
    getLocalStorage,
    setLocalStorage,
    formatCurrency,
    formatDate,
    formatDateOnly,
    escapeHtml,
    showToast,
    checkAuth,
    logoutAdmin,
    renderStandardSidebar,
    attachLogoutEvents,
    syncTopbar,
    exportTableToExcel,
    exportToCSV,
    renderStandardNavbar,
    initializeSystemData,
    validatePasswordSecurity,
    getWebsiteConfig,
    applyWebsiteConfigToPage,
    resolveAdminImgPath,
    openAdminChangePasswordModal,
    closeAdminChangePasswordModal,
    submitAdminChangePassword,
    openDbConfigModal,
    closeDbConfigModal,
    testModalDbConnection,
    saveModalDbConfig,
    toggleModalDbPass,
    updateDbStatusBadge,
    loadAdminUserInfo: function() {
        let user = (typeof GearsApp !== 'undefined' && GearsApp.auth) 
            ? GearsApp.auth.getCurrentAdminUser() 
            : (getLocalStorage('currentAdminUser') || getLocalStorage('clientLoggedInUser'));

        if (!user && typeof sessionStorage !== 'undefined') {
            try {
                user = JSON.parse(sessionStorage.getItem('currentAdminUser') || sessionStorage.getItem('clientLoggedInUser') || 'null');
            } catch (e) {}
        }

        if (!user) return;
        const nameEl = document.getElementById('admin-user-name');
        const roleEl = document.getElementById('admin-user-role');
        const avatarEl = document.getElementById('admin-user-avatar');
        if (nameEl) nameEl.innerText = user.name || user.username;
        if (roleEl) {
            const isPos = user.role === 'pos' || user.role === 'cashier' || user.userType === 'pos';
            roleEl.innerText = isPos ? 'Thu Ngân / POS Quầy' : (user.roleName || (user.role === 'admin' ? 'Quản Trị Viên' : 'Quản Lý'));
            if (isPos) {
                roleEl.style.color = '#34d399';
                roleEl.style.fontWeight = '700';
            }
        }
        if (avatarEl && user.avatar) avatarEl.src = resolveAdminImgPath(user.avatar);

        const profileBadge = document.querySelector('.user-profile-badge');
        if (profileBadge) {
            profileBadge.style.cursor = 'pointer';
            profileBadge.title = 'Nhấn để xem thông tin và đổi mật khẩu';
            profileBadge.onclick = function() {
                AdminCommon.openAdminChangePasswordModal();
            };
        }
    },
    Models: typeof GearsApp !== 'undefined' ? GearsApp.Models : (typeof GearsDomain !== 'undefined' ? GearsDomain : {}),
    Patterns: typeof GearsApp !== 'undefined' ? GearsApp.Patterns : {},
    EntityFactory: typeof EntityFactory !== 'undefined' ? EntityFactory : (typeof GearsDomain !== 'undefined' ? GearsDomain.EntityFactory : null)
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.AdminCommon;
}


