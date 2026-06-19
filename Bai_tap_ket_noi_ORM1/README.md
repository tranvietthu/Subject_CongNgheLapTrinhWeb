# link video:

https://docs.google.com/videos/d/1y502eGPVmwjV53uHlUruNoG6fB8hZt9ETYG7DhbkW0c/edit?usp=sharing



## Hướng dẫn kết nối API (Front-end / Postman)

Ứng dụng chạy API tại đường dẫn: `https://localhost:<port>` hoặc `http://localhost:<port>` (Thay `<port>` bằng port khi bạn chạy ứng dụng, ví dụ `5001` hoặc `5000`).

### 1\. API Thêm mới sản phẩm (POST /api/products)

Dùng để thêm một sản phẩm mới vào cơ sở dữ liệu.

* **URL:** `/api/products`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`
* **Body (JSON):**

```json
{
  "name": "Sản phẩm A",
  "price": 100.5
}
```

* **Ràng buộc dữ liệu (Validation):**

  * `name`: Bắt buộc, tối thiểu 3 ký tự.
  * `price`: Bắt buộc, giá trị > 0.
* **Kết quả thành công (201 Created):** Trả về thông tin sản phẩm vừa tạo.
* **Kết quả lỗi Validation (400 Bad Request):** Trả về danh sách lỗi. Ví dụ:

```json
{
  "errors": \[
    "Name must be at least 3 characters.",
    "Price must be greater than 0."
  ]
}
```

### 2\. API Lấy thông tin sản phẩm (GET /api/products/{id})

Dùng để lấy thông tin chi tiết của một sản phẩm dựa vào ID.

* **URL:** `/api/products/{id}` (ví dụ: `/api/products/1`)
* **Method:** `GET`
* **Ràng buộc dữ liệu (Validation):**

  * `id`: Phải là số nguyên dương (> 0).
* **Kết quả thành công (200 OK):**

```json
{
  "id": 1,
  "name": "Sản phẩm A",
  "price": 100.5
}
```

* **Kết quả lỗi (400 Bad Request):** Nếu ID <= 0.
* **Kết quả lỗi (404 Not Found):** Nếu không tìm thấy sản phẩm.

