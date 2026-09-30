# HUONG DAN HE THONG DO AN PTTKHDT - GEARS KEYCAP SHOP
### De tai: Quan ly cua hang ban keycap
**Khoa Cong nghe Thong tin - Truong Dai hoc Sai Gon (SGU)**

---

### THANH VIEN NHOM THUC HIEN:
1. **Nguyen Cong Danh** - MSSV: **3124410032** (Truong nhom / Backend Lead)
2. **Tran Nhat Quang** - MSSV: **3124410293** (Frontend Lead / UI Designer)
3. **Le Hoai Loc** - MSSV: **3122560041** (Database / Tester Lead)

---

## DA HOAN TAT 100% CAC PHAN HE THEO SO DO CHUC NANG BFD:

```
                          Quan ly cua hang ban keycap
                                       │
   ┌───────────┬─────────────┬─────────┴────────┬────────────┬─────────────┬──────────┐
   │           │             │                  │            │             │          │
Dang nhap   Quan ly       Quan ly            Quan ly      Quan ly       Quan ly    Thong ke
           nha cung cap   don hang          khach hang   san pham      nhan vien      │
               │             │                  │            │             │     ┌────┼────┐
            Tao NCC       Tao DH              Tao KH       Tao SP       Tao NV   │    │    │
                        (Diem POS)                                         │    Doanh Doanh Loi
                                                                      Phan quyen  thu  so  nhuan
```

### 1. Cong Ung Dung (App Launcher Odoo style) - app-launcher.html
- Thiet ke chuan ERP theo muc 6.1 (trang 36) tai lieu PTTKHDT.
- Cong truy cap tap trung tat ca cac phan he: POS, Don hang, San pham, Nha cung cap, Khach hang, Nhan vien, Bao cao va Web Store.

### 2. Phan he Dang nhap & Xac thuc - login.html (Nhanh BFD 1 & Use Case 2.7)
- Dang nhap bao mat, ho tro an/hien mat khau.
- Tai khoan quan ly: `admin` / `admin123` (Toan quyen).
- Tai khoan thu ngan: `cashier` / `cashier123` (Ban hang POS tai quay).

### 3. Phan he Quan ly Nha cung cap - suppliers.html (Nhanh BFD 2 & Use Case 2.1)
- Hien thi danh sach doi tac cung cap phim (Akko, Keychron, Jelly Key, HolyOOPS...).
- Tao Nha cung cap: Form modal them moi NCC.
- Sua & Xoa NCC: Rang buoc toan ven: Khong cho phep xoa neu NCC dang co san pham lien ket (theo dung dac ta PTTKHDT).
- Xuat toan bo danh sach ra file Excel.

### 4. Phan he Quan ly Don hang & POS Ban le - orders.html & pos.html (Nhanh BFD 3)
- Diem ban le POS (pos.html):
  * Quan ly phien lam viec thu ngan tai quay.
  * Bo loc danh muc Keycap, tim kiem, luoi san pham co anh, gia, ton kho.
  * Ban phim so Numpad ao (chinh so luong Qty, ap chiet khau %Dic).
  * Chon khach hang than thiet hoac khach vang lai.
  * Thanh toan da phuong thuc: Tien mat (Cash), Chuyen khoan (Bank), Tai khoan KH.
  * Tu dong tinh tien thoi lai cho khach.
  * In hoa don bien lai (Receipt) chuyen nghiep va nut tao don moi.
- Quan ly Don hang (orders.html):
  * Dong bo don hang tu ca Diem ban le POS va Web khach hang Online.
  * Loc theo khoang thoi gian, trang thai (Moi, Dang xu ly, Hoan thanh, Huy).
  * Xem chi tiet tung mon hang trong don.
  * Rang buoc xoa don: Chi cho phep xoa khi don o trang thai "Moi dat" hoac "Da huy".
  * Xuat danh sach don hang ra file Excel.

### 5. Phan he Quan ly Khach hang - customers.html (Nhanh BFD 4 & Use Case 2.3)
- Danh sach khach hang voi tong chi tieu tich luy tu dong tinh tu cac don hang.
- Tao Khach hang moi: Form modal them ho so khach hang.
- Khoa / Mo khoa tai khoan, reset mat khau, tim kiem va Xuat Excel.

### 6. Phan he Quan ly San pham Keycap - products.html (Nhanh BFD 5 & Use Case 2.5)
- Quan ly danh muc Keycap: Artisan, Anime, Pudding, Other...
- Lien ket ma Nha cung cap (ID_NCC), quan ly gia von nhap, gia ban va so luong ton kho.
- Tao San pham Keycap: Form modal them moi co chon Nha cung cap tu danh sach doi tac.
- Tim kiem, loc theo the loai & khoang gia, phan trang va Xuat Excel.

### 7. Phan he Quan ly Nhan vien & Phan quyen - employees.html (Nhanh BFD 6 & Use Case 2.4)
- Danh sach can bo nhan vien, thong tin lien lac, chuc vu.
- Tao Nhan vien moi: Cap tai khoan dang nhap cho nhan vien.
- Phan quyen tai khoan: Cap nhat vai tro Quan ly (Admin) hoac Nhan vien Ban hang (Thu ngan POS), khoa/mo khoa quyen truy cap.
- Xuat Excel danh sach nhan su.

### 8. Phan he Thong ke Bao cao - reports.html (Nhanh BFD 7 & Muc 6.13)
- Doanh thu: Tong doanh thu thuc te, bieu do doanh thu theo ngay/thang.
- Doanh so: Tong so don hang, tong so keycap ban ra, bieu do tron phan bo danh muc.
- Loi nhuan: Loi nhuan gop = Doanh thu - Tong gia von nhap hang tu NCC; hien thi ty suat loi nhuan (%).
- Bang vinh danh Top 5 san pham Keycap ban chay nhat.
- Xuat bao cao thong ke phan tich ra file Excel.

### 9. Co so du lieu quan he chuan PTTKHDT - database_keycap_shop.sql
- Script SQL day du 8 bang: NhaCungCap, SanPham, KhachHang, NhanVien, DangNhap, DonHang, ChiTietDonHang, BaoCao, ChiTietBaoCao.
- Khoa chinh, khoa ngoai, rang buoc toan ven du lieu.
- Bo du lieu mau phong phu tuong thich hoan toan phpMyAdmin (XAMPP) va MySQL.

---

## DANH MUC FILE TRONG HE THONG:

```
GEARS-Shop-Main-Project/
├── index.html                      <- Web mua sam truc tuyen cho Khach hang (GearVN Theme)
├── database_keycap_shop.sql        <- Script CSDL MySQL chuan 8 bang PTTKHDT
├── BANG-PHAN-CONG-CHI-TIET.md      <- Phan cong vai tro & Gantt chart 12 tuan
├── README.md                       <- Gioi thieu do an mon hoc
└── assets/
    └── Admin/
        ├── app-launcher.html       <- CONG UNG DUNG ODOO STYLE (Man hinh chinh)
        ├── dashboard.html          <- Bang dieu khien tong quan 5 chi so
        ├── login.html              <- Dang nhap & phan quyen nhan vien
        ├── pos.html                <- DIEM BAN LE POS (Ban hang tai quay & In bill)
        ├── orders.html             <- Quan ly don hang (Loc & Xuat Excel)
        ├── products.html           <- Quan ly san pham Keycap (Gan NCC & Gia von)
        ├── suppliers.html          <- Quan ly Nha cung cap (Tao NCC & Rang buoc)
        ├── customers.html          <- Quan ly Khach hang (Tao KH & Tich diem)
        ├── employees.html          <- Quan ly Nhan vien & Phan quyen tai khoan
        ├── reports.html            <- BAO CAO THONG KE (Doanh thu - Doanh so - Loi nhuan)
        ├── css/
        │   └── style.css          <- CSS he thong quan tri
        └── script/
            ├── admin-common.js    <- Core Data & Utilities dung chung
            ├── dashboard.js       <- Logic trang tong quan
            ├── pos.js             <- Logic Diem ban le POS & In hoa don
            ├── orders.js          <- Logic Don hang & dong bo CartList
            ├── products-admin.js  <- Logic San pham Keycap & NCC
            ├── suppliers.js       <- Logic Nha cung cap
            ├── customers.js       <- Logic Khach hang
            ├── employees.js       <- Logic Nhan vien & Phan quyen
            └── reports.js         <- Logic Thong ke & Bieu do Chart.js
```
