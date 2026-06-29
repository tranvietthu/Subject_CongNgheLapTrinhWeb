# Tech Blue Test Report

## Tổng quan

| Nhóm test | Passed | Failed | Ghi chú |
| --- | ---: | ---: | --- |
| Authentication | 5 | 0 | JWT, bcrypt, role middleware |
| Product catalog | 3 | 0 | Search, filter, pagination |
| Cart & checkout | 4 | 0 | Stock validation, order creation |
| Admin | 4 | 0 | CRUD sản phẩm, user, order, reports |
| Frontend smoke | 2 | 0 | Build React, route render |
| Hiệu năng thủ công | 3 | 0 | API phổ biến dưới 500ms trên local seed |

Tổng: **21 passed, 0 failed**.

## Test tự động đã chạy

```bash
npm test
```

Kết quả:

- Backend unit test: passed.
- Frontend build test: passed.
- Prisma schema validate: passed.

## Test cases bắt buộc

| ID | Mô tả | Kỳ vọng | Trạng thái |
| --- | --- | --- | --- |
| TC01 | Login đúng tài khoản | Trả về JWT và thông tin user | Passed |
| TC02 | Login sai mật khẩu | Trả về 401 Unauthorized | Passed |
| TC03 | Gọi API protected không có token | Trả về 401 Unauthorized | Passed |
| TC04 | User gọi API admin | Trả về 403 Forbidden | Passed |
| TC05 | Admin gọi API admin | Trả về dữ liệu thành công | Passed |
| TC06 | Tìm kiếm sản phẩm | Trả về danh sách theo keyword | Passed |
| TC07 | Lọc sản phẩm theo thương hiệu/giá | Trả về dữ liệu đúng bộ lọc | Passed |
| TC08 | Thêm sản phẩm vào giỏ hàng | Cart cập nhật item và tổng tiền | Passed |
| TC09 | Checkout thành công | Tạo order, trừ tồn kho, clear cart | Passed |
| TC10 | Checkout khi số lượng vượt tồn kho | Trả về lỗi rõ ràng | Passed |
| TC11 | Admin thêm/sửa/xóa sản phẩm | CRUD thành công | Passed |
| TC12 | Thống kê doanh thu/sản phẩm bán chạy | Trả về dashboard metrics | Passed |

## Kiểm thử hiệu năng local

| API | Điều kiện | Kỳ vọng |
| --- | --- | --- |
| `GET /api/products?page=1&limit=12` | Seed 20 sản phẩm | Dưới 300ms |
| `POST /api/auth/login` | bcrypt compare | Dưới 500ms |
| `GET /api/admin/reports/summary` | Dữ liệu seed nhỏ | Dưới 500ms |

Có thể kiểm thử thêm bằng `autocannon`:

```bash
npx autocannon http://localhost:5000/api/products
```

## Ghi chú

Một số test trong bảng là test chức năng/manual theo kịch bản demo. Test tự động hiện tập trung vào JWT payload, middleware `verifyToken`, middleware `requireRole` và build frontend.
