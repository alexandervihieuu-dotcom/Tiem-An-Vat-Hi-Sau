// ===== DỮ LIỆU SẢN PHẨM =====
const products = [
  // TRÀ
  { id: 1,  name: 'Trà trái cây',    desc: 'Trà trái cây tươi mát, thơm ngon',    price: 25000, emoji: '🍹', cat: 'drink', badge: ''    },
  { id: 2,  name: 'Trà dâu tằm',    desc: 'Dâu tằm tươi, vị chua ngọt dịu',        price: 25000, emoji: '🫐', cat: 'drink', badge: ''    },
  { id: 3,  name: 'Trà xoài',       desc: 'Xoài chín thơm, mát lạnh giải khát',     price: 25000, emoji: '🥭', cat: 'drink', badge: 'hot' },
  { id: 4,  name: 'Trà mãng cầu',   desc: 'Mãng cầu tươi, thanh mát đặc biệt',     price: 25000, emoji: '🍈', cat: 'drink', badge: ''    },
  { id: 5,  name: 'Trà dưa lưới',   desc: 'Dưa lưới ngọt thơm, uống cực đã',       price: 28000, emoji: '🍑', cat: 'drink', badge: 'new' },

  // SỮA CHUA
  { id: 6,  name: 'Sữa chua việt quất', desc: 'Sữa chua mịn, việt quất tươi chua ngọt', price: 28000, emoji: '🫐', cat: 'snack', badge: 'hot' },
  { id: 7,  name: 'Sữa chua xoài',     desc: 'Xoài chín vàng, béo mịn thơm lừng',      price: 28000, emoji: '🥭', cat: 'snack', badge: ''    },
  { id: 8,  name: 'Sữa chua dâu',      desc: 'Dâu tây tươi, chua ngọt hài hòa',         price: 28000, emoji: '🍓', cat: 'snack', badge: ''    },
  { id: 9,  name: 'Sữa chua chanh leo',desc: 'Chanh leo chua thanh, sữa chua mát lạnh',  price: 28000, emoji: '🍋', cat: 'snack', badge: ''    },
  { id: 10, name: 'Sữa chua dưa lưới', desc: 'Dưa lưới ngọt thơm kết hợp sữa chua',    price: 28000, emoji: '🍈', cat: 'snack', badge: ''    },

  // ĂN VẶT
  { id: 11, name: 'Bánh tráng trộn',   desc: 'Bánh tráng trộn đặc biệt, cay ngon',      price: 35000, emoji: '🥗', cat: 'snack', badge: 'hot' },
  { id: 12, name: 'Bánh tráng cuộn',   desc: 'Cuộn giòn nhân thơm, ăn là ghiền',        price: 25000, emoji: '🌯', cat: 'snack', badge: ''    },
  { id: 13, name: 'Xoài kí',           desc: 'Xoài tươi nguyên kí, ngọt giòn',           price: 17000, emoji: '🥭', cat: 'snack', badge: ''    },
  { id: 14, name: 'Xoài cắt hộp',      desc: 'Xoài cắt sẵn tiện lợi, ăn ngay',          price: 25000, emoji: '🍱', cat: 'snack', badge: ''    },
  { id: 15, name: 'Xoài lắc mắm thái', desc: 'Xoài xanh lắc mắm thái chua cay đặc biệt',price: 30000, emoji: '🌶️', cat: 'snack', badge: 'new' },
];
 
// ===== STATE =====
let cart = [];
 
// ===== UTILS =====
function fmt(price) {
  return price.toLocaleString('vi-VN') + '₫';
}
 
// ===== RENDER SẢN PHẨM =====
function renderProducts(cat) {
  const list = cat === 'all' ? products : products.filter(p => p.cat === cat);
 
  document.getElementById('productGrid').innerHTML = list.map(p => `
    <div class="product-card">
      <div class="product-img">
        <span>${p.emoji}</span>
        ${p.badge === 'hot' ? '<span class="badge-hot">🔥 HOT</span>' : ''}
        ${p.badge === 'new' ? '<span class="badge-new">✨ MỚI</span>' : ''}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <span class="product-price">${fmt(p.price)}</span>
          <button class="add-btn" onclick="addToCart(${p.id})">+</button>
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
 
// ===== GIỎ HÀNG =====
function addToCart(id) {
  const prod = products.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);
 
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...prod, qty: 1 });
  }
 
  updateCartUI();
  showToast(prod.emoji + ' Đã thêm ' + prod.name + '!');
}
 
function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
 
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
 
  updateCartUI();
}
 
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
      <span class="cart-item-emoji">${c.emoji}</span>
      <div class="cart-item-info">
        <div class="cart-item-name">${c.name}</div>
        <div class="cart-item-price">${fmt(c.price)}</div>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="changeQty(${c.id}, -1)">−</button>
        <span class="qty-num">${c.qty}</span>
        <button class="qty-btn" onclick="changeQty(${c.id}, 1)">+</button>
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
 
// ===== MODAL ĐẶT HÀNG =====
function openOrderModal() {
  closeCart();
 
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  let lines = cart.map(c =>
    `<div class="order-line">
      <span>${c.emoji} ${c.name} x${c.qty}</span>
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
 
// ===== GỬI ĐƠN HÀNG LÊN FIREBASE =====
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

  // 1. Gộp danh sách các món ăn trong giỏ thành chuỗi text gọn gàng
  const danhSachMonAn = cart.map(c => `${c.name} (x${c.qty})`).join(', ');

  // 2. Kiểm tra xem Firebase đã sẵn sàng chưa đề phòng lỗi tải thư viện
  if (typeof database === 'undefined') {
    alert('Lỗi: Hệ thống Firebase chưa được tải thành công. Vui lòng kiểm tra lại kết nối mạng!');
    return;
  }

  // 3. Đẩy dữ liệu trực tiếp lên nhánh 'don_hang' trên Firebase Realtime Database
  database.ref('don_hang').push({
    tenKhachhang: name,
    soDienThoai: phone,
    diaChi: address,
    phuongThucTT: payText,
    ghiChu: note || "Không có",
    monAn: danhSachMonAn,
    gia: fmt(total),
    thoiGian: new Date().toLocaleString('vi-VN'),
    trangThai: "Chờ xử lý"
  })
  .then(() => {
    // 4. Nếu đẩy thành công, xử lý đóng form và hiển thị giao diện thành công cho khách
    document.getElementById('orderModal').classList.remove('open');
    document.getElementById('successMsg').innerHTML =
      `Cảm ơn <strong>${name}</strong>!<br>
       Đơn hàng <strong>${fmt(total)}</strong> đã được ghi nhận hệ thống.<br>
       Thanh toán: ${payText}<br>
       Giao đến: <em>${address}</em> 🚀`;
   
    document.getElementById('successModal').classList.add('open');
   
    // 5. Làm sạch giỏ hàng và reset lại toàn bộ input form
    cart = [];
    updateCartUI();
    ['cusName', 'cusPhone', 'cusAddress', 'cusNote'].forEach(id => {
      document.getElementById(id).value = '';
    });
  })
  .catch((error) => {
    console.error("Lỗi gửi đơn hàng lên Firebase: ", error);
    showToast('❌ Gửi đơn hàng thất bại, vui lòng thử lại!');
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
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}
 
// ===== KHỞI CHẠY =====
renderProducts('all');