# TRƯỜNG ĐẠI HỌC SÀI GÒN - KHOA CÔNG NGHỆ THÔNG TIN
## BÁO CÁO ĐỒ ÁN MÔN HỌC: PHÂN TÍCH THIẾT KẾ HƯỚNG ĐỐI TƯỢNG (PTTKHDT)
### TÀI LIỆU THIẾT KẾ HỆ THỐNG VÀ CÁC SƠ ĐỒ UML CHUẨN
### ĐỀ TÀI: HỆ THỐNG QUẢN LÝ CỬA HÀNG BÁN KEYCAP (GEARS KEYCAP SHOP)

---

### THÔNG TIN DỰ ÁN & NHÓM THỰC HIỆN
- **Đơn vị đào tạo:** Khoa Công nghệ Thông tin - Trường Đại học Sài Gòn (SGU)
- **Môn học:** Phân tích Thiết kế Hướng đối tượng (PTTKHDT)
- **Hệ thống phát triển:** GEARS Keycap Shop (Quản lý cửa hàng bán Keycap & Điểm bán lẻ POS)
- **Thành viên nhóm:**
  1. **Nguyễn Công Danh** - MSSV: **3124410032** (Trưởng nhóm / Backend & BFD Lead)
  2. **Trần Nhật Quang** - MSSV: **3124410293** (Frontend & POS Lead)
  3. **Lê Hoài Lộc** - MSSV: **3122560041** (Database & Tester Lead)

---

## MỤC LỤC TÀI LIỆU
1. **Sơ đồ phân rã chức năng (Business Function Diagram - BFD)**
2. **Sơ đồ Use Case tổng quát (System Use Case Diagram)**
3. **Sơ đồ Use Case chi tiết phân hệ Bán hàng & Duyệt đơn hàng**
4. **Sơ đồ thực thể liên kết (Entity Relationship Diagram - ERD)**
5. **Sơ đồ hoạt động (Activity Diagrams)**
   - Quy trình duyệt và xử lý đơn hàng (Có ràng buộc khóa trạng thái Đã hoàn tất - Done)
   - Quy trình bán hàng tại quầy POS và in hóa đơn
   - Quy trình cấu hình website và tải lên Logo thương hiệu
6. **Sơ đồ tuần tự (Sequence Diagrams)**
   - Tuần tự luồng xử lý đơn hàng và cập nhật tồn kho
   - Tuần tự luồng bán hàng tại quầy POS
   - Tuần tự luồng upload logo và đồng bộ nhận diện website
7. **Sơ đồ lớp chi tiết (Class Diagram - OOP 3 Lớp)**

---

## 1. SƠ ĐỒ PHÂN RÃ CHỨC NĂNG (BFD - BUSINESS FUNCTION DIAGRAM)

Hệ thống được tổ chức thành 7 phân hệ chính tương ứng với tài liệu khảo sát nghiệp vụ và cấu trúc BFD của đề tài, tích hợp thêm phân hệ mở rộng Quản trị Cấu hình Website:

```mermaid
graph TD
    ROOT["HỆ THỐNG QUẢN LÝ CỬA HÀNG BÁN KEYCAP<br>(GEARS SHOP)"]

    ROOT --> F1["1. Phân hệ Đăng nhập & Xác thực"]
    ROOT --> F2["2. Quản lý Nhà cung cấp"]
    ROOT --> F3["3. Quản lý Đơn hàng & POS"]
    ROOT --> F4["4. Quản lý Khách hàng"]
    ROOT --> F5["5. Quản lý Sản phẩm"]
    ROOT --> F6["6. Quản lý Nhân viên"]
    ROOT --> F7["7. Thống kê Báo cáo"]
    ROOT --> F8["8. Cấu hình Website & Logo"]

    F1 --> F11["1.1 Đăng nhập tài khoản"]
    F1 --> F12["1.2 Kiểm tra chuẩn mật khẩu 8+ ký tự"]
    F1 --> F13["1.3 Ghi nhớ phiên làm việc"]
    F1 --> F14["1.4 Đăng xuất hệ thống"]

    F2 --> F21["2.1 Tạo Nhà cung cấp mới"]
    F2 --> F22["2.2 Tra cứu thông tin NCC"]
    F2 --> F23["2.3 Chỉnh sửa thông tin NCC"]
    F2 --> F24["2.4 Xóa NCC (Kiểm tra ràng buộc)"]
    F2 --> F25["2.5 Xuất dữ liệu NCC ra Excel"]

    F3 --> F31["3.1 Điểm bán lẻ POS tại quầy"]
    F3 --> F32["3.2 Chiết khấu giảm giá %Dic"]
    F3 --> F33["3.3 In biên lai hóa đơn"]
    F3 --> F34["3.4 Duyệt đơn hàng Online"]
    F3 --> F35["3.5 Khóa trạng thái đơn khi Đã xong"]
    F3 --> F36["3.6 Hủy đơn và hoàn tồn kho"]

    F4 --> F41["4.1 Tạo Khách hàng mới"]
    F4 --> F42["4.2 Tra cứu hồ sơ khách hàng"]
    F4 --> F43["4.3 Khóa / Mở khóa tài khoản"]
    F4 --> F44["4.4 Quản lý điểm thưởng tích lũy"]
    F4 --> F45["4.5 Xuất danh sách khách ra Excel"]

    F5 --> F51["5.1 Tạo Sản phẩm Keycap mới"]
    F5 --> F52["5.2 Phân loại thể loại (Artisan, Anime...)"]
    F5 --> F53["5.3 Quản lý giá vốn & giá bán"]
    F5 --> F54["5.4 Nhập thêm hàng (+X) và trừ kho (-X)"]
    F5 --> F55["5.5 Xóa sản phẩm (Kiểm tra giao dịch)"]

    F6 --> F61["6.1 Tạo Nhân viên mới"]
    F6 --> F62["6.2 Phân quyền Quản lý / Thu ngân"]
    F6 --> F63["6.3 Cập nhật thông tin nhân viên"]
    F6 --> F64["6.4 Khóa quyền truy cập nhân viên"]

    F7 --> F71["7.1 Thống kê Doanh thu theo ngày/tháng"]
    F7 --> F72["7.2 Thống kê Doanh số & Số lượng bán"]
    F7 --> F73["7.3 Thống kê Lợi nhuận gộp (Doanh thu - Vốn)"]
    F7 --> F74["7.4 Xuất báo cáo tài chính ra Excel"]

    F8 --> F81["8.1 Tải lên Logo thương hiệu (Upload Logo)"]
    F8 --> F82["8.2 Cập nhật Tên cửa hàng & Khẩu hiệu"]
    F8 --> F83["8.3 Quản lý Hotline CSKH & Showroom"]
    F8 --> F84["8.4 Cấu hình liên kết Mạng xã hội"]
    F8 --> F85["8.5 Tùy chỉnh thông báo Top Banner"]
```

---

## 2. SƠ ĐỒ USE CASE TỔNG QUÁT (SYSTEM USE CASE DIAGRAM)

```mermaid
graph LR
    subgraph Actors["Tác Nhân Hệ Thống"]
        Admin["Quản Trị Viên / Quản Lý"]
        Cashier["Nhân Viên Thu Ngân POS"]
        Customer["Khách Hàng Thành Viên"]
        Guest["Khách Vãng Lai"]
    end

    subgraph SystemBoundary["HỆ THỐNG GEARS KEYCAP SHOP"]
        UC_Auth(("Đăng nhập / Đăng xuất"))
        UC_SecPass(("Xác thực mật khẩu bảo mật<br>(>=8 ký tự, hoa, ký tự đặc biệt)"))
        
        UC_Product(("Quản lý Sản phẩm Keycap"))
        UC_Supplier(("Quản lý Nhà cung cấp"))
        UC_Employee(("Quản lý Nhân viên & Phân quyền"))
        UC_Report(("Xem Báo cáo Thống kê<br>(Doanh thu, Doanh số, Lợi nhuận)"))
        UC_Settings(("Cấu hình Website & Upload Logo"))
        
        UC_POS(("Bán hàng tại quầy POS"))
        UC_OrderMgmt(("Quản lý & Duyệt đơn hàng"))
        UC_LockOrder(("Khóa cập nhật đơn hàng<br>khi trạng thái ĐÃ HOÀN TẤT"))
        
        UC_Browse(("Xem danh mục 100 sản phẩm Keycap"))
        UC_Filter(("Lọc theo thể loại & Khoảng giá"))
        UC_Cart(("Quản lý Giỏ hàng"))
        UC_Checkout(("Đặt hàng trực tuyến"))
    end

    UC_Auth -.->|"<<include>>"| UC_SecPass
    UC_OrderMgmt -.->|"<<include>>"| UC_LockOrder

    Admin --> UC_Auth
    Admin --> UC_Product
    Admin --> UC_Supplier
    Admin --> UC_Employee
    Admin --> UC_Report
    Admin --> UC_Settings
    Admin --> UC_OrderMgmt

    Cashier --> UC_Auth
    Cashier --> UC_POS
    Cashier --> UC_OrderMgmt

    Customer --> UC_Auth
    Customer --> UC_Browse
    Customer --> UC_Filter
    Customer --> UC_Cart
    Customer --> UC_Checkout

    Guest --> UC_Browse
    Guest --> UC_Filter
    Guest --> UC_Cart
    Guest --> UC_Checkout
```

---

## 3. SƠ ĐỒ USE CASE CHI TIẾT PHÂN HỆ ĐƠN HÀNG & POS

```mermaid
graph TB
    subgraph Users["Người Sử Dụng"]
        Staff["Nhân viên Quản lý / Thu ngân"]
    end

    subgraph OrderSubsystem["Phân Hệ Quản Lý Đơn Hàng & Điểm Bán Lẻ POS"]
        UC_CreatePOS(("Tạo đơn hàng tại quầy (POS)"))
        UC_SelectProd(("Chọn sản phẩm Keycap"))
        UC_CalcDiscount(("Nhập chiết khấu %Dic"))
        UC_ProcessPay(("Xử lý thanh toán (Tiền mặt / Chuyển khoản)"))
        UC_PrintReceipt(("In biên lai hóa đơn"))
        UC_UpdateStock(("Tự động trừ số lượng tồn kho"))

        UC_ViewOrders(("Tra cứu danh sách đơn hàng"))
        UC_FilterStatus(("Lọc theo trạng thái đơn"))
        UC_UpdateStatus(("Cập nhật trạng thái đơn"))
        UC_CheckDoneStatus(("Kiểm tra điều kiện: Đã Done thì KHÔNG cho sửa"))
        UC_CancelOrder(("Hủy đơn hàng"))
        UC_RestoreStock(("Tự động hoàn lại tồn kho khi hủy"))
    end

    Staff --> UC_CreatePOS
    Staff --> UC_ViewOrders
    Staff --> UC_UpdateStatus
    Staff --> UC_CancelOrder

    UC_CreatePOS -.->|"<<include>>"| UC_SelectProd
    UC_CreatePOS -.->|"<<include>>"| UC_CalcDiscount
    UC_CreatePOS -.->|"<<include>>"| UC_ProcessPay
    UC_ProcessPay -.->|"<<include>>"| UC_PrintReceipt
    UC_ProcessPay -.->|"<<include>>"| UC_UpdateStock

    UC_ViewOrders -.->|"<<extend>>"| UC_FilterStatus
    UC_UpdateStatus -.->|"<<include>>"| UC_CheckDoneStatus
    UC_CancelOrder -.->|"<<include>>"| UC_RestoreStock
```

---

## 4. SƠ ĐỒ THỰC THỂ LIÊN KẾT (ERD - CROW'S FOOT NOTATION)

Sơ đồ ERD chuẩn hóa bậc 3 (3NF) gồm 8 bảng dữ liệu quan hệ, khớp 100% với tệp kịch bản `database_keycap_shop.sql`:

```mermaid
erDiagram
    NhaCungCap ||--o{ SanPham : "cung cap"
    SanPham ||--o{ ChiTietDonHang : "co trong"
    DonHang ||--|{ ChiTietDonHang : "gom"
    KhachHang ||--o{ DonHang : "dat"
    NhanVien ||--o{ DonHang : "lap"
    DangNhap ||--|| NhanVien : "so huu"
    DangNhap ||--|| KhachHang : "so huu"
    NhanVien ||--o{ BaoCao : "xuat"

    NhaCungCap {
        int MaNCC PK "Mã nhà cung cấp"
        varchar TenNCC "Tên nhà cung cấp (Akko, Keychron...)"
        varchar DiaChi "Địa chỉ đối tác"
        varchar SoDienThoai "Số điện thoại liên hệ"
        varchar Email "Email liên hệ"
    }

    SanPham {
        int MaSP PK "Mã sản phẩm Keycap"
        int MaNCC FK "Khóa ngoại tham chiếu NhaCungCap"
        varchar TenSP "Tên bộ / nút Keycap"
        varchar TheLoai "Artisan, Anime, Pudding, Cherry..."
        decimal GiaNhap "Giá vốn nhập kho từ NCC"
        decimal GiaBan "Giá niêm yết bán cho khách"
        int SoLuongTon "Số lượng khả dụng trong kho"
        text HinhAnh "Đường dẫn ảnh sản phẩm"
        text MoTa "Mô tả chất liệu, profile, layout"
    }

    KhachHang {
        int MaKH PK "Mã khách hàng"
        varchar TenKH "Họ và tên khách hàng"
        varchar SoDienThoai "Số điện thoại liên lạc"
        varchar Email "Email nhận thông báo"
        varchar DiaChi "Địa chỉ giao hàng mặc định"
        int DiemTichLuy "Điểm thưởng mua hàng"
    }

    NhanVien {
        int MaNV PK "Mã nhân viên"
        varchar TenNV "Họ và tên nhân viên"
        varchar ChucVu "Quản lý / Thu ngân POS"
        varchar SoDienThoai "Số điện thoại cá nhân"
        varchar Email "Email nội bộ"
        date NgayVaoLam "Ngày bắt đầu làm việc"
    }

    DangNhap {
        varchar TenDangNhap PK "Tên tài khoản (admin, cashier...)"
        varchar MatKhau "Mật khẩu băm (BCrypt / SHA)"
        varchar VaiTro "admin, cashier, customer"
        int TrangThai "1: Hoạt động, 0: Bị khóa"
        int MaNV FK "Liên kết nhân viên (nếu có)"
        int MaKH FK "Liên kết khách hàng (nếu có)"
    }

    DonHang {
        int MaDH PK "Mã đơn hàng"
        varchar MaDon "Mã hiển thị (DH-2601, POS-2601)"
        int MaKH FK "Khóa ngoại KhachHang"
        int MaNV FK "Khóa ngoại NhanVien lập đơn"
        datetime NgayLap "Thời gian lập đơn"
        decimal TongTien "Tổng tiền sau giảm giá"
        decimal TienVon "Tổng giá vốn các mặt hàng"
        decimal LoiNhuan "Lợi nhuận gộp (TongTien - TienVon)"
        varchar PhuongThucTT "Cash, Bank, Online"
        varchar TrangThai "moi, xuly, giaohang (Done), huy"
        varchar KenhBan "POS tại quầy, Web Online"
        text GhiChu "Ghi chú đơn hàng"
    }

    ChiTietDonHang {
        int MaCTDH PK "Mã chi tiết đơn hàng"
        int MaDH FK "Khóa ngoại tham chiếu DonHang"
        int MaSP FK "Khóa ngoại tham chiếu SanPham"
        int SoLuong "Số lượng sản phẩm mua"
        decimal DonGia "Giá bán tại thời điểm đặt"
        decimal DonGiaNhap "Giá vốn tại thời điểm đặt"
        decimal ThanhTien "Thành tiền = SoLuong * DonGia"
    }

    BaoCao {
        int MaBaoCao PK "Mã báo cáo thống kê"
        int MaNV FK "Khóa ngoại nhân viên xuất báo cáo"
        varchar LoaiBaoCao "DoanhThu, DoanhSo, LoiNhuan"
        date TuNgay "Khoảng thời gian từ ngày"
        date DenNgay "Khoảng thời gian đến ngày"
        decimal TongDoanhThu "Tổng doanh thu kỳ báo cáo"
        decimal TongLoiNhuan "Tổng lợi nhuận gộp kỳ báo cáo"
        datetime NgayXuat "Thời gian kết xuất file"
    }
```

---

## 5. SƠ ĐỒ HOẠT ĐỘNG (ACTIVITY DIAGRAMS)

### 5.1 Quy trình Duyệt & Xử lý đơn hàng (Có ràng buộc khóa trạng thái Done)

```mermaid
flowchart TD
    Start([Bắt đầu: Nhân viên mở danh sách đơn hàng]) --> SelectOrder[Chọn đơn hàng cần cập nhật]
    SelectOrder --> CheckCurrentStatus{Trạng thái hiện tại của đơn hàng là gì?}

    CheckCurrentStatus -- "ĐÃ HOÀN TẤT (giaohang) HOẶC ĐÃ HỦY (huy)" --> LockedBadge[Hiển thị Badge trạng thái CỐ ĐỊNH có Biểu tượng Khóa]
    LockedBadge --> BlockEdit[Khóa thẻ Select Dropdown - Không cho phép chỉnh sửa]
    BlockEdit --> TriggerAlert[Hiển thị thông báo nghiệp vụ:<br>'Đơn hàng đã Hoàn tất hoặc Đã hủy nên KHÔNG ĐƯỢC PHÉP đổi trạng thái!']
    TriggerAlert --> EndFail([Kết thúc: Từ chối thay đổi])

    CheckCurrentStatus -- "MỚI (moi) HOẶC ĐANG XỬ LÝ (xuly)" --> ChooseNewStatus[Chọn trạng thái mới: Đang xử lý / Đã giao hàng / Hủy đơn]
    ChooseNewStatus --> CheckNewStatus{Trạng thái mới được chọn là gì?}

    CheckNewStatus -- "ĐÃ GIAO HÀNG (giaohang / Done)" --> ConfirmDone[Xác nhận bàn giao hàng thành công cho khách]
    ConfirmDone --> UpdateOrderDone[Lưu trạng thái Đã giao hàng vào CSDL]
    UpdateOrderDone --> LockForever[Khóa vĩnh viễn đơn hàng không cho cập nhật thêm nữa]
    LockForever --> ShowDoneSuccess[Hiển thị Toast: Cập nhật đơn hàng thành công]
    ShowDoneSuccess --> EndSuccess([Kết thúc: Đơn hàng hoàn tất])

    CheckNewStatus -- "HỦY ĐƠN (huy)" --> ConfirmCancel[Yêu cầu xác nhận lý do hủy đơn hàng]
    ConfirmCancel --> RestoreInventory[Tự động hoàn trả số lượng Keycap vào tồn kho SanPham]
    RestoreInventory --> UpdateOrderCancel[Lưu trạng thái Đã hủy vào CSDL]
    UpdateOrderCancel --> ShowCancelSuccess[Hiển thị Toast: Đã hủy đơn và phục hồi kho hàng]
    ShowCancelSuccess --> EndSuccess

    CheckNewStatus -- "ĐANG XỬ LÝ (xuly)" --> UpdateOrderProc[Cập nhật trạng thái Đang xử lý vào CSDL]
    UpdateOrderProc --> ShowProcSuccess[Hiển thị Toast: Đang xử lý đóng gói đơn hàng]
    ShowProcSuccess --> EndSuccess
```

---

### 5.2 Quy trình Bán hàng tại quầy POS và In hóa đơn

```mermaid
flowchart TD
    StartPOS([Thu ngân bắt đầu phiên làm việc POS]) --> ScanProd[Tìm kiếm / Click chọn Keycap từ danh mục]
    ScanProd --> CheckStock{Số lượng tồn kho > 0?}
    CheckStock -- Không --> ShowStockAlert[Báo hết hàng, không cho thêm vào giỏ] --> ScanProd
    CheckStock -- Có --> AddToCart[Thêm Keycap vào giỏ hàng POS]
    
    AddToCart --> MoreItem{Có chọn thêm sản phẩm khác?}
    MoreItem -- Có --> ScanProd
    MoreItem -- Không --> InputDiscount[Nhập chiết khấu %Dic nếu có chính sách khuyến mãi]

    InputDiscount --> SelectPayMethod[Chọn phương thức: Tiền mặt hoặc Chuyển khoản QR]
    SelectPayMethod --> ProcessPayment[Xác nhận nhận tiền từ khách hàng]
    ProcessPayment --> DeductInventory[Trừ số lượng tồn kho tự động trong CSDL]
    DeductInventory --> SavePOSOrder[Lưu Đơn hàng với trạng thái ĐÃ HOÀN TẤT - Done]
    SavePOSOrder --> GenReceipt[Sinh mẫu biên lai hóa đơn bán lẻ]
    GenReceipt --> PrintWindow[Kích hoạt hộp thoại in window.print]
    PrintWindow --> ResetPOS[Làm mới giao diện POS cho lượt khách tiếp theo]
    ResetPOS --> EndPOS([Kết thúc giao dịch POS])
```

---

### 5.3 Quy trình Cấu hình Website & Upload Logo thương hiệu

```mermaid
flowchart TD
    StartCfg([Quản trị viên mở trang Cấu hình Website]) --> LoadCurrent[Hệ thống tải cấu hình hiện tại từ LocalStorage / CSDL]
    LoadCurrent --> EditInfo[Chỉnh sửa Tên shop, Slogan, Hotline, Showroom, MXH]
    EditInfo --> UploadLogoChoice{Có tải lên Logo mới không?}

    UploadLogoChoice -- Có --> SelectFile[Chọn file ảnh từ máy tính (PNG/JPG/SVG/WebP)]
    SelectFile --> CheckSize{Dung lượng file <= 2MB?}
    CheckSize -- Không --> ErrorSize[Báo lỗi: File vượt quá kích thước 2MB cho phép] --> SelectFile
    CheckSize -- Có --> ReadBase64[FileReader đọc file và chuyển đổi sang định dạng chuỗi Base64 DataURL]
    ReadBase64 --> LivePreview[Hiển thị xem trước tức thì trên khung Logo Preview]
    LivePreview --> SubmitSave[Nhấn nút LƯU CẤU HÌNH WEBSITE]

    UploadLogoChoice -- Không --> SubmitSave
    SubmitSave --> ValidateForm{Tên cửa hàng có hợp lệ?}
    ValidateForm -- Trống --> FocusName[Báo lỗi: Tên thương hiệu không được để trống] --> EditInfo
    ValidateForm -- Hợp lệ --> PersistConfig[Lưu đối tượng websiteConfig vào LocalStorage / CSDL]
    PersistConfig --> BroadcastUpdate[Kích hoạt hàm AdminCommon.applyWebsiteConfigToPage]
    BroadcastUpdate --> UpdateClientUI[Header Logo, Hotline, Footer, Banner trên trang Khách hàng được cập nhật đồng bộ]
    UpdateClientUI --> EndCfg([Cấu hình Website hoàn tất])
```

---

## 6. SƠ ĐỒ TUẦN TỰ (SEQUENCE DIAGRAMS)

### 6.1 Tuần tự luồng xử lý đơn hàng và kiểm tra điều kiện Done

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Quản lý / Thu ngân
    participant View as Giao diện Quản lý Đơn hàng<br>(orders.html)
    participant Ctrl as Bộ điều khiển Đơn hàng<br>(orders.js)
    participant Common as Thư viện dùng chung<br>(admin-common.js)
    participant DB as CSDL / LocalStorage<br>(orders / product)

    Admin ->> View: Mở trang danh sách đơn hàng
    View ->> Ctrl: renderOrdersTable()
    Ctrl ->> Common: getLocalStorage('orders')
    Common ->> DB: Đọc danh sách đơn hàng
    DB -->> Common: Trả về mảng danh sách orders
    Common -->> Ctrl: Dữ liệu orders
    Ctrl ->> Ctrl: Kiểm tra trạng thái từng đơn
    Note over Ctrl, View: Nếu status === 'giaohang' (Done) hoặc 'huy':<br>Render locked-status-badge có biểu tượng khóa,<br>KHÔNG hiển thị dropdown cho phép sửa!
    Ctrl -->> View: Xuất bảng HTML hiển thị danh sách đơn

    Admin ->> View: Cố ý cập nhật trạng thái đơn (updateOrderStatus)
    View ->> Ctrl: updateOrderStatus(orderId, newStatus)
    Ctrl ->> Ctrl: Kiểm tra order.status hiện tại

    alt Đơn hàng đang ở trạng thái 'giaohang' (Done) hoặc 'huy'
        Ctrl -->> View: Báo lỗi nghiệp vụ: 'Đơn hàng đã Hoàn tất, KHÔNG được phép đổi trạng thái!'
        View -->> Admin: Hiển thị cảnh báo từ chối
    else Đơn hàng đang ở trạng thái 'moi' hoặc 'xuly'
        alt Chuyển sang 'huy'
            Ctrl ->> DB: Phục hồi số lượng tồn kho (product.stock += item.quantity)
        end
        Ctrl ->> DB: Cập nhật order.status = newStatus
        DB -->> Ctrl: Ghi nhận thành công
        Ctrl ->> Common: showToast('Cập nhật trạng thái thành công!', 'success')
        Ctrl ->> View: Cập nhật lại giao diện bảng đơn hàng
        View -->> Admin: Hiển thị giao diện mới đã áp dụng
    end
```

---

### 6.2 Tuần tự luồng Bán hàng tại quầy POS

```mermaid
sequenceDiagram
    autonumber
    actor Cashier as Thu ngân POS
    participant POSView as Màn hình POS<br>(pos.html)
    participant POSCtrl as Xử lý POS<br>(pos.js)
    participant Storage as Bộ lưu trữ dữ liệu<br>(LocalStorage / SQL)

    Cashier ->> POSView: Chọn sản phẩm Keycap từ danh mục
    POSView ->> POSCtrl: addItemToCart(productId)
    POSCtrl ->> Storage: getLocalStorage('product')
    Storage -->> POSCtrl: Thông tin sản phẩm & Tồn kho
    POSCtrl ->> POSCtrl: Kiểm tra tồn kho khả dụng
    POSCtrl -->> POSView: Cập nhật giỏ hàng & Tính lại Tổng tiền

    Cashier ->> POSView: Nhập giảm giá %Dic & Chọn phương thức thanh toán
    Cashier ->> POSView: Bấm 'Thanh toán & In hóa đơn'
    POSView ->> POSCtrl: processPOSPayment()
    
    POSCtrl ->> Storage: Trừ số lượng tồn kho: product.stock -= item.qty
    POSCtrl ->> Storage: Lưu hóa đơn mới với status = 'giaohang' (Done)
    Storage -->> POSCtrl: Xác nhận lưu hóa đơn thành công

    POSCtrl ->> POSView: Sinh mã HTML biên lai thanh toán
    POSView ->> Cashier: Hiển thị Modal hóa đơn & Tự động bật lệnh In
    POSCtrl ->> POSView: Xóa giỏ hàng hiện tại, sẵn sàng cho khách mới
```

---

### 6.3 Tuần tự luồng Cấu hình Website & Upload Logo Base64

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Quản trị viên
    participant SettingsView as Màn hình Cấu hình<br>(settings.html)
    participant FileReader as Trình duyệt FileReader API
    participant SettingsCtrl as Xử lý Cấu hình<br>(settings.js)
    participant Common as AdminCommon Core
    participant ClientView as Trang Khách Hàng<br>(index.html)

    Admin ->> SettingsView: Chọn tệp ảnh Logo mới từ ổ đĩa
    SettingsView ->> FileReader: readAsDataURL(file)
    FileReader -->> SettingsView: Trả về chuỗi ảnh Base64
    SettingsView ->> SettingsView: Hiển thị ảnh logo xem trước ngay lập tức

    Admin ->> SettingsView: Nhập Hotline, Tên Shop, Slogan, Banner, MXH
    Admin ->> SettingsView: Bấm 'LƯU CẤU HÌNH WEBSITE'
    SettingsView ->> SettingsCtrl: saveWebsiteConfig()
    SettingsCtrl ->> Common: setLocalStorage('websiteConfig', updatedConfig)
    Common ->> Common: Lưu chuỗi cấu hình vào bộ nhớ
    SettingsCtrl ->> Common: showToast('Đã lưu cấu hình thành công!', 'success')

    Admin ->> ClientView: Mở trang Web Khách Hàng
    ClientView ->> Common: applyWebsiteConfigToPage()
    Common ->> Common: Đọc websiteConfig từ bộ nhớ
    Common ->> ClientView: Cập nhật Logo header (.gear-logo-box)
    Common ->> ClientView: Cập nhật Hotline (.gear-hotline)
    Common ->> ClientView: Cập nhật Banner thông báo (#gear-top-banner-text)
    Common ->> ClientView: Cập nhật Tên shop & Mô tả chân trang (#footer-shop-desc)
    ClientView -->> Admin: Khách hàng nhìn thấy toàn bộ nhận diện thương hiệu mới
```

---

## 7. SƠ ĐỒ LỚP CHI TIẾT (CLASS DIAGRAM - OOP 3 LỚP)

Kiến trúc phần mềm được phân tách rõ ràng theo mô hình 3 lớp (Boundary - Controller - Entity/DAO):

```mermaid
classDiagram
    %% --- BOUNDARY CLASSES (Giao diện người dùng) ---
    class PosView {
        +renderCategoryList()
        +renderProductGrid()
        +renderOrderItems()
        +openPaymentModal()
        +printReceipt()
    }

    class OrderAdminView {
        +renderOrdersTable()
        +renderStatusBadge(status)
        +openOrderDetailModal(orderId)
        +exportOrdersToExcel()
    }

    class ProductAdminView {
        +renderProductTable()
        +openAddProductModal()
        +openEditProductModal(id)
        +quickUpdateStockPrompt(id)
    }

    class SettingsView {
        +loadCurrentSettings()
        +handleLogoUpload(input)
        +resetDefaultLogo()
        +saveWebsiteConfig()
    }

    class StorefrontView {
        +loadProducts()
        +filterCategory(cat)
        +changeSort(sortBy)
        +renderPagination()
        +openCartModal()
    }

    %% --- CONTROLLER CLASSES (Bộ điều khiển nghiệp vụ) ---
    class OrderController {
        +createPOSOrder(orderData)
        +updateOrderStatus(orderId, newStatus)
        +cancelOrder(orderId)
        +deleteOrder(orderId)
        +filterOrders(keyword, status, date)
        -checkCanModifyStatus(currentStatus)
    }

    class ProductController {
        +getAllProducts()
        +getProductById(id)
        +addProduct(productDTO)
        +updateProduct(id, productDTO)
        +deleteProduct(id)
        +adjustStock(id, amount)
        -validateProductConstraints(productDTO)
    }

    class WebsiteConfigController {
        +getConfig()
        +saveConfig(configDTO)
        +resetToDefault()
        +applyConfigToPage()
    }

    class AuthController {
        +login(username, password)
        +logout()
        +checkRole(requiredRole)
        +validatePasswordSecurity(password)
    }

    %% --- ENTITY CLASSES (Thực thể dữ liệu) ---
    class SanPham {
        +int id
        +string name
        +string type
        +int price
        +int costPrice
        +int stock
        +string img
        +string description
        +int supplierId
        +isAvailable() bool
        +calculateProfitMargin() float
    }

    class DonHang {
        +int id
        +string orderCode
        +string customerName
        +string customerPhone
        +string address
        +string date
        +string status
        +string paymentMethod
        +string cashierName
        +string channel
        +ChiTietDonHang[] items
        +int subTotal
        +int discountPercent
        +int total
        +int costTotal
        +int profit
        +isLocked() bool
    }

    class ChiTietDonHang {
        +int id
        +string name
        +int quantity
        +int costPrice
        +int price
        +calcSubTotal() int
    }

    class NhaCungCap {
        +int id
        +string name
        +string phone
        +string email
        +string address
    }

    class KhachHang {
        +int id
        +string name
        +string phone
        +string email
        +string address
        +int rewardPoints
        +bool isLocked
    }

    class NhanVien {
        +string id
        +string name
        +string username
        +string role
        +string roleName
        +string phone
        +string email
    }

    class WebsiteConfig {
        +string shopName
        +string brandTagline
        +string description
        +string logoUrl
        +string hotline
        +string email
        +string address
        +string workingHours
        +string topBannerText
        +string facebookUrl
        +string instagramUrl
        +string githubUrl
    }

    %% --- QUAN HỆ GIỮA CÁC LỚP ---
    PosView ..> OrderController : gọi điều khiển
    OrderAdminView ..> OrderController : gọi điều khiển
    ProductAdminView ..> ProductController : gọi điều khiển
    SettingsView ..> WebsiteConfigController : gọi điều khiển
    StorefrontView ..> WebsiteConfigController : áp dụng cấu hình
    StorefrontView ..> OrderController : đặt hàng

    OrderController --> DonHang : xử lý & kiểm tra ràng buộc
    DonHang "1" *-- "many" ChiTietDonHang : chứa chi tiết
    ChiTietDonHang ..> SanPham : tham chiếu
    ProductController --> SanPham : thao tác kho
    SanPham "many" --> "1" NhaCungCap : thuộc về
    DonHang "many" --> "1" KhachHang : thuộc về
    DonHang "many" --> "1" NhanVien : lập bởi
    WebsiteConfigController --> WebsiteConfig : quản lý
    AuthController --> NhanVien : xác thực
```

---

### 7.1. HIỆN THỰC 4 TRỤ CỘT LẬP TRÌNH HƯỚNG ĐỐI TƯỢNG (OOP PRINCIPLES)

1. **Tính Đóng Gói (Encapsulation):**
   - Mọi thuộc tính dữ liệu trong các lớp Thực thể (`Product`, `Order`, `Customer`, `Employee`) đều được bảo vệ thông qua các trường nội bộ (`_id`, `_price`, `_stock`, `_status`...) và chỉ cho phép truy xuất/thao tác qua các phương thức Getter, Setter và phương thức nghiệp vụ.
   - Cơ chế xác thực dữ liệu được tích hợp trực tiếp trong lớp: `Product.adjustStock(delta)` từ chối trừ hàng nếu tồn kho không đủ (bảo vệ tồn kho không âm); `Order.transitionTo(newStatus)` từ chối chuyển trạng thái khi đơn hàng đã ở trạng thái khóa `giaohang` hoặc `huy`.

2. **Tính Kế Thừa (Inheritance):**
   - Lớp cơ sở `BaseEntity` đóng gói các thuộc tính chung (`id`, `createdAt`, `updatedAt`, `equals()`, `toJSON()`).
   - Lớp trừu tượng `User` kế thừa từ `BaseEntity`, đóng gói các thuộc tính tài khoản người dùng (`name`, `username`, `phone`, `email`, `role`, `status`).
   - Hai lớp thực thể `Customer` và `Employee` kế thừa trực tiếp từ `User`:
     - `Customer` mở rộng thêm điểm thưởng (`rewardPoints`), địa chỉ (`address`), phân hạng thành viên (`getMembershipTier()`).
     - `Employee` mở rộng thêm chức vụ (`position`), phân quyền thao tác (`hasPermission()`).

3. **Tính Đa Hình (Polymorphism):**
   - Phương thức `getRoleName()` và `getRoleBadgeClass()` được khai báo tại lớp cha `User` và được ghi đè (Override) tại các lớp con:
     - `Customer.getRoleName()` trả về "Khách hàng".
     - `Employee.getRoleName()` trả về linh hoạt "Quản trị viên" hoặc "Nhân viên Thu ngân" dựa vào vai trò được cấu hình.
   - Giao diện `PaymentStrategy` định nghĩa phương thức `pay(order, context)`. Các lớp dẫn xuất `VietQRPaymentStrategy`, `CashPaymentStrategy`, và `CardPaymentStrategy` hiện thực đa hình thuật toán thanh toán tương ứng cho từng kênh giao dịch.

4. **Tính Trừu Tượng (Abstraction):**
   - Hệ thống trừu tượng hóa các khái niệm thực tế thành các lớp mô hình: Toàn bộ quá trình tạo đơn hàng, tính chiết khấu, sinh mã Napas QR, và trừ tồn kho được ẩn giấu sau các giao diện điều khiển cấp cao (`OrderService`, `PaymentStrategy`).
   - Tầng Giao diện (Boundary) chỉ tương tác với các phương thức nghiệp vụ rõ ràng mà không cần can thiệp vào cấu trúc chi tiết bên trong.

---

### 7.2. CÁC MẪU THIẾT KẾ HƯỚNG ĐỐI TƯỢNG (DESIGN PATTERNS) ĐƯỢC ÁP DỤNG

1. **Singleton Pattern (Mẫu Khởi Tạo Đơn Lẻ):**
   - Toàn bộ 11 Service điều khiển nghiệp vụ (`StorageService`, `AuthService`, `ProductService`, `CartService`, `OrderService`, `CustomerService`, `SupplierService`, `EmployeeService`, `ReportService`, `ConfigService`, `NotificationService`) đều áp dụng Singleton Pattern với phương thức `getInstance()`. Đảm bảo chỉ tồn tại một thể hiện duy nhất quản lý trạng thái dữ liệu trong suốt vòng đời ứng dụng.

2. **Factory Method Pattern (Mẫu Nhà Máy Khởi Tạo):**
   - Lớp `EntityFactory` cung cấp các phương thức tĩnh: `createProduct()`, `createOrder()`, `createCustomer()`, `createEmployee()`, `createPaymentStrategy()`.
   - Giúp đóng gói toàn bộ logic kiểm tra hợp lệ, gắn giá trị mặc định và khởi tạo đúng loại đối tượng cụ thể mà không làm lộ chi tiết khởi tạo ra bên ngoài.

3. **Strategy Pattern (Mẫu Chiến Lược):**
   - Đóng gói các thuật toán thanh toán vào họ các chiến lược `PaymentStrategy`:
     - `VietQRPaymentStrategy`: Sinh liên kết mã VietQR SePay theo chuẩn ngân hàng Napas, cú pháp chuyển khoản và cơ chế webhook.
     - `CashPaymentStrategy`: Xử lý giao dịch tiền mặt tại quầy POS, kiểm tra tiền khách đưa và tính tiền thối tự động.
     - `CardPaymentStrategy`: Xử lý giao dịch quẹt thẻ qua thiết bị POS Terminal.

4. **Observer Pattern (Mẫu Người Quan Sát - Pub/Sub):**
   - Triển khai trong `StorageService` với cơ chế `subscribe(key, callback)` và `_notifySubscribers(key, data)`. Khi dữ liệu giỏ hàng hoặc đơn hàng thay đổi, các thành phần giao diện đã đăng ký (như biểu tượng giỏ hàng trên Header, bảng danh sách đơn hàng Admin) sẽ tự động cập nhật mà không cần tải lại trang.

5. **Facade Pattern (Mẫu Mặt Tiền Điều Khiển):**
   - Lớp `GearsApp` đóng vai trò là một Master Gateway Facade duy nhất, tập hợp toàn bộ các Service, Domain Models và Design Patterns. Cung cấp một điểm truy cập tập trung duy nhất (`window.GearsApp`) cho tất cả các trang web trong hệ thống.

---

## 8. KẾT LUẬN & ĐÁNH GIÁ MỨC ĐỘ ĐÁP ỨNG ĐỒ ÁN PTTKHDT

1. **Chuẩn mực nghiệp vụ:**
   - Hệ thống thỏa mãn đầy đủ các quy định kiểm tra bảo mật mật khẩu (tối thiểu 8 ký tự, có chữ in hoa và ký tự đặc biệt).
   - Ràng buộc nghiệp vụ trạng thái đơn hàng được bảo vệ chặt chẽ: Khi đơn hàng đã ở trạng thái **ĐÃ HOÀN TẤT (giaohang / Done)** hoặc **ĐÃ HỦY (huy)**, giao diện sẽ tự động khóa chuyển trạng thái và mã nguồn logic sẽ từ chối bất kỳ hành vi thay đổi nào.
   - Thao tác xóa sản phẩm và xóa đơn hàng đều tích hợp cơ chế bảo toàn dữ liệu và toàn vẹn tham chiếu.

2. **Cấu hình thương hiệu & Nhận diện Website:**
   - Cho phép Quản trị viên tùy biến toàn bộ thông tin hệ thống từ Cổng Quản Trị: Tên shop, Slogan, Hotline, Email, Địa chỉ, Mạng xã hội và tải lên tệp ảnh **Logo thương hiệu** (được mã hóa chuỗi Base64 Data URL).
   - Mọi thay đổi cấu hình được đồng bộ tự động tới trang chủ bán hàng của Khách hàng theo thời gian thực.

3. **Mô hình hóa hình thức chuẩn PTTKHDT:**
   - Tất cả 7 dạng sơ đồ (BFD, Use Case tổng quát, Use Case chi tiết, ERD quan hệ, Activity, Sequence và Class Diagram) đều được mô hình hóa theo đúng chuẩn UML và phương pháp phân tích thiết kế hướng đối tượng của Khoa CNTT - Trường Đại học Sài Gòn (SGU).
