Link video: https://www.loom.com/share/cf58155f1926422599b0629a1d291308

1\. Kiến trúc tổng quan (Mô hình MVC)

Dự án được tổ chức theo mô hình Model - View - Controller:



Models (Models/Phone.cs): Chứa cấu trúc dữ liệu.

Controllers (Controllers/PhoneController.cs): Xử lý logic và điều hướng dữ liệu giữa Model và View.

Views (Views/Phone/...): Chứa giao diện người dùng (HTML/Razor) để hiển thị dữ liệu.

2\. Chi tiết từng thành phần

A. Cấu hình ứng dụng (Program.cs)

File này là điểm bắt đầu của ứng dụng:



Khởi tạo builder và thêm dịch vụ MVC: builder.Services.AddControllersWithViews();

Thiết lập routing mặc định: Khi ứng dụng chạy, nếu không có URL cụ thể, nó sẽ trỏ về Controller Home và Action Index. Tuy nhiên, trọng tâm của bài này nằm ở Controller Phone.

B. Data Model (Models/Phone.cs)

Lớp Phone đại diện cho một sản phẩm điện thoại gồm các thuộc tính: Id, Name (Tên), Brand (Hãng), Price (Giá), và Quantity (Số lượng).



Code sử dụng Data Annotations (như \[Required], \[Range]) để tự động bắt lỗi (validate) dữ liệu nhập vào từ người dùng. Ví dụ: Tên không được để trống, Giá phải lớn hơn 0, Số lượng không được âm.

C. Xử lý Logic (Controllers/PhoneController.cs)

Đây là bộ não điều khiển của ứng dụng quản lý Điện thoại. Đáng chú ý là project này không dùng Database thật mà sử dụng một danh sách ảo (static list) private static List<Phone> phones lưu sẵn 2 điện thoại (iPhone 15 Pro, Galaxy S24 Ultra) làm dữ liệu tạm thời (chỉ tồn tại khi ứng dụng đang chạy).



Controller này cung cấp 5 chức năng chính:



\[Read] Xem danh sách và Tìm kiếm (Index):

Lấy toàn bộ danh sách phones truyền sang View.

Hỗ trợ thêm tính năng tìm kiếm: Nếu người dùng nhập searchString, code sẽ lọc danh sách những điện thoại có Tên hoặc Hãng chứa chuỗi tìm kiếm (không phân biệt hoa/thường).

\[Read] Xem chi tiết (Detail):

Tìm điện thoại theo id. Nếu tìm thấy sẽ chuyển dữ liệu sang trang Detail để hiển thị. Nếu không thấy sẽ trả về lỗi NotFound().

\[Create] Thêm mới (Create):

GET: Trả về form trống để người dùng nhập dữ liệu.

POST (Sau khi bấm nút Submit): Kiểm tra dữ liệu (dựa vào rule bên Model), tự động tạo Id mới bằng cách lấy Id lớn nhất cộng thêm 1, sau đó lưu vào danh sách ảo.

\[Update] Chỉnh sửa (Edit):

GET: Tìm điện thoại theo id và hiển thị thông tin cũ lên form.

POST: Lấy dữ liệu mới từ form và cập nhật lại vào phần tử tương ứng trong danh sách phones.

\[Delete] Xóa (Delete):

GET: Hiển thị một trang để xác nhận xem người dùng có thực sự muốn xóa điện thoại này không.

POST (DeleteConfirmed): Thực hiện xóa đối tượng khỏi danh sách dựa trên id.

(Ngoài ra, các action thêm/sửa/xóa có sử dụng TempData\["SuccessMessage"] để gửi thông báo thành công ra màn hình cho người dùng).



D. Giao diện hiển thị (Views/Phone/...)

Thư mục này chứa các file .cshtml (Razor Views) tương ứng với các action trong Controller:



Index.cshtml: Hiển thị danh sách dạng bảng, có thanh tìm kiếm và các nút "Sửa", "Xóa", "Chi tiết".

Create.cshtml / Edit.cshtml: Các biểu mẫu (form) nhập liệu điện thoại. Có kèm các câu lệnh hiển thị lỗi màu đỏ nếu người dùng nhập sai quy tắc.

Detail.cshtml: Hiển thị thông tin chi tiết của 1 điện thoại.

Delete.cshtml: Trang hỏi xác nhận trước khi xóa dữ liệu.

