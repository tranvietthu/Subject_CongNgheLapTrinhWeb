Bài tập buổi 4



1\. File Models/Book.cs (Định nghĩa các quy tắc kiểm tra)

Trong ASP.NET Core, cách phổ biến và hiệu quả nhất để thực hiện validation là sử dụng Data Annotations (các thuộc tính dữ liệu) gắn trực tiếp lên các thuộc tính của Model.



public class Book

{

&#x20;   \[Display(Name = "Tên sách")]

&#x20;   \[Required(ErrorMessage = "Không được để trống")]

&#x20;   public string Name { get; set; }



&#x20;   \[Display(Name = "Giá")]

&#x20;   \[Required(ErrorMessage = "Không được để trống")]

&#x20;   \[Range(0.01, double.MaxValue, ErrorMessage = "Giá phải lớn hơn 0")]

&#x20;   public double Price { get; set; }

}



\[Display(Name = "Tên sách")]: Dùng để thay đổi tên hiển thị trên giao diện thay vì dùng tên biến Name hay Price.

\[Required(...)]: Yêu cầu bắt buộc người dùng phải nhập thông tin vào trường này. Nếu người dùng để trống, hệ thống sẽ trả về lỗi nằm trong tham số ErrorMessage. (Đáp ứng yêu cầu: Tên rỗng -> Không được để trống).

\[Range(0.01, double.MaxValue, ...)]: Giới hạn giá trị của trường bằng một khoảng số. Ở đây, giá thấp nhất (Minimum) được đặt là 0.01 và cao nhất là vô hạn (double.MaxValue). Điều này đồng nghĩa với việc giá trị nhập vào bắt buộc phải lớn hơn 0. (Đáp ứng yêu cầu: Giá <= 0 -> Giá phải lớn hơn 0).



2\. File Views/Book/Create.cshtml (Giao diện hiển thị form và lỗi)

View là nơi hiển thị Form cho người dùng nhập liệu, đồng thời nhận trách nhiệm hiển thị các lỗi (nếu có) lên màn hình.



<form asp-action="Create">

&#x20;   <!-- Nơi hiển thị lỗi chung của cả form (nếu có) -->

&#x20;   <div asp-validation-summary="ModelOnly" class="text-danger"></div>

&#x20;   

&#x20;   <div class="form-group mb-3">

&#x20;       <label asp-for="Name" class="control-label"></label>

&#x20;       <!-- Thẻ input để nhập liệu -->

&#x20;       <input asp-for="Name" class="form-control" />

&#x20;       <!-- Thẻ span chuyên nhận và in ra dòng thông báo lỗi cho thuộc tính Name -->

&#x20;       <span asp-validation-for="Name" class="text-danger"></span>

&#x20;   </div>

&#x20;   

&#x20;   <!-- ... tương tự cho Price ... -->

</form>



@section Scripts {

&#x20;   @{await Html.RenderPartialAsync("\_ValidationScriptsPartial");}

}



Tag Helper asp-validation-for: Tag này sẽ kiểm tra xem thuộc tính tương ứng (như Name hoặc Price) có đang bị lỗi validation nào từ server trả về hay không. Nếu có, nó sẽ tự động lấy câu ErrorMessage đã được cài đặt trong file Model và in ra màn hình ở phần chữ màu đỏ (text-danger).

\_ValidationScriptsPartial: Phần Scripts ở cuối file gọi đến các thư viện JQuery Validation. Việc này giúp thực hiện Client-side Validation (kiểm tra ngay trên trình duyệt trước khi gửi về server), giúp người dùng thấy lỗi ngay lập tức mà không cần phải tải lại trang, tiết kiệm thời gian và tài nguyên server.



3\. File Controllers/BookController.cs (Xử lý dữ liệu)

Controller đóng vai trò làm trung gian, tiếp nhận dữ liệu từ View gửi lên và kiểm tra tính hợp lệ của dữ liệu đó (Server-side Validation).



\[HttpPost]

public IActionResult Create(Book book)

{

&#x20;   // ModelState.IsValid sẽ kiểm tra toàn bộ dữ liệu (book) được gửi lên

&#x20;   // đối chiếu với các quy tắc \[Required], \[Range]... trong file Model.

&#x20;   if (ModelState.IsValid)

&#x20;   {

&#x20;       // Nếu tất cả dữ liệu đều hợp lệ:

&#x20;       ViewBag.Message = "Thêm sách thành công!";

&#x20;       return View("Success");

&#x20;   }

&#x20;   // Nếu có bất kỳ lỗi nào (tên để trống, hoặc giá <= 0):

&#x20;   // Trả lại View Create và kèm theo các thông báo lỗi để hiển thị.

&#x20;   return View(book);

}



ModelState.IsValid: Đây là cốt lõi của Validation trên Server. Khi bạn nhấn nút "Thêm mới" trên giao diện, ASP.NET Core sẽ gom dữ liệu lại, đưa vào biến book và tự động đối chiếu các trường dữ liệu với các Data Annotations đã đặt bên Model.

Nếu mọi thứ đều tuân thủ luật, ModelState.IsValid trả về true -> Code xử lý thành công sẽ chạy.

Nếu dữ liệu vi phạm luật, ASP.NET Core sẽ tự động nạp các câu lỗi (ErrorMessage) vào hệ thống ModelState. Sau đó hàm return View(book); sẽ đẩy giao diện Form cùng các câu lỗi đó trở lại để hiển thị cho người dùng sửa lại.



Tóm tắt luồng hoạt động:

Bạn vào trang Thêm sách.

Bạn nhập Form (ví dụ: Để trống tên, nhập giá là -5).

(Client-side): Trình duyệt có thể sẽ bám theo Javascript chặn lại ngay và báo chữ đỏ nếu phát hiện lỗi.

(Server-side): Khi dữ liệu được gửi về server (nếu trình duyệt vượt qua hoặc tắt JS), thuộc tính \[Required] sẽ bắt lỗi tên trống, \[Range] sẽ bắt lỗi giá âm. Biến ModelState.IsValid lúc này trở thành false.

Server dừng việc thêm sách, phản hồi ngược trang Form về trình duyệt. Helper asp-validation-for móc nối vào các lỗi trong Model và hiển thị các dòng text "Không được để trống" hay "Giá phải lớn hơn 0" lên màn hình.

