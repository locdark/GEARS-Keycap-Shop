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

## 2. HƯỚNG DẪN KHỞI CHẠY PHẦN MỀM (DÀNH CHO GIẢNG VIÊN & SINH VIÊN)

Dự án cung cấp **Hệ thống Phần Mềm Java Desktop Chuẩn Đồ Án PTTKHDT Kiến Trúc 3 Lớp** hỗ trợ chạy độc lập từng phân hệ hoặc **Khởi Động Đồng Thời Cả 3 Phần Mềm (Admin + Thu Ngân + Khách Hàng)** để kiểm thử tương tác Real-time đa tác nhân qua Observer Pattern!

---

### Cách 1: [ĐẶC BIỆT - KHUYÊN DÙNG CHẤM ĐIỂM] Khởi Động Đồng Thời 3 Phần Mềm Bằng `Chay-Cung-Luc-3-Phan-Mem.bat`
> Tự động khởi chạy và sắp xếp đồng thời cả 3 cửa sổ trên màn hình để chấm điểm tương tác Real-time:
> 1. **Cửa Sổ Trái**: [QUẢN TRỊ VIÊN ADMIN] - Giám sát Dashboard biểu đồ Java2D, Kho 100 Keycaps, Quản lý đơn, CRM, Báo cáo & CSDL.
> 2. **Cửa Sổ Phải-Trên**: [THU NGÂN CASHIER POS] - Điểm bán lẻ POS tại quầy, giỏ hàng, in hóa đơn.
> 3. **Cửa Sổ Phải-Dưới**: [CỔNG MUA SẮM KHÁCH HÀNG] - Duyệt catalog 100 keycaps, giỏ hàng trực tuyến, tích lũy xu, thanh toán VietQR / COD.
> 
> *Khi Khách Hàng hoặc Thu Ngân đặt hàng, hệ thống Observer Pattern lập tức kích hoạt cập nhật doanh thu và đơn hàng lên màn hình Quản Trị Viên không có độ trễ!*

1. Nhấp đúp chuột vào tệp **`Chay-Cung-Luc-3-Phan-Mem.bat`** (hoặc gõ `java -cp GEARS-Keycap-Shop.jar com.gears.Main all`).
2. Màn hình 3 phân hệ sẽ tự động mở và xếp song song trên desktop!

---

### Cách 2: Khởi Chạy Từng Phân Hệ Riêng Biệt
- **Quản Trị Viên (Admin)**: Nhấp đúp **`Chay-Admin.bat`** (`admin` / `Admin@123`).
- **Thu Ngân (Cashier POS)**: Nhấp đúp **`Chay-Thu-Ngan-POS.bat`** (`cashier` / `Cashier@123`).
- **Khách Hàng (Customer Portal)**: Nhấp đúp **`Chay-Khach-Hang.bat`** (Mặc định: Nguyễn Văn Hải - KH02).
- **Hộp Thoại Khởi Chạy (Launcher Menu)**: Nhấp đúp **`Chay-Phan-Mem-Java.bat`**.

---

### Cách 3: Chạy Bằng Menu Tổng Hợp `start.bat`
Nhấp đúp chuột vào tệp **`start.bat`** và chọn:
- Phím `1`: Khởi động cùng lúc cả 3 phần mềm (Admin + Thu Ngân + Khách Hàng).
- Phím `2`: Mở phần mềm Quản Trị Viên (Admin).
- Phím `3`: Mở phần mềm Thu Ngân POS.
- Phím `4`: Mở cổng mua sắm Khách Hàng.
- Phím `5`: Chạy toàn bộ 48 Test Cases tự động kiểm thử hệ thống.
- Phím `6`: Biên dịch lại toàn bộ mã nguồn Java `src/` và đóng gói JAR mới.
- Phím `7`: Mở bản Web Storefront tham khảo.

---

### Cách 4: Chạy Kiểm Thử 48 Test Cases Tự Động Bằng `Chay-Kiem-Thu-TestCases.bat`
- Nhấp đúp vào **`Chay-Kiem-Thu-TestCases.bat`** để chạy bộ kiểm thử tự động `GearsFullTestSuite` đạt chuẩn 48/48 (100.0%)!

---

### Cách 5: Biên Dịch Lại Mã Nguồn Java Bằng `Bien-Dich-Java.bat`
- Nhấp đúp vào **`Bien-Dich-Java.bat`** để biên dịch lại toàn bộ các class Java bằng `javac` và đóng gói tệp `GEARS-Keycap-Shop.jar` chuẩn hóa.

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

## 5. CẤU TRÚC KIẾN TRÚC 3 LỚP JAVA DESKTOP (CHUẨN ĐỒ ÁN PTTKHDT SGU)

Dự án được phân tách chặt chẽ theo mô hình **3 Lớp (3-Tier Architecture)** kết hợp các mẫu thiết kế chuẩn **GoF Design Patterns**:

```text
GEARS-Keycap-Shop/
├── Chay-Phan-Mem-Java.bat          # 1-Click khởi chạy Phần Mềm Java Swing Desktop
├── Bien-Dich-Java.bat              # 1-Click tự động biên dịch javac và build JAR
├── start.bat                       # Menu chọn khởi chạy (Java App / Web Storefront)
├── GEARS-Keycap-Shop.jar           # Tệp thực thi độc lập (Runnable JAR)
├── data/                           # CSDL lưu trữ bền vững (CSDL nạp sẵn 100 keycaps)
├── database_keycap_shop.sql        # Script CSDL MySQL gốc
│
├── src/com/gears/                  # MÃ NGUỒN PHẦN MỀM JAVA 3 LỚP (OOP)
│   ├── Main.java                   # Điểm khởi chạy ứng dụng (Application Entry Point)
│   │
│   ├── model/                      # TẦNG THỰC THỂ (ENTITY / DTO LAYER)
│   │   ├── BaseEntity.java         # Lớp cơ sở trừu tượng (ID, Timestamps)
│   │   ├── NguoiDung.java          # Lớp trừu tượng User (Đa hình getVaiTro)
│   │   ├── KhachHang.java          # Thực thể Khách hàng (CRM, Keycap Coins)
│   │   ├── NhanVien.java           # Thực thể Nhân viên (Phân quyền Admin/POS)
│   │   ├── SanPhamKeycap.java      # Thực thể Sản phẩm (Tính giá vốn, lãi gộp)
│   │   ├── ChiTietDonHang.java     # Chi tiết mặt hàng trong đơn
│   │   ├── DonHang.java            # Thực thể Đơn hàng (Khóa trạng thái Done/Hủy)
│   │   ├── NhaCungCap.java         # Thực thể Nhà cung cấp đối tác
│   │   ├── BaoCao.java             # Thực thể Báo cáo tài chính
│   │   └── ShopConfig.java         # Thực thể Cấu hình thương hiệu & VietQR
│   │
│   ├── dao/                        # TẦNG TRUY XUẤT DỮ LIỆU (DATA ACCESS OBJECT LAYER)
│   │   ├── IGenericDAO.java        # Interface Generic DAO chuẩn CRUD
│   │   ├── SanPhamDAO.java         # DAO truy xuất kho 100 sản phẩm
│   │   ├── DonHangDAO.java         # DAO quản lý đơn hàng
│   │   ├── KhachHangDAO.java       # DAO quản lý khách hàng
│   │   ├── NhanVienDAO.java        # DAO quản lý nhân sự
│   │   ├── NhaCungCapDAO.java      # DAO quản lý nhà cung cấp
│   │   └── BaoCaoDAO.java          # DAO kết xuất báo cáo
│   │
│   ├── service/                    # TẦNG NGHIỆP VỤ (BUSINESS LOGIC / BUS LAYER)
│   │   ├── AuthService.java        # Nghiệp vụ đăng nhập, mật khẩu an toàn
│   │   ├── SanPhamService.java     # Nghiệp vụ kiểm tra tồn kho, nhập/xuất kho
│   │   ├── DonHangService.java     # State Machine khóa đơn Done & hoàn kho khi hủy
│   │   ├── KhachHangService.java   # Nghiệp vụ tích lũy điểm thưởng & thăng hạng
│   │   ├── NhanVienService.java    # Nghiệp vụ phân quyền Quản trị / Thu ngân
│   │   ├── NhaCungCapService.java  # Ràng buộc toàn vẹn khóa ngoại khi xóa NCC
│   │   └── BaoCaoService.java      # Tính toán doanh thu, giá vốn, lãi gộp & xuất CSV
│   │
│   ├── patterns/                   # 6 MẪU THIẾT KẾ HƯỚNG ĐỐI TƯỢNG (GoF PATTERNS)
│   │   ├── singleton/
│   │   │   ├── DatabaseContext.java# Singleton quản lý CSDL & Seed Data
│   │   │   └── SessionManager.java # Singleton phiên làm việc người dùng
│   │   ├── factory/
│   │   │   ├── SanPhamFactory.java # Factory sản xuất đối tượng theo thể loại
│   │   │   └── EntityFactory.java  # Factory tạo DonHang, User, NhaCungCap
│   │   ├── strategy/
│   │   │   ├── ChienLuocThanhToan.java # Strategy Interface đa hình thanh toán
│   │   │   ├── ThanhToanTienMat.java   # Strategy thanh toán tiền mặt & tiền thối
│   │   │   ├── ThanhToanVietQR.java    # Strategy sinh mã VietQR Napas 24/7
│   │   │   ├── ThanhToanTheNganHang.java # Strategy quẹt thẻ POS Terminal
│   │   │   └── PaymentProcessor.java   # Strategy Context điều hướng thanh toán
│   │   ├── observer/
│   │   │   ├── IDataObserver.java  # Observer Interface cập nhật UI thời gian thực
│   │   │   └── Subject.java        # Observable Subject phát sự kiện
│   │   ├── facade/
│   │   │   └── GearsShopFacade.java# Master Facade cổng giao tiếp cấp cao duy nhất
│   │   └── builder/
│   │       └── InvoiceBuilder.java # Builder tạo mẫu hóa đơn bán lẻ in ấn
│   │
│   └── ui/                         # TẦNG GIAO DIỆN NGƯỜI DÙNG (BOUNDARY / GUI SWING)
│       ├── LoginFrame.java         # Cổng đăng nhập phân quyền Admin / Cashier
│       ├── MainFrame.java          # Cửa sổ chính với Sidebar điều hướng hiện đại
│       ├── theme/UITheme.java      # Design System (GearVN Red + Obsidian Dark)
│       ├── components/             # Reusable UI Widgets (ModernButton, ModernTable, StatCard, ReceiptDialog...)
│       └── panels/                 # 10 Phân Hệ Màn Hình
│           ├── DashboardPanel.java # Bảng điều khiển KPI & đơn hàng gần đây
│           ├── POSPanel.java       # Màn hình bán hàng tại quầy POS & Numpad
│           ├── SanPhamPanel.java   # Quản lý 100 sản phẩm & điều chỉnh kho
│           ├── DonHangPanel.java   # Quản lý đơn hàng & khóa trạng thái Done/Hủy
│           ├── NhaCungCapPanel.java# Quản lý nhà cung cấp & kiểm tra ràng buộc
│           ├── KhachHangPanel.java # CRM khách hàng & điểm thưởng
│           ├── NhanVienPanel.java  # Quản lý nhân viên & đổi quyền Admin/POS
│           ├── BaoCaoPanel.java    # Biểu đồ tài chính & xuất file Excel CSV
│           ├── ShopConfigPanel.java# Cấu hình thương hiệu & VietQR Napas
│           └── OOPInspectorPanel.java # Trình kiểm tra & thuyết trình đồ án OOP trực tiếp
```

---

## 6. THÔNG TIN BẢN QUYỀN & LIÊN HỆ

- **Đồ án môn học**: Phân Tích Thiết Kế Hướng Đối Tượng (PTTKHDT) - Khoa CNTT Trường Đại Học Sài Gòn (SGU).
- **Nhóm sinh viên thực hiện**:
  - Nguyễn Công Danh (`3124410032`)
  - Trần Nhật Quang (`3124410293`)
  - Lê Hoài Lộc (`3122560041`)
- **Bản quyền**: © 2026 GEARS Shop. Toàn bộ mã nguồn phục vụ mục đích nghiên cứu và bảo vệ đồ án môn học.
