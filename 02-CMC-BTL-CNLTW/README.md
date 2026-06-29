# Tech Blue - Website bán điện thoại online

Tech Blue là đồ án môn **Công nghệ Lập trình Web** xây dựng hệ thống bán điện thoại online với giao diện tông xanh công nghệ, có xác thực JWT, phân quyền USER/ADMIN, quản lý sản phẩm, giỏ hàng, đơn hàng và thống kê doanh thu.

## Công nghệ sử dụng

| Thành phần | Công nghệ |
| --- | --- |
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MySQL |
| ORM | Prisma |
| Authentication | JWT + bcrypt |
| UI | CSS responsive + lucide-react |

## Chức năng chính

### Khách vãng lai

- Xem trang chủ.
- Xem danh sách sản phẩm.
- Xem chi tiết sản phẩm.
- Tìm kiếm và lọc sản phẩm theo thương hiệu, giá, tình trạng, khuyến mãi.

### Người dùng

- Đăng ký tài khoản.
- Đăng nhập và nhận JWT.
- Cập nhật thông tin cá nhân.
- Đổi mật khẩu.
- Thêm, sửa, xóa sản phẩm trong giỏ hàng.
- Đặt hàng và chọn phương thức thanh toán.
- Xem lịch sử đơn hàng.

### Quản trị viên

- Đăng nhập trang quản trị.
- Quản lý sản phẩm.
- Quản lý danh mục.
- Quản lý thương hiệu.
- Quản lý đơn hàng.
- Quản lý người dùng.
- Xem thống kê doanh thu, sản phẩm bán chạy, tồn kho, tổng đơn hàng và tổng người dùng.

## JWT Authentication

Luồng xác thực của hệ thống:

1. Client gửi email/password tới `POST /api/auth/login`.
2. Server kiểm tra thông tin đăng nhập.
3. Nếu hợp lệ, server tạo JWT có payload gồm `userId`, `email`, `role`.
4. Client lưu JWT trong `localStorage`.
5. Client gửi JWT ở các API cần đăng nhập bằng header:

```http
Authorization: Bearer <JWT>
```

6. Server kiểm tra JWT bằng middleware `verifyToken`.
7. Server kiểm tra quyền bằng middleware `requireRole`.
8. Nếu thiếu/sai token trả `401 Unauthorized`.
9. Nếu token hợp lệ nhưng không đủ quyền trả `403 Forbidden`.

## Cấu trúc thư mục

```text
CMC_CNLTweb/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── state/
│   │   └── styles.css
├── README.md
├── TEST_REPORT.md
└── PROMPT_DO_AN.md
```

## Yêu cầu môi trường

- Node.js 20+
- MySQL 8+
- npm

## Cài dependencies

```bash
npm install
npm run install:all
```

## Tạo database

Tạo database MySQL:

```sql
CREATE DATABASE tech_blue CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Sao chép file môi trường:

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

Cập nhật `DATABASE_URL` trong `backend/.env` theo tài khoản MySQL của bạn.

Ví dụ:

```env
PORT=5000
DATABASE_URL="mysql://root:password@localhost:3306/tech_blue"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="7d"
CLIENT_URL="http://localhost:5173"
```

## Migration và seed dữ liệu

```bash
npm run prisma:generate --prefix backend
npm run prisma:migrate --prefix backend
npm run seed --prefix backend
```

Seed data gồm:

- 1 tài khoản admin.
- 1 tài khoản user.
- 20 sản phẩm điện thoại mẫu thuộc Apple, Samsung, Xiaomi, Oppo, Vivo.

## Chạy project

Chạy backend và frontend cùng lúc:

```bash
npm run dev
```

Hoặc chạy riêng:

```bash
npm run dev:backend
npm run dev:frontend
```

Đường dẫn local:

- Backend: <http://localhost:5000>
- Frontend: <http://localhost:5173>
- Health check: <http://localhost:5000/api/health>

## Tài khoản demo

| Role | Email | Password |
| --- | --- | --- |
| ADMIN | `admin@techblue.vn` | `Admin@123` |
| USER | `user@techblue.vn` | `User@123` |

## API chính

### Authentication

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập, trả JWT |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại |

### Product

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| GET | `/api/products` | Danh sách, tìm kiếm, lọc, phân trang |
| GET | `/api/products/:id` | Chi tiết sản phẩm |

### Cart

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| GET | `/api/cart` | Xem giỏ hàng |
| POST | `/api/cart/items` | Thêm sản phẩm vào giỏ |
| PUT | `/api/cart/items/:id` | Cập nhật số lượng |
| DELETE | `/api/cart/items/:id` | Xóa khỏi giỏ |

### Order

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| POST | `/api/orders` | Checkout, tạo đơn hàng |
| GET | `/api/orders/my` | Lịch sử đơn hàng |

### Admin

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| GET | `/api/admin/products` | Danh sách sản phẩm admin |
| POST | `/api/admin/products` | Thêm sản phẩm |
| PUT | `/api/admin/products/:id` | Sửa sản phẩm |
| DELETE | `/api/admin/products/:id` | Ẩn sản phẩm |
| GET | `/api/admin/orders` | Quản lý đơn hàng |
| PUT | `/api/admin/orders/:id/status` | Cập nhật trạng thái đơn |
| GET | `/api/admin/users` | Quản lý người dùng |
| GET | `/api/admin/reports/summary` | Thống kê tổng quan |

## Test

Chạy test:

```bash
npm test
```

Kết quả đã kiểm tra:

- Backend unit test pass.
- Frontend production build pass.
- Prisma schema validate pass.

Báo cáo test nằm tại [TEST_REPORT.md](TEST_REPORT.md).

## Ghi chú khi upload GitHub

Không upload các thư mục sinh tự động:

- `node_modules/`
- `frontend/dist/`
- `.env`
- file log

Các file này đã được khai báo trong `.gitignore`.

Lệnh commit và push:

```bash
git status
git add .
git commit -m "Update Tech Blue project"
git push
```

Nếu GitHub README bị dính thành một dòng, hãy kiểm tra:

- File phải lưu bằng UTF-8.
- Heading phải có dòng trống phía trước/sau.
- Code block phải dùng đúng ba dấu backtick.
- Không copy nội dung có ký tự `\n` dạng text thay vì xuống dòng thật.

## Deploy frontend lên GitHub Pages

Repo này có sẵn workflow tại `.github/workflows/deploy.yml` để build thư mục `frontend` và deploy `frontend/dist` lên GitHub Pages.

Các bước trên GitHub:

1. Vào repository trên GitHub.
2. Chọn **Settings**.
3. Chọn **Pages**.
4. Ở mục **Source**, chọn **GitHub Actions**.
5. Push code lên nhánh `main` hoặc `master`.
6. Vào tab **Actions** để chờ workflow deploy chạy xong.

Sau khi deploy thành công, link web sẽ có dạng:

```text
https://<username>.github.io/02-CMC-BTL-CNLTW/
```

Lưu ý:

- GitHub Pages chỉ chạy được frontend tĩnh.
- Backend Node.js/Express và MySQL không chạy trực tiếp trên GitHub Pages.
- Muốn demo đầy đủ API thật, cần deploy backend lên dịch vụ khác như Render, Railway hoặc VPS.
- Bản frontend có fallback demo data để vẫn xem giao diện và đăng nhập demo trên GitHub Pages.
