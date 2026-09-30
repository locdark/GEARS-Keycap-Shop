const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const ROOT_DIR = __dirname;
const ENV_FILE = path.join(ROOT_DIR, '.env');
const SQL_FILE = path.join(ROOT_DIR, 'database_keycap_shop.sql');

// -----------------------------------------------------------------------------
// 1. DOC VA GHI FILE .ENV (NAVICAT STYLE CONFIG MANAGER)
// -----------------------------------------------------------------------------
function readEnvConfig() {
    const config = {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'gears_keycap_shop',
        serverPort: 3333
    };

    if (fs.existsSync(ENV_FILE)) {
        try {
            const content = fs.readFileSync(ENV_FILE, 'utf8');
            content.split('\n').forEach(line => {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith('#')) return;
                const idx = trimmed.indexOf('=');
                if (idx !== -1) {
                    const key = trimmed.slice(0, idx).trim();
                    const val = trimmed.slice(idx + 1).trim();
                    if (key === 'DB_HOST') config.host = val;
                    if (key === 'DB_PORT') config.port = parseInt(val, 10) || 3306;
                    if (key === 'DB_USER') config.user = val;
                    if (key === 'DB_PASSWORD') config.password = val;
                    if (key === 'DB_NAME') config.database = val;
                    if (key === 'SERVER_PORT') config.serverPort = parseInt(val, 10) || 3333;
                }
            });
        } catch (e) {
            console.warn('[Env] Canh bao doc file .env:', e.message);
        }
    }
    return config;
}

function writeEnvConfig(cfg) {
    const content = `# GEARS Keycap Shop - Cau hinh ket noi Co So Du Lieu (MySQL / XAMPP)
# Quan ly ket noi chuan Navicat & Do an PTTKHDT SGU
DB_HOST=${cfg.host || '127.0.0.1'}
DB_PORT=${cfg.port || 3306}
DB_USER=${cfg.user || 'root'}
DB_PASSWORD=${cfg.password || ''}
DB_NAME=${cfg.database || 'gears_keycap_shop'}
SERVER_PORT=${cfg.serverPort || 3333}
`;
    fs.writeFileSync(ENV_FILE, content, 'utf8');
    console.log('[Env] Da ghi cau hinh moi vao file .env thanh cong!');
}

let currentConfig = readEnvConfig();
let pool = null;
let isDbConnected = false;
let dbVersion = '';

async function initDbPool(cfg = currentConfig) {
    if (pool) {
        try { await pool.end(); } catch (e) {}
    }
    try {
        pool = mysql.createPool({
            host: cfg.host,
            port: cfg.port,
            user: cfg.user,
            password: cfg.password,
            database: cfg.database,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            multipleStatements: true
        });

        const [rows] = await pool.query('SELECT VERSION() as version');
        isDbConnected = true;
        dbVersion = rows[0]?.version || 'Unknown';
        console.log(`[XAMPP MySQL] Ket noi thanh cong toi database ${cfg.database} tren cong ${cfg.port}! (Version: ${dbVersion})`);
        return { success: true, version: dbVersion };
    } catch (err) {
        isDbConnected = false;
        console.warn('[XAMPP MySQL] Canh bao ket noi MySQL:', err.message);
        return { success: false, error: err.message };
    }
}

// Khoi tao pool lan dau
initDbPool();

// -----------------------------------------------------------------------------
// 2. MIME TYPES & UTILS
// -----------------------------------------------------------------------------
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.sql': 'text/plain; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8',
    '.env': 'text/plain; charset=utf-8'
};

function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end(JSON.stringify(data));
}

function parseJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (err) {
                reject(err);
            }
        });
        req.on('error', reject);
    });
}

// -----------------------------------------------------------------------------
// 3. HTTP SERVER & API ROUTING
// -----------------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://localhost:${currentConfig.serverPort}`);
    const pathname = decodeURIComponent(parsedUrl.pathname);

    // =========================================================================
    // API ROUTES (XAMPP MYSQL & NAVICAT CONNECTION MANAGER)
    // =========================================================================
    if (pathname.startsWith('/api/')) {
        try {
            // A. LAY CAU HINH HIEN TAI (TU .ENV HOAC MEMORY)
            if (pathname === '/api/db/config' && req.method === 'GET') {
                const cfg = readEnvConfig();
                return sendJson(res, 200, {
                    host: cfg.host,
                    port: cfg.port,
                    user: cfg.user,
                    database: cfg.database,
                    serverPort: cfg.serverPort,
                    connected: isDbConnected,
                    version: dbVersion
                });
            }

            // B. NAVICAT TEST CONNECTION (KIEM TRA KET NOI TRUOC KHI LUU)
            if (pathname === '/api/db/test-connection' && req.method === 'POST') {
                const body = await parseJsonBody(req);
                const testHost = body.host || '127.0.0.1';
                const testPort = parseInt(body.port, 10) || 3306;
                const testUser = body.user || 'root';
                const testPass = body.password !== undefined ? body.password : '';
                const testDb = body.database || 'gears_keycap_shop';

                let tempConn = null;
                try {
                    // Buoc 1: Ket noi toi MySQL Server (chua can DB)
                    tempConn = await mysql.createConnection({
                        host: testHost,
                        port: testPort,
                        user: testUser,
                        password: testPass,
                        connectTimeout: 4000
                    });

                    const [vRows] = await tempConn.query('SELECT VERSION() as version');
                    const serverVer = vRows[0]?.version || 'Unknown';

                    // Buoc 2: Kiem tra database co ton tai khong
                    const [dbRows] = await tempConn.query('SHOW DATABASES LIKE ?', [testDb]);
                    const dbExists = dbRows.length > 0;
                    let tablesCount = 0;

                    if (dbExists) {
                        const [tRows] = await tempConn.query(
                            'SELECT count(*) as count FROM information_schema.tables WHERE table_schema = ?',
                            [testDb]
                        );
                        tablesCount = tRows[0]?.count || 0;
                    }

                    await tempConn.end();

                    return sendJson(res, 200, {
                        success: true,
                        host: testHost,
                        port: testPort,
                        user: testUser,
                        database: testDb,
                        version: serverVer,
                        dbExists,
                        tablesCount,
                        message: `Connection Successful! (Ket noi MySQL thanh cong! Phien ban: ${serverVer})`
                    });
                } catch (connErr) {
                    if (tempConn) { try { await tempConn.end(); } catch (e) {} }
                    return sendJson(res, 200, {
                        success: false,
                        error: connErr.message,
                        code: connErr.code || 'ERR_CONNECTION',
                        message: `Connection Failed! (Ket noi that bai: ${connErr.message})`
                    });
                }
            }

            // C. NAVICAT SAVE CONFIG & CONNECT (LUU VAO .ENV VA KET NOI)
            if (pathname === '/api/db/save-config' && req.method === 'POST') {
                const body = await parseJsonBody(req);
                const newCfg = {
                    host: body.host || '127.0.0.1',
                    port: parseInt(body.port, 10) || 3306,
                    user: body.user || 'root',
                    password: body.password !== undefined ? body.password : '',
                    database: body.database || 'gears_keycap_shop',
                    serverPort: currentConfig.serverPort || 3333
                };

                // Kiem tra ket noi truoc khi cho luu
                let tempConn = null;
                try {
                    tempConn = await mysql.createConnection({
                        host: newCfg.host,
                        port: newCfg.port,
                        user: newCfg.user,
                        password: newCfg.password,
                        connectTimeout: 4000
                    });

                    // Tu dong tao CSDL neu chua co
                    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${newCfg.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
                    await tempConn.end();
                } catch (chkErr) {
                    if (tempConn) { try { await tempConn.end(); } catch (e) {} }
                    return sendJson(res, 400, {
                        success: false,
                        error: chkErr.message,
                        message: `Khong the ket noi de luu cau hinh: ${chkErr.message}`
                    });
                }

                // Luu vao file .env
                writeEnvConfig(newCfg);
                currentConfig = newCfg;

                // Khoi tao lai Pool ket noi
                const poolRes = await initDbPool(newCfg);

                // Kiem tra so luong bang, neu trong -> tu dong import database_keycap_shop.sql
                let autoImported = false;
                try {
                    const [tRows] = await pool.query('SELECT count(*) as count FROM information_schema.tables WHERE table_schema = ?', [newCfg.database]);
                    if (tRows[0]?.count === 0 && fs.existsSync(SQL_FILE)) {
                        const sqlContent = fs.readFileSync(SQL_FILE, 'utf8');
                        await pool.query(sqlContent);
                        autoImported = true;
                        console.log('[XAMPP MySQL] Tu dong nạp 8 bang du lieu database_keycap_shop.sql vao CSDL moi!');
                    }
                } catch (impErr) {
                    console.warn('[XAMPP MySQL] Canh bao import CSDL tu dong:', impErr.message);
                }

                return sendJson(res, 200, {
                    success: true,
                    config: {
                        host: newCfg.host,
                        port: newCfg.port,
                        user: newCfg.user,
                        database: newCfg.database
                    },
                    autoImported,
                    version: poolRes.version,
                    message: 'Da luu cau hinh vao file .env va ket noi CSDL MySQL thanh cong!'
                });
            }

            // D. IMPORT SCRIPT DATABASE_KEYCAP_SHOP.SQL VAO CSDL DANG KET NOI
            if (pathname === '/api/db/import-sql' && req.method === 'POST') {
                if (!pool || !isDbConnected) {
                    return sendJson(res, 500, { success: false, message: 'Chua co ket noi CSDL hoat dong' });
                }
                if (!fs.existsSync(SQL_FILE)) {
                    return sendJson(res, 404, { success: false, message: 'Khong tim thay file database_keycap_shop.sql' });
                }
                const sqlContent = fs.readFileSync(SQL_FILE, 'utf8');
                await pool.query(sqlContent);
                return sendJson(res, 200, { success: true, message: 'Da nap toan bo 8 bang va du lieu tu database_keycap_shop.sql vao MySQL thanh cong!' });
            }

            // E. TRANG THAI KET NOI DATABASE HIEN TAI
            if (pathname === '/api/db/status' && req.method === 'GET') {
                if (!pool) {
                    return sendJson(res, 200, { connected: false, message: 'Pool chua duoc khoi tao' });
                }
                try {
                    const [resProd] = await pool.query('SELECT count(*) as count FROM SanPham');
                    const [resOrder] = await pool.query('SELECT count(*) as count FROM DonHang');
                    const [resCust] = await pool.query('SELECT count(*) as count FROM KhachHang');
                    const [resEmp] = await pool.query('SELECT count(*) as count FROM NhanVien');
                    const [resSupp] = await pool.query('SELECT count(*) as count FROM NhaCungCap');
                    return sendJson(res, 200, {
                        connected: true,
                        host: currentConfig.host,
                        port: currentConfig.port,
                        user: currentConfig.user,
                        database: currentConfig.database,
                        version: dbVersion,
                        counts: {
                            products: resProd[0].count,
                            orders: resOrder[0].count,
                            customers: resCust[0].count,
                            employees: resEmp[0].count,
                            suppliers: resSupp[0].count
                        },
                        timestamp: new Date().toISOString()
                    });
                } catch (dbErr) {
                    return sendJson(res, 200, {
                        connected: false,
                        error: dbErr.message,
                        host: currentConfig.host,
                        port: currentConfig.port,
                        database: currentConfig.database
                    });
                }
            }

            // E2. API XEM CHI TIET DU LIEU BANG TRONG CSDL (CHO NGUOI DUNG XEM DB)
            if (pathname === '/api/db/table-data' && req.method === 'GET') {
                const table = parsedUrl.searchParams.get('table');
                const allowedTables = ['SanPham', 'DonHang', 'ChiTietDonHang', 'KhachHang', 'NhanVien', 'NhaCungCap', 'DangNhap'];
                if (!allowedTables.includes(table)) {
                    return sendJson(res, 400, { success: false, message: 'Bảng không hợp lệ hoặc không có quyền truy cập: ' + table });
                }
                if (!pool) {
                    return sendJson(res, 200, { success: false, connected: false, message: 'MySQL chưa kết nối, sử dụng dữ liệu bộ nhớ đệm Frontend' });
                }
                try {
                    const [rows] = await pool.query(`SELECT * FROM \`${table}\` LIMIT 300`);
                    return sendJson(res, 200, {
                        success: true,
                        connected: true,
                        table,
                        total: rows.length,
                        rows,
                        timestamp: new Date().toISOString()
                    });
                } catch (err) {
                    return sendJson(res, 500, { success: false, connected: false, error: err.message });
                }
            }

            // F. API SAN PHAM
            if (pathname === '/api/products' && req.method === 'GET') {
                const [rows] = await pool.query('SELECT * FROM SanPham ORDER BY ID_SP ASC');
                const products = rows.map(r => ({
                    id: r.ID_SP,
                    supplierId: r.ID_NCC,
                    name: r.Ten_SP,
                    type: r.Type,
                    costPrice: parseFloat(r.GiaNhap) || 0,
                    price: parseFloat(r.Gia) || 0,
                    stock: r.Stock || 0,
                    img: r.Img,
                    desc: r.MoTa
                }));
                return sendJson(res, 200, { success: true, data: products });
            }

            if (pathname === '/api/products' && req.method === 'POST') {
                const body = await parseJsonBody(req);
                const [result] = await pool.query(
                    'INSERT INTO SanPham (ID_NCC, Ten_SP, Type, GiaNhap, Gia, Stock, Img, MoTa) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [body.supplierId || 'NCC01', body.name, body.type || 'Other', body.costPrice || 0, body.price || 0, body.stock || 0, body.img || '', body.desc || '']
                );
                return sendJson(res, 201, { success: true, insertId: result.insertId, message: 'Them san pham vao MySQL thanh cong' });
            }

            // G. API DON HANG
            if (pathname === '/api/orders' && req.method === 'GET') {
                const [orders] = await pool.query('SELECT * FROM DonHang ORDER BY Date DESC');
                const [details] = await pool.query('SELECT * FROM ChiTietDonHang');
                
                const fullOrders = orders.map(o => {
                    const items = details.filter(d => d.ID_DH === o.ID_DH).map(d => ({
                        productId: d.ID_SP,
                        quantity: d.SoLuong,
                        costPrice: parseFloat(d.GiaNhap) || 0,
                        price: parseFloat(d.Gia) || 0,
                        totalPrice: parseFloat(d.ThanhTien) || 0
                    }));
                    return {
                        id: o.ID_DH,
                        customerId: o.ID_KH,
                        employeeId: o.ID_NV,
                        date: o.Date,
                        totalItemsAmount: parseFloat(o.TongTienHang) || 0,
                        discountPercent: parseFloat(o.ChietKhau) || 0,
                        totalAmount: parseFloat(o.ThanhTien) || 0,
                        totalCost: parseFloat(o.GiaVonTong) || 0,
                        profit: parseFloat(o.LoiNhuan) || 0,
                        paymentMethod: o.PhuongThucTT,
                        channel: o.KenhBan,
                        status: o.TrangThai,
                        note: o.Ghichu,
                        items
                    };
                });
                return sendJson(res, 200, { success: true, data: fullOrders });
            }

            if (pathname === '/api/orders' && req.method === 'POST') {
                const body = await parseJsonBody(req);
                const orderId = body.id || `DH-${Date.now().toString().slice(-6)}`;
                await pool.query(
                    'INSERT INTO DonHang (ID_DH, ID_KH, ID_NV, Date, TongTienHang, ChietKhau, ThanhTien, GiaVonTong, LoiNhuan, PhuongThucTT, KenhBan, TrangThai, Ghichu) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [orderId, body.customerId || null, body.employeeId || null, body.totalItemsAmount || body.totalAmount, body.discountPercent || 0, body.totalAmount, body.totalCost || 0, body.profit || 0, body.paymentMethod || 'COD', body.channel || 'Online', body.status || 'moi', body.note || '']
                );

                if (Array.isArray(body.items)) {
                    for (const item of body.items) {
                        await pool.query(
                            'INSERT INTO ChiTietDonHang (ID_DH, ID_SP, SoLuong, GiaNhap, Gia, ThanhTien) VALUES (?, ?, ?, ?, ?, ?)',
                            [orderId, item.id || item.productId, item.quantity || 1, item.costPrice || 0, item.price || 0, (item.price || 0) * (item.quantity || 1)]
                        );
                    }
                }
                return sendJson(res, 201, { success: true, orderId, message: 'Luu don hang vao MySQL thanh cong' });
            }

            // H. API NHA CUNG CAP
            if (pathname === '/api/suppliers' && req.method === 'GET') {
                const [rows] = await pool.query('SELECT * FROM NhaCungCap ORDER BY ID_NCC ASC');
                return sendJson(res, 200, { success: true, data: rows });
            }

            // I. API KHACH HANG
            if (pathname === '/api/customers' && req.method === 'GET') {
                const [rows] = await pool.query('SELECT * FROM KhachHang ORDER BY ID_KH ASC');
                return sendJson(res, 200, { success: true, data: rows });
            }

            // J. API NHAN VIEN
            if (pathname === '/api/employees' && req.method === 'GET') {
                const [rows] = await pool.query('SELECT * FROM NhanVien ORDER BY ID_NV ASC');
                return sendJson(res, 200, { success: true, data: rows });
            }

            // K. API DANG NHAP & DOI MAT KHAU
            if (pathname === '/api/auth/login' && req.method === 'POST') {
                const body = await parseJsonBody(req);
                const [users] = await pool.query(
                    'SELECT d.*, n.Ten_NV, n.ChucVu FROM DangNhap d JOIN NhanVien n ON d.ID_NV = n.ID_NV WHERE d.Username = ? AND d.Password = ? AND d.TrangThai = "active"',
                    [body.username, body.password]
                );
                if (users.length > 0) {
                    const u = users[0];
                    return sendJson(res, 200, {
                        success: true,
                        user: {
                            id: u.ID_TK,
                            employeeId: u.ID_NV,
                            name: u.Ten_NV,
                            username: u.Username,
                            role: u.Role,
                            roleName: u.ChucVu
                        }
                    });
                } else {
                    return sendJson(res, 401, { success: false, message: 'Sai ten dang nhap hoac mat khau!' });
                }
            }

            if (pathname === '/api/auth/change-password' && req.method === 'POST') {
                const body = await parseJsonBody(req);
                const [result] = await pool.query(
                    'UPDATE DangNhap SET Password = ? WHERE Username = ?',
                    [body.newPassword, body.username]
                );
                if (result.affectedRows > 0) {
                    return sendJson(res, 200, { success: true, message: 'Doi mat khau trong MySQL thanh cong' });
                } else {
                    return sendJson(res, 404, { success: false, message: 'Khong tim thay tai khoan de cap nhat' });
                }
            }

            return sendJson(res, 404, { error: 'API endpoint not found' });
        } catch (apiErr) {
            console.error('[API Error]', apiErr);
            return sendJson(res, 500, { error: apiErr.message });
        }
    }

    // =========================================================================
    // STATIC FILE SERVING
    // =========================================================================
    let safePath = pathname;
    if (safePath === '/' || safePath === '') safePath = '/index.html';
    safePath = safePath.split('?')[0];

    let filePath = path.join(ROOT_DIR, safePath);

    // Auto-append .html cho URL khong co extension (clean URLs)
    // Vi du: /assets/Admin/pos -> /assets/Admin/pos.html
    let fileExists = false;
    try {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }
        fileExists = true;
    } catch (e) {
        fileExists = false;
    }

    // Neu file khong ton tai va URL khong co extension, thu them .html
    if (!fileExists) {
        const ext = path.extname(safePath).toLowerCase();
        if (!ext) {
            const htmlPath = filePath + '.html';
            try {
                fs.statSync(htmlPath);
                filePath = htmlPath;
                fileExists = true;
            } catch (e2) {
                // Van khong tim thay, tra 404
            }
        }
    }

    if (!fileExists) {
        try {
            fs.statSync(filePath);
            fileExists = true;
        } catch (e) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found: ' + safePath);
            return;
        }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('500 Server Error: ' + err.message);
        } else {
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache'
            });
            res.end(content);
        }
    });
});

server.listen(currentConfig.serverPort, '0.0.0.0', () => {
    console.log(`[GEARS Web Server] He thong dang hoat dong tai: http://localhost:${currentConfig.serverPort}`);
    console.log(`[XAMPP MySQL] Ket noi CSDL: ${currentConfig.database} (127.0.0.1:${currentConfig.port})`);
});
