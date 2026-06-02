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
        // Nhận tham số 'name' cùng 2 tham số khác qua Query String (ví dụ: /Product/Category?name=Laptop&brand=Asus&price=15000000)
        // Hiển thị: Category = Laptop, Brand = Asus, Price = 15000000
        public IActionResult Category(string name, string brand, decimal? price)
        {
            return Content($"Category = {name}, Brand = {brand}, Price = {price}");
        }
    }
}
