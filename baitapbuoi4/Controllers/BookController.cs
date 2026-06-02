using Microsoft.AspNetCore.Mvc;
using baitapbuoi4.Models;

namespace baitapbuoi4.Controllers
{
    public class BookController : Controller
    {
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Book book)
        {
            if (ModelState.IsValid)
            {
                // Xử lý logic khi dữ liệu hợp lệ (ví dụ: lưu vào CSDL)
                ViewBag.Message = "Thêm sách thành công!";
                return View("Success");
            }
            return View(book);
        }
    }
}
