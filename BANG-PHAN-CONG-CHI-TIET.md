# TRƯỜNG ĐẠI HỌC SÀI GÒN - KHOA CÔNG NGHỆ THÔNG TIN
## BÁO CÁO ĐỒ ÁN MÔN HỌC: PHÂN TÍCH THIẾT KẾ HƯỚNG ĐỐI TƯỢNG (PTTKHDT)
### ĐỀ TÀI: XÂY DỰNG HỆ THỐNG QUẢN LÝ CỬA HÀNG BÁN KEYCAP (GEARS KEYCAP SHOP)

---

# BẢNG PHÂN CÔNG VAI TRÒ & NHIỆM VỤ CHI TIẾT 12 TUẦN

---

### I. THÔNG TIN THÀNH VIÊN & VAI TRÒ DỰ ÁN

| Mã TV | Họ và Tên | Mã Số Sinh Viên | Vai Trò Báo Cáo | Trách Nhiệm Chính trong Dự Án | Các Phân Hệ / Module Phụ Trách | Tỷ Lệ Đóng Góp |
| :---: | :--- | :---: | :--- | :--- | :--- | :---: |
| **TV1** | **Nguyễn Công Danh** | **3124410032** | **Trưởng nhóm / Backend Lead** | - Chịu trách nhiệm kiến trúc phần mềm 3 lớp (3-Tier: View - Controller - Entity/Data).<br>- Phân tích yêu cầu nghiệp vụ (SRS), điều phối tiến độ chung.<br>- Quản lý mã nguồn Git repository & quy chuẩn code.<br>- Xây dựng module Nhà cung cấp và Báo cáo Thống kê. | - Khảo sát SRS & Sơ đồ BFD<br>- Kiến trúc Base Project<br>- Module Quản lý Nhà cung cấp (Tạo NCC)<br>- Module Thống kê (Doanh thu, Doanh số, Lợi nhuận) | **35%** |
| **TV2** | **Trần Nhật Quang** | **3124410293** | **Frontend Lead / UI Designer** | - Thiết kế giao diện theo phong cách Odoo / ERP hiện đại kết hợp theme GearVN.<br>- Phát triển giao diện người dùng (UI/UX) và tối ưu hóa tương tác.<br>- Xây dựng phân hệ bán hàng tại quầy (Điểm bán lẻ POS).<br>- Lập kế hoạch Gantt Chart và ma trận kiểm thử giao diện. | - Kế hoạch Gantt 12 tuần<br>- Thiết kế UI Prototype Figma<br>- Module Điểm bán lẻ POS (Bán hàng tại quầy)<br>- Module Quản lý Đơn hàng (Tạo & In biên lai)<br>- Tối ưu hóa UI/UX Responsive | **33%** |
| **TV3** | **Lê Hoài Lộc** | **3122560041** | **Database / Tester Lead** | - Thiết kế & quản trị CSDL, đảm bảo toàn vẹn dữ liệu, lập test case và kiểm thử hệ thống.<br>- Xây dựng các Entity & mối quan hệ giữa các bảng, đảm bảo toàn vẹn khóa ngoại.<br>- Phụ trách kiểm thử tự động, bug fixing và rà soát an toàn bảo mật.<br>- Vận hành và kết nối CSDL quan hệ thực tế (sử dụng db thật luôn). | - Sơ đồ ERD & Script SQL (`database_keycap_shop.sql`)<br>- Module 1: Quản lý Sản phẩm Keycap (100 sản phẩm, phân loại, giá vốn, tồn kho)<br>- Module 4: Quản lý Khách hàng & Nhân viên (Phân quyền Quản lý/Thu ngân)<br>- Bộ kiểm thử tự động 48 Test Cases & Bug Fix (sử dụng db thật luôn) | **32%** |

---

### II. BẢNG TIẾN ĐỘ THỰC HIỆN DỰ ÁN 12 TUẦN (GANTT CHART)

| STT | Hạng Mục / Giai Đoạn Công Việc | Phân Công | Bắt Đầu | Kết Thúc | Thời Gian | Trạng Thái | Sản Phẩm Bàn Giao (Deliverables) | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 | T11 | T12 |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **G1** | **GIAI ĐOẠN 1: KHỞI TẠO & PHÂN TÍCH YÊU CẦU** | | | | | | | | | | | | | | | | | | |
| 1.1 | Khảo sát nghiệp vụ cửa hàng bán keycap (Sản phẩm, NCC, Bán hàng, Tồn kho) | **TV1** | Tuần 1 | Tuần 1 | 1 tuần | **Hoàn thành** | Tài liệu Yêu cầu nghiệp vụ (SRS) | [X] | | | | | | | | | | | |
| 1.2 | Xác định Scope đồ án, phân tích yêu cầu chức năng & phi chức năng, vẽ sơ đồ BFD | **Cả nhóm** | Tuần 1 | Tuần 2 | 2 tuần | **Hoàn thành** | Sơ đồ BFD & Feature List | [X] | [X] | | | | | | | | | | |
| 1.3 | Thành lập Git repository, quy chuẩn commit, chọn tech stack chuẩn PTTKHDT | **TV1** | Tuần 2 | Tuần 2 | 1 tuần | **Hoàn thành** | Setup Repo & Guideline | | [X] | | | | | | | | | | |
| 1.4 | Lập kế hoạch tiến độ chi tiết 12 tuần & phân công công việc | **TV2** | Tuần 2 | Tuần 2 | 1 tuần | **Hoàn thành** | File Gantt Chart & Kế hoạch | | [X] | | | | | | | | | | |
| **G2** | **GIAI ĐOẠN 2: THIẾT KẾ HỆ THỐNG & CƠ SỞ DỮ LIỆU** | | | | | | | | | | | | | | | | | | |
| 2.1 | Thiết kế Use Case tổng quát, Use Case chi tiết, Sequence Diagram, Sơ đồ lớp (Class Diagram) | **TV1** | Tuần 3 | Tuần 3 | 1 tuần | **Hoàn thành** | Sơ đồ UML & Đặc tả Use Case | | | [X] | | | | | | | | | |
| 2.2 | Thiết kế ERD & CSDL quan hệ (KhachHang, NhanVien, DonHang, SanPham, NhaCungCap...) | **TV3** | Tuần 3 | Tuần 4 | 2 tuần | **Hoàn thành** | Sơ đồ ERD & Data Schema | | | [X] | [X] | | | | | | | |
| 2.3 | Thiết kế Wireframe / Prototype UI (Figma/Template Odoo) cho ứng dụng | **TV2** | Tuần 3 | Tuần 4 | 2 tuần | **Hoàn thành** | Bản mẫu giao diện Prototype | | | [X] | [X] | | | | | | | |
| 2.4 | Review thiết kế CSDL, chuẩn hóa 3NF & kiểm tra Ràng buộc toàn vẹn | **TV3** | Tuần 4 | Tuần 4 | 1 tuần | **Hoàn thành** | Database Review Sheet | | | | [X] | | | | | | | |
| **G3** | **GIAI ĐOẠN 3: PHÁT TRIỂN CÁC PHÂN HỆ CỐT LÕI (THEO SƠ ĐỒ BFD)** | | | | | | | | | | | | | | | | | | |
| 3.1 | Xây dựng Kiến trúc nền tảng 3 lớp (Boundary - Controller - Entity/Storage) | **TV1** | Tuần 5 | Tuần 5 | 1 tuần | **Hoàn thành** | Source Base Project (admin-common.js) | | | | | [X] | | | | | | | |
| 3.2 | **Module 1: Quản lý Sản phẩm Keycap** (CRUD, Danh mục: Artisan, Anime, Pudding, Other, Tồn kho) | **TV3** | Tuần 5 | Tuần 6 | 2 tuần | **Hoàn thành** | Giao diện & Xử lý products.html | | | | | [X] | [X] | | | | | | |
| 3.3 | **Module 2: Quản lý Nhà cung cấp** (CRUD, liên kết sản phẩm, tìm kiếm, xuất Excel) | **TV1** | Tuần 6 | Tuần 7 | 2 tuần | **Hoàn thành** | Giao diện & Xử lý suppliers.html | | | | | | [X] | [X] | | | | | |
| 3.4 | **Module 3: Điểm bán lẻ POS & Đơn hàng** (Mở/đóng phiên, Numpad, Giảm giá %Dic, Thanh toán, In biên lai) | **TV2** | Tuần 6 | Tuần 8 | 3 tuần | **Hoàn thành** | Màn hình POS pos.html & orders.html | | | | | | [X] | [X] | [X] | | | | |
| 3.5 | **Module 4: Quản lý Khách hàng & Nhân viên** (Phân quyền Quản lý vs Thu ngân POS) | **TV3** | Tuần 7 | Tuần 8 | 2 tuần | **Hoàn thành** | Màn hình customers.html & employees.html | | | | | | | [X] | [X] | | | | |
| **G4** | **GIAI ĐOẠN 4: NÂNG CAO, BÁO CÁO THỐNG KÊ & TÍCH HỢP** | | | | | | | | | | | | | | | | | | |
| 4.1 | **Module 5: Đăng nhập & Xác thực hệ thống** (Login phân quyền, bảo vệ route, đổi mật khẩu) | **TV1** | Tuần 9 | Tuần 9 | 1 tuần | **Hoàn thành** | Giao diện & Logic login.html | | | | | | | | | [X] | | | |
| 4.2 | **Module 6: Thống kê Báo cáo** (3 nhánh BFD: Doanh thu, Doanh số, Lợi nhuận, Biểu đồ Chart.js, Xuất Excel) | **TV1** | Tuần 9 | Tuần 10 | 2 tuần | **Hoàn thành** | Dashboard & reports.html | | | | | | | | | [X] | [X] | | |
| 4.3 | Tích hợp Cổng ứng dụng chính (App Launcher Odoo style) & Hoàn thiện luồng dữ liệu end-to-end | **Cả nhóm** | Tuần 10 | Tuần 10 | 1 tuần | **Hoàn thành** | Màn hình app-launcher.html & Build Alpha | | | | | | | | | | [X] | | |
| **G5** | **GIAI ĐOẠN 5: KIỂM THỬ, ĐÓNG GÓI & BÁO CÁO ĐỒ ÁN** | | | | | | | | | | | | | | | | | | |
| 5.1 | Kiểm thử phần mềm (Unit Test, Integration Test, kiểm tra ràng buộc xóa NCC/Đơn hàng) | **TV3** | Tuần 11 | Tuần 11 | 1 tuần | **Hoàn thành** | Báo cáo Kiểm thử & Bug Tracker | | | | | | | | | | | [X] | |
| 5.2 | Tối ưu hóa giao diện (UI/UX), kiểm tra tương thích trình duyệt và thiết bị | **TV2** | Tuần 11 | Tuần 11 | 1 tuần | **Hoàn thành** | Giao diện hoàn thiện chuẩn UX | | | | | | | | | | | [X] | |
| 5.3 | Hoàn thiện Báo cáo Đồ án môn học PTTKHDT (Word / PDF / Slide thuyết trình) | **Cả nhóm** | Tuần 11 | Tuần 12 | 2 tuần | **Hoàn thành** | Báo cáo đồ án PTTKHDT hoàn chỉnh | | | | | | | | | | | [X] | [X] |
| 5.4 | Đóng gói sản phẩm, chuẩn bị kịch bản Demo & Sẵn sàng bảo vệ đồ án | **Cả nhóm** | Tuần 12 | Tuần 12 | 1 tuần | **Hoàn thành** | Bộ sản phẩm hoàn chỉnh 100% | | | | | | | | | | | | [X] |

---

### III. MA TRẬN PHÂN CÔNG TRÁCH NHIỆM RACI CHO 7 CHỨC NĂNG BFD

| Nhánh Chức Năng BFD | Mô Tả Nghiệp Vụ Cụ Thể | TV1 (Danh) | TV2 (Quang) | TV3 (Lộc) |
| :--- | :--- | :---: | :---: | :---: |
| **1. Đăng nhập** | - Form đăng nhập Quản lý & Thu ngân<br>- An/hien mat khau, ghi nho phien<br>- Kiem tra phan quyen truy cap | **R / A** | C | I |
| **2. Quản lý Nhà cung cấp** | - Danh sách NCC, tìm kiếm, xuất Excel<br>- **Tạo Nhà cung cấp**<br>- Sửa, Xóa NCC (ràng buộc toàn vẹn) | **R / A** | I | C |
| **3. Quản lý Đơn hàng** | - Danh sách đơn hàng, lọc ngày, lọc trạng thái<br>- Xóa đơn (chỉ xóa khi Mới/Hủy)<br>- **Tạo Đơn hàng**: Điểm bán lẻ POS tại quầy, Numpad, Giảm giá %Dic, Thanh toán (Cash/Bank), In biên lai | C | **R / A** | C |
| **4. Quản lý Khách hàng** | - Danh sách khách hàng, tìm kiếm, xuất Excel<br>- **Tạo Khách hàng**<br>- Khóa/Mở khóa tài khoản, reset mật khẩu | I | C | **R / A** |
| **5. Quản lý Sản phẩm** | - Danh sách Keycap theo danh mục & khoảng giá<br>- **Tạo Sản phẩm Keycap** (gắn mã NCC, giá vốn, giá bán)<br>- Sửa, Xóa, Quản lý Thể loại Keycap | C | C | **R / A** |
| **6. Quản lý Nhân viên** | - Danh sách nhân viên, thông tin liên lạc<br>- **Tạo Nhân viên mới**<br>- **Phân quyền tài khoản** (Quản lý vs Thu ngân POS) | **A** | I | **R** |
| **7. Thống kê** | - **Doanh thu**: Biểu đồ doanh thu theo thời gian & phương thức TT<br>- **Doanh số**: Số lượng đơn & keycap đã bán, cơ cấu danh mục<br>- **Lợi nhuận**: Lợi nhuận gộp = Doanh thu - Giá vốn nhập NCC | **R / A** | C | I |

---

### IV. KÝ TÊN XÁC NHẬN CỦA CÁC THÀNH VIÊN NHÓM

| Trưởng Nhóm / Backend Lead | Frontend Lead / UI Designer | Database / Tester Lead |
| :---: | :---: | :---: |
| *(Đã ký duyệt)* | *(Đã ký duyệt)* | *(Đã ký duyệt)* |
| **Nguyễn Công Danh**<br>MSSV: 3124410032 | **Trần Nhật Quang**<br>MSSV: 3124410293 | **Lê Hoài Lộc**<br>MSSV: 3122560041 |
