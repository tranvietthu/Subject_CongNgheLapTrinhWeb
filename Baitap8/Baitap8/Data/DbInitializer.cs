using Microsoft.EntityFrameworkCore;

namespace Lesson3_CNLTWeb.Data
{
    /// <summary>
    /// Tự động tạo database BookManagement và bảng Book khi ứng dụng khởi động.
    /// </summary>
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            // Chỉ tạo database nếu chưa tồn tại, KHÔNG xóa database cũ để bảo toàn dữ liệu
            context.Database.EnsureCreated();

            // Kiểm tra và thêm cột ImageUrl vào bảng Book nếu chưa có (trong trường hợp database cũ đã tồn tại)
            var sql = @"
                IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Book]') AND type in (N'U'))
                BEGIN
                    IF NOT EXISTS (
                        SELECT * FROM sys.columns 
                        WHERE object_id = OBJECT_ID(N'[dbo].[Book]') 
                        AND name = 'ImageUrl'
                    )
                    BEGIN
                        ALTER TABLE [dbo].[Book] ADD [ImageUrl] NVARCHAR(MAX) NULL;
                    END
                END
            ";
            context.Database.ExecuteSqlRaw(sql);
        }
    }
}
