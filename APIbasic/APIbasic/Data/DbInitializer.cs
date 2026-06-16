namespace Lesson3_CNLTWeb.Data
{
    /// <summary>
    /// Tự động tạo database BookManagement và bảng Book khi ứng dụng khởi động.
    /// </summary>
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            // Xóa database cũ (nếu có) để tạo lại DB mới chứa cột ImageUrl
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();
        }
    }
}
