// ---------------------------------------------------------------------------- //
var productList = JSON.parse(localStorage.getItem("product"));
var userList = JSON.parse(localStorage.getItem("user"));
var tempArray = []; // mảng chứa thông tin đơn hàng của user

function formPayment() {
  document.querySelector(".cartPayment").innerHTML = `
    <div class="container__cart-title">Đơn Hàng hiện tại</div>
    <div class="container__Mycart-wrap">
        <ul class="container__Mycart-listItem">
            <div class="container_Mycart-Temp">
                Hiện tại bạn chưa đặt đơn hàng nào cả :(
            </div>
        </ul>
    </div>`;
}

// ---------------------------------------------------------------------------- //
// function xử lí công việc thêm sản phẩm vào giỏ hàng
function addCart(nameProduct, quantity = 1) {
  var check = document
    .querySelector(".js-HandlerLR")
    .classList.contains("js-isLogin");
  if (!check) {
    alert(
      "Hãy đăng nhập để có thể mua sắm\nNếu bạn chưa có tài khoản thì hãy nhanh tay tạo cho mình một tài khoản đi nào."
    );
    console.warn("Thêm giỏ hàng thất bại: Người dùng chưa đăng nhập.");
    return;
  }

  var product = productList.find((p) => p.name === nameProduct);
  if (!product) return;

  var existingItem = tempArray.find((item) => item.name === product.name);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    var tempCart = {
      id: product.id,
      type: product.type,
      name: product.name,
      img: product.img,
      price: product.price,
      quantity: quantity,
    };
    tempArray.push(tempCart);
  }

  renderCart();
  addCartSuccess();
}

// Hàm xử lý tăng/giảm số lượng sản phẩm trong giỏ hàng
function changeQuantity(nameProduct, action) {
  var itemIndex = tempArray.findIndex((item) => item.name === nameProduct);

  if (itemIndex > -1) {
    var item = tempArray[itemIndex];

    if (action === "increase") {
      item.quantity += 1;
    } else if (action === "decrease") {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        if (
          confirm(`Bạn có muốn xóa sản phẩm ${nameProduct} ra khỏi giỏ hàng?`)
        ) {
          tempArray.splice(itemIndex, 1);
        }
      }
    }

    renderCart();
  }
}

// Hàm vẽ lại giao diện giỏ hàng - STUB để tránh lỗi
function renderCart() {
  // Logic render giỏ hàng
}

function deleteCart(nameProduct) {
  var itemIndex = tempArray.findIndex((item) => item.name === nameProduct);

  if (itemIndex > -1) {
    if (confirm("Bạn có muốn xóa sản phẩm này ?")) {
      tempArray.splice(itemIndex, 1);
    }
  }
  renderCart();
}

// ---------------------------------------------------------------------------- //
// HÀM MỚI: Hiển thị lịch sử đơn hàng đã đặt
function displayOrderHistory() {
  var currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    console.log("No user logged in");
    return;
  }
  var orderHistory = JSON.parse(localStorage.getItem("cartList")) || [];
  var userOrders = orderHistory.filter((order) => order.maKH === currentUser);

  if (userOrders.length === 0) {
    document.querySelector(".cartPayment").innerHTML = `
      <div class="container__cart-title">Lịch sử Đơn hàng</div>
      <div class="container__Mycart-wrap">
        <ul class="container__Mycart-listItem">
          <div class="container_Mycart-Temp">
            Bạn chưa có đơn hàng nào.
          </div>
        </ul>
      </div>`;
    return;
  }

  userOrders.sort((a, b) => b.maHD - a.maHD);

  let orderHistoryHTML = `
    <div class="container__cart-title">Lịch sử Đơn hàng</div>
    <div class="container__Mycart-wrap">
      <div class="order-history-header">
        <span>Đơn hàng của bạn (${userOrders.length} đơn)</span>
      </div>
      <ul class="container__Mycart-listItem order-history-list">
  `;

  userOrders.forEach((order, index) => {
    const statusInfo = getStatusInfo(order.status);
    const paymentMethodInfo = getPaymentMethodInfo(order.paymentMethod);
    const totalItems = order.totalProducts.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    orderHistoryHTML += `
      <li class="order-history-item" onclick="viewOrderDetail('${order.maHD}')">
        <div class="order-history-main">
          <div class="order-history-info">
            <div class="order-header">
              <strong>Mã đơn: #${order.maHD}</strong>
              <span class="order-status" style="color: ${statusInfo.color}">
                ${statusInfo.text}
              </span>
            </div>
            <div class="order-details">
              <span>Ngày đặt: ${order.ngayLapHD}</span>
              <span>•</span>
              <span>${totalItems} sản phẩm</span>
              <span>•</span>
              <span class="order-total">${order.tongTien.toLocaleString("vi", {
                style: "currency",
                currency: "VND",
              })}</span>
            </div>
            <div class="order-payment-method">
              <i class="fas fa-credit-card"></i>
              ${paymentMethodInfo.text}
            </div>
          </div>
          <div class="order-history-actions">
            <button class="btn-view-detail" onclick="event.stopPropagation(); viewOrderDetail('${
              order.maHD
            }')">
              <i class="fas fa-eye"></i> Xem chi tiết
            </button>
          </div>
        </div>
      </li>
    `;
  });

  orderHistoryHTML += `
      </ul>
    </div>
  `;

  document.querySelector(".cartPayment").innerHTML = orderHistoryHTML;
}

// ---------------------------------------------------------------------------- //
// HÀM MỚI: Lấy thông tin trạng thái đơn hàng
function getStatusInfo(status) {
  switch (status) {
    case "pending":
      return { text: "Đang chờ xử lý", color: "#ff9800" };
    case "confirmed":
      return { text: "Đã xác nhận", color: "#4caf50" };
    case "shipping":
      return { text: "Đang giao hàng", color: "#2196f3" };
    case "completed":
      return { text: "Đã hoàn thành", color: "#4caf50" };
    case "cancelled":
      return { text: "Đã hủy", color: "#f44336" };
    default:
      return { text: "Đang xử lý", color: "#ff9800" };
  }
}

// ---------------------------------------------------------------------------- //
// HÀM MỚI: Lấy thông tin phương thức thanh toán
function getPaymentMethodInfo(method) {
  switch (method) {
    case "cash":
      return {
        text: "Thanh toán tiền mặt",
        color: "#4caf50",
        icon: "money-bill-wave",
      };
    case "transfer":
      return {
        text: "Chuyển khoản ngân hàng",
        color: "#2196f3",
        icon: "university",
      };
    default:
      return {
        text: "Thanh toán tiền mặt",
        color: "#4caf50",
        icon: "money-bill-wave",
      };
  }
}

// ---------------------------------------------------------------------------- //
// HÀM MỚI: Xem chi tiết đơn hàng
function viewOrderDetail(orderId) {
  var orderHistory = JSON.parse(localStorage.getItem("cartList")) || [];
  var order = orderHistory.find((order) => order.maHD == orderId);

  if (!order) {
    alert("Không tìm thấy thông tin đơn hàng!");
    return;
  }

  displayOrderReview(order);
}

// ---------------------------------------------------------------------------- //
// HÀM MỚI: Cập nhật hiển thị giỏ hàng sau khi đăng nhập
function updateCartDisplayAfterLogin() {
  renderCart();
  displayOrderHistory();
}

// ---------------------------------------------------------------------------- //
// Các hàm xử lý modal
function toggleDeliveryModal(show) {
  const modal = document.querySelector(".js-delivery-wrap");
  if (show) {
    modal.style.display = "flex";
  } else {
    modal.style.display = "none";
  }
}

function toggleOrderReviewModal(show) {
  const modal = document.querySelector(".js-order-review-wrap");
  if (show) {
    modal.style.display = "flex";
  } else {
    modal.style.display = "none";
  }
}

// ---------------------------------------------------------------------------- //
// HÀM MỚI: Hiển thị chi tiết đơn hàng với thông tin thanh toán
function displayOrderReview(order) {
  const contentDiv = document.getElementById("orderReviewContent");
  let productDetails = "";
  let totalItems = 0;

  order.totalProducts.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalItems += item.quantity;
    productDetails += `
      <div class="order-item-detail">
        <p><strong>${item.name}</strong> (x${item.quantity})</p>
        <p>${itemTotal.toLocaleString("vi", {
          style: "currency",
          currency: "VND",
        })}</p>
      </div>
    `;
  });

  const statusInfo = getStatusInfo(order.status);
  const paymentMethodInfo = getPaymentMethodInfo(order.paymentMethod);

  contentDiv.innerHTML = `
    <div class="order-info-group">
      <p><strong>Mã đơn hàng:</strong> ${order.maHD}</p>
      <p><strong>Ngày đặt hàng:</strong> ${order.ngayLapHD}</p>
      <p><strong>Trạng thái:</strong> <span style="color: ${
        statusInfo.color
      }">${statusInfo.text}</span></p>
      <p><strong>Phương thức thanh toán:</strong> <span style="color: ${
        paymentMethodInfo.color
      }">${paymentMethodInfo.text}</span></p>
    </div>
    
    <div class="order-info-group">
      <h4>Thông tin giao hàng</h4>
      <p>${order.diaChiNhanHang.replace(/\n/g, "<br>")}</p>
    </div>
    
    <div class="order-info-group">
      <h4>Sản phẩm (${totalItems} món)</h4>
      ${productDetails}
    </div>
    
    <div class="order-total">
      <p><strong>Tổng tiền:</strong></p>
      <p><strong>${order.tongTien.toLocaleString("vi", {
        style: "currency",
        currency: "VND",
      })}</strong></p>
    </div>
    
    ${
      order.paymentMethod === "transfer"
        ? `
    <div class="order-info-group bank-info">
      <h4>Thông tin chuyển khoản</h4>
      <div class="bank-details">
        <p><strong>Ngân hàng:</strong> TECHCOMBANK</p>
        <p><strong>Số tài khoản:</strong> 1903 6666 8888</p>
        <p><strong>Chủ tài khoản:</strong> GEARS SHOP</p>
        <p><strong>Nội dung chuyển khoản:</strong> GEARS${order.maHD}</p>
        <p class="note"><em>Lưu ý: Vui lòng chuyển khoản đúng số tiền và nội dung như trên</em></p>
      </div>
    </div>
    `
        : ""
    }
    
    <p style="margin-top: 15px; font-style: italic; color: #888;">Cảm ơn quý khách đã đặt hàng! Chúng tôi sẽ liên hệ lại để xác nhận.</p>
  `;

  toggleOrderReviewModal(true);
}

// ---------------------------------------------------------------------------- //
// HÀM MỚI: Cập nhật modal địa chỉ giao hàng để thêm phần chọn phương thức thanh toán
function updateDeliveryModal() {
  const deliveryForm = document.querySelector(".DeliveryAddress_main_form");
  if (deliveryForm && !deliveryForm.querySelector(".payment-method-section")) {
    const paymentMethodHTML = `
      <div class="form-group payment-method-section">
        <h4>Phương thức thanh toán</h4>
        <div class="payment-options">
          <div class="payment-option">
            <input type="radio" id="cashPayment" name="paymentMethod" value="cash" checked>
            <label for="cashPayment">
              <i class="fas fa-money-bill-wave"></i>
              <span>Thanh toán tiền mặt khi nhận hàng</span>
            </label>
          </div>
          <div class="payment-option">
            <input type="radio" id="transferPayment" name="paymentMethod" value="transfer">
            <label for="transferPayment">
              <i class="fas fa-university"></i>
              <span>Chuyển khoản ngân hàng</span>
            </label>
          </div>
        </div>
        <div id="bankInfo" class="bank-info" style="display: none; margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
          <h5>Thông tin chuyển khoản:</h5>
          <p><strong>Ngân hàng:</strong> TECHCOMBANK</p>
          <p><strong>Số tài khoản:</strong> 1903 6666 8888</p>
          <p><strong>Chủ tài khoản:</strong> GEARS SHOP</p>
          <p><em>Sau khi chuyển khoản, vui lòng giữ lại biên lai để đối chiếu</em></p>
        </div>
      </div>
    `;

    const addressForm = deliveryForm.querySelector(".form-group");
    if (addressForm) {
      addressForm.insertAdjacentHTML("afterend", paymentMethodHTML);
    }

    // Xử lý sự kiện khi chọn phương thức thanh toán - ĐÃ CẬP NHẬT
    document
      .querySelectorAll('input[name="paymentMethod"]')
      .forEach((radio) => {
        radio.addEventListener("change", function () {
          const bankInfo = document.getElementById("bankInfo");
          if (this.value === "transfer") {
            bankInfo.style.display = "block";
            // THÊM: Tự động cuộn xuống phần thông tin ngân hàng
            setTimeout(() => {
              bankInfo.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }, 300);
          } else {
            bankInfo.style.display = "none";
          }
        });
      });
  }
}

// ---------------------------------------------------------------------------- //
// Hàm chính xử lý Thanh toán (đã cập nhật với phương thức thanh toán)
function handleCheckout() {
  // Lấy phương thức thanh toán
  const paymentMethod = document.querySelector(
    'input[name="paymentMethod"]:checked'
  ).value;

  // Lấy và kiểm tra địa chỉ nhận hàng
  var selectedAddress = "";
  var addressType = document.querySelector(
    'input[name="deliveryAddress"]:checked'
  ).value;

  if (addressType === "default") {
    selectedAddress = document.getElementById("userDefaultAddress").innerText;
    if (selectedAddress.includes("[Vui lòng nhập")) {
      alert(
        "Vui lòng cập nhật địa chỉ mặc định của bạn hoặc chọn nhập địa chỉ mới."
      );
      return;
    }
  } else {
    var receiverName = document.getElementById("newReceiverName").value.trim();
    var receiverPhone = document
      .getElementById("newReceiverPhone")
      .value.trim();
    var receiverStreet = document
      .getElementById("newReceiverStreet")
      .value.trim();
    var receiverCity = document.getElementById("newReceiverCity").value.trim();

    if (!receiverName || !receiverPhone || !receiverStreet || !receiverCity) {
      alert("Vui lòng nhập đầy đủ thông tin địa chỉ mới.");
      return;
    }

    selectedAddress = `Người nhận: ${receiverName} - SĐT: ${receiverPhone}\nĐịa chỉ: ${receiverStreet}, ${receiverCity}`;
  }

  // Kiểm tra giỏ hàng
  if (tempArray.length === 0) {
    alert("Giỏ hàng đang trống! Vui lòng thêm sản phẩm.");
    toggleDeliveryModal(false);
    return;
  }

  // Lấy thông tin cần thiết
  var nameUser = document.getElementById("js-Username").innerText;
  var ListNameProducts = tempArray.map((item) => item.name);
  var totalMoney = tempArray.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Tạo đối tượng HoaDon với phương thức thanh toán
  var tempTemp = {
    maHD: Date.now(),
    maKH: nameUser,
    ngayLapHD: new Date().toLocaleDateString("vi-VN"),
    tongTien: totalMoney,
    diaChiNhanHang: selectedAddress,
    paymentMethod: paymentMethod, // THÊM PHƯƠNG THỨC THANH TOÁN
    totalProducts: tempArray,
    ListNameProducts: ListNameProducts,
    status: "pending",
  };

  // Lưu đơn hàng vào Local Storage
  var totalPayment = JSON.parse(localStorage.getItem("cartList")) || [];
  totalPayment.push(tempTemp);
  localStorage.setItem("cartList", JSON.stringify(totalPayment));

  // Đồng bộ ngay lập tức sang orders của Admin
  try {
      var currentOrders = JSON.parse(localStorage.getItem("orders")) || [];
      if (!currentOrders.some(o => o.id === tempTemp.maHD)) {
          currentOrders.unshift({
              id: tempTemp.maHD,
              orderCode: 'DH-WEB-' + String(tempTemp.maHD).slice(-4),
              customerName: tempTemp.maKH || 'Khách hàng Web',
              customerPhone: '',
              customerEmail: '',
              address: tempTemp.diaChiNhanHang || 'Giao hàng tận nơi',
              date: new Date().toISOString(),
              status: 'moi',
              paymentMethod: tempTemp.paymentMethod || 'Online',
              paymentMethodText: tempTemp.paymentMethod || 'Đặt hàng Web Online',
              cashierName: 'Hệ thống Web',
              channel: 'Online',
              items: tempTemp.totalProducts ? tempTemp.totalProducts.map(tp => ({
                  id: tp.id,
                  name: tp.name,
                  quantity: tp.quantity || 1,
                  price: tp.price,
                  costPrice: Math.round(tp.price * 0.65)
              })) : [],
              subTotal: tempTemp.tongTien,
              discountPercent: 0,
              discountAmount: 0,
              total: tempTemp.tongTien,
              costTotal: Math.round(tempTemp.tongTien * 0.65),
              profit: Math.round(tempTemp.tongTien * 0.35),
              note: 'Khách hàng đặt qua Website Client'
          });
          localStorage.setItem("orders", JSON.stringify(currentOrders));
      }
  } catch (errSync) {}

  // Xóa giỏ hàng tạm thời và cập nhật giao diện
  sendRequire(tempArray);
  tempArray = [];
  renderCart();

  // Đóng Modal địa chỉ và MỞ Modal xem lại đơn hàng
  toggleDeliveryModal(false);
  displayOrderReview(tempTemp);

  // Cập nhật lại hiển thị lịch sử đơn hàng
  setTimeout(() => {
    displayOrderHistory();
  }, 100);
}

// Hàm khởi tạo sự kiện
function pushCarttoLocalStorage() {
  const openBtn = document.getElementById("openDeliveryModalBtn");
  const closeBtn = document.querySelector(".js-delivery-close-btn");
  const confirmBtn = document.getElementById("confirmCheckoutBtn");

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      if (tempArray.length > 0) {
        toggleDeliveryModal(true);
        // CẬP NHẬT: Thêm phần chọn phương thức thanh toán vào modal
        setTimeout(updateDeliveryModal, 100);
      } else {
        alert("Giỏ hàng đang trống! Vui lòng thêm sản phẩm.");
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => toggleDeliveryModal(false));
  }

  document.querySelector(".js-delivery-wrap").addEventListener("click", (e) => {
    if (e.target.classList.contains("js-delivery-wrap")) {
      toggleDeliveryModal(false);
    }
  });

  document
    .querySelectorAll('input[name="deliveryAddress"]')
    .forEach((radio) => {
      radio.addEventListener("change", function () {
        const newAddressForm = document.getElementById("newAddressForm");
        newAddressForm.style.display = this.value === "new" ? "block" : "none";
      });
    });

  if (confirmBtn) {
    confirmBtn.addEventListener("click", handleCheckout);
  }

  // Gắn sự kiện đóng cho Modal Xem lại đơn hàng
  const reviewCloseBtns = document.querySelectorAll(
    ".js-order-review-close-btn"
  );
  if (reviewCloseBtns.length > 0) {
    reviewCloseBtns.forEach((btn) => {
      btn.addEventListener("click", () => toggleOrderReviewModal(false));
    });
  }

  document
    .querySelector(".js-order-review-wrap")
    ?.addEventListener("click", (e) => {
      if (e.target.classList.contains("js-order-review-wrap")) {
        toggleOrderReviewModal(false);
      }
    });

  // Kiểm tra nếu đã đăng nhập thì hiển thị lịch sử đơn hàng
  const isLoggedIn = document
    .querySelector(".js-HandlerLR")
    ?.classList.contains("js-isLogin");
  if (isLoggedIn) {
    updateCartDisplayAfterLogin();
  }
}

// ----------------------------------------------------------------------------------------------------------
// Toast Notify Form (Đã sửa để sử dụng alert() cho thông báo thành công và loại bỏ kiểm tra đăng nhập lặp lại)
function addCartSuccess() {
  // Hàm này chỉ chạy khi addCart() đã xác nhận người dùng đã đăng nhập.
  alert("Giỏ hàng: Đã thêm sản phẩm vào giỏ hàng thành công!");
}

function setupCartPaymentEvents() {
  const openBtn = document.getElementById("openDeliveryModalBtn");
  const closeBtn = document.querySelector(".js-delivery-close-btn");
  const confirmBtn = document.getElementById("confirmCheckoutBtn");

  if (!openBtn) return;

  openBtn.addEventListener("click", () => {
    if (tempArray.length > 0) {
      toggleDeliveryModal(true);
      setTimeout(updateDeliveryModal, 100);
    } else {
      alert("Giỏ hàng đang trống! Vui lòng thêm sản phẩm.");
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => toggleDeliveryModal(false));
  }

  document.querySelector(".js-delivery-wrap").addEventListener("click", (e) => {
    if (e.target.classList.contains("js-delivery-wrap")) {
      toggleDeliveryModal(false);
    }
  });

  document
    .querySelectorAll('input[name="deliveryAddress"]')
    .forEach((radio) => {
      radio.addEventListener("change", function () {
        const newAddressForm = document.getElementById("newAddressForm");
        if (newAddressForm) {
          newAddressForm.style.display =
            this.value === "new" ? "block" : "none";
        }
      });
    });

  if (confirmBtn) {
    confirmBtn.addEventListener("click", handleCheckout);
  }
}

function sendRequire(arr) {
  // Hàm này có thể gọi toast (từ EventHandler.js) nếu có
  // Nhưng hiện tại ta sẽ dựa vào alert của addCartSuccess()
  // Nếu bạn có dùng hàm toast, hãy đảm bảo file EventHandler.js đã được tải.
}

// ---------------------------------------------------------------------------- //
// Hàm khởi tạo các sự kiện cần thiết khi trang tải
document.addEventListener("DOMContentLoaded", function () {
  renderCart();
  pushCarttoLocalStorage();

  const isLoggedIn = document
    .querySelector(".js-HandlerLR")
    ?.classList.contains("js-isLogin");
  if (isLoggedIn) {
    updateCartDisplayAfterLogin();
  }
});
