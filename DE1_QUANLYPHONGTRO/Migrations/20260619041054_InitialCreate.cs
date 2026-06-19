using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DE1_QUANLYPHONGTRO.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RoomTypes_BCS240041",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomTypes_BCS240041", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Rooms_BCS240041",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Area = table.Column<double>(type: "float", nullable: false),
                    IsAvailable = table.Column<bool>(type: "bit", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RoomTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms_BCS240041", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Rooms_BCS240041_RoomTypes_BCS240041_RoomTypeId",
                        column: x => x.RoomTypeId,
                        principalTable: "RoomTypes_BCS240041",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RoomImages_BCS240041",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsThumbnail = table.Column<bool>(type: "bit", nullable: false),
                    RoomId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomImages_BCS240041", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoomImages_BCS240041_Rooms_BCS240041_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms_BCS240041",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "RoomTypes_BCS240041",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { 1, "Phòng dành cho 1 người", "Phòng Đơn" },
                    { 2, "Phòng dành cho 2 người", "Phòng Đôi" },
                    { 3, "Phòng rộng cho gia đình", "Phòng Gia Đình" }
                });

            migrationBuilder.InsertData(
                table: "Rooms_BCS240041",
                columns: new[] { "Id", "Area", "Description", "IsAvailable", "Name", "Price", "RoomTypeId" },
                values: new object[,]
                {
                    { 1, 20.0, "Phòng ở tầng 1", true, "Phòng 101", 2000000m, 1 },
                    { 2, 25.0, "Phòng góc tầng 1", true, "Phòng 102", 2500000m, 1 },
                    { 3, 30.0, "Phòng có ban công", true, "Phòng 201", 3000000m, 2 },
                    { 4, 30.0, "Phòng mặt trước", false, "Phòng 202", 3000000m, 2 },
                    { 5, 50.0, "Phòng gia đình rộng rãi", true, "Phòng 301", 5000000m, 3 }
                });

            migrationBuilder.InsertData(
                table: "RoomImages_BCS240041",
                columns: new[] { "Id", "ImageUrl", "IsThumbnail", "RoomId" },
                values: new object[,]
                {
                    { 1, "https://via.placeholder.com/150", true, 1 },
                    { 2, "https://via.placeholder.com/150", true, 2 },
                    { 3, "https://via.placeholder.com/150", true, 3 },
                    { 4, "https://via.placeholder.com/150", true, 4 },
                    { 5, "https://via.placeholder.com/150", true, 5 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_RoomImages_BCS240041_RoomId",
                table: "RoomImages_BCS240041",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_BCS240041_Name_RoomTypeId",
                table: "Rooms_BCS240041",
                columns: new[] { "Name", "RoomTypeId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_BCS240041_RoomTypeId",
                table: "Rooms_BCS240041",
                column: "RoomTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RoomImages_BCS240041");

            migrationBuilder.DropTable(
                name: "Rooms_BCS240041");

            migrationBuilder.DropTable(
                name: "RoomTypes_BCS240041");
        }
    }
}
