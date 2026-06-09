using Microsoft.AspNetCore.Mvc;

namespace bai4_5.Controllers
{
    public class BookController : Controller
    {
        public IActionResult Index()
        {
            return Content("Đây là trang danh sách sách");
        }

        public IActionResult Detail(int id)
        {
            return Content($"Đây là trang chi tiết sách có ID: {id}");
        }
    }
}