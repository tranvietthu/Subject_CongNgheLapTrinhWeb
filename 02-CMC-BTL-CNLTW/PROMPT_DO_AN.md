# Prompt đồ án Tech Blue

## Vai trò

Bạn là lập trình viên fullstack hỗ trợ xây dựng đồ án môn **Công nghệ Lập trình Web**.

## Tên đề tài

**Hệ thống quản lý bán điện thoại online - Tech Blue**

## Mục tiêu

Xây dựng website bán điện thoại online có giao diện hiện đại, tông màu xanh công nghệ. Website hỗ trợ khách hàng xem, tìm kiếm, lọc sản phẩm, xem chi tiết, thêm sản phẩm vào giỏ hàng, đặt hàng, thanh toán, xem lịch sử đơn hàng. Đồng thời hệ thống hỗ trợ admin quản lý sản phẩm, danh mục, thương hiệu, đơn hàng, người dùng và thống kê doanh thu.

## Công nghệ đề xuất

- Frontend: React + Vite.
- Backend: Node.js + Express.
- Database: MySQL.
- ORM: Prisma.
- Authentication: JWT + bcrypt.
- Authorization: phân quyền theo role USER/ADMIN.

## Yêu cầu JWT bắt buộc

1. Client gửi thông tin đăng nhập gồm email/password tới server.
2. Server xác thực thông tin đăng nhập.
3. Password trong database phải được hash bằng bcrypt.
4. Nếu đăng nhập thành công, server tạo JWT.
5. JWT payload gồm:
   - `userId`
   - `email`
   - `role`
6. Server trả JWT về client.
7. Client lưu JWT.
8. Client gửi JWT ở các API cần đăng nhập bằng HTTP header:

```http
Authorization: Bearer <JWT>
```

9. Server kiểm tra JWT ở mỗi request cần bảo vệ.
10. Nếu không có token hoặc token sai, server trả `401 Unauthorized`.
11. Nếu token đúng nhưng role không đủ quyền, server trả `403 Forbidden`.

## Role trong hệ thống

| Role | Quyền |
| --- | --- |
| GUEST | Xem trang chủ, xem danh sách sản phẩm, xem chi tiết sản phẩm, tìm kiếm/lọc |
| USER | Giỏ hàng, đặt hàng, lịch sử đơn hàng, đánh giá sản phẩm, cập nhật hồ sơ |
| ADMIN | Quản lý sản phẩm, danh mục, thương hiệu, đơn hàng, người dùng, thống kê |

## Backend cần xây dựng

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- Middleware `verifyToken`
- Middleware `requireRole("ADMIN")`
- JWT secret đọc từ `.env`
- Token có thời hạn hợp lý

### Product catalog

- Lấy danh sách sản phẩm.
- Xem chi tiết sản phẩm.
- Tìm kiếm theo tên.
- Lọc theo thương hiệu, giá, tình trạng mới/cũ, khuyến mãi, dung lượng.
- Phân trang.
- Hiển thị tồn kho.

### Cart

- Thêm sản phẩm vào giỏ hàng.
- Cập nhật số lượng.
- Xóa sản phẩm khỏi giỏ.
- Tính tổng tiền.
- Kiểm tra tồn kho trước checkout.

### Order

- Nhập địa chỉ giao hàng.
- Chọn phương thức thanh toán: COD, Banking, Credit Card mock.
- Tạo đơn hàng.
- Lưu chi tiết đơn hàng.
- Trừ tồn kho khi đặt hàng thành công.
- Xem trạng thái đơn hàng: chờ xác nhận, đang giao, hoàn thành, hủy.

### Admin

- Quản lý sản phẩm.
- Quản lý danh mục.
- Quản lý thương hiệu.
- Quản lý đơn hàng.
- Quản lý user.
- Thống kê doanh thu, sản phẩm bán chạy, sản phẩm tồn kho, tổng đơn hàng, tổng người dùng.

## Database chính

- `users`
- `categories`
- `brands`
- `products`
- `product_variants`
- `product_images`
- `carts`
- `cart_items`
- `orders`
- `order_items`
- `reviews`
- `promotions`

## Frontend pages

- `/`
- `/login`
- `/register`
- `/products`
- `/products/:id`
- `/cart`
- `/checkout`
- `/orders`
- `/profile`
- `/admin`
- `/admin/products`
- `/admin/orders`
- `/admin/users`
- `/admin/reports`

## Seed data

Tạo dữ liệu mẫu:

- Admin: `admin@techblue.vn` / `Admin@123`
- User: `user@techblue.vn` / `User@123`
- Ít nhất 20 sản phẩm điện thoại thuộc Apple, Samsung, Xiaomi, Oppo, Vivo.

## Test cases

1. Login đúng tài khoản trả JWT.
2. Login sai mật khẩu trả 401.
3. Gọi API protected không token trả 401.
4. User gọi API admin trả 403.
5. Admin gọi API admin thành công.
6. Tìm kiếm sản phẩm.
7. Lọc sản phẩm theo thương hiệu/giá.
8. Thêm sản phẩm vào giỏ hàng.
9. Checkout thành công.
10. Checkout vượt tồn kho trả lỗi.
11. Admin thêm/sửa/xóa sản phẩm.
12. Thống kê doanh thu/sản phẩm bán chạy.

## Yêu cầu README

README cần có:

- Mô tả project.
- Công nghệ sử dụng.
- Hướng dẫn cài dependencies.
- Hướng dẫn tạo database.
- Hướng dẫn migration/seed.
- Hướng dẫn chạy backend/frontend.
- Danh sách API chính.
- Tài khoản test.
- Hướng dẫn chạy test.

## Kết quả mong muốn

- Project chạy local.
- Có `.env.example`.
- Có README rõ ràng.
- Có báo cáo test.
- Có JWT Auth đúng yêu cầu.
- Có phân quyền USER/ADMIN.
- Giao diện đủ đẹp để quay video demo.
- Không lỗi khi chạy `npm install`, `npm run dev`, `npm test`.
