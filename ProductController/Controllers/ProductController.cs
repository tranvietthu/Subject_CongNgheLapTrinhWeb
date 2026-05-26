using Microsoft.AspNetCore.Mvc;

namespace ProductController.Controllers
{
    public class ProductController : Controller
    {
        // Action 1: Detail
        // Nhận tham số 'id' qua URL (ví dụ: /Product/Detail/5)
        // Hiển thị: Product ID = 5
        public IActionResult Detail(int id)
        {
            return Content($"Product ID = {id}");
        }

        // Action 2: Category
        // Nhận tham số 'name' qua Query String (ví dụ: /Product/Category?name=Laptop)
        // Hiển thị: Category = Laptop
        public IActionResult Category(string name)
        {
            return Content($"Category = {name}");
        }
    }
}
