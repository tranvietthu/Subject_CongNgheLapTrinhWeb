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

        private async Task<string> ProcessUploadedFiles(List<IFormFile>? imageFiles)
        {
            if (imageFiles == null || imageFiles.Count == 0)
                return string.Empty;

            var imageUrls = new List<string>();
            string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            foreach (var file in imageFiles)
            {
                string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(file.FileName);
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }
                imageUrls.Add("/images/" + uniqueFileName);
            }

            return string.Join(";", imageUrls);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Book book)
        {
            if (book.ImageFiles != null && book.ImageFiles.Count > 0)
            {
                var validExtensions = new[] { ".jpg", ".jpeg", ".png" };
                foreach (var file in book.ImageFiles)
                {
                    var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                    if (!validExtensions.Contains(extension))
                    {
                        ModelState.AddModelError("ImageFiles", "Chỉ cho phép file .jpg và .png");
                    }
                }
            }

            if (!ModelState.IsValid)
            {
                return View(book);
            }

            book.ImageUrl = await ProcessUploadedFiles(book.ImageFiles);
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
        public async Task<IActionResult> Edit(int id, Book book)
        {
            if (id != book.Id)
            {
                return BadRequest();
            }

            if (book.ImageFiles != null && book.ImageFiles.Count > 0)
            {
                var validExtensions = new[] { ".jpg", ".jpeg", ".png" };
                foreach (var file in book.ImageFiles)
                {
                    var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                    if (!validExtensions.Contains(extension))
                    {
                        ModelState.AddModelError("ImageFiles", "Chỉ cho phép file .jpg và .png");
                    }
                }
            }

            if (!ModelState.IsValid)
            {
                return View(book);
            }

            if (book.ImageFiles != null && book.ImageFiles.Count > 0)
            {
                book.ImageUrl = await ProcessUploadedFiles(book.ImageFiles);
            }
            else
            {
                var existingBook = _bookRepository.GetById(id);
                if (existingBook != null)
                {
                    book.ImageUrl = existingBook.ImageUrl;
                }
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
