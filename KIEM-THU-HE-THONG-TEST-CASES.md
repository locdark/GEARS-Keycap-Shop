# TRƯỜNG ĐẠI HỌC SÀI GÒN - KHOA CÔNG NGHỆ THÔNG TIN
## BÁO CÁO ĐỒ ÁN MÔN HỌC: PHÂN TÍCH THIẾT KẾ HƯỚNG ĐỐI TƯỢNG (PTTKHDT)
### TÀI LIỆU MA TRẬN KIỂM THỬ HỆ THỐNG & KẾT QUẢ TEST CASES
### ĐỀ TÀI: HỆ THỐNG QUẢN LÝ CỬA HÀNG BÁN KEYCAP (GEARS KEYCAP SHOP)

---

### THÔNG TIN NHÓM SINH VIÊN THỰC HIỆN
- **Nguyễn Công Danh** - MSSV: **3124410032** (Trưởng nhóm / Backend Lead)
- **Trần Nhật Quang** - MSSV: **3124410293** (Frontend & UI/UX Lead)
- **Lê Hoài Lộc** - MSSV: **3122560041** (Database & Tester Lead - Người lập tài liệu)

---

## I. MỤC TIÊU & PHẠM VI KIỂM THỬ (TEST PLAN & SCOPE)

1. **Mục tiêu:**
   - Xác minh toàn bộ các yêu cầu nghiệp vụ đặc tả theo sơ đồ BFD của đồ án.
   - Kiểm tra tính toàn vẹn và an toàn của hệ thống xác thực (mật khẩu chuẩn bảo mật >= 8 ký tự, có chữ in hoa và ký tự đặc biệt).
   - Kiểm tra ràng buộc bất biến: **Đơn hàng đã Hoàn tất (`giaohang` / Done) hoặc Đã hủy (`huy`) KHÔNG ĐƯỢC PHÉP thay đổi trạng thái**.
   - Kiểm tra luồng bán hàng trực tuyến dành cho khách vãng lai: **Thêm vào giỏ hàng và tiến hành thanh toán mà không bắt buộc đăng nhập trước**.
   - Kiểm tra tích hợp cổng thanh toán **SePay VietQR động**, cơ chế **Giả lập Webhook** và tự động cập nhật trạng thái đơn hàng.
   - Kiểm tra việc điều chỉnh tồn kho tự động khi bán POS, đặt hàng online, hủy đơn và nhập kho nhanh.
   - Rà soát toàn bộ mã nguồn tuân thủ quy chuẩn không sử dụng emoji.

2. **Môi trường kiểm thử:**
   - Trình duyệt: Google Chrome 120+, Microsoft Edge.
   - Độ phân giải: 1920x1080 (Desktop), 1366x768 (Laptop), 768x1024 (Tablet), 375x812 (Mobile).
   - Công cụ chạy kiểm thử tự động: Node.js Test Suite Runner (`run-tests.js`).

---

## II. BẢNG MA TRẬN 30 TEST CASES CHI TIẾT

| Mã TC | Phân Hệ / Chức Năng | Kịch Bản Kiểm Thử | Dữ Liệu Đầu Vào | Kết Quả Mong Đợi | Kết Quả Thực Tế | Đánh Giá |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC01** | Xác thực & Bảo mật | Kiểm tra mật khẩu dưới 8 ký tự | `12345` | Báo lỗi: Mật khẩu phải có độ dài tối thiểu 8 ký tự | Từ chối, hiển thị lỗi vi phạm độ dài | **PASSED** |
| **TC02** | Xác thực & Bảo mật | Kiểm tra mật khẩu thiếu chữ in hoa | `admin12345@` | Báo lỗi: Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa | Từ chối, yêu cầu chữ viết hoa | **PASSED** |
| **TC03** | Xác thực & Bảo mật | Kiểm tra mật khẩu thiếu ký tự đặc biệt | `Admin12345` | Báo lỗi: Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt | Từ chối, yêu cầu ký tự đặc biệt | **PASSED** |
| **TC04** | Xác thực & Bảo mật | Kiểm tra mật khẩu quản trị viên hợp lệ | `Admin@123` | Xác thực thành công | Đăng nhập thành công vào Admin | **PASSED** |
| **TC05** | Xác thực & Bảo mật | Kiểm tra mật khẩu nhân viên thu ngân | `Cashier@123` | Xác thực thành công | Đăng nhập thành công vào POS | **PASSED** |
| **TC06** | Quản lý Sản phẩm | Kiểm tra số lượng bộ dữ liệu sản phẩm | Bộ nạp `product` | Có đủ 100 sản phẩm Keycap | Nạp chính xác 100 sản phẩm | **PASSED** |
| **TC07** | Quản lý Sản phẩm | Kiểm tra cơ cấu 5 thể loại Keycap | Mảng 100 items | 25 Artisan, 25 Anime, 20 Pudding, 20 Cherry, 10 Other | Khớp 100% cơ cấu danh mục | **PASSED** |
| **TC08** | Quản lý Sản phẩm | Ràng buộc giá bán và giá vốn | 100 sản phẩm | Giá bán (price) >= Giá vốn (costPrice) > 0 | Tất cả sản phẩm có lãi dương | **PASSED** |
| **TC09** | Quản lý Kho hàng | Điều chỉnh tồn kho nhanh (+10 nút) | Sản phẩm ID 1 | `stock` tăng từ X lên X + 10 | Tồn kho cập nhật tức thì | **PASSED** |
| **TC10** | Quản lý Đơn hàng | Khởi tạo đơn hàng mẫu ban đầu | LocalStorage `orders` | Tối thiểu 4 đơn hàng mẫu | Đầy đủ đơn POS và Online | **PASSED** |
| **TC11** | Ràng buộc Đơn hàng | Đổi trạng thái đơn đã Done sang Xử lý | Đơn `status = 'giaohang'` | Báo lỗi nghiệp vụ, khóa cứng dropdown | Từ chối thay đổi trạng thái | **PASSED** |
| **TC12** | Ràng buộc Đơn hàng | Đổi trạng thái đơn đã Done sang Hủy | Đơn `status = 'giaohang'` | Báo lỗi nghiệp vụ, khóa cứng dropdown | Từ chối thay đổi trạng thái | **PASSED** |
| **TC13** | Ràng buộc Đơn hàng | Đổi trạng thái đơn đã Hủy sang Hoàn tất | Đơn `status = 'huy'` | Báo lỗi nghiệp vụ, khóa cứng dropdown | Từ chối thay đổi trạng thái | **PASSED** |
| **TC14** | Quản lý Đơn hàng | Cập nhật đơn hàng mới sang Đang xử lý | Đơn `status = 'moi'` | Cho phép cập nhật bình thường | Cập nhật trạng thái thành công | **PASSED** |
| **TC15** | Giỏ hàng Khách hàng | Khách chưa đăng nhập thêm vào giỏ | Click 'Thêm vào giỏ' | Lưu giỏ hàng, tăng badge giỏ không chặn | Thêm thành công vào giỏ hàng | **PASSED** |
| **TC16** | Giỏ hàng Khách hàng | Tính tổng tiền giỏ hàng nhiều món | 2 sản phẩm x 2 nút | Tổng tiền = Đơn giá x Số lượng | Tính đúng 100% tổng tiền | **PASSED** |
| **TC17** | Cổng SePay VietQR | Khởi tạo đơn hàng thanh toán SePay | Chọn SePay, bấm Checkout | Đơn lưu trạng thái `xuly`, chờ quét QR | Tạo đơn SePay thành công | **PASSED** |
| **TC18** | Cổng SePay VietQR | Sinh URL mã QR VietQR Napas | Số tiền, STK, Mã đơn | URL chứa đầy đủ `MBBank`, `0987654321`, ST, ND | Sinh mã QR động chuẩn xác | **PASSED** |
| **TC19** | Giả lập Webhook | Kích hoạt giả lập khách chuyển tiền | Bấm nút 'Giả lập SePay' | Khởi chạy webhook mô phỏng ngân hàng | Nhận tín hiệu thành công | **PASSED** |
| **TC20** | Tự động cập nhật | Khớp lệnh thanh toán SePay tự động | Webhook phản hồi | Đơn hàng đổi thành `giaohang` (Done - Khóa) | Tự động hoàn tất và khóa đơn | **PASSED** |
| **TC21** | Cấu hình Website | Tải cấu hình nhận diện ban đầu | LocalStorage `websiteConfig` | Có tên shop, hotline, địa chỉ, slogan | Tải cấu hình mặc định đầy đủ | **PASSED** |
| **TC22** | Cấu hình Website | Lưu và đồng bộ cấu hình thương hiệu | Đổi Hotline: `1900 8888` | Phản ánh lên trang chủ và footer tức thì | Đồng bộ thành công | **PASSED** |
| **TC23** | Giỏ hàng Stepper | Tăng số lượng sản phẩm bằng nút (+) | Bấm nút (+) trên giỏ | Số lượng tăng từ 2 lên 3 | Cập nhật số lượng và tổng tiền | **PASSED** |
| **TC24** | Giỏ hàng Stepper | Giảm số lượng sản phẩm bằng nút (-) | Bấm nút (-) trên giỏ | Số lượng giảm từ 3 xuống 1 | Cập nhật số lượng và tổng tiền | **PASSED** |
| **TC25** | Giỏ hàng Stepper | Xóa sản phẩm khỏi giỏ hàng | Bấm nút thùng rác đỏ | Xóa món, cập nhật lại giỏ hàng | Xóa thành công, giỏ cập nhật | **PASSED** |
| **TC26** | Thanh toán COD | Đặt hàng phương thức tiền mặt tận nơi | Chọn 'COD', điền địa chỉ | Đơn lưu trạng thái `moi`, chờ giao hàng | Tạo đơn COD thành công | **PASSED** |
| **TC27** | Điểm Bán Lẻ POS | Khởi tạo phiên bán hàng POS | Mở `pos.html` | Phiên `status = 'open'`, quỹ ban đầu | Mở phiên POS thành công | **PASSED** |
| **TC28** | Điểm Bán Lẻ POS | Tính chiết khấu %Dic tại quầy | 1,000,000 đ giảm 10% | Số tiền giảm: 100,000 đ, Tổng: 900,000 đ | Khớp chính xác 100% | **PASSED** |
| **TC29** | Quy chuẩn Kỹ thuật | Quét toàn bộ mã nguồn Client | `index.html`, `storefront.js`, `css` | Không chứa bất kỳ ký tự Unicode emoji nào | 0 emoji phát hiện | **PASSED** |
| **TC30** | Quy chuẩn Kỹ thuật | Quét toàn bộ mã nguồn Admin | `dashboard.html`, `settings.html`, `pos` | Không chứa bất kỳ ký tự Unicode emoji nào | 0 emoji phát hiện | **PASSED** |
| **TC31** | OOP Singleton | Kiểm tra tính độc bản StorageService | `StorageService.getInstance()` | `storage1 === storage2` duy nhất 1 thể hiện | Áp dụng đúng Singleton Pattern | **PASSED** |
| **TC32** | OOP AuthService | Đăng nhập Admin và lưu phiên | `AuthService.login('admin', 'Admin@123')` | Trả về session hợp lệ, đúng vai trò admin | Đăng nhập và phân quyền chuẩn | **PASSED** |
| **TC33** | OOP ProductService | Lọc danh mục sản phẩm Artisan | `ProductService.filterByCategory('Artisan')` | Trả về chính xác 25 sản phẩm thuộc danh mục | Khớp 25 sản phẩm Artisan | **PASSED** |
| **TC34** | OOP CartService | Thêm 2 sản phẩm vào giỏ không login | `CartService.addItem(1, 2)` | Giỏ hàng lưu trữ 2 sản phẩm hợp lệ | Thêm vào giỏ thành công | **PASSED** |
| **TC35** | OOP OrderService | Khóa trạng thái đơn hàng nghiêm ngặt | Đơn `giaohang`, cập nhật sang `choxuly` | Bị từ chối và cờ `isLocked = true` | Khóa cứng trạng thái đơn Done | **PASSED** |
| **TC36** | OOP ReportService | Tính toán báo cáo tài chính & lợi nhuận | `ReportService.getFinancialSummary()` | Doanh thu >= 0, Lợi nhuận gộp >= 0 | Tính toán tài chính chính xác | **PASSED** |
| **TC37** | OOP Facade Pattern | Kiểm tra tích hợp Master GearsApp Facade | `GearsApp.getInstance()` | Đồng bộ đầy đủ 11 Module OOP hệ thống | Tích hợp Master Facade thành công | **PASSED** |
| **TC38** | OOP Đóng gói | Kiểm tra Encapsulation & BaseEntity | `Product(101, ..., 1200000, 750000)` | Tính đúng biên lợi nhuận (37.5%) & định dạng tiền | Đóng gói nghiệp vụ chính xác | **PASSED** |
| **TC39** | OOP Kế thừa | Kiểm tra Inheritance đa cấp | `Customer`, `Employee` kế thừa `User` | Kế thừa thuộc tính và phương thức từ User | Kiểm tra `instanceof` hợp lệ | **PASSED** |
| **TC40** | OOP Đa hình | Ghi đè phương thức getRoleName | Gọi `getRoleName()` trên Customer, Employee | Trả về đúng 'Khách hàng', 'Quản trị viên', 'Thu ngân' | Đa hình phương thức chính xác | **PASSED** |
| **TC41** | OOP Composition | DonHang chứa danh sách ChiTietDonHang | `Order` tổng hợp danh sách `OrderItem` | Tính đúng Tổng tiền (1.25M), Giá vốn (780K), Lợi nhuận (470K) | Cấu trúc Composition chuẩn UML | **PASSED** |
| **TC42** | OOP Vòng đời Đơn | Đổi trạng thái hợp lệ sang 'danggiao' | `oAggregate.transitionTo('danggiao')` | Chuyển trạng thái thành công | Chuyển trạng thái mượt mà | **PASSED** |
| **TC43** | OOP Tự động Khóa | Chuyển sang 'giaohang' tự động khóa | `oAggregate.transitionTo('giaohang')` | Tự động chuyển `isLocked = true`, `paid` | Khóa đơn hàng tự động | **PASSED** |
| **TC44** | OOP Bảo vệ Trạng thái | Từ chối sửa đơn đã khóa về 'choxuly' | `oAggregate.transitionTo('choxuly')` | Từ chối tuyệt đối, trả về lỗi khóa đơn | Bảo vệ tính toàn vẹn dữ liệu | **PASSED** |
| **TC45** | OOP Factory Pattern | Khởi tạo qua EntityFactory | `EntityFactory.createProduct()`, `createOrder()` | Sinh ra đúng thực thể Product và Order hợp lệ | Khởi tạo đối tượng chuẩn Factory | **PASSED** |
| **TC46** | OOP Strategy Pattern | Chiến lược thanh toán đa dạng | `PaymentStrategy`: VietQR và Tiền mặt | VietQR sinh link SePay, Tiền mặt tính tiền thối | Áp dụng đúng Strategy Pattern | **PASSED** |
| **TC47** | OOP Observer Pattern | Đăng ký lắng nghe sự kiện Storage | `storage.subscribe()` nhận cập nhật tự động | Nhận dữ liệu thay đổi tức thì | Phản hồi sự kiện Pub-Sub chuẩn | **PASSED** |
| **TC48** | OOP Logic Nghiệp vụ | Điều chỉnh tồn kho hợp lệ & chặn tồn âm | `adjustStock(-5)` và `adjustStock(-50)` | Cho phép trừ trong hạn mức, từ chối số lượng âm | Ràng buộc tồn kho toàn vẹn | **PASSED** |

---

## III. TỔNG KẾT & ĐÁNH GIÁ CHẤT LƯỢNG

```
==============================================================================
THỐNG KÊ KẾT QUẢ KIỂM THỬ TỰ ĐỘNG (AUTOMATED TEST SUITE):
- Tổng số Test Cases:    48 / 48
- Số test đạt (PASSED):  48 (Tỷ lệ: 100%)
- Số test hỏng (FAILED): 0 (Tỷ lệ: 0%)
- Tuân thủ quy định:     0 Unicode Emoji trên toàn bộ hệ thống
- Khớp chuẩn CSDL thật:  100% tương thích database_keycap_shop.sql
==============================================================================
```

### KẾT LUẬN:
Hệ thống **GEARS Keycap Shop** đã vượt qua 100% các bài kiểm thử nghiêm ngặt (48/48 Test Cases), đảm bảo tính nhất quán dữ liệu, chuẩn mực nghiệp vụ bán hàng, an toàn bảo mật mật khẩu, độ tin cậy của cổng thanh toán trực tuyến SePay VietQR, và tuân thủ chặt chẽ 4 trụ cột OOP cùng 6 GoF Design Patterns. Toàn bộ thiết kế cơ sở dữ liệu đồng bộ hoàn hảo với CSDL thật `database_keycap_shop.sql`. Sản phẩm hoàn toàn sẵn sàng cho báo cáo và bảo vệ đồ án môn học PTTKHDT tại Trường Đại học Sài Gòn (SGU).
