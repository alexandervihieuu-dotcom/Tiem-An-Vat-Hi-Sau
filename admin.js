// 1. Kiểm tra Firebase đã được khởi tạo từ index/admin html chưa
if (typeof firebase !== 'undefined') {
    const database = firebase.database();

    // 2. Lắng nghe dữ liệu thay đổi trên nhánh 'don_hang' theo thời gian thực
    database.ref('don_hang').on('value', (snapshot) => {
        const data = snapshot.val();
        const tableBody = document.querySelector('table tbody') || document.getElementById('adminTableBody'); 
        
        // Nếu giao diện của bạn dùng cấu trúc bảng, hãy chuẩn bị chuỗi HTML để chèn vào
        let htmlContent = "";

        if (data) {
            // Duyệt qua từng đơn hàng lấy về từ Firebase
            Object.keys(data).forEach((key) => {
                const donHang = data[key];
                htmlContent += `
                    <tr>
                        <td>${donHang.thoiGian || ''}</td>
                        <td><strong>${donHang.tenKhachhang || ''}</strong></td>
                        <td>${donHang.soDienThoai || ''}</td>
                        <td>${donHang.monAn || ''}</td>
                        <td><span style="color: #e67e22; font-weight: bold;">${donHang.gia || ''}</span></td>
                        <td><span class="badge-status">${donHang.trangThai || 'Chờ xử lý'}</span></td>
                    </tr>
                `;
            });
        } else {
            htmlContent = `<tr><td colspan="6" style="text-align: center; color: #999;">Chưa có đơn hàng nào hôm nay...</td></tr>`;
        }

        // Thay đổi nội dung hiển thị trên giao diện Admin
        // Lưu ý: Đảm bảo trong file admin.html của bạn có thẻ <tbody> có id là "adminTableBody" hoặc nằm trong thẻ <table>
        const targetEl = document.getElementById('adminTableBody') || document.querySelector('.main-table tbody');
        if (targetEl) {
            targetEl.innerHTML = htmlContent;
        }
    });
}