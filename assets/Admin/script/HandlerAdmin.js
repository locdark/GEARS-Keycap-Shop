	// ---------------------------------------------------------------------------- //
// xử lí các sự kiện đóng mở form chung
function OpenCloseForm() {
	var btnAdd = document.querySelector('.js-addProduct');
	var btnAddType = document.querySelector('.js-addTypeProduct');
	var btnEditType = document.querySelector('.js-editTypeProduct');
	var btnDelType = document.querySelector('.js-delTypeProduct');
	var AP_wrap = document.querySelector('.AddProduct_Wrap');
	var ATP_wrap = document.querySelector('.AddTypeProduct_Wrap');
	var ETP_wrap = document.querySelector('.EditTypeProduct_Wrap');
	var DTP_wrap = document.querySelector('.DelTypeProduct_Wrap');
	var APrice_wrap = document.querySelector('.AddPrice_Wrap');
	var EditPrice_wrap = document.querySelector('.EditPrice_Wrap');
	var closeBtn = document.querySelector('.js-close-btn');
	var closeBtn2 = document.querySelector('.js-close-btn2');
	var closeBtn3 = document.querySelector('.js-close-btn3');
	var closeBtn4 = document.querySelector('.js-close-btn4');
	var closeBtn5 = document.querySelector('.js-close-btn-edit');
	var closeBtn6 = document.querySelector('.js-close-btn-del');
	var closeBtnAddP = document.querySelector('.js-close-add-price');
	var closeBtnEditP = document.querySelector('.js-close-edit-price');
	var addImportWrap = document.querySelector(".AddImport_Wrap");
	var addImportBtn = document.querySelector(".js-addImport"); 
	var btneditP = document.querySelector('.js-editPrice');
	var btnaddP = document.querySelector('.js-addPrice');
	// nút mở form
	var closeAddBtn = addImportWrap.querySelector(".js-close-btn-import");	
	var editImportWrap = document.querySelector(".EditImport_Wrap");
	var editImportBtn = document.querySelector(".js-editImport"); // nút mở form sửa
	var closeEditBtn = editImportWrap.querySelector(".js-close-btn-edit-import");
	// event mở form
btnAdd.addEventListener('click', () => {
		AP_wrap.classList.add('isOpenAP');
		RenderOptionType();
	});
	
addImportBtn.addEventListener("click", () => {
    addImportWrap.classList.add("isOpenAP"); // bật popup
});

btnaddP.addEventListener("click", () => {
    APrice_wrap.classList.add("isOpenAP"); // bật popup
});
btneditP.addEventListener("click", () => {
    EditPrice_wrap.classList.add("isOpenAP"); // bật popup
});
editImportBtn.addEventListener("click", () => {
    editImportWrap.classList.add("isOpenAP");
});

closeEditBtn.addEventListener("click", () => {
    editImportWrap.classList.remove("isOpenAP");
});

closeAddBtn.addEventListener("click", () => {
    addImportWrap.classList.remove("isOpenAP"); // tắt popup
});

btnAddType.addEventListener('click', () => {
		ATP_wrap.classList.add('isOpenAP');
	})
btnEditType.addEventListener('click', () => {
		ETP_wrap.classList.add('isOpenAP');
		RenderOptionType();
		
	})
btnDelType.addEventListener('click', () => {
		DTP_wrap.classList.add('isOpenAP');
		RenderOptionType();
		
	})

	// event đóng form
	closeBtn.addEventListener('click', () => {
		AP_wrap.classList.remove('isOpenAP');
	});

	closeBtn2.addEventListener('click', () => {
		document.querySelector(".ChangeProduct_Wrap").classList.remove('isOpenAP')
	})

	closeBtn3.addEventListener('click', () => {
		document.querySelector(".ConfirmListCart_Wrap").classList.remove('isOpenAP')
	})

	closeBtn4.addEventListener('click', () => {
		document.querySelector(".AddTypeProduct_Wrap").classList.remove('isOpenAP')
	})
	closeBtn5.addEventListener('click', () => {
		document.querySelector(".EditTypeProduct_Wrap").classList.remove('isOpenAP')
	})
	closeBtn6.addEventListener('click', () => {
		document.querySelector(".DelTypeProduct_Wrap").classList.remove('isOpenAP')
	})
	closeBtn6.addEventListener('click', () => {
		document.querySelector(".DelTypeProduct_Wrap").classList.remove('isOpenAP')
	})
	closeBtnEditP.addEventListener('click', () => {
		document.querySelector(".EditPrice_Wrap").classList.remove('isOpenAP')
	})
	closeBtnAddP.addEventListener('click', () => {
		document.querySelector(".AddPrice_Wrap").classList.remove('isOpenAP')
	})
}

//----------------------show user----------------------------------
function showUserList() {
    if (localStorage.getItem('user') === null) return false;
    var userArray = JSON.parse(localStorage.getItem('user'));

    var tr = `<tr>
                <th>ID</th>
                <th>Username</th>
                <th>Gmail</th>
                <th>Register Day</th>
                <th>Permission</th>
                <th>Action</th>
            </tr>`;

    for (var i = 0; i < userArray.length; i++) {
        tr += `
        <tr>
            <td>${i}</td>
            <td>${userArray[i].username}</td>
            <td>${userArray[i].gmail}</td>
            <td>${userArray[i].RegisterDay}</td>
            <td>${userArray[i].userType}</td>
            <td>
                <button class="btn-Product" onClick="resetPassword(${i})">Reset MK</button>
                <button class="btn-Product" onClick="toggleLock(${i})" id="lock-btn-${i}">
                    ${userArray[i].status === 'locked' ? 'Mở khoá' : 'Khoá'}
                </button>
            </td>
        </tr>
        `;
    }

    document.querySelector('#userlist').innerHTML = tr;
}





//----------------------show products----------------------------------
function showProductList() {
	if (localStorage.getItem('product') === null) return false;
	var ProductArray = JSON.parse(localStorage.getItem('product'));
	var tr = `<tr>
				<th>ID</th>
				<th>Name</th>
				<th>Type</th>
				<th>Price</th>
				<th>Image</th>
				<th>Change</th>
				<th>Delete</th>
			</tr>`;

	for (var i = 0; i < ProductArray.length; i++) {
		tr += `
			<tr>
				<td>${ProductArray[i].id}</td>
				<td>${ProductArray[i].name}</td>
				<td>${ProductArray[i].type}</td>
				<td>${ProductArray[i].price.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</td>
				<td><img src="..${ProductArray[i].img}" class="container-img"></td>
				<td><button id="js-fix" class="fix" onClick="changeProduct(\'${ProductArray[i].name}\'); RenderOptionTypeC();"><i class="fas fa-wrench"></i></button></td>
				<td><button class="delete" onClick="deleteProduct(\'${ProductArray[i].name}\')"><i class="fas fa-times-circle"></i></button></td>
			</tr>
		`;
	}
	document.querySelector('#productlist').innerHTML = tr;
}

function deleteProduct(ProductName) {
	var ProductArray = JSON.parse(localStorage.getItem('product'));
	for (var i = 0; i < ProductArray.length; i++) {
		if (ProductArray[i].name == ProductName) {
			if (confirm('Bạn có muốn xóa sản phẩm này ?')) {
				// ProductArray.splice(i, 1);
				// window.location.reload(); // reset lại web sau khi nhập xong
			}
		}
	}
	// localStorage.setItem('product', JSON.stringify(ProductArray));
}

function Add_Product() {
	var add_btn = document.querySelector("#js-btn-product");
	add_btn.addEventListener('click', () => {
		var itemName = document.getElementById("js-item-name");
		var itemPrice = document.getElementById("js-item-price");
		var productArray = JSON.parse(localStorage.getItem('product'));
		var OptionSelect = document.querySelector("#AddOption");

		if (itemName.value.length === 0) {
			alert("vui lòng nhập tên sản phẩm !");
			itemName.focus();
			return false;
		}

		if (itemPrice.value.length === 0) {
			alert("vui lòng nhập giá tiền !");
			itemPrice.focus();
			return false;
		}

		// tìm thể loại của sản phẩm
		var OptionSelect = document.querySelector("#AddOption");
		var valueType = OptionSelect.options[OptionSelect.selectedIndex].text;
		// tìm id lớn nhất của sản phẩm
		var maxID = Math.max(...productArray.map(item => item.id));

		var item = {
			id: maxID + 1,
			type: valueType,
			name: itemName.value,
			img: '/img/UpdatingProduct.png',
			price: Number(itemPrice.value), // đổi chuỗi thành số
		}

		// productArray.push(item);
		// localStorage.setItem('product', JSON.stringify(productArray));
		// alert("Thêm sản phẩm thành công !");

		// đóng form lẫn reset value trong form input
		document.querySelector(".AddProduct_Wrap").classList.remove('isOpenAP');
		itemName.value = "";
		itemPrice.value = "";
		showProductList();
	})
}

// hàm in danh sách thể loại lên Form
function RenderOptionType() {
	// in ra danh sách loại sản phẩm
	var typesArray = JSON.parse(localStorage.getItem('types'))
	var tempArr = '';
	for (var i = 0; i < typesArray.length; i++) {
		if (typesArray[i].id != 'All') {
			tempArr += `<option value="${typesArray[i].id}">${typesArray[i].id}</option>`;
		}
	}
	document.querySelector("#AddOption").innerHTML = tempArr;
}

function RenderOptionTypeC() {
	// in ra danh sách loại sản phẩm
	var typesArray = JSON.parse(localStorage.getItem('types'))
	var tempArr = '';
	for (var i = 0; i < typesArray.length; i++) {
		if (typesArray[i].id != 'All') {
			tempArr += `<option value="${typesArray[i].id}">${typesArray[i].id}</option>`;
		}
	}
	document.querySelector("#AddOptionC").innerHTML = tempArr;
}

function Add_TypeProduct() {
	var add_btn = document.querySelector("#js-btn-product--typpe");
	var edit_btn =document.querySelector("#js-btn-product--typpe-edit");
	var delete_btn=document.querySelector("#js-btn-product--typpe-del");


	edit_btn.addEventListener('click', () => { 
	var itemID =document.getElementById("js-edit-Type--id");   // ID nhập vào
    var itemName = document.getElementById("js-edit-Type--name"); // Tên nhập vào
   var typeArray = JSON.parse(localStorage.getItem('types')) || [];


    if (itemID.value.length === 0) {
        alert("Vui lòng nhập id dòng sản phẩm cần sửa!");
        itemID.focus();
        return false;
    }

    if (itemName.value.length === 0) {
        alert("Vui lòng nhập tên mới cho dòng sản phẩm!");
        itemName.focus();
        return false;
    }
	
var index = typeArray.findIndex(item => item.id == itemID.value);
 
   

    // if (index === -1) {
    //     alert("Không tìm thấy ID sản phẩm để sửa!");
    //     return false;
    // } 
 typeArray[index].id = itemName.value.trim();
   

    // Lưu lại vào localStorage
    // localStorage.setItem('types', JSON.stringify(typeArray));
    // alert("Sửa dòng sản phẩm thành công!");
	
    
    // đóng form + reset input
    document.querySelector(".EditTypeProduct_Wrap").classList.remove('isOpenAP');
    itemID.value = "";
    itemName.value = "";
	
	
});


	
	add_btn.addEventListener('click', () => {
		var itemID = document.getElementById("js-item-Type--id");
		var itemName = document.getElementById("js-item-Type--name");
		var typeArray = JSON.parse(localStorage.getItem('types'));

		if (itemID.value.length === 0) {
			alert("vui lòng nhập id dòng sản phẩn !");
			itemID.focus();
			return false;
		}

		if (itemName.value.length === 0) {
			alert("vui lòng nhập tên dòng sản phẩm !");
			itemName.focus();
			return false;
		}

		var item = {
			id: itemID.value,
			name: itemName.value,
		}
		// typeArray.unshift(item);
		// localStorage.setItem('types', JSON.stringify(typeArray));
		// alert("Thêm dòng sản phẩm thành công !");

		// đóng form lẫn reset value trong form input
		document.querySelector(".AddTypeProduct_Wrap").classList.remove('isOpenAP');
		itemID.value = "";
		itemName.value = "";
	})
	delete_btn.addEventListener('click', () => {
    var itemID = document.getElementById("js-del-Type--id");
    var typeArray = JSON.parse(localStorage.getItem('types')) || [];

    if (itemID.value.length === 0) {
        alert("Vui lòng nhập ID dòng sản phẩm cần xóa!");
        itemID.focus();
        return false;
    }

    var index = typeArray.findIndex(item => item.id == itemID.value);

    // if (index === -1) {
    //     alert("Không tìm thấy ID sản phẩm để xóa!");
    //     return false;
    // }

    // Xóa không cần xác nhận
    // typeArray.splice(index, 1);
    // localStorage.setItem('types', JSON.stringify(typeArray));
    // alert("Xóa dòng sản phẩm thành công!");

    // Cập nhật giao diện
    location.reload();

    // Đóng form + reset
    document.querySelector(".DelTypeProduct_Wrap").classList.remove('isOpenAP');
    itemID.value = "";
});
}


function changeProduct(ProductName) {
	var ProductArray = JSON.parse(localStorage.getItem('product'));
	for (var i = 0; i < ProductArray.length; i++) {
		if (ProductArray[i].name == ProductName) {
			// ấn vào nút thay đổi thì mở form đổi thông tin sản phẩm
			document.querySelector(".ChangeProduct_Wrap").classList.add("isOpenAP");
			document.querySelector("#js-btn-productC").addEventListener('click', () => {
				var productArray = JSON.parse(localStorage.getItem('product'));
				var itemName = document.getElementById("js-item-nameC");
				var itemPrice = document.getElementById("js-item-priceC");
				var OptionSelect = document.querySelector("#AddOptionC");

				if (itemName.value.length === 0) {
					alert("vui lòng nhập tên sản phẩm !");
					itemName.focus();
					return false;
				}

				if (itemPrice.value.length === 0) {
					alert("vui lòng nhập giá tiền !");
					itemPrice.focus();
					return false;
				}

				// tìm thể loại của sản phẩm
				var OptionSelect = document.querySelector("#AddOptionC");
				var valueType = OptionSelect.options[OptionSelect.selectedIndex].text;

				for (var i = 0; i < ProductArray.length; i++) {
					if (ProductArray[i].name == ProductName) {
						productArray[i].name = itemName.value;
						productArray[i].price = Number(itemPrice.value);
						productArray[i].type = valueType;
						productArray[i].img = '/img/UpdatingProduct.png';
					}
				}

				// localStorage.setItem('product', JSON.stringify(productArray));
				// alert("Sửa sản phẩm thành công !");
				// window.location.reload(); // reset lại web sau khi nhập xong
			});
		}
	}
}

// hiển thị ra danh sách đơn đặt hàng từ khách hàng
function showOrder() {
	// lấy dữ liệu từ localStorage
	// hiện ra danh sách user mua hàng
	var orderArray = JSON.parse(localStorage.getItem('cartList'));
	var tr = `
	<tr>
		<th>ID</th>
		<th>Name</th>
		<th>Status</th>
		<th>Active</th>
	</tr>`;

	for (var i = 0; i < orderArray.length; i++) {
		var value = "";
		var color = "";
		var form = "";

		if (orderArray[i].status == 'confirmed') {
			value = "Đã xác nhận";
			color = "green";
		}

		if (orderArray[i].status == 'pending') {
			value = "Đang xử lí";
			color = "orange";
			form = `					
			<button class="apply" onClick="showListCartUser(\'${i}\')">
				<i class="fas fa-clipboard-list"></i>
			</button>`;
		} else {
			form = ``;
		}

		if (orderArray[i].status == 'unconfirmed') {
			value = "Đã huỷ";
			color = "red";
		}

		tr += `
			<tr>
				<td>${i}</td>
				<td>${orderArray[i].username}</td>
				<td id="statusOrder">
					<span style="color: ${color}">${value}</span>
				</td>
				<td>${form}</td>
			</tr>
		`;
	}

	// in lên màn hình
	document.querySelector('#confirm-order').innerHTML = tr;
}

function showListCartUser(id) {
	document.querySelector(".ConfirmListCart_Wrap").classList.add("isOpenAP");
	var orderArray = JSON.parse(localStorage.getItem('cartList'));
	var tr = `<tr>
				<th>ID</th>
				<th>Name</th>
				<th>Type</th>
				<th>Price</th>
				<th>Image</th>
			</tr>`;

	// lấy ra danh sách sản phẩm mà user đã mua
	var ListCart = orderArray[id].totalProducts; // id là id của đơn hàng mà user đã mua
	for (var i = 0; i < ListCart.length; i++) {
		tr += `
			<tr>
				<td>${i+1}</td>
				<td>${ListCart[i].name}</td>
				<td>${ListCart[i].type}</td>
				<td>${ListCart[i].price}</td>
				<td>
					<img src="..${ListCart[i].img}" alt="" class="container-img">
				</td>
			</tr>
		`;
	}
	document.querySelector('#product-list').innerHTML = tr;

	if (orderArray[id].status == 'confirmed') {
		value = "Đã xác nhận";
		color = "green";
	}

	if (orderArray[id].status == 'pending') {
		value = "Đang xử lí";
		color = "orange";
	}

	if (orderArray[id].status == 'unconfirmed') {
		value = "Đã huỷ";
		color = "red";
	}

	document.querySelector('#product-list--price').innerHTML = `
		<p style="padding: 12px 0;">Mã đơn hàng: <strong id="product-list--id">${id}</strong></p>
		<p style="padding: 12px 0;">Tên người mua: <strong>${orderArray[id].username}</strong></p>
		<p style="padding: 12px 0;">Tổng tiền: <strong>${orderArray[id].totalMoney.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</strong></p>
		<p style="padding: 12px 0;">Tình trạng đơn hàng: <span style="color: ${color}">${value}</span></p>
	`;
}

function unConfirmOrder() {
	if (confirm('Xác nhận huỷ đơn hàng !')) {
		// lấy ra id của đơn hàng được chọn
		var id = document.getElementById("product-list--id").innerText;

		// thay đổi status trong loacalStorage -> đơn hàng xem như đã bị huỷ
		var orderArray = JSON.parse(localStorage.getItem('cartList'));
		orderArray[id].status = 'unconfirmed'; // chuyển đổi trạng thái của đơn hàng
		localStorage.setItem('cartList', JSON.stringify(orderArray)); // update dữ liệu

		// sau khi ấn vào nút xác nhận thì đóng form và chuyển trạng thái hiện thị
		document.querySelector(".ConfirmListCart_Wrap").classList.remove('isOpenAP')
		showOrder(); // chạy lại hàm showOrder() để hiển thị lại danh sách đặt hàng
	}
}

function ConfirmOrder() {
	if (confirm('Xác nhận chấp nhận đơn hàng !')) {
		// lấy ra id của đơn hàng được chọn
		var id = document.getElementById("product-list--id").innerText;

		// thay đổi status trong loacalStorage -> đơn hàng xem như đã bị huỷ
		var orderArray = JSON.parse(localStorage.getItem('cartList'));
		orderArray[id].status = 'confirmed'; // chuyển đổi trạng thái của đơn hàng
		localStorage.setItem('cartList', JSON.stringify(orderArray)); // update dữ liệu

		// sau khi ấn vào nút xác nhận thì đóng form và chuyển trạng thái hiện thị
		document.querySelector(".ConfirmListCart_Wrap").classList.remove('isOpenAP')
		showOrder(); // chạy lại hàm showOrder() để hiển thị lại danh sách đặt hàng
	}
}
// Giả sử bạn lưu user trong localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];

// Reset mật khẩu
function resetPassword(index){
    users[index].password = '123456';
    localStorage.setItem('users', JSON.stringify(users));
    alert(`Đã reset mật khẩu user ${users[index].username} thành 123456`);
}

// // Khoá / Mở khoá tài khoản
// function toggleLock(index){
//     users[index].status = users[index].status === 'locked' ? 'active' : 'locked';
//     localStorage.setItem('users', JSON.stringify(users));

//     document.getElementById(`status-${index}`).innerText = users[index].status;
//     document.getElementById(`lock-btn-${index}`).innerText = users[index].status === 'locked' ? 'Mở khoá' : 'Khoá';
// }
// function resetPassword(index) {
//     let users = JSON.parse(localStorage.getItem('user'));
//     users[index].password = '123456'; // đặt lại mật khẩu mặc định
//     localStorage.setItem('user', JSON.stringify(users));
//     alert(`Đã reset mật khẩu ${users[index].username} thành 123456`);
// }

// function toggleLock(index) {
//     let users = JSON.parse(localStorage.getItem('user'));
//     users[index].status = users[index].status === 'locked' ? 'active' : 'locked';
//     localStorage.setItem('user', JSON.stringify(users));
//     showUserList(); // cập nhật lại bảng
// }
function createImportList() {
    if (localStorage.getItem('importList') === null) {
        const importArray = [
            { id: 1, date: '2025-10-01', product: 'OSU! keycap', price: 50000, quantity: 10, status: 'Chưa hoàn thành' },
            { id: 2, date: '2025-10-02', product: 'Apple logo keycap', price: 55000, quantity: 5, status: 'Chưa hoàn thành' },
            { id: 3, date: '2025-10-03', product: 'CS:GO keycap', price: 110000, quantity: 8, status: 'Chưa hoàn thành' },
            { id: 4, date: '2025-10-04', product: 'Sun Goddess Shrine keycap', price: 823529, quantity: 2, status: 'Chưa hoàn thành' },
            { id: 5, date: '2025-10-05', product: 'Galaxy Keycap', price: 802118, quantity: 4, status: 'Chưa hoàn thành' },
            { id: 6, date: '2025-10-06', product: 'Cute Cat Keycaps', price: 188000, quantity: 6, status: 'Chưa hoàn thành' }
        ];
        localStorage.setItem('importList', JSON.stringify(importArray));
    }
}
function showImportList() {
    if (localStorage.getItem('importList') === null) return false;
    var importArray = JSON.parse(localStorage.getItem('importList'));
    var tr = `<tr>
                <th>ID</th>
                <th>Ngày nhập</th>
                <th>Sản phẩm</th>
                <th>Giá nhập</th>
                <th>Số lượng</th>
                <th>Trạng thái</th>
                
            </tr>`;

    for (var i = 0; i < importArray.length; i++) {
        tr += `
            <tr>
                <td>${importArray[i].id}</td>
                <td>${importArray[i].date}</td>
                <td>${importArray[i].product}</td>
                <td>${importArray[i].price.toLocaleString('vi', {style: 'currency', currency: 'VND'})}</td>
                <td>${importArray[i].quantity}</td>
                <td>${importArray[i].status}</td>
                <td>
                    <button class="complete" onClick="completeImport(${importArray[i].id})">
                       
                    </button>
                </td>
            </tr>
        `;
    }

    document.querySelector('#import-list').innerHTML = tr;
}
function createPriceList() {
    if (localStorage.getItem('prices') === null) {
        var priceArray = [
            { id: 0, type: 'Artisan', name: 'Sun Goddess Shrine keycap', cost: 500000, profit: 20 },
            { id: 1, type: 'Artisan', name: 'Galaxy Keycap', cost: 600000, profit: 25 },
            { id: 2, type: 'Pudding', name: 'Keycap PBT Pudding Black', cost: 250000, profit: 30 },
            { id: 3, type: 'Anime', name: 'Kimetsu no Yaiba set Keycap', cost: 600000, profit: 35 },
        ];
        localStorage.setItem('prices', JSON.stringify(priceArray));
    }
}

function showPriceList() {
    if (localStorage.getItem('prices') === null) return false;
    var priceArray = JSON.parse(localStorage.getItem('prices'));

    var tr = `
        <tr>
            <th>ID</th>
            <th>Loại</th>
            <th>Tên sản phẩm</th>
            <th>Giá vốn</th>
            <th>% Lợi nhuận</th>
            <th>Giá bán</th>
        </tr>
    `;

    priceArray.forEach(item => {
        let sellingPrice = item.cost + (item.cost * item.profit / 100);
        tr += `
            <tr>
                <td>${item.id}</td>
                <td>${item.type}</td>
                <td>${item.name}</td>
                <td>${item.cost.toLocaleString('vi', {style:'currency', currency:'VND'})}</td>
                <td>${item.profit}%</td>
                <td>${sellingPrice.toLocaleString('vi', {style:'currency', currency:'VND'})}</td>
            </tr>
        `;
    });

    document.querySelector('#price-list').innerHTML = tr;
}


function TabHeaderAnimation() {
    var $ = document.querySelector.bind(document);
    var $$ = document.querySelectorAll.bind(document);

    var HeaderItem = $$('.js-TabHeader');
    var ContainerItem = $$('.js-Container');

    var tabActive = $('.js-TabHeader.headerActive');
    var line = $('.header-navbar--list .line');

    line.style.width = tabActive.offsetWidth + 'px';
    line.style.left = tabActive.offsetLeft + 'px';

    HeaderItem.forEach((HeaderItem, index) => {
        var pane = ContainerItem[index];

        HeaderItem.onclick = function () {
            // gỡ class đã có trước khi add vào
            $('.js-TabHeader.headerActive').classList.remove('headerActive');
            $('.js-Container.headerActive').classList.remove('headerActive');

            line.style.width = this.offsetWidth + 'px';
            line.style.left = this.offsetLeft + 'px';

            //add class vào element
            this.classList.add('headerActive');
            pane.classList.add('headerActive');
        }
    })

    document.querySelector(".headerActive").addEventListener('click', (e) => {
        e.preventDefault();
    })
}

// Gọi hàm khi trang load
document.addEventListener('DOMContentLoaded', TabHeaderAnimation);

// Gọi render khi load

document.addEventListener("DOMContentLoaded", function () {
    CreateFakeOrders();
    showOrderDetail();
});

function CreateFakeOrders() {
    if (localStorage.getItem('orders') === null) {
        var orderArray = [
            { id: 1, date: '2025-10-06',user: 'User1', total: 350000, status: 'Mới đặt' },
            { id: 2,date: '2025-10-05', user: 'User2', total: 520000, status: 'Đã giao' },
            { id: 3,date: '2025-10-01', user: 'minhkhoa03', total: 280000, status: 'Đã xử lý' },
        ];
        localStorage.setItem('orders', JSON.stringify(orderArray));
    }
}
function showOrderDetail(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    for (var i = 0; i < orders.length; i++) {
        if (orders[i].id === orderId) {
            // Mở form hiển thị chi tiết đơn hàng
            const orderWrap = document.querySelector(".OrderDetail_Wrap");
            orderWrap.classList.add("isOpenAP");

            // Lấy các phần tử
            const inputOrderId = document.getElementById("js-order-id");
            const inputUser = document.getElementById("js-order-user");
            const inputDate = document.getElementById("js-order-date");
            const inputTotal = document.getElementById("js-order-total");
            const inputStatus = document.getElementById("js-order-status");
            const tableItems = document.getElementById("js-order-items");

            const order = orders[i];

            // Định dạng ngày + tiền
            const dateParts = order.date.split('-');
            const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
            const formattedTotal = order.total.toLocaleString('vi', { style: 'currency', currency: 'VND' });

            // Gán dữ liệu lên form
            inputOrderId.value = order.id;
            inputUser.value = order.user;
            inputDate.value = formattedDate;
            inputTotal.value = formattedTotal;
            inputStatus.value = order.status || '';

            // Render danh sách sản phẩm
            let itemsHTML = `
                <tr>
                    <th>Tên sản phẩm</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                </tr>
            `;

            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    const formattedPrice = item.price.toLocaleString('vi', { style: 'currency', currency: 'VND' });
                    const formattedItemTotal = (item.price * item.quantity).toLocaleString('vi', { style: 'currency', currency: 'VND' });
                    itemsHTML += `
                        <tr>
                            <td>${item.name}</td>
                            <td>${formattedPrice}</td>
                            <td>${item.quantity}</td>
                            <td>${formattedItemTotal}</td>
                        </tr>
                    `;
                });
            }

            tableItems.innerHTML = itemsHTML;
            break;
        }
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const closeBtn = document.querySelector(".js-close-btn7");
    const orderWrap = document.querySelector(".OrderDetail_Wrap");

    if (closeBtn && orderWrap) {
        closeBtn.addEventListener("click", function () {
            orderWrap.classList.remove("isOpenAP");
        });
    }
});




function showOrderList() {
    if (localStorage.getItem('orders') === null) return false;
    var orderArray = JSON.parse(localStorage.getItem('orders'));

    var tr = `
        <tr>
            <th>ID</th>
            <th>Ngày đặt</th>
            <th>User</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
			<th>Chi tiết</th>
        </tr>
    `;

    orderArray.forEach(item => {
        // Định dạng ngày từ YYYY-MM-DD sang DD/MM/YYYY
        const dateParts = item.date.split('-');
        const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        
        // Định dạng tiền tệ
        const formattedTotal = item.total.toLocaleString('vi', {style:'currency', currency:'VND'});
        
        tr += `
            <tr>
                <td>${item.id}</td>
                <td>${formattedDate}</td>
                <td>${item.user}</td>
                <td>${formattedTotal}</td>
                <td>${item.status}</td>
				 <td><button class="btn-Product" onclick="showOrderDetail(${item.id})">Chi tiết</button></td>
        `;
    });

    // Gán vào bảng
    var table = document.getElementById('orders-list');
    if (table) {
        table.innerHTML = tr;
    }
}
function createProducts1() {
    if (localStorage.getItem('product') === null) {
        var productArray = [
            { id: 0, type: 'Other', name: 'OSU! keycap', img: '/img/Products/Other/020.jpg', price: 55000, description: "Keycap với biểu tượng OSU!", stock: 2 },
            { id: 1, type: 'Other', name: 'Apple logo keycap', img: '/img/Products/Other/021.jpg', price: 55000, description: "", stock: 10 },
            { id: 2, type: 'Other', name: 'CS:GO keycap', img: '/img/Products/Other/022.jpg', price: 110000, description: "", stock: 1 },
            { id: 3, type: 'Other', name: 'TypeWriter set keycap', img: '/img/Products/Other/023.jpg', price: 270000, description: "", stock: 8 },
            { id: 4, type: 'Artisan', name: 'Sun Goddess Shrine keycap', img: '/img/Products/Artisan/001.jpg', price: 823529, description: "", stock: 5 },
            { id: 5, type: 'Artisan', name: 'Galaxy Keycap', img: '/img/Products/Artisan/002.jpg', price: 802118, description: "", stock: 2 },
            { id: 6, type: 'Artisan', name: 'Koi Fish Keycap', img: '/img/Products/Artisan/003.jpg', price: 543529, description: "", stock: 12 },
            { id: 7, type: 'Artisan', name: 'Interstellar Keycap', img: '/img/Products/Artisan/004.jpg', price: 929176, description: "", stock: 3 },
            { id: 8, type: 'Artisan', name: 'Cute Cat Keycaps', img: '/img/Products/Artisan/005.jpg', price: 188000, description: "", stock: 0 },
            { id: 9, type: 'Artisan', name: 'Mega Charizard Keycap', img: '/img/Products/Artisan/006.jpg', price: 136447, description: "", stock: 7 },
            { id: 10, type: 'Artisan', name: 'Devil Fruit Keycap', img: '/img/Products/Artisan/007.jpg', price: 938824, description: "", stock: 15 },
            { id: 11, type: 'Artisan', name: 'Re:Zero Rem Keycap', img: '/img/Products/Artisan/008.jpg', price: 677116, description: "", stock: 1 },
            { id: 12, type: 'Artisan', name: 'Totoru Natural Landscape & Waterfall Keycap', img: '/img/Products/Artisan/009.jpg', price: 124705, description: "", stock: 9 },
            { id: 13, type: 'Artisan', name: 'Keycap Doubleshot xuyên led Kim Loại - Spiderman', img: '/img/Products/Artisan/010.jpg', price: 300000, description: "", stock: 6 },
            { id: 14, type: 'Pudding', name: 'Keycap PBT Pudding Black', img: '/img/Products/Pudding/011.jpg', price: 350000, description: "Set keycap Pudding màu đen với chất liệu PBT chắn chắn", stock: 11 },
            { id: 15, type: 'Pudding', name: 'Keycap PBT Pudding White', img: '/img/Products/Pudding/012.jpg', price: 350000, description: "Set keycap Pudding màu trắng với chất liệu PBT chắn chắn", stock: 3 },
            { id: 16, type: 'Pudding', name: 'Keycap PBT Pudding Pink', img: '/img/Products/Pudding/013.jpg', price: 350000, description: "Set keycap Pudding màu hồng với chất liệu PBT chắn chắn", stock: 4 },
            { id: 17, type: 'Pudding', name: 'Keycap PBT Pudding Blue', img: '/img/Products/Pudding/blue.jpg', price: 350000, description: "Set keycap Pudding màu xanh với chất liệu PBT chắn chắn", stock: 2 },
            { id: 18, type: 'Pudding', name: 'Keycap PBT Pudding Purple', img: '/img/Products/Pudding/purple.jpg', price: 350000, description: "Set keycap Pudding màu tím với chất liệu PBT chắn chắn", stock: 10 },
            { id: 19, type: 'Pudding', name: 'Keycap PBT Pudding Red', img: '/img/Products/Pudding/red.jpg', price: 350000, description: "Set keycap Pudding màu đỏ với chất liệu PBT chắn chắn", stock: 1 },
            { id: 20, type: 'Anime', name: 'Kimetsu no Yaiba set Keycap', img: '/img/Products/Anime/014.png', price: 745000, description: "Set keycap song ngữ chủ đề anime Kimetsu no Yaiba", stock: 9 },
            { id: 21, type: 'Anime', name: 'Re: Zero set Keycap', img: '/img/Products/Anime/015.png', price: 745000, description: "Set keycap song ngữ chủ đề anime Re: Zero", stock: 5 },
            { id: 22, type: 'Anime', name: 'Pokemon Bulbasaur set keycap', img: '/img/Products/Anime/016.png', price: 790000, description: "Set keycap song ngữ chủ đề pokemon Bulbasaur", stock: 4 },
            { id: 23, type: 'Anime', name: 'Pokemon Charmander set keycap', img: '/img/Products/Anime/017.png', price: 790000, description: "Set keycap song ngữ chủ đề pokemon Charmander", stock: 8 },
            { id: 24, type: 'Anime', name: 'Pokemon Squirtle set keycap', img: '/img/Products/Anime/018.png', price: 790000, description: "Set keycap song ngữ chủ đề pokemon Squirtle", stock: 3 },
            { id: 25, type: 'Anime', name: 'Hatsune Miku set keycap', img: '/img/Products/Anime/019.jpeg', price: 690000, description: "Set keycap song ngữ chủ đề nhân vật Hatsune Miku", stock: 0 },
        ];
        localStorage.setItem('product', JSON.stringify(productArray));
    }
}
function showInventoryList() {
    const productData = localStorage.getItem('product');
    if (!productData) {
        console.warn("️ Không có dữ liệu sản phẩm trong localStorage.");
        return;
    }

    const productArray = JSON.parse(productData);

    // Tạo header + body
    let tableHTML = `
        <tr>
            <th>Mã sản phẩm</th>
            <th>Tên sản phẩm</th>
            <th>Loại</th>
            <th>Tồn kho hiện tại</th>
        </tr>
    `;

    productArray.forEach(item => {
        tableHTML += `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.type}</td>
                <td>${item.stock}</td>
            </tr>
        `;
    });

    const table = document.getElementById('inventory-list');
    if (table) {
        table.innerHTML = tableHTML;
    } else {
        console.error(" Không tìm thấy bảng #inventory-list");
    }
}
function showLowStockList() {
    // Lấy dữ liệu sản phẩm từ localStorage
    const productData = localStorage.getItem('product');
    if (!productData) {
        console.warn("Không có dữ liệu sản phẩm trong localStorage!");
        return;
    }

    const productArray = JSON.parse(productData);

    // Tạo bảng tiêu đề
    let tableHTML = `
        <tr>
            <th>Mã sản phẩm</th>
            <th>Tên sản phẩm</th>
            <th>Loại</th>
            <th>Tồn kho</th>
            <th>Trạng thái</th>
        </tr>
    `;

    // Lọc ra các sản phẩm có tồn kho thấp
    const lowStockItems = productArray.filter(p => p.stock <= 3);

    if (lowStockItems.length === 0) {
        tableHTML += `
            <tr>
                <td colspan="5" style="color: green;">Tất cả sản phẩm đều còn đủ hàng!</td>
            </tr>
        `;
    } else {
        lowStockItems.forEach(p => {
            tableHTML += `
                <tr style="color: ${p.stock === 0 ? 'red' : 'orange'};">
                    <td>${p.id}</td>
                    <td>${p.name}</td>
                    <td>${p.type}</td>
                    <td>${p.stock}</td>
                    <td>${p.stock === 0 ? 'Hết hàng' : 'Sắp hết hàng'}</td>
                </tr>
            `;
        });
    }

    // Gắn vào bảng
    const table = document.getElementById('low-stock-list');
    if (table) {
        table.innerHTML = tableHTML;
    } else {
        console.error("Không tìm thấy bảng #low-stock-list trong HTML!");
    }
}

// Tự động hiển thị khi load trang
document.addEventListener('DOMContentLoaded', showLowStockList);

// ---------------------------------------------------------------------------- //
window.onload = () => {createProducts1();
	showUserList();
	TabHeaderAnimation();

	showProductList();
	
	deleteProduct();

	OpenCloseForm();
	Add_Product();
	Add_TypeProduct();
	createImportList();
	showImportList();
	createPriceList();
	showPriceList();
	CreateFakeOrders();
	showOrderList();
	
	showInventoryList();
 showLowStockList() ;


	// order
	
}