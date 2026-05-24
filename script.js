// ===== DỮ LIỆU SẢN PHẨM =====
const products = [
  // TRÀ
  { id: 1,  name: 'Trà trái cây',    desc: 'Trà trái cây tươi mát, thơm ngon',    price: 25000, image: 'tra-trai-cay.jpg',    cat: 'drink', badge: ''    },
  { id: 2,  name: 'Trà dâu tằm',    desc: 'Dâu tằm tươi, vị chua ngọt dịu',        price: 25000, image: 'tra-dau-tam.jpg',    cat: 'drink', badge: ''    },
  { id: 3,  name: 'Trà xoài',       desc: 'Xoài chín thơm, mát lạnh giải khát',     price: 25000, image: 'tra-xoai.jpg',       cat: 'drink', badge: 'hot' },
  { id: 4,  name: 'Trà mãng cầu',    desc: 'Mãng cầu tươi, thanh mát đặc biệt',     price: 25000, image: 'tra-mang-cau.jpg',   cat: 'drink', badge: ''    },
  { id: 5,  name: 'Trà dưa lưới',    desc: 'Dưa lưới ngọt thơm, uống cực đã',       price: 28000, image: 'tra-dua-luoi.jpg',   cat: 'drink', badge: 'new' },

  // SỮA CHUA
  { id: 6,  name: 'Sữa chua việt quất', desc: 'Sữa chua mịn, việt quất tươi chua ngọt', price: 28000, image: 'sua-chua-viet-quat.jpg', cat: 'snack', badge: 'hot' },
  { id: 7,  name: 'Sữa chua xoài',     desc: 'Xoài chín vàng, béo mịn thơm lừng',      price: 28000, image: 'sua-chua-xoai.jpg',      cat: 'snack', badge: ''    },
  { id: 8,  name: 'Sữa chua dâu',      desc: 'Dâu tây tươi, chua ngọt hài hòa',         price: 28000, image: 'sua-chua-dau.jpg',       cat: 'snack', badge: ''    },
  { id: 9,  name: 'Sữa chua chanh leo',desc: 'Chanh leo chua thanh, sữa chua mát lạnh',  price: 28000, image: 'sua-chua-chanh-leo.jpg', cat: 'snack', badge: ''    },
  { id: 10, name: 'Sữa chua dưa lưới', desc: 'Dưa lưới ngọt thơm kết hợp sữa chua',    price: 28000, image: 'sua-chua-dua-luoi.jpg',  cat: 'snack', badge: ''    },

  // ĂN VẶT
  { id: 11, name: 'Bánh tráng trộn',   desc: 'Bánh tráng trộn đặc biệt, cay ngon',      price: 35000, image: 'banh-trang-tron.jpg',   cat: 'snack', badge: 'hot' },
  { id: 12, name: 'Bánh tráng cuộn',   desc: 'Cuộn giòn nhân thơm, ăn là ghiền',        price: 25000, image: 'banh-trang-cuon.jpg',   cat: 'snack', badge: ''    },
  { id: 13, name: 'Xoài kí',           desc: 'Xoài tươi nguyên kí, ngọt giòn',           price: 17000, image: 'xoai-ki.jpg',           cat: 'snack', badge: ''    },
  { id: 14, name: 'Xoài cắt hộp',      desc: 'Xoài cắt sẵn tiện lợi, ăn ngay',          price: 25000, image: 'xoai-cat-hop.jpg',      cat: 'snack', badge: ''    },
  { id: 15, name: 'Xoài lắc mắm thái', desc: 'Xoài xanh lắc mắm thái chua cay đặc biệt',price: 30000, image: 'xoai-lac-mam-thai.jpg', cat: 'snack', badge: 'new' },
];
 
// ===== STATE GIỎ HÀNG VÀ STATE CHỌN SIZE =====
let cart = [];
let currentSelectedProduct = null;
let currentSelectedSize = 'S';
let currentSizeSurplus = 0; 
let currentModalQty = 1;
 
// ===== UTILS =====
function fmt(price) {
  return price.toLocaleString('vi-VN') + '₫';
}
 
// ===== RENDER SẢN PHẨM TRANG CHỦ =====
function renderProducts(cat) {
  const list = cat === 'all' ? products : products.filter(p => p.cat === cat);
 
  document.getElementById('productGrid').innerHTML = list.map(p => `
    <div class="product-card">
      <div class="product-img">
        <img src="${p.image}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover; border-radius:12px 12px 0 0;">
        ${p.badge === 'hot' ? '<span class="badge-hot">🔥 HOT</span>' : ''}
        ${p.badge === 'new' ? '<span class="badge-new">✨ MỚI</span>' : ''}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <span class="product-price">${fmt(p.price)}</span>
          <button class="add-btn" onclick="openSizeModal(${p.id})">+</button>
        </div>
      </div>
    </div>
  `).join('');
}
 
function filterCat(btn, cat) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
}

// ===== ĐIỀU KHIỂN MODAL CHỌN SIZE & SỐ LƯỢNG =====
function openSizeModal(id) {
  const prod = products.find(p => p.id === id);
  if (!prod) return;

  currentSelectedProduct = prod;
  currentSelectedSize = 'S';
  currentSizeSurplus = 0;
  currentModalQty = 1;

  document.getElementById('modalProdName').textContent = prod.name;
  
  document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
  const firstSizeBtn = document.querySelector('.size-btn');
  if(firstSizeBtn) firstSizeBtn.classList.add('active');

  updateSizeModalPriceUI();
  
  document.getElementById('sizeModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSizeModal() {
  document.getElementById('sizeModal').classList.remove('open');
  document.body.style.overflow = '';
}

function selectSize(element, sizeName, surplusPrice) {
  document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');

  currentSelectedSize = sizeName;
  currentSizeSurplus = surplusPrice;
  updateSizeModalPriceUI();
}

function changeModalQty(delta) {
  currentModalQty += delta;
  if (currentModalQty < 1) currentModalQty = 1; 
  updateSizeModalPriceUI();
}

function updateSizeModalPriceUI() {
  if (!currentSelectedProduct) return;
  document.getElementById('modalQtyNum').textContent = currentModalQty;
  const singlePrice = currentSelectedProduct.price + currentSizeSurplus;
  const totalPrice = singlePrice * currentModalQty;
  document.getElementById('modalTotalPrice').textContent = fmt(totalPrice);
}

// ===== XÁC NHẬN THÊM VÀO GIỎ =====
function confirmAddToCart() {
  const finalPrice = currentSelectedProduct.price + currentSizeSurplus;
  const existing = cart.find(c => c.id === currentSelectedProduct.id && c.size === currentSelectedSize);

  if (existing) {
    existing.qty += currentModalQty;
  } else {
    cart.push({
      ...currentSelectedProduct,
      price: finalPrice, 
      size: currentSelectedSize,
      qty: currentModalQty
    });
  }

  updateCartUI();
  closeSizeModal();
  showToast(`🛒 Đã thêm x${currentModalQty} ${currentSelectedProduct.name} (Size ${currentSelectedSize})!`);
}
 
// ===== ĐIỀU CHỈNH SỐ LƯỢNG TRONG GIỎ HÀNG =====
function changeQty(id, size, delta) {
  const item = cart.find(c => c.id === id && c.size === size);
  if (!item) return;
 
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => !(c.id === id && c.size === size));
 
  updateCartUI();
}
 
// ===== CẬP NHẬT GIAO DIỆN GIỎ HÀNG =====
function updateCartUI() {
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const count = cart.reduce((s, c) => s + c.qty, 0);
 
  document.getElementById('cartCount').textContent = count;
 
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
 
  if (!cart.length) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="big">🛒</div>
        <p>Giỏ hàng trống!</p>
        <p style="font-size:13px;margin-top:6px;color:#aaa;">Thêm món ngon vào nhé 😋</p>
      </div>`;
    footerEl.style.display = 'none';
    return;
  }
 
  itemsEl.innerHTML = cart.map(c => `
    <div class="cart-item">
      <img src="${c.image}" alt="${c.name}" style="width:40px; height:40px; object-fit:cover; border-radius:6px; margin-right:10px;">
      <div class="cart-item-info">
        <div class="cart-item-name">${c.name} <span style="color:#ff5722; font-weight:bold; font-size:12px;">[Size ${c.size}]</span></div>
        <div class="cart-item-price">${fmt(c.price)}</div>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="changeQty(${c.id}, '${c.size}', -1)">−</button>
        <span class="qty-num">${c.qty}</span>
        <button class="qty-btn" onclick="changeQty(${c.id}, '${c.size}', 1)">+</button>
      </div>
    </div>
  `).join('');
 
  document.getElementById('cartTotal').textContent = fmt(total);
  footerEl.style.display = 'block';
}
 
// ===== MỞ / ĐÓNG GIỎ HÀNG =====
function openCart() {
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartSidebar').classList.add('open');
  document.body.style.overflow = 'hidden';
}
 
function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartSidebar').classList.remove('open');
  document.body.style.overflow = '';
}
 
// ===== MODAL XÁC NHẬN ĐƠN HÀNG =====
function openOrderModal() {
  closeCart();
 
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  let lines = cart.map(c =>
    `<div class="order-line">
      <span>📸 ${c.name} (Size ${c.size}) x${c.qty}</span>
      <span>${fmt(c.price * c.qty)}</span>
    </div>`
  ).join('');
  lines += `<div class="order-line total"><span>Tổng cộng</span><span>${fmt(total)}</span></div>`;
 
  document.getElementById('modalSummary').innerHTML =
    `<div class="order-summary-title">🧾 Đơn hàng của bạn</div>${lines}`;
 
  document.getElementById('orderModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
 
function closeOrderModal() {
  document.getElementById('orderModal').classList.remove('open');
  document.body.style.overflow = '';
  openCart();
}
 
// ===== GỬI ĐƠN HÀNG LÊN FIREBASE & BẮN THÔNG BÁO TELEGRAM (BẢN TỐI ƯU 100%) =====
function submitOrder() {
  const name    = document.getElementById('cusName').value.trim();
  const phone   = document.getElementById('cusPhone').value.trim();
  const address = document.getElementById('cusAddress').value.trim();
  const note    = document.getElementById('cusNote').value.trim();
 
  if (!name || !phone || !address) {
    showToast('⚠️ Vui lòng điền đủ thông tin bắt buộc!');
    return;
  }
 
  const payment = document.getElementById('cusPayment').value;
  const payText = { cod: 'Tiền mặt COD', banking: 'Chuyển khoản', momo: 'MoMo', zalo: 'ZaloPay' }[payment];
  const total   = cart.reduce((s, c) => s + c.price * c.qty, 0);

  const danhSachMonAn = cart.map(c => `${c.name} [Size ${c.size}] (x${c.qty})`).join(', ');
  const thoiGianHienTai = new Date().toLocaleString('vi-VN');

  if (typeof database === 'undefined') {
    alert('Lỗi: Hệ thống Firebase chưa được tải thành công!');
    return;
  }

  // Khóa nút đặt hàng để chặn spam đơn bấm liên tục
  const submitBtn = document.querySelector('.submit-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Đang xử lý đơn hàng...';
  }

  // 1. Đẩy dữ liệu lên Firebase Realtime Database
  database.ref('don_hang').push({
    tenKhachhang: name,
    soDienThoai: phone,
    diaChi: address,
    phuongThucTT: payText,
    ghiChu: note || "Không có",
    monAn: danhSachMonAn,
    gia: fmt(total),
    thoiGian: thoiGianHienTai,
    trangThai: "Chờ xử lý"
  })
  .then(() => {
    // 2. BẮN TELEGRAM ĐỘC LẬP (Firebase thành công là chạy ngay)
    try {
      const TOKEN_BOT = "8626165001:AAGkRnfpDXHP1QAm2cc52Vfg8HnYV3lCME"; //
      const CHAT_ID = "7994959261"; //

      const noiDungTinNhan = `
🔔 <b>CÓ ĐƠN HÀNG MỚI - TIỆM HAI SÁU</b>  
━━━━━━━━━━━━━━━━━━
👤 <b>Khách hàng:</b> ${name}
📞 <b>Số điện thoại:</b> ${phone}
📍 <b>Địa chỉ giao:</b> ${address}
🛒 <b>Món đặt:</b> ${danhSachMonAn}
💰 <b>Tổng tiền:</b> ${fmt(total)}
💳 <b>Thanh toán:</b> ${payText}
📝 <b>Ghi chú:</b> ${note || "Không có"}
⏰ <b>Thời gian:</b> ${thoiGianHienTai}
━━━━━━━━━━━━━━━━━━
👉 <i>Vui lòng chuẩn bị món ăn cho khách ngay nhé!</i>
`;

      fetch(`https://api.telegram.org/bot${TOKEN_BOT}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: CHAT_ID, text: noiDungTinNhan, parse_mode: "HTML" })
      })
      .then(res => console.log("Gửi API Telegram hoàn tất!"))
      .catch(err => console.error("Lỗi mạng khi gọi Telegram:", err));

    } catch (teleErr) {
      console.error("Lỗi xử lý tin nhắn Telegram:", teleErr);
    }

    // 3. Đóng form hiển thị thành công cho khách hàng
    document.getElementById('orderModal').classList.remove('open');
    document.getElementById('successMsg').innerHTML =
      `Cảm ơn <strong>${name}</strong>!<br>
       Đơn hàng <strong>${fmt(total)}</strong> đã được ghi nhận hệ thống.<br>
       Thanh toán: ${payText}<br>
       Giao đến: <em>${address}</em> 🚀`;
    
    document.getElementById('successModal').classList.add('open');
    
    // Reset trạng thái giỏ hàng sạch sẽ
    cart = [];
    updateCartUI();
    ['cusName', 'cusPhone', 'cusAddress', 'cusNote'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  })
  .catch((error) => {
    console.error("Lỗi gửi đơn hàng lên Firebase: ", error);
    showToast('❌ Gửi đơn hàng thất bại, vui lòng thử lại!');
  })
  .finally(() => {
    // Khôi phục nút bấm về ban đầu
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '✅ Xác nhận đặt hàng';
    }
  });
}
 
// ===== MODAL THÀNH CÔNG =====
function closeSuccess() {
  document.getElementById('successModal').classList.remove('open');
  document.body.style.overflow = '';
}
 
// ===== TOAST THÔNG BÁO =====
function showToast(msg) {
  const t = document.getElementById('toast');
  if(t) {
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2200);
  }
}
 
// ===== KHỞI CHẠY =====
renderProducts('all');