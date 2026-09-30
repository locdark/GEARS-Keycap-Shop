// ============================================================================
// DATASET 100 SAN PHAM KEYCAP CHINH HANG (CAU HINH TU CAC SHOP KEYCAP NOI TIENG)
// Nguon cam hung: Akko Gear, Jelly Key, Dwarf Factory, Keychron, GMK, KBDfans, Drop
// Khong su dung emoji
// ============================================================================

const KEYCAP_100_PRODUCTS = [
    // --- NHOM 1: ARTISAN RESIN THU CONG CAO CAP (IDs 1 - 25) ---
    {
        id: 1,
        name: "Sun Goddess Shrine Artisan Keycap",
        type: "Artisan",
        supplierId: "NCC03",
        costPrice: 520000,
        price: 825000,
        stock: 12,
        img: "./assets/img/Products/Artisan/001.jpg",
        description: "Keycap nghe thuat den than mat troi duc nhua resin thu cong tinh xao 1U SA profile."
    },
    {
        id: 2,
        name: "Galaxy Space Nebula Artisan Keycap",
        type: "Artisan",
        supplierId: "NCC03",
        costPrice: 500000,
        price: 800000,
        stock: 8,
        img: "./assets/img/Products/Artisan/002.jpg",
        description: "Keycap hieu ung dai ngan ha huyen ao ket hop bot da quang phat sang trong dem."
    },
    {
        id: 3,
        name: "Koi Fish Natural Pond 3D Artisan Keycap",
        type: "Artisan",
        supplierId: "NCC03",
        costPrice: 350000,
        price: 545000,
        stock: 15,
        img: "./assets/img/Products/Artisan/003.jpg",
        description: "Ho ca Koi boi loi song dong, hieu ung nuoc trong suot duc thu cong da lop."
    },
    {
        id: 4,
        name: "Interstellar Deep Universe Keycap",
        type: "Artisan",
        supplierId: "NCC03",
        costPrice: 600000,
        price: 930000,
        stock: 6,
        img: "./assets/img/Products/Artisan/004.jpg",
        description: "Tac pham du hanh vu tru Interstellar, vien phi thuyen sieu chi tiet."
    },
    {
        id: 5,
        name: "Cute Cat Paw Silicone Artisan Keycap",
        type: "Artisan",
        supplierId: "NCC04",
        costPrice: 110000,
        price: 188000,
        stock: 25,
        img: "./assets/img/Products/Artisan/005.jpg",
        description: "Chan meo dem silicone mem mai tao cam giac nhan em tay de thuong."
    },
    {
        id: 6,
        name: "Mega Charizard X Fire Dragon Keycap",
        type: "Artisan",
        supplierId: "NCC04",
        costPrice: 180000,
        price: 295000,
        stock: 14,
        img: "./assets/img/Products/Artisan/006.jpg",
        description: "Rong lua Mega Charizard tao hinh kim loai phu son tinh dien cao cap."
    },
    {
        id: 7,
        name: "Devil Fruit One Piece Resin Keycap",
        type: "Artisan",
        supplierId: "NCC03",
        costPrice: 620000,
        price: 940000,
        stock: 10,
        img: "./assets/img/Products/Artisan/007.jpg",
        description: "Trai ac quy Mera Mera no Mi xuyen sang LED trong suot sieu dep."
    },
    {
        id: 8,
        name: "Re:Zero Rem Crystal Artisan Keycap",
        type: "Artisan",
        supplierId: "NCC03",
        costPrice: 420000,
        price: 675000,
        stock: 9,
        img: "./assets/img/Products/Artisan/008.jpg",
        description: "Nhan vat nu hau Rem hoa than trong khoi pha le resin huyen ao."
    },
    {
        id: 9,
        name: "Totoro Natural Landscape Waterfall Keycap",
        type: "Artisan",
        supplierId: "NCC03",
        costPrice: 480000,
        price: 760000,
        stock: 11,
        img: "./assets/img/Products/Artisan/009.jpg",
        description: "Khu rung Totoro va thac nuoc thu nho moc mac tho mong."
    },
    {
        id: 10,
        name: "Iron Man Arc Reactor Metal Keycap",
        type: "Artisan",
        supplierId: "NCC04",
        costPrice: 320000,
        price: 490000,
        stock: 16,
        img: "./assets/img/Products/Artisan/010.jpg",
        description: "Lo phan ung ho quang cua Iron Man lam bang hop kim nhom CNC xuyen LED."
    },
    {
        id: 11,
        name: "Dwarf Factory Terrarium Eden Keycap",
        type: "Artisan",
        supplierId: "NCC03",
        costPrice: 750000,
        price: 1150000,
        stock: 7,
        img: "./assets/img/Products/Artisan/001.jpg",
        description: "He sinh thai thuc vat co thu nho ben trong khoi thuy tinh DOM profile."
    },
    {
        id: 12,
        name: "Dwarf Factory Gnarly Koala Artisan",
        type: "Artisan",
        supplierId: "NCC03",
        costPrice: 780000,
        price: 1200000,
        stock: 5,
        img: "./assets/img/Products/Artisan/002.jpg",
        description: "Chu gau Koala huyen bi voi mat ngoc tinh xao va canh cay tram huong."
    },
    {
        id: 13,
        name: "Dwarf Factory The Great Duckie",
        type: "Artisan",
        supplierId: "NCC03",
        costPrice: 690000,
        price: 1050000,
        stock: 8,
        img: "./assets/img/Products/Artisan/003.jpg",
        description: "Chu vit vang khong lo phieu luu giua dai duong bao la."
    },
    {
        id: 14,
        name: "Jelly Key Dragons of Eden 2.0",
        type: "Artisan",
        supplierId: "NCC03",
        costPrice: 950000,
        price: 1490000,
        stock: 4,
        img: "./assets/img/Products/Artisan/004.jpg",
        description: "Rong chau A uy nghi uon luon duoi song hoa thach anh da sac."
    },
    {
        id: 15,
        name: "Jelly Key Retro TV Arcade Series",
        type: "Artisan",
        supplierId: "NCC03",
        costPrice: 850000,
        price: 1350000,
        stock: 6,
        img: "./assets/img/Products/Artisan/007.jpg",
        description: "Man hinh tivi thap nien 80 hien thi tro choi dien tu co dien."
    },
    {
        id: 16,
        name: "HolyOOPS Captain America Shield CNC",
        type: "Artisan",
        supplierId: "NCC04",
        costPrice: 380000,
        price: 590000,
        stock: 18,
        img: "./assets/img/Products/Artisan/010.jpg",
        description: "Khien doi truong My gia cong nhom nguyen khoi son anot hoa ben mau."
    },
    {
        id: 17,
        name: "HolyOOPS Thor Mjolnir Hammer Keycap",
        type: "Artisan",
        supplierId: "NCC04",
        costPrice: 420000,
        price: 650000,
        stock: 12,
        img: "./assets/img/Products/Artisan/010.jpg",
        description: "Bua set Mjolnir dat tren be da titan, khac laser tinh xao."
    },
    {
        id: 18,
        name: "Cyberpunk Oni Mask Resin Artisan",
        type: "Artisan",
        supplierId: "NCC04",
        costPrice: 490000,
        price: 780000,
        stock: 10,
        img: "./assets/img/Products/Artisan/008.jpg",
        description: "Mat na quy Oni phong cach Cyberpunk 2077 voi cap sung nhon."
    },
    {
        id: 19,
        name: "Gengar Shadow Pokemon Resin Keycap",
        type: "Artisan",
        supplierId: "NCC03",
        costPrice: 380000,
        price: 590000,
        stock: 20,
        img: "./assets/img/Products/Artisan/006.jpg",
        description: "Bong ma Gengar doi mat do phat quang huyen bi trong bong toi."
    },
    {
        id: 20,
        name: "Snorlax Sleeping Meadow Keycap",
        type: "Artisan",
        supplierId: "NCC03",
        costPrice: 360000,
        price: 560000,
        stock: 14,
        img: "./assets/img/Products/Artisan/009.jpg",
        description: "Chu Snorlax nam ngu tren dong co hoa vang cuc de thuong."
    },
    {
        id: 21,
        name: "Mount Fuji Snowy Peak Resin Keycap",
        type: "Artisan",
        supplierId: "NCC03",
        costPrice: 410000,
        price: 640000,
        stock: 15,
        img: "./assets/img/Products/Artisan/001.jpg",
        description: "Nui Phu Si phu tuyet trang mua xuan hoa anh dao roi tho mong."
    },
    {
        id: 22,
        name: "Ancient Dragon Skull Bone Artisan",
        type: "Artisan",
        supplierId: "NCC04",
        costPrice: 450000,
        price: 720000,
        stock: 9,
        img: "./assets/img/Products/Artisan/002.jpg",
        description: "Hop so rong co dai son gia co danh cho tin do Gothic ngau loi."
    },
    {
        id: 23,
        name: "Samurai Kabuto Helmet Titanium Keycap",
        type: "Artisan",
        supplierId: "NCC04",
        costPrice: 550000,
        price: 880000,
        stock: 8,
        img: "./assets/img/Products/Artisan/010.jpg",
        description: "Mu giap chien binh Samurai Nhat Ban phay CNC sac sao."
    },
    {
        id: 24,
        name: "Astronaut Moon Walking Space Keycap",
        type: "Artisan",
        supplierId: "NCC03",
        costPrice: 530000,
        price: 840000,
        stock: 12,
        img: "./assets/img/Products/Artisan/004.jpg",
        description: "Phi hanh gia buoc di tren be mat mat trang vo vang bong nho."
    },
    {
        id: 25,
        name: "Cybernetic Mechanical Heart Resin Keycap",
        type: "Artisan",
        supplierId: "NCC04",
        costPrice: 620000,
        price: 980000,
        stock: 7,
        img: "./assets/img/Products/Artisan/007.jpg",
        description: "Trai tim may moc banh rang co khi chuyen dong theo nhip go."
    },

    // --- NHOM 2: ANIME / MANGA PBT DYESUB (IDs 26 - 50) ---
    {
        id: 26,
        name: "Kimetsu no Yaiba Tanjiro & Nezuko Keycap Set",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 480000,
        price: 745000,
        stock: 22,
        img: "./assets/img/Products/Anime/014.png",
        description: "Bo keycap 108 phim hoa tiet caro xanh den va hoa van kimono Nezuko."
    },
    {
        id: 27,
        name: "Re:Zero Starting Life in Another World Set",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 490000,
        price: 750000,
        stock: 18,
        img: "./assets/img/Products/Anime/015.png",
        description: "Set keycap Rem & Ram tong mau xanh ngoc va hong pastel cuc cuon hut."
    },
    {
        id: 28,
        name: "Pokemon Bulbasaur Forest Garden Keycap Set",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 510000,
        price: 790000,
        stock: 16,
        img: "./assets/img/Products/Anime/016.png",
        description: "Bo keycap Pokemon Ech Dieu Ky song ngu Nhat - Anh in nhiet PBT."
    },
    {
        id: 29,
        name: "Pokemon Charmander Fire Blaze Keycap Set",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 510000,
        price: 790000,
        stock: 15,
        img: "./assets/img/Products/Anime/017.png",
        description: "Set keycap lua cam ruc ro chu de Pokemon Khung Long Lua Charmander."
    },
    {
        id: 30,
        name: "Pokemon Squirtle Water Splash Keycap Set",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 510000,
        price: 790000,
        stock: 19,
        img: "./assets/img/Products/Anime/018.png",
        description: "Set keycap Pokemon Rua Squirtle sac xanh mat diu em ai."
    },
    {
        id: 31,
        name: "Hatsune Miku Vocaloid 01 Limited Edition",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 450000,
        price: 690000,
        stock: 14,
        img: "./assets/img/Products/Anime/019.jpeg",
        description: "Keycap Hatsune Miku tong mau xanh ngoc biec voi font chu so digital."
    },
    {
        id: 32,
        name: "Akko Dragon Ball Super Goku Ultra Instinct",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 580000,
        price: 890000,
        stock: 17,
        img: "./assets/img/Products/Anime/014.png",
        description: "Bo keycap Son Goku Ban Nang Vo Cuc chinh hang Akko JDA profile."
    },
    {
        id: 33,
        name: "Akko Dragon Ball Super Vegeta Super Saiyan Blue",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 580000,
        price: 890000,
        stock: 12,
        img: "./assets/img/Products/Anime/015.png",
        description: "Hoang tu Saiyan Vegeta trang phuc giap chien xanh vang manh me."
    },
    {
        id: 34,
        name: "One Piece Straw Hat Pirates Wano Kuni Set",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 520000,
        price: 820000,
        stock: 25,
        img: "./assets/img/Products/Anime/016.png",
        description: "Bang Hai Tac Mu Rom tai Wano quoc voi hoa van truyen thong Nhat."
    },
    {
        id: 35,
        name: "One Piece Luffy Gear 5 Sun God Nika Keycap",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 550000,
        price: 860000,
        stock: 30,
        img: "./assets/img/Products/Anime/017.png",
        description: "Luffy trang thai Than Mat Troi Nika trang tinh ruc sang Cherry profile."
    },
    {
        id: 36,
        name: "Naruto Shippuden Akatsuki Cloud Keycap Set",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 500000,
        price: 790000,
        stock: 24,
        img: "./assets/img/Products/Anime/018.png",
        description: "Dam may do Akatsuki tren nen den bi an danh cho tin do Ninja."
    },
    {
        id: 37,
        name: "Naruto Uzumaki Sage Mode Orange Set",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 480000,
        price: 760000,
        stock: 15,
        img: "./assets/img/Products/Anime/019.jpeg",
        description: "Naruto trang thai Tien Nhan Thuat voi sac cam bieu tuong."
    },
    {
        id: 38,
        name: "Jujutsu Kaisen Gojo Satoru Infinity Set",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 560000,
        price: 880000,
        stock: 28,
        img: "./assets/img/Products/Anime/014.png",
        description: "Thay Gojo Satoru Vô Lượng Không Xứ mat xanh bac quyen ru."
    },
    {
        id: 39,
        name: "Jujutsu Kaisen Sukuna Ryomen Cursed King",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 540000,
        price: 850000,
        stock: 14,
        img: "./assets/img/Products/Anime/015.png",
        description: "Vua loi nguyen Sukuna hinh xam co dai sac do den ac liet."
    },
    {
        id: 40,
        name: "Chainsaw Man Denji & Pochita Orange Keycaps",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 490000,
        price: 780000,
        stock: 20,
        img: "./assets/img/Products/Anime/016.png",
        description: "Quy cua Pochita va Denji hoa tiet cam den phong cach Manga."
    },
    {
        id: 41,
        name: "Spy x Family Anya Forger Peanuts Keycap",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 460000,
        price: 720000,
        stock: 26,
        img: "./assets/img/Products/Anime/017.png",
        description: "Be Anya Forger bieu cam waku waku sieu yeu mau hong phan."
    },
    {
        id: 42,
        name: "Attack on Titan Survey Corps Wings of Freedom",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 520000,
        price: 820000,
        stock: 17,
        img: "./assets/img/Products/Anime/018.png",
        description: "Doi Trinh Sat canh chim tu do Levi va Eren mau xanh reu quan doi."
    },
    {
        id: 43,
        name: "Neon Genesis Evangelion EVA-01 Unit Purple",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 590000,
        price: 920000,
        stock: 15,
        img: "./assets/img/Products/Anime/019.jpeg",
        description: "Robot EVA-01 phoi mau tim neon va xanh la doc nhat vo nhi."
    },
    {
        id: 44,
        name: "Genshin Impact Raiden Shogun Electro Archon",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 570000,
        price: 890000,
        stock: 21,
        img: "./assets/img/Products/Anime/014.png",
        description: "Loi Than Raiden Ei tia set tim Inazuma sang trong quy phai."
    },
    {
        id: 45,
        name: "Genshin Impact Hu Tao Funeral Director",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 550000,
        price: 870000,
        stock: 23,
        img: "./assets/img/Products/Anime/015.png",
        description: "Hu Tao tiem ma hoa mai do dam hoa buom tinh nghich."
    },
    {
        id: 46,
        name: "Genshin Impact Ganyu Qilin Frost Set",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 540000,
        price: 860000,
        stock: 16,
        img: "./assets/img/Products/Anime/016.png",
        description: "Ganyu bang tuyet nu than Ky Lan mau xanh pastel tinh khiet."
    },
    {
        id: 47,
        name: "Cyberpunk Edgerunners Lucy & David Moonlight",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 580000,
        price: 910000,
        stock: 13,
        img: "./assets/img/Products/Anime/017.png",
        description: "Chuyen tinh mat trang Night City phoi mau neon ruc ro."
    },
    {
        id: 48,
        name: "Tokyo Ghoul Kaneki Ken Awakening Centipede",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 500000,
        price: 790000,
        stock: 18,
        img: "./assets/img/Products/Anime/018.png",
        description: "Kaneki Ken toc trang mat na gieo rac noi kinh hoang."
    },
    {
        id: 49,
        name: "Fate/Stay Night Saber Excalibur Gold Set",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 560000,
        price: 880000,
        stock: 15,
        img: "./assets/img/Products/Anime/019.jpeg",
        description: "Vua Arthur Saber Excalibur thanh kiem chien thang sac xanh lam."
    },
    {
        id: 50,
        name: "Bleach Kurosaki Ichigo Bankai Hollow Set",
        type: "Anime",
        supplierId: "NCC01",
        costPrice: 510000,
        price: 810000,
        stock: 19,
        img: "./assets/img/Products/Anime/014.png",
        description: "Ichigo mat na Hollow tram toa tram luan Bankai mau den cam."
    },

    // --- NHOM 3: PUDDING XUYEN SANG LED RGB (IDs 51 - 70) ---
    {
        id: 51,
        name: "Keycap PBT Pudding Black LED RGB",
        type: "Pudding",
        supplierId: "NCC02",
        costPrice: 210000,
        price: 350000,
        stock: 45,
        img: "./assets/img/Products/Pudding/011.jpg",
        description: "Set keycap banhbong Pudding den chan trang xuyen LED ruc ro."
    },
    {
        id: 52,
        name: "Keycap PBT Pudding Pure White LED",
        type: "Pudding",
        supplierId: "NCC02",
        costPrice: 210000,
        price: 350000,
        stock: 50,
        img: "./assets/img/Products/Pudding/012.jpg",
        description: "Set Pudding trang tinh khoi doubleshot khong bao gio bi mo chu."
    },
    {
        id: 53,
        name: "Keycap PBT Pudding Sweet Pink Cherry",
        type: "Pudding",
        supplierId: "NCC02",
        costPrice: 220000,
        price: 360000,
        stock: 35,
        img: "./assets/img/Products/Pudding/013.jpg",
        description: "Pudding hong phan nu tinh danh cho goc may gaming cong chua."
    },
    {
        id: 54,
        name: "Keycap PBT Pudding Sky Blue Ocean",
        type: "Pudding",
        supplierId: "NCC02",
        costPrice: 220000,
        price: 360000,
        stock: 28,
        img: "./assets/img/Products/Pudding/blue.jpg",
        description: "Pudding xanh da troi pastel tao cam giac mat me thoai mai."
    },
    {
        id: 55,
        name: "Keycap PBT Pudding Lavender Purple",
        type: "Pudding",
        supplierId: "NCC02",
        costPrice: 220000,
        price: 360000,
        stock: 30,
        img: "./assets/img/Products/Pudding/purple.jpg",
        description: "Pudding tim oai huong thanh lich ton dang den LED pham ban phat."
    },
    {
        id: 56,
        name: "Keycap PBT Pudding Fiery Red Crimson",
        type: "Pudding",
        supplierId: "NCC02",
        costPrice: 220000,
        price: 360000,
        stock: 22,
        img: "./assets/img/Products/Pudding/red.jpg",
        description: "Pudding do lua dam chat gaming chien binh ruc lua dam me."
    },
    {
        id: 57,
        name: "HyperX Pudding Keycaps Black PBT",
        type: "Pudding",
        supplierId: "NCC02",
        costPrice: 380000,
        price: 590000,
        stock: 25,
        img: "./assets/img/Products/Pudding/011.jpg",
        description: "Bo keycap Pudding chinh hang HyperX font chu doc quyen ro net."
    },
    {
        id: 58,
        name: "HyperX Pudding Keycaps White PBT",
        type: "Pudding",
        supplierId: "NCC02",
        costPrice: 380000,
        price: 590000,
        stock: 28,
        img: "./assets/img/Products/Pudding/012.jpg",
        description: "HyperX Pudding ban trang tuyet dep cho ban phim HyperX Alloy."
    },
    {
        id: 59,
        name: "SteelSeries PrismCaps Universal Pudding",
        type: "Pudding",
        supplierId: "NCC02",
        costPrice: 420000,
        price: 650000,
        stock: 20,
        img: "./assets/img/Products/Pudding/011.jpg",
        description: "Keycap banh bong cao cap cua SteelSeries tuong thich Apex Pro."
    },
    {
        id: 60,
        name: "Glorious Aura Keycaps V2 Black",
        type: "Pudding",
        supplierId: "NCC02",
        costPrice: 450000,
        price: 690000,
        stock: 18,
        img: "./assets/img/Products/Pudding/011.jpg",
        description: "Glorious Aura the he 2 chong bam van tay hieu ung anh sang vo cuc."
    },
    {
        id: 61,
        name: "Glorious Aura Keycaps V2 White",
        type: "Pudding",
        supplierId: "NCC02",
        costPrice: 450000,
        price: 690000,
        stock: 19,
        img: "./assets/img/Products/Pudding/012.jpg",
        description: "Bo keycap Glorious trang ngoc trai chat lieu PBT day 1.5mm."
    },
    {
        id: 62,
        name: "XVX Low Profile Pudding Keycaps Set",
        type: "Pudding",
        supplierId: "NCC02",
        costPrice: 310000,
        price: 490000,
        stock: 15,
        img: "./assets/img/Products/Pudding/blue.jpg",
        description: "Pudding phang Low Profile chuyen dung cho ban phim mong gon nhe."
    },
    {
        id: 63,
        name: "Pudding Gradient Rainbow Prism LED",
        type: "Pudding",
        supplierId: "NCC02",
        costPrice: 280000,
        price: 450000,
        stock: 20,
        img: "./assets/img/Products/Pudding/purple.jpg",
        description: "Chuyen mau cau vong Gradient 7 mau xuyen sang cuc ky bat mat."
    },
    {
        id: 64,
        name: "Pudding Mint Green Cool Breeze",
        type: "Pudding",
        supplierId: "NCC02",
        costPrice: 230000,
        price: 370000,
        stock: 22,
        img: "./assets/img/Products/Pudding/blue.jpg",
        description: "Pudding xanh bac ha tuoi mat tao cam giac em diu thu thai."
    },
    {
        id: 65,
        name: "Pudding Coral Orange Sunset Keycaps",
        type: "Pudding",
        supplierId: "NCC02",
        costPrice: 230000,
        price: 370000,
        stock: 17,
        img: "./assets/img/Products/Pudding/red.jpg",
        description: "Mau cam hoang hon am ap ket hop den vang LED am cúng."
    },
    {
        id: 66,
        name: "Pudding Dark Smokey Translucent Grey",
        type: "Pudding",
        supplierId: "NCC02",
        costPrice: 240000,
        price: 380000,
        stock: 26,
        img: "./assets/img/Products/Pudding/011.jpg",
        description: "Khoi xam trong mo tao hieu ung anh sang mo ao bi an."
    },
    {
        id: 67,
        name: "Pudding Emerald Green Forest Keycaps",
        type: "Pudding",
        supplierId: "NCC02",
        costPrice: 230000,
        price: 370000,
        stock: 18,
        img: "./assets/img/Products/Pudding/blue.jpg",
        description: "Xanh ngoc luc bao sang trong quy phai chan trang xuyen sang."
    },
    {
        id: 68,
        name: "Pudding Cyberpunk Neon Yellow Keycaps",
        type: "Pudding",
        supplierId: "NCC02",
        costPrice: 250000,
        price: 390000,
        stock: 14,
        img: "./assets/img/Products/Pudding/red.jpg",
        description: "Vang neon ruc sang cho khong gian phong troi dam chat hacker."
    },
    {
        id: 69,
        name: "Pudding Coffee Milk Cream Duo",
        type: "Pudding",
        supplierId: "NCC02",
        costPrice: 240000,
        price: 380000,
        stock: 21,
        img: "./assets/img/Products/Pudding/012.jpg",
        description: "Phoi mau nau ca phe sua ngot ngao tao cam giac am ap."
    },
    {
        id: 70,
        name: "Pudding Midnight Blue Starry Night",
        type: "Pudding",
        supplierId: "NCC02",
        costPrice: 230000,
        price: 370000,
        stock: 25,
        img: "./assets/img/Products/Pudding/blue.jpg",
        description: "Xanh dem tinh mich ket hop anh sao dem LED huyen bi."
    },

    // --- NHOM 4: CHERRY / OEM / CLASSIC CUSTOM SETS (IDs 71 - 90) ---
    {
        id: 71,
        name: "GMK Laser Cyberpunk Synthwave Keycaps",
        type: "Cherry",
        supplierId: "NCC04",
        costPrice: 1100000,
        price: 1750000,
        stock: 8,
        img: "./assets/img/Products/Anime/015.png",
        description: "Bo keycap huyen thoai GMK Laser phoi mau tim hong retro thap nien 80."
    },
    {
        id: 72,
        name: "GMK Olivia Minimalist Rose Gold Set",
        type: "Cherry",
        supplierId: "NCC04",
        costPrice: 1150000,
        price: 1850000,
        stock: 7,
        img: "./assets/img/Products/Anime/019.jpeg",
        description: "Tong mau trang den diem xuyen vang hong Rose Gold thanh lich dinh cao."
    },
    {
        id: 73,
        name: "GMK Botanical Nature Green Keycaps",
        type: "Cherry",
        supplierId: "NCC04",
        costPrice: 1050000,
        price: 1690000,
        stock: 10,
        img: "./assets/img/Products/Anime/016.png",
        description: "Lay cam hung tu vuon thuc vat voi sac xanh la moc mac tuoi tan."
    },
    {
        id: 74,
        name: "GMK Red Samurai Warrior Edition",
        type: "Cherry",
        supplierId: "NCC04",
        costPrice: 1120000,
        price: 1790000,
        stock: 9,
        img: "./assets/img/Products/Anime/014.png",
        description: "Bo keycap Samurai giap do vang den kieu hung dam chat vo si dao."
    },
    {
        id: 75,
        name: "GMK Bento Japanese Traditional Dish",
        type: "Cherry",
        supplierId: "NCC04",
        costPrice: 1080000,
        price: 1720000,
        stock: 11,
        img: "./assets/img/Products/Anime/018.png",
        description: "Hop com Bento truyen thong Nhat Ban xanh bien trang va ca hoi do."
    },
    {
        id: 76,
        name: "Akko Black & Pink ASA Profile 158 Keys",
        type: "Cherry",
        supplierId: "NCC01",
        costPrice: 620000,
        price: 990000,
        stock: 20,
        img: "./assets/img/Products/Anime/015.png",
        description: "Bo keycap 158 phim full layout Akko ASA profile go cuc chac tay."
    },
    {
        id: 77,
        name: "Akko Wavez Cyber Green PBT Dyesub",
        type: "Cherry",
        supplierId: "NCC01",
        costPrice: 580000,
        price: 920000,
        stock: 16,
        img: "./assets/img/Products/Anime/016.png",
        description: "Xanh la Wavez hien dai tren nen xam den cuc ky hop dan den RGB."
    },
    {
        id: 78,
        name: "Akko Macaw Blue & Gold ASA Set",
        type: "Cherry",
        supplierId: "NCC01",
        costPrice: 590000,
        price: 940000,
        stock: 14,
        img: "./assets/img/Products/Anime/018.png",
        description: "Vang xanh chim Macaw nhiet doi song dong ruc ro."
    },
    {
        id: 79,
        name: "Keychron Retro Mac Layout Dye-Sub PBT",
        type: "Cherry",
        supplierId: "NCC02",
        costPrice: 490000,
        price: 790000,
        stock: 25,
        img: "./assets/img/Products/Other/021.jpg",
        description: "Dac tri danh cho nguoi dung macOS voi cac phim Command Option co dien."
    },
    {
        id: 80,
        name: "Keychron K Pro Mint Blue Cherry Profile",
        type: "Cherry",
        supplierId: "NCC02",
        costPrice: 470000,
        price: 750000,
        stock: 22,
        img: "./assets/img/Products/Pudding/blue.jpg",
        description: "PBT Double-shot sieu ben chong bong mo tieu chuan go cong thai hoc."
    },
    {
        id: 81,
        name: "KBDfans ePBT Sushi Japanese Hiragana",
        type: "Cherry",
        supplierId: "NCC04",
        costPrice: 680000,
        price: 1080000,
        stock: 15,
        img: "./assets/img/Products/Anime/019.jpeg",
        description: "Bo phap Hiragana Nhat Ban chat lieu ePBT nhap khau cao cap."
    },
    {
        id: 82,
        name: "KBDfans ePBT Grand Tour Space Theme",
        type: "Cherry",
        supplierId: "NCC04",
        costPrice: 720000,
        price: 1150000,
        stock: 12,
        img: "./assets/img/Products/Artisan/004.jpg",
        description: "Chuyen thoi gian kham pha khong gian vu tru cua NASA va ESA."
    },
    {
        id: 83,
        name: "Drop + MT3 Susuwatari Retro High Profile",
        type: "Cherry",
        supplierId: "NCC04",
        costPrice: 850000,
        price: 1390000,
        stock: 10,
        img: "./assets/img/Products/Other/023.jpg",
        description: "Profile MT3 cao lom cong om tron ngon tay tao cam giac go may co dien."
    },
    {
        id: 84,
        name: "Drop + MT3 Cyber Neon High Profile",
        type: "Cherry",
        supplierId: "NCC04",
        costPrice: 890000,
        price: 1450000,
        stock: 8,
        img: "./assets/img/Products/Anime/015.png",
        description: "Hoi tho vi tuong tuong tuong lai MT3 profile nhua ABS day 1.8mm."
    },
    {
        id: 85,
        name: "XDA V2 Matcha Tea Soft Green Set",
        type: "Cherry",
        supplierId: "NCC01",
        costPrice: 380000,
        price: 590000,
        stock: 30,
        img: "./assets/img/Products/Anime/016.png",
        description: "Be mat XDA phang phiu em ai tong mau tra xanh Matcha nhe nhang."
    },
    {
        id: 86,
        name: "XDA Honey Milk Sweet Cream Set",
        type: "Cherry",
        supplierId: "NCC01",
        costPrice: 380000,
        price: 590000,
        stock: 32,
        img: "./assets/img/Products/Pudding/012.jpg",
        description: "Sua mat ong vang kem ngot ngao font chu tron xinh xan."
    },
    {
        id: 87,
        name: "XDA Canvas Dieter Rams Minimalist",
        type: "Cherry",
        supplierId: "NCC04",
        costPrice: 520000,
        price: 830000,
        stock: 14,
        img: "./assets/img/Products/Other/020.jpg",
        description: "Cam hung tu triet ly thiet ke toi gian Dieter Rams Braun Duc."
    },
    {
        id: 88,
        name: "MOA Profile Marshmallow Soft Touch Set",
        type: "Cherry",
        supplierId: "NCC01",
        costPrice: 420000,
        price: 670000,
        stock: 24,
        img: "./assets/img/Products/Pudding/013.jpg",
        description: "Profile MOA vien tron nhu vien keo xop go am tram thocky."
    },
    {
        id: 89,
        name: "MOA Cat Coffee Garden PBT Dyesub",
        type: "Cherry",
        supplierId: "NCC01",
        costPrice: 440000,
        price: 690000,
        stock: 21,
        img: "./assets/img/Products/Artisan/005.jpg",
        description: "Quan ca phe meo xinh xan voi hang loat icon chu meo de thuong."
    },
    {
        id: 90,
        name: "Domikey SA Cyberpunk High Profile Set",
        type: "Cherry",
        supplierId: "NCC04",
        costPrice: 920000,
        price: 1490000,
        stock: 9,
        img: "./assets/img/Products/Anime/015.png",
        description: "Profile SA cao sang chanh go tieng am no vang chac nich."
    },

    // --- NHOM 5: KEYCAP CUSTOM DOC BAN, NUT LE, NOVELTY (IDs 91 - 100) ---
    {
        id: 91,
        name: "TypeWriter Retro Round Metal Rim Keycaps",
        type: "Other",
        supplierId: "NCC04",
        costPrice: 170000,
        price: 270000,
        stock: 25,
        img: "./assets/img/Products/Other/023.jpg",
        description: "Bo phim tron may danh chu co vien kim loai ma bac sang trong."
    },
    {
        id: 92,
        name: "OSU! Rhythm Game Custom Single Keycap",
        type: "Other",
        supplierId: "NCC04",
        costPrice: 28000,
        price: 55000,
        stock: 60,
        img: "./assets/img/Products/Other/020.jpg",
        description: "Nut le in logo game OSU chuyen dung cho game thu nhap nhip sieu ben."
    },
    {
        id: 93,
        name: "Apple Vintage Classic Rainbow Logo Keycap",
        type: "Other",
        supplierId: "NCC04",
        costPrice: 30000,
        price: 55000,
        stock: 45,
        img: "./assets/img/Products/Other/021.jpg",
        description: "Qua tao Apple 7 sac cau vong thap nien 90 hoai niem dep de."
    },
    {
        id: 94,
        name: "CS:GO Global Elite Metal Logo Keycap",
        type: "Other",
        supplierId: "NCC04",
        costPrice: 65000,
        price: 110000,
        stock: 35,
        img: "./assets/img/Products/Other/022.jpg",
        description: "Logo CS:GO Counter Strike chat lieu nhom phong cach game thu ban sung."
    },
    {
        id: 95,
        name: "Spacebar Resin Great Wave off Kanagawa 6.25U",
        type: "Other",
        supplierId: "NCC03",
        costPrice: 260000,
        price: 420000,
        stock: 18,
        img: "./assets/img/Products/Artisan/003.jpg",
        description: "Phim Spacebar dai 6.25U buc hoa song than Kanagawa duc resin 3D."
    },
    {
        id: 96,
        name: "Spacebar Artisan Galaxy Mountain 6.25U",
        type: "Other",
        supplierId: "NCC03",
        costPrice: 280000,
        price: 450000,
        stock: 14,
        img: "./assets/img/Products/Artisan/002.jpg",
        description: "Day nui tuyet hung vi duoi ngan ha spacebar duc tay nghe thuat."
    },
    {
        id: 97,
        name: "Enter Novelty Dragon Head Metallic Keycap",
        type: "Other",
        supplierId: "NCC04",
        costPrice: 190000,
        price: 320000,
        stock: 20,
        img: "./assets/img/Products/Artisan/006.jpg",
        description: "Phim Enter dau rong uy nghi duc hop kim son ma vang gold."
    },
    {
        id: 98,
        name: "ESC Artisanal Skull King Dark Bronze",
        type: "Other",
        supplierId: "NCC04",
        costPrice: 160000,
        price: 280000,
        stock: 22,
        img: "./assets/img/Products/Artisan/002.jpg",
        description: "Nut ESC dau lau vua doi vuong mien dong hun co dien."
    },
    {
        id: 99,
        name: "Wooden Walnut Handcrafted Artisan Keycap",
        type: "Other",
        supplierId: "NCC04",
        costPrice: 140000,
        price: 240000,
        stock: 30,
        img: "./assets/img/Products/Other/023.jpg",
        description: "Go oc cho Walnut tu nhien tien CNC phu dau lau giu van go moc."
    },
    {
        id: 100,
        name: "Ceramic Glazed Custom Keycap Set 1U",
        type: "Other",
        supplierId: "NCC03",
        costPrice: 220000,
        price: 380000,
        stock: 25,
        img: "./assets/img/Products/Artisan/001.jpg",
        description: "Chat lieu gom su men ngoc trang men hoa bien am thanh go trong treo doc la."
    }
];

// Export ra window de cac file script truy cap de dang
if (typeof window !== 'undefined') {
    window.KEYCAP_100_PRODUCTS = KEYCAP_100_PRODUCTS;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KEYCAP_100_PRODUCTS;
}
