# link video:

https://cmcuni-my.sharepoint.com/:v:/g/personal/bcs240041\_st\_cmcu\_edu\_vn/IQCaZ-kGky3yQ4WUJzhGEQZpAVd8pMKfuOKCWADaTg\_Yz4U?e=DhE0UT\&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D

## Hướng dẫn front-end (web, mobile) connect API

### 1. Gọi API thêm sản phẩm (POST)
- **URL**: `/api/products`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "name": "Sản phẩm A",
  "price": 10000
}
```

- **Ví dụ sử dụng fetch (JavaScript)**:
```javascript
fetch('https://localhost:7208/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Sản phẩm A', price: 10000 })
})
.then(res => res.json())
.then(data => console.log('Thành công:', data))
.catch(err => console.error('Lỗi:', err));
```

### 2. Gọi API lấy thông tin sản phẩm (GET)
- **URL**: `/api/products/{id}` (với `{id}` là số nguyên dương, ví dụ `/api/products/1`)
- **Method**: `GET`

- **Ví dụ sử dụng fetch (JavaScript)**:
```javascript
fetch('https://localhost:7208/api/products/1')
.then(res => {
    if (!res.ok) throw new Error('Không tìm thấy hoặc lỗi server');
    return res.json();
})
.then(data => console.log('Thông tin sản phẩm:', data))
.catch(err => console.error('Lỗi:', err));
```
