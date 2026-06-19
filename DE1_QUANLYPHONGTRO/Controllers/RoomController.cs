using DE1_QUANLYPHONGTRO.Data;
using DE1_QUANLYPHONGTRO.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace DE1_QUANLYPHONGTRO.Controllers
{
    public class RoomController : Controller
    {
        private readonly AppDbContext _context;

        public RoomController(AppDbContext context)
        {
            _context = context;
        }

        // GET: Room
        public async Task<IActionResult> Index(string searchName, int? roomTypeId, bool? isAvailable, decimal? maxPrice, string sortOrder)
        {
            // Keep search conditions
            ViewBag.SearchName = searchName;
            ViewBag.RoomTypeId = roomTypeId;
            ViewBag.IsAvailable = isAvailable;
            ViewBag.MaxPrice = maxPrice;
            ViewBag.SortOrder = sortOrder;

            // Populate Room Types dropdown
            ViewBag.RoomTypes = new SelectList(await _context.RoomTypes_BCS240041.ToListAsync(), "Id", "Name", roomTypeId);

            // Query
            var query = _context.Rooms_BCS240041.Include(r => r.RoomType).AsQueryable();

            if (!string.IsNullOrEmpty(searchName))
            {
                query = query.Where(r => r.Name.Contains(searchName));
            }

            if (roomTypeId.HasValue)
            {
                query = query.Where(r => r.RoomTypeId == roomTypeId.Value);
            }

            if (isAvailable.HasValue)
            {
                query = query.Where(r => r.IsAvailable == isAvailable.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(r => r.Price <= maxPrice.Value);
            }

            // Sorting
            switch (sortOrder)
            {
                case "price_asc":
                    query = query.OrderBy(r => r.Price);
                    break;
                case "price_desc":
                    query = query.OrderByDescending(r => r.Price);
                    break;
                case "area_desc":
                    query = query.OrderByDescending(r => r.Area);
                    break;
                default:
                    query = query.OrderBy(r => r.Id);
                    break;
            }

            var rooms = await query.ToListAsync();
            return View(rooms);
        }

        // GET: Room/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var room = await _context.Rooms_BCS240041
                .Include(r => r.RoomType)
                .Include(r => r.RoomImages)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (room == null)
            {
                return NotFound();
            }

            return View(room);
        }

        // GET: Room/Create
        public IActionResult Create()
        {
            ViewBag.RoomTypeId = new SelectList(_context.RoomTypes_BCS240041, "Id", "Name");
            return View();
        }

        // POST: Room/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Name,Price,Area,IsAvailable,Description,RoomTypeId")] Room_BCS240041 room)
        {
            if (ModelState.IsValid)
            {
                // Check if Room Name is duplicate in the same Room Type
                if (_context.Rooms_BCS240041.Any(r => r.Name == room.Name && r.RoomTypeId == room.RoomTypeId))
                {
                    ModelState.AddModelError("Name", "Tên phòng không được trùng trong cùng một loại phòng.");
                }
                else
                {
                    _context.Add(room);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
            }
            ViewBag.RoomTypeId = new SelectList(_context.RoomTypes_BCS240041, "Id", "Name", room.RoomTypeId);
            return View(room);
        }

        // GET: Room/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var room = await _context.Rooms_BCS240041.FindAsync(id);
            if (room == null)
            {
                return NotFound();
            }
            ViewBag.RoomTypeId = new SelectList(_context.RoomTypes_BCS240041, "Id", "Name", room.RoomTypeId);
            return View(room);
        }

        // POST: Room/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,Price,Area,IsAvailable,Description,RoomTypeId")] Room_BCS240041 room)
        {
            if (id != room.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    if (_context.Rooms_BCS240041.Any(r => r.Name == room.Name && r.RoomTypeId == room.RoomTypeId && r.Id != room.Id))
                    {
                        ModelState.AddModelError("Name", "Tên phòng không được trùng trong cùng một loại phòng.");
                        ViewBag.RoomTypeId = new SelectList(_context.RoomTypes_BCS240041, "Id", "Name", room.RoomTypeId);
                        return View(room);
                    }

                    _context.Update(room);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!RoomExists(room.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewBag.RoomTypeId = new SelectList(_context.RoomTypes_BCS240041, "Id", "Name", room.RoomTypeId);
            return View(room);
        }

        // POST: Room/AddImage
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddImage(int roomId, string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl))
            {
                TempData["ErrorMessage"] = "Vui lòng nhập đường dẫn ảnh.";
                return RedirectToAction("Details", new { id = roomId });
            }

            var hasImages = await _context.RoomImages_BCS240041.AnyAsync(i => i.RoomId == roomId);

            var newImage = new RoomImage_BCS240041
            {
                RoomId = roomId,
                ImageUrl = imageUrl,
                IsThumbnail = !hasImages // First image becomes thumbnail automatically
            };

            _context.RoomImages_BCS240041.Add(newImage);
            await _context.SaveChangesAsync();

            return RedirectToAction("Details", new { id = roomId });
        }

        // POST: Room/SetThumbnail
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SetThumbnail(int imageId, int roomId)
        {
            var image = await _context.RoomImages_BCS240041.FindAsync(imageId);
            if (image == null)
            {
                return NotFound();
            }

            // Set all others to false
            var allImages = await _context.RoomImages_BCS240041.Where(i => i.RoomId == roomId).ToListAsync();
            foreach (var img in allImages)
            {
                img.IsThumbnail = false;
            }

            // Set this one to true
            image.IsThumbnail = true;
            await _context.SaveChangesAsync();

            return RedirectToAction("Details", new { id = roomId });
        }

        private bool RoomExists(int id)
        {
            return _context.Rooms_BCS240041.Any(e => e.Id == id);
        }
    }
}
