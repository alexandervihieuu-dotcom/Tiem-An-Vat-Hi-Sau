// 1. Kiểm tra Firebase đã được khởi tạo từ index/admin html chưa
if (typeof firebase !== 'undefined') {
    const database = firebase.database();

    // Hàm cập nhật trạng thái đơn hàng lên Firebase khi click nút nhanh
    window.updateOrderStatus = function(orderId, newStatus) {
        database.ref('don_hang').child(orderId).update({
            trangThai: newStatus
        })
        .then(() => {
            console.log(`Đã cập nhật trạng thái đơn hàng ${orderId} thành: ${newStatus}`);
        })
        .catch((error) => {
            alert('❌ Lỗi cập nhật trạng thái: ' + error.message);
        });
    };

    // Xin quyền hiển thị thông báo Pop-up của hệ thống ngay khi Admin mở trang
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
    }

    // 2. Lắng nghe dữ liệu thay đổi trên nhánh 'don_hang' theo thời gian thực
    database.ref('don_hang').on('value', (snapshot) => {
        const data = snapshot.val();
        
        // Chuẩn bị chuỗi HTML để chèn vào
        let htmlContent = "";

        if (data) {
            // Lấy danh sách key và đảo ngược (.reverse()) để đơn mới nhất hiện lên đầu bảng
            const keys = Object.keys(data).reverse();
            const currentOrderCount = keys.length;

            // Lấy số lượng đơn hàng cũ đã lưu trong bộ nhớ trình duyệt ra để so sánh
            const savedOrderCount = sessionStorage.getItem('last_order_count');

            // ----- LOGIC ĐỔ CHUÔNG BÁO CHUẨN XÁC -----
            if (savedOrderCount !== null) {
                const lastCount = parseInt(savedOrderCount, 10);
                
                // Nếu số lượng đơn hiện tại lớn hơn số lượng đơn cũ lưu trong máy -> Phát chuông!
                if (currentOrderCount > lastCount) {
                    // 1. Phát tiếng chuông Ting Ting
                    const tiengChuong = new Audio('chuong-bao.mp3');
                    tiengChuong.play().then(() => {
                        console.log("🔊 Chuông báo đơn mới nổ thành công!");
                    }).catch(error => {
                        console.log("Trình duyệt chặn tự động phát âm thanh:", error);
                    });

                    // 2. Bắn thông báo Pop-up hệ thống
                    const latestKey = keys[0]; 
                    const donMoiNhat = data[latestKey];
                    if (Notification.permission === "granted" && donMoiNhat) {
                        new Notification("🔔 TIỆM HAI SÁU - CÓ ĐƠN MỚI!", {
                            body: `Khách: ${donMoiNhat.tenKhachhang || 'Ẩn danh'} - Giá: ${donMoiNhat.gia || '0₫'}\nMón: ${donMoiNhat.monAn || ''}`,
                            icon: 'tra-trai-cay.jpg'
                        });
                    }
                }
            }

            // Luôn luôn cập nhật số lượng đơn mới nhất vào bộ nhớ trình duyệt để không bị mất khi reload
            sessionStorage.setItem('last_order_count', currentOrderCount);

            // Duyệt qua từng đơn hàng lấy về từ Firebase để render giao diện
            keys.forEach((key) => {
                const donHang = data[key];
                const currentStatus = donHang.trangThai || 'Chờ xử lý';

                htmlContent += `
                    <tr>
                        <td>${donHang.thoiGian || ''}</td>
                        <td><strong>${donHang.tenKhachhang || ''}</strong></td>
                        <td><a href="tel:${donHang.soDienThoai}">${donHang.soDienThoai || ''}</a></td>
                        <td>${donHang.monAn || ''}</td>
                        <td><span style="color: #ff5722; font-weight: bold;">${donHang.gia || ''}</span></td>
                        <td>
                            <div class="status-action-group">
                                <button class="status-btn btn-wait ${currentStatus === 'Chờ xử lý' ? 'active' : ''}" 
                                    onclick="updateOrderStatus('${key}', 'Chờ xử lý')">⏳ Chờ xử lý</button>
                                    
                                <button class="status-btn btn-confirm ${currentStatus === 'Đã xác nhận' ? 'active' : ''}" 
                                    onclick="updateOrderStatus('${key}', 'Đã xác nhận')">✅ Xác nhận</button>
                                    
                                <button class="status-btn btn-shipping ${currentStatus === 'Đang giao hàng' ? 'active' : ''}" 
                                    onclick="updateOrderStatus('${key}', 'Đang giao hàng')">🚀 Đang giao</button>
                                    
                                <button class="status-btn btn-success ${currentStatus === 'Đã hoàn thành' ? 'active' : ''}" 
                                    onclick="updateOrderStatus('${key}', 'Đã hoàn thành')">🎉 Hoàn thành</button>
                            </div>
                        </td>
                    </tr>
                `;
            });
        } else {
            sessionStorage.setItem('last_order_count', 0);
            htmlContent = `<tr><td colspan="6" style="text-align: center; color: #999;">Chưa có đơn hàng nào hôm nay...</td></tr>`;
        }

        // Thay đổi nội dung hiển thị trên giao diện Admin
        const targetEl = document.getElementById('adminTableBody') || document.querySelector('table tbody') || document.querySelector('.main-table tbody');
        if (targetEl) {
            targetEl.innerHTML = htmlContent;
        }
    });
}