using Microsoft.AspNetCore.Mvc;
using bai4_5.Models;
using System.Collections.Generic;
using System.Linq;

namespace bai4_5.Controllers
{
    public class BookController : Controller
    {
        // Giả lập Database bằng một danh sách tĩnh
        private static List<Book> _books = new List<Book>
        {
            new Book { Id = 1, Name = "Lập trình C# cơ bản", Price = 150000 },
            new Book { Id = 2, Name = "ASP.NET Core MVC", Price = 200000 }
        };

        // 1. Hiển thị danh sách sách (Giao diện 1)
        public IActionResult Index()
        {
            return View(_books);
        }

        // 2. Action cho Middleware kiểm tra (Có sẵn từ bài trước)
        public IActionResult Detail(int id)
        {
            var book = _books.FirstOrDefault(b => b.Id == id);
            if (book == null) return Content("Không tìm thấy sách");
            return Content($"Đây là trang chi tiết sách: {book.Name} - Giá: {book.Price}");
        }

        // 3. Hiển thị Form thêm sách (Giao diện 2 - Phương thức GET)
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // 4. Xử lý dữ liệu khi người dùng bấm nút "Thêm" (Phương thức POST)
        [HttpPost]
        public IActionResult Create(Book book)
        {
            // Kiểm tra tính hợp lệ của dữ liệu dựa trên Model (ModelState)
            if (ModelState.IsValid)
            {
                // Tự động tăng ID
                book.Id = _books.Any() ? _books.Max(b => b.Id) + 1 : 1;
                _books.Add(book);

                // Nếu thành công, chuyển hướng về trang danh sách
                return RedirectToAction("Index");
            }

            // Nếu dữ liệu bị lỗi (tên trống, giá < 0), trả lại Form kèm thông báo lỗi
            return View(book);
        }
    }
}