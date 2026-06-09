Bài tập buổi 5: sử dụng Middleware cơ bản

link video: https://www.loom.com/share/716347d94b0e4ca6a4990cd8deb32e30



1\. Middleware trong ASP.NET Core dùng để làm gì?

Middleware là các đoạn code được lắp ráp vào một (pipeline) để xử lý các luồng HTTP Request (yêu cầu) và Response (phản hồi). Nó dùng để thực hiện các tác vụ chung trước hoặc sau khi request đi vào Controller, ví dụ như: ghi log, xác thực người dùng (Authentication), phân quyền, xử lý lỗi, hoặc điều hướng request.



2\. Middleware khác Controller ở điểm nào?



Middleware: Chịu trách nhiệm cho các xử lý mang tính hệ thống, dùng chung cho toàn bộ hoặc một nhóm lớn các request (Ví dụ: mọi request đều phải đi qua middleware ghi log).



Controller: Chịu trách nhiệm xử lý logic nghiệp vụ cụ thể cho từng đường dẫn (URL) riêng biệt, tương tác với Model và trả về View tương ứng.



3\. Dòng lệnh await \_next(context); có ý nghĩa gì?

Dòng lệnh này có ý nghĩa là chuyển giao quyền xử lý cho Middleware tiếp theo nằm trong pipeline. Nó mang theo đối tượng context (chứa toàn bộ thông tin của request hiện tại) để các middleware phía sau hoặc Controller có thể tiếp tục xử lý.



4\. Vì sao khi middleware trả về return; thì request không đi tiếp vào Controller?

Vì khi dùng return; mà không gọi lệnh await \_next(context);, luồng xử lý sẽ bị ngắt ngang tại Middleware đó. Hiện tượng này gọi là "đoản mạch" (short-circuit). Hệ thống hiểu rằng request đã được xử lý xong (hoặc bị từ chối), do đó nó sẽ không đi tiếp tới Controller nữa mà quay đầu trả luôn Response về cho client.



5\. Nếu đặt middleware sau app.MapControllerRoute(...) thì có thể xảy ra vấn đề gì?

Vấn đề xảy ra là Middleware của bạn sẽ không bao giờ được chạy. MapControllerRoute (thuộc Endpoint Middleware) thường là điểm dừng cuối cùng của pipeline. Tại đây, nó gọi vào Controller để xử lý và trả về kết quả luôn chứ không gọi ủy thác \_next nữa. Do đó, các middleware khai báo sau nó sẽ bị bỏ qua.



6\. Nếu cần sử dụng thêm middleware khác thì viết tiếp thế nào?

Chỉ cần tạo một class Middleware mới (ví dụ: CustomMiddleware), sau đó vào file Program.cs và đăng ký nó bằng cú pháp:

app.UseMiddleware<CustomMiddleware>();



