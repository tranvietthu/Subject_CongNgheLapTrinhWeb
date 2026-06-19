using DE1_QUANLYPHONGTRO.Models;
using Microsoft.EntityFrameworkCore;

namespace DE1_QUANLYPHONGTRO.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<RoomType_BCS240041> RoomTypes_BCS240041 { get; set; }
        public DbSet<Room_BCS240041> Rooms_BCS240041 { get; set; }
        public DbSet<RoomImage_BCS240041> RoomImages_BCS240041 { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Unique constraint on Room Name per RoomType
            modelBuilder.Entity<Room_BCS240041>()
                .HasIndex(r => new { r.Name, r.RoomTypeId })
                .IsUnique();

            // Seed Data
            modelBuilder.Entity<RoomType_BCS240041>().HasData(
                new RoomType_BCS240041 { Id = 1, Name = "Phòng Đơn", Description = "Phòng dành cho 1 người" },
                new RoomType_BCS240041 { Id = 2, Name = "Phòng Đôi", Description = "Phòng dành cho 2 người" },
                new RoomType_BCS240041 { Id = 3, Name = "Phòng Gia Đình", Description = "Phòng rộng cho gia đình" }
            );

            modelBuilder.Entity<Room_BCS240041>().HasData(
                new Room_BCS240041 { Id = 1, Name = "Phòng 101", Price = 2000000, Area = 20, IsAvailable = true, Description = "Phòng ở tầng 1", RoomTypeId = 1 },
                new Room_BCS240041 { Id = 2, Name = "Phòng 102", Price = 2500000, Area = 25, IsAvailable = true, Description = "Phòng góc tầng 1", RoomTypeId = 1 },
                new Room_BCS240041 { Id = 3, Name = "Phòng 201", Price = 3000000, Area = 30, IsAvailable = true, Description = "Phòng có ban công", RoomTypeId = 2 },
                new Room_BCS240041 { Id = 4, Name = "Phòng 202", Price = 3000000, Area = 30, IsAvailable = false, Description = "Phòng mặt trước", RoomTypeId = 2 },
                new Room_BCS240041 { Id = 5, Name = "Phòng 301", Price = 5000000, Area = 50, IsAvailable = true, Description = "Phòng gia đình rộng rãi", RoomTypeId = 3 }
            );

            modelBuilder.Entity<RoomImage_BCS240041>().HasData(
                new RoomImage_BCS240041 { Id = 1, ImageUrl = "https://via.placeholder.com/150", IsThumbnail = true, RoomId = 1 },
                new RoomImage_BCS240041 { Id = 2, ImageUrl = "https://via.placeholder.com/150", IsThumbnail = true, RoomId = 2 },
                new RoomImage_BCS240041 { Id = 3, ImageUrl = "https://via.placeholder.com/150", IsThumbnail = true, RoomId = 3 },
                new RoomImage_BCS240041 { Id = 4, ImageUrl = "https://via.placeholder.com/150", IsThumbnail = true, RoomId = 4 },
                new RoomImage_BCS240041 { Id = 5, ImageUrl = "https://via.placeholder.com/150", IsThumbnail = true, RoomId = 5 }
            );
        }
    }
}
