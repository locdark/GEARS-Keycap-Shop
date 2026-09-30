# GEARS Keycap Shop - Hệ Thống Quản Lý Cửa Hàng Bán Keycap & Bàn Phím Cơ

**Trường Đại Học Sài Gòn (SGU)**  
**Khoa Công Nghệ Thông Tin**  
**Môn học**: Phân Tích Thiết Kế Hướng Đối Tượng (PTTKHDT) / Đồ Án Chuyên Ngành  
**Đề tài**: Hệ Thống Quản Lý Cửa Hàng Bán Keycap Bàn Phím Cơ (GEARS Keycap Shop)  
**Nhóm thực hiện**: Nhóm 19  

---

## 1. THÔNG TIN THÀNH VIÊN & PHÂN CÔNG NHIỆM VỤ

| STT | Mã Số Sinh Viên | Họ và Tên | Vai Trò & Phân Công Nhiệm Vụ |
|:---:|:---:|:---|:---|
| **1** | **3124410032** | **Nguyễn Công Danh (TV1)** | **Trưởng Nhóm / Backend & System Architect**: Thiết kế kiến trúc hướng đối tượng (OOP), 6 GoF Design Patterns, Module Kho & Nhà cung cấp, Module Thống kê Báo cáo Doanh thu - Doanh số - Lợi nhuận gộp, Tổng hợp đồ án. |
| **2** | **3124410293** | **Trần Nhật Quang (TV2)** | **Frontend Developer / UI-UX Designer**: Thiết kế giao diện Cửa hàng Web Khách hàng (GearVN Signature Red Theme), Mega Dropdown 3 Biến Thể, Điểm Bán Lẻ Tại Quầy POS (Obsidian Dark ERP), Tích hợp Thanh toán SePay VietQR tự động, Gợi ý Địa chỉ Geocoding. |
| **3** | **3122560041** | **Lê Hoài Lộc (TV3)** | **Database / Tester Lead**: Thiết kế & quản trị CSDL, đảm bảo toàn vẹn dữ liệu, lập test case và kiểm thử hệ thống. Sản phẩm bàn giao: Sơ đồ ERD & Script SQL (`database_keycap_shop.sql`), Module Quản lý Sản phẩm Keycap 100 items, CRM Khách hàng & Nhân viên / Phân quyền. |

---

## 2. HƯỚNG DẪN CHẠY DỰ ÁN (DÀNH CHO MỌI NGƯỜI - AI CŨNG CÀI ĐƯỢC)

Dự án được đóng gói để **bất kỳ ai (giảng viên, sinh viên, người không rành kỹ thuật)** đều có thể mở và sử dụng ngay lập tức chỉ với 1 cú nhấp chuột. Bạn có thể chọn 1 trong các cách sau:

---

### Cách 1: [DỄ NHẤT] 1 Click Bằng File `start.bat` (Khuyên Dùng Trên Windows)
> Dành cho người dùng Windows muốn mở nhanh nhất mà không cần gõ bất kỳ dòng lệnh nào.

1. Tải dự án về máy và giải nén thư mục `GEARS-Shop-Main-Project`.
2. Tìm và **nhấp đúp chuột vào tệp `start.bat`**.
3. Hệ thống sẽ tự động nhận diện môi trường và **tự động mở trình duyệt web** vào thẳng trang chủ!

---

### Cách 2: Mở Trực Tiếp Bằng Trình Duyệt Web (Không Cần Cài Đặt Gì Hết)
> Hoạt động trên mọi hệ điều hành (Windows, macOS, Linux) mà không cần cài thêm bất kỳ phần mềm nào.

1. Mở thư mục dự án `GEARS-Shop-Main-Project`.
2. **Nhấp đúp chuột** vào tệp [`index.html`](file:///c:/Users/MY%20PC/Downloads/GEARS-Shop-Main-Project/GEARS-Shop-Main-Project/index.html) để mở giao diện Cửa hàng khách hàng trên trình duyệt mặc định (Chrome, Edge, Cốc Cốc, Safari...).
3. Muốn vào trang Quản trị & Bán hàng POS: Nhấp đúp vào tệp `assets/Admin/login.html`.
4. Muốn xem Sơ đồ Kiến trúc & OOP Canvas: Nhấp đúp vào tệp `so-do-canvas.html`.

---

### Cách 3: Chạy Bằng Tiện Ích Live Server (Dành Cho Ai Dùng VS Code)
1. Mở thư mục dự án bằng phần mềm **Visual Studio Code**.
2. Tìm tệp `index.html` ở thanh danh sách tệp bên trái.
3. Nhấp chuột phải vào `index.html` $\to$ Chọn **"Open with Live Server"** (hoặc bấm nút **"Go Live"** ở góc dưới cùng bên phải màn hình VS Code).

---

### Cách 4: Chạy Bằng Node.js Terminal (Dành Cho Lập Trình Viên)
1. Cài đặt **Node.js** nếu máy chưa có: [https://nodejs.org](https://nodejs.org) (chọn bản LTS).
2. Mở cửa sổ dòng lệnh (**Command Prompt** hoặc **PowerShell**) tại thư mục dự án và chạy lần lượt 2 lệnh:
   ```bash
   npm install
   node server.js
   ```
3. Mở trình duyệt web bất kỳ và truy cập các đường dẫn:
   - **Trang chủ Cửa hàng**: `http://localhost:3333/`
   - **Cổng Đăng Nhập Quản trị & Thu ngân POS**: `http://localhost:3333/assets/Admin/login.html`
   - **Màn hình Bán Hàng Tại Quầy POS**: `http://localhost:3333/assets/Admin/pos.html`
   - **Bảng Điều Khiển Quản Trị**: `http://localhost:3333/assets/Admin/dashboard.html`
   - **Trình Vẽ Sơ Đồ Thiết Kế Canvas**: `http://localhost:3333/so-do-canvas`

---

### Cách 5: Chạy Qua XAMPP / WampServer (Dành Cho Ai Dùng Web Server PHP)
1. Sao chép toàn bộ thư mục `GEARS-Shop-Main-Project` vào thư mục `C:\xampp\htdocs\`.
2. Mở **XAMPP Control Panel** và nhấn **Start** tại mục **Apache**.
3. Mở trình duyệt gõ: `http://localhost/GEARS-Shop-Main-Project/`.

---

### Cách 6 (Tùy Chọn): Nạp Cơ Sở Dữ Liệu MySQL
Dự án đã tích hợp sẵn cơ chế tự động nạp dữ liệu chuẩn trên trình duyệt (`LocalStorage`), nên **không bắt buộc cài đặt CSDL vẫn chạy mượt mà 100%**. Nếu giảng viên yêu cầu nạp CSDL MySQL:
1. Mở **phpMyAdmin** (`http://localhost/phpmyadmin`) hoặc **MySQL Workbench**.
2. Tạo CSDL mới: `gears_keycap_shop`.
3. Nhấn **Import** $\to$ chọn tệp [`database_keycap_shop.sql`](file:///c:/Users/MY%20PC/Downloads/GEARS-Shop-Main-Project/GEARS-Shop-Main-Project/database_keycap_shop.sql) trong thư mục dự án $\to$ bấm **Go**.

---

## 3. DANH SÁCH TÀI KHOẢN ĐĂNG NHẬP MẪU

Hệ thống thiết lập sẵn các tài khoản tương ứng với từng vai trò người dùng trong cửa hàng:

| Phân Hệ / Vai Trò | Tên Đăng Nhập (`Username`) | Mật Khẩu Mặc Định (`Password`) | Quyền Hạn Trong Hệ Thống |
|:---|:---:|:---:|:---|
| **Quản Trị Viên (Admin)** | `admin` | `Admin@123` | Toàn quyền kiểm soát hệ thống: Quản lý sản phẩm, kho & nhà cung cấp, khách hàng, nhân viên & phân quyền, duyệt / sửa đơn hàng, xem báo cáo doanh thu & lợi nhuận. |
| **Nhân Viên Thu Ngân (Cashier)** | `cashier` | `Cashier@123` | Bán hàng tại quầy (POS), tạo đơn hàng mới, tính chiết khấu `%Dic`, thu tiền mặt / quét mã SePay VietQR, in hóa đơn. Không có quyền sửa báo cáo tài chính hoặc xóa nhân viên. |
| **Khách Hàng Thành Viên** | `vanhai` | `VanHai@123` | Đặt hàng trực tuyến, thanh toán SePay VietQR, lưu địa chỉ giao hàng, theo dõi tiến độ đơn hàng và tích lũy điểm thưởng Keycap Coins. |

> **Quy chuẩn bảo mật mật khẩu**: Mật khẩu phải có tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ in hoa và 1 ký tự đặc biệt (Ví dụ: `Admin@123`).

---

## 4. TỔNG QUAN TÍNH NĂNG NỔI BẬT

### A. Cửa Hàng Trực Tuyến (Storefront - GearVN Signature Red UI)
- **Giao diện chuẩn GearVN**: Tông màu đỏ thương hiệu `#e30019`, thanh tìm kiếm thông minh bo tròn rộng rãi, cụm nút điều hướng dạng pill tối màu.
- **Mega Dropdown 3 Biến Thể**:
  - *Biến thể 1 - Thể loại Keycap*: Artisan Thủ Công, Anime / Manga, Pudding LED, Cherry Profile, Phụ Kiện & Mod.
  - *Biến thể 2 - Profile & Chất liệu*: Cherry, OEM, XDA/MOA, Nhựa PBT Dyesub 5 mặt nhiệt, PBT Doubleshot xuyên sáng, Resin 3D, Nhôm CNC.
  - *Biến thể 3 - Chủ đề & Studio*: Dwarf Factory, Jelly Key, HolyOOPS, One Piece, Pokemon, Cá Koi, Galaxy kèm Banner khuyến mãi mini.
- **Khối Hero 3 Cột Hiện Đại**: Cột trái danh mục sản phẩm (kèm Mega Flyout khi hover), banner trung tâm ưu đãi độc quyền, cột phải banner tiện ích nổi bật.
- **Thanh Subnav Tiện Ích**: Điều hướng danh mục nhanh, tra cứu bảo hành chính hãng, loại bỏ hoàn toàn lỗi tràn viền hoặc cắt chữ.
- **Giỏ Hàng & Đặt Hàng Trực Tuyến**:
  - Hỗ trợ khách vãng lai và thành viên.
  - Tự động gợi ý địa chỉ giao hàng thông minh (Address Autocomplete Geocoding).
  - Thanh toán tự động SePay VietQR với mã QR động và giả lập Webhook khớp lệnh tức thì.
  - Tra cứu lịch sử đơn hàng của tôi kèm bảng chi tiết và timeline trạng thái.

### B. Điểm Bán Lẻ Tại Quầy (POS Terminal - Obsidian Dark Theme)
- Giao diện tối chuyên dụng cho quầy thu ngân (Obsidian Dark ERP).
- Bàn phím số Numpad cảm ứng nhanh, phím chức năng đổi số lượng `Qty`, chiết khấu phần trăm `%Dic`, xóa món.
- Hỗ trợ chọn khách hàng thành viên hoặc khách vãng lai.
- Thanh toán đa phương thức: Tiền mặt, SePay VietQR quét mã tự động, Thẻ ngân hàng.
- Xuất và in hóa đơn bán lẻ chuyên nghiệp.

### C. Bảng Điều Khiển Quản Trị (Admin Dashboard)
- **Quản lý Sản phẩm**: Kho dữ liệu 100 sản phẩm Keycap chuẩn hóa, thêm/sửa/xóa sản phẩm, cập nhật giá nhập, giá bán, tồn kho và hình ảnh.
- **Quản lý Đơn hàng Toàn diện**:
  - Xem danh sách và lọc theo trạng thái: *Chờ xử lý, Đang đóng gói, Đang giao hàng, Hoàn tất, Đã hủy*.
  - **Bộ biên tập đơn hàng chuyên sâu**: Chỉnh sửa thông tin người nhận, địa chỉ, trạng thái, ghi chú, chiết khấu và bảng sản phẩm (tăng/giảm số lượng, xóa món, thêm sản phẩm từ kho với tính toán tự động Tổng tiền, Giá vốn, Lợi nhuận).
  - Ràng buộc khóa đơn hàng nghiêm ngặt khi trạng thái đã `Hoàn tất` hoặc `Đã hủy`.
- **Quản lý Kho & Nhà Cung Cấp**: Theo dõi số lượng tồn kho theo thời gian thực, quản lý nhà cung cấp phôi PBT, Resin và phụ kiện mod phím.
- **Báo cáo Thống kê Tài chính**:
  - Tổng doanh thu bán hàng thực tế.
  - Tổng số lượng đơn hàng và số keycap xuất kho.
  - Lợi nhuận gộp thực tế = Doanh thu bán ra - Tổng giá vốn nhập kho.
  - Biểu đồ thống kê doanh thu theo ngày và tỷ lệ cơ cấu thể loại keycap.
  - Xuất báo cáo dữ liệu định dạng Excel (.xlsx) / CSV.
- **Quản lý Khách Hàng (CRM) & Nhân Viên**: Phân quyền Admin / Cashier, bảo mật tài khoản, đổi mật khẩu.

### D. Trình Vẽ & Khảo Sát Kiến Trúc Canvas (UML & OOP Live Inspector)
- Tích hợp tại tệp `so-do-canvas.html` (hoặc `/so-do-canvas`).
- Trực quan hóa vector trên thẻ `<canvas>`: Sơ đồ phân rã chức năng (BFD), Use Case tổng quát, Sơ đồ lớp (Class Diagram), Sơ đồ tuần tự (Sequence Diagram SePay), và Sơ đồ 6 GoF Design Patterns.
- Chế độ **Live OOP Inspector**: Chạy thử nghiệm trực tiếp các Pattern hướng đối tượng (*Factory, Strategy, Observer, Facade, Singleton, Composite*) ngay trên giao diện.

---

## 5. CẤU TRÚC THƯ MỤC DỰ ÁN

```text
GEARS-Shop-Main-Project/
├── index.html                      # Trang chủ Web Storefront bán lẻ (GearVN UI)
├── so-do-canvas.html               # Trình vẽ sơ đồ kiến trúc & mẫu thiết kế OOP trên Canvas
├── server.js                       # Node.js Express/HTTP dev server (Port 3333)
├── package.json                    # Cấu hình dự án & thư viện hỗ trợ
├── database_keycap_shop.sql        # Script CSDL MySQL hoàn chỉnh
├── .gitignore                      # Cấu hình loại bỏ file rác, logs, file tạm khi đẩy Git
├── README.md                       # Tài liệu tổng quan & hướng dẫn chạy dự án
├── BANG-PHAN-CONG-CHI-TIET.md      # Bảng phân công nhiệm vụ & tiến độ đồ án
├── KIEM-THU-HE-THONG-TEST-CASES.md # Danh mục kịch bản kiểm thử hệ thống
├── assets/
│   ├── css/
│   │   ├── gearvn-theme.css        # Hệ thống Design System GearVN Signature Red & Mega Dropdown
│   │   └── Cart.css                # CSS giỏ hàng & modal thông tin
│   ├── scripts/
│   │   ├── storefront.js           # Controller chính của trang mua sắm khách hàng
│   │   ├── keycap-dataset-100.js   # Bộ dữ liệu 100 sản phẩm Keycap chuẩn hóa
│   │   ├── LocalStorage.js         # Tầng lưu trữ dữ liệu client
│   │   ├── address-autocomplete.js # Module gợi ý địa chỉ giao hàng Geocoding
│   │   ├── models-oop.js           # Định nghĩa các lớp thực thể OOP
│   │   └── modules/                # 11 Module dịch vụ hướng đối tượng (GoF Patterns)
│   │       ├── GearsApp.js         # Master Facade Pattern
│   │       ├── StorageService.js   # Singleton & Observer Pattern
│   │       ├── ProductService.js   # Quản lý nghiệp vụ sản phẩm
│   │       ├── OrderService.js     # Quản lý nghiệp vụ đơn hàng & thanh toán
│   │       ├── CustomerService.js  # Quản lý hồ sơ khách hàng & CRM
│   │       ├── EmployeeService.js  # Quản lý nhân viên & phân quyền
│   │       └── ...
│   └── Admin/
│       ├── login.html              # Màn hình đăng nhập hệ thống (Admin & POS)
│       ├── dashboard.html          # Bảng điều khiển quản trị tổng quan
│       ├── pos.html                # Màn hình bán hàng tại quầy (POS Terminal)
│       ├── products.html           # Phân hệ quản lý sản phẩm
│       ├── orders.html             # Phân hệ quản lý & chỉnh sửa đơn hàng
│       ├── customers.html          # Phân hệ quản lý khách hàng
│       ├── employees.html          # Phân hệ quản lý nhân viên & phân quyền
│       ├── suppliers.html          # Phân hệ quản lý nhà cung cấp
│       ├── reports.html            # Phân hệ báo cáo thống kê & tài chính
│       ├── database.html           # Trình thanh tra CSDL & khôi phục dữ liệu
│       ├── css/
│       │   └── admin-obsidian.css  # Giao diện Obsidian Dark ERP chuyên nghiệp
│       └── script/
│           ├── admin-common.js     # Hàm dùng chung, xác thực & toast notification
│           ├── orders.js           # Controller quản lý & bộ biên tập đơn hàng
│           ├── pos.js              # Controller bán hàng tại quầy
│           └── ...
```

---

## 6. THÔNG TIN BẢN QUYỀN & LIÊN HỆ

- **Đồ án môn học**: Phân Tích Thiết Kế Hướng Đối Tượng (PTTKHDT) - Khoa CNTT Trường Đại Học Sài Gòn (SGU).
- **Nhóm sinh viên thực hiện**:
  - Nguyễn Công Danh (`3124410032`)
  - Trần Nhật Quang (`3124410293`)
  - Lê Hoài Lộc (`3122560041`)
- **Bản quyền**: © 2026 GEARS Shop. Toàn bộ mã nguồn phục vụ mục đích nghiên cứu và bảo vệ đồ án môn học.
