namespace Lesson3_CNLTWeb.Data
{
    /// <summary>
    /// Tự động tạo database BookManagement và bảng Book khi ứng dụng khởi động.
    /// </summary>
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            // Chỉ tạo database nếu chưa tồn tại, không xóa DB cũ để giữ lại dữ liệu
            context.Database.EnsureCreated();
        }
    }
}
