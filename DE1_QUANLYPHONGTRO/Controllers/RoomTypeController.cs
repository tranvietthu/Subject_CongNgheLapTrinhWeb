using DE1_QUANLYPHONGTRO.Data;
using DE1_QUANLYPHONGTRO.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace DE1_QUANLYPHONGTRO.Controllers
{
    public class RoomTypeController : Controller
    {
        private readonly AppDbContext _context;

        public RoomTypeController(AppDbContext context)
        {
            _context = context;
        }

        // GET: RoomType
        public async Task<IActionResult> Index()
        {
            return View(await _context.RoomTypes_BCS240041.ToListAsync());
        }

        // GET: RoomType/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var roomType = await _context.RoomTypes_BCS240041
                .FirstOrDefaultAsync(m => m.Id == id);
            if (roomType == null)
            {
                return NotFound();
            }

            return View(roomType);
        }

        // POST: RoomType/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var roomType = await _context.RoomTypes_BCS240041.FindAsync(id);
            if (roomType == null) return NotFound();

            if (_context.Rooms_BCS240041.Any(r => r.RoomTypeId == id))
            {
                TempData["ErrorMessage"] = "Không thể xóa loại phòng đang có phòng sử dụng.";
                return RedirectToAction(nameof(Delete), new { id = id });
            }

            _context.RoomTypes_BCS240041.Remove(roomType);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
    }
}
