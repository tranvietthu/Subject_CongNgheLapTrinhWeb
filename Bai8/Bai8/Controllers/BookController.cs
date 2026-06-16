using Lesson3_CNLTWeb.Data;
using Lesson3_CNLTWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace Lesson3_CNLTWeb.Controllers
{
    public class BookController : Controller
    {
        private readonly BookRepository _bookRepository;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public BookController(BookRepository bookRepository, IWebHostEnvironment webHostEnvironment)
        {
            _bookRepository = bookRepository;
            _webHostEnvironment = webHostEnvironment;
        }

        public IActionResult Index()
        {
            return View(_bookRepository.GetAll());
        }

        public IActionResult Detail(int id)
        {
            var book = _bookRepository.GetById(id);
            if (book == null)
            {
                return NotFound();
            }

            return View(book);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Book book, IFormFile? imageFile)
        {
            if (imageFile != null)
            {
                var extension = Path.GetExtension(imageFile.FileName).ToLower();
                if (extension != ".jpg" && extension != ".png" && extension != ".jpeg")
                {
                    ModelState.AddModelError("ImageUrl", "Chỉ cho phép upload file .jpg hoặc .png");
                }
            }

            if (!ModelState.IsValid)
            {
                return View(book);
            }

            if (imageFile != null)
            {
                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }
                string uniqueFileName = Guid.NewGuid().ToString() + "_" + imageFile.FileName;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    imageFile.CopyTo(fileStream);
                }
                book.ImageUrl = "/images/" + uniqueFileName;
            }

            _bookRepository.Add(book);

            TempData["SuccessMessage"] = "Thêm sách thành công!";
            return RedirectToAction(nameof(Index));
        }

        public IActionResult Edit(int id)
        {
            var book = _bookRepository.GetById(id);
            if (book == null)
            {
                return NotFound();
            }

            return View(book);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, Book book, IFormFile? imageFile, string? existingImageUrl)
        {
            if (id != book.Id)
            {
                return BadRequest();
            }

            if (imageFile != null)
            {
                var extension = Path.GetExtension(imageFile.FileName).ToLower();
                if (extension != ".jpg" && extension != ".png" && extension != ".jpeg")
                {
                    ModelState.AddModelError("ImageUrl", "Chỉ cho phép upload file .jpg hoặc .png");
                }
            }

            if (!ModelState.IsValid)
            {
                book.ImageUrl = existingImageUrl;
                return View(book);
            }

            if (imageFile != null)
            {
                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }
                string uniqueFileName = Guid.NewGuid().ToString() + "_" + imageFile.FileName;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    imageFile.CopyTo(fileStream);
                }
                book.ImageUrl = "/images/" + uniqueFileName;
            }
            else
            {
                book.ImageUrl = existingImageUrl;
            }

            if (!_bookRepository.Update(book))
            {
                return NotFound();
            }

            TempData["SuccessMessage"] = "Cập nhật sách thành công!";
            return RedirectToAction(nameof(Index));
        }

        public IActionResult Delete(int id)
        {
            var book = _bookRepository.GetById(id);
            if (book == null)
            {
                return NotFound();
            }

            return View(book);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            if (!_bookRepository.Delete(id))
            {
                return NotFound();
            }

            TempData["SuccessMessage"] = "Xóa sách thành công!";
            return RedirectToAction(nameof(Index));
        }
    }
}
