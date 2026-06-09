using Bai6.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace Bai6.Controllers
{
    public class PhoneController : Controller
    {
        // Sử dụng static list để lưu dữ liệu giả lập
        private static List<Phone> phones = new List<Phone>
        {
            new Phone { Id = 1, Name = "iPhone 15 Pro", Brand = "Apple", Price = 25000000, Quantity = 10 },
            new Phone { Id = 2, Name = "Galaxy S24 Ultra", Brand = "Samsung", Price = 24000000, Quantity = 15 }
        };

        // 1. CHỨC NĂNG LIST & TÌM KIẾM (Mở rộng)
        public IActionResult Index(string searchString)
        {
            var phoneList = phones.AsQueryable();

            if (!string.IsNullOrEmpty(searchString))
            {
                phoneList = phoneList.Where(p => p.Name.Contains(searchString, System.StringComparison.OrdinalIgnoreCase)
                                              || p.Brand.Contains(searchString, System.StringComparison.OrdinalIgnoreCase));
            }

            ViewData["CurrentFilter"] = searchString;
            return View(phoneList.ToList());
        }

        // 2. CHỨC NĂNG DETAIL
        public IActionResult Detail(int id)
        {
            var phone = phones.FirstOrDefault(p => p.Id == id);
            if (phone == null) return NotFound();
            return View(phone);
        }

        // 3. CHỨC NĂNG CREATE
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Phone model)
        {
            if (ModelState.IsValid)
            {
                // Tự động tăng ID
                model.Id = phones.Any() ? phones.Max(p => p.Id) + 1 : 1;
                phones.Add(model);

                TempData["SuccessMessage"] = "Thêm điện thoại thành công!"; // Thông báo (Mở rộng)
                return RedirectToAction("Index");
            }
            return View(model);
        }

        // 4. CHỨC NĂNG EDIT
        public IActionResult Edit(int id)
        {
            var phone = phones.FirstOrDefault(p => p.Id == id);
            if (phone == null) return NotFound();
            return View(phone);
        }

        [HttpPost]
        public IActionResult Edit(Phone model)
        {
            if (ModelState.IsValid)
            {
                var phone = phones.FirstOrDefault(p => p.Id == model.Id);
                if (phone != null)
                {
                    phone.Name = model.Name;
                    phone.Brand = model.Brand;
                    phone.Price = model.Price;
                    phone.Quantity = model.Quantity;

                    TempData["SuccessMessage"] = "Cập nhật thông tin thành công!";
                    return RedirectToAction("Index");
                }
            }
            return View(model);
        }

        // 5. CHỨC NĂNG DELETE
        public IActionResult Delete(int id)
        {
            var phone = phones.FirstOrDefault(p => p.Id == id);
            if (phone == null) return NotFound();
            return View(phone); // Hiển thị trang xác nhận xóa
        }

        [HttpPost, ActionName("Delete")]
        public IActionResult DeleteConfirmed(int id)
        {
            var phone = phones.FirstOrDefault(p => p.Id == id);
            if (phone != null)
            {
                phones.Remove(phone);
                TempData["SuccessMessage"] = "Xóa điện thoại thành công!";
            }
            return RedirectToAction("Index");
        }
    }
}