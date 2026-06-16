using Lesson3_CNLTWeb.Models;
using Microsoft.AspNetCore.Mvc;

namespace Lesson3_CNLTWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        // Sử dụng danh sách tĩnh để lưu tạm dữ liệu sản phẩm trong bộ nhớ
        private static readonly List<Product> _products = new List<Product>();

        // POST /api/products
        [HttpPost]
        public IActionResult CreateProduct([FromBody] Product product)
        {
            if (!ModelState.IsValid)
            {
                // Trả về danh sách lỗi nếu dữ liệu không hợp lệ
                return BadRequest(ModelState);
            }

            // Tự động sinh ID cho sản phẩm mới
            product.Id = _products.Count > 0 ? _products.Max(p => p.Id) + 1 : 1;
            
            _products.Add(product);
            
            // Trả về 201 Created cùng với đường dẫn để lấy chi tiết sản phẩm
            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
        }

        // GET /api/products/{id}
        // Sử dụng route constraint ':int:min(1)' để validate id phải là số nguyên dương
        [HttpGet("{id:int:min(1)}")]
        public IActionResult GetProductById(int id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound(new { Message = "Không tìm thấy sản phẩm với ID được yêu cầu" });
            }
            
            return Ok(product);
        }
    }
}
