using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DE1_QUANLYPHONGTRO.Models
{
    [Table("Rooms_BCS240041")]
    public class Room_BCS240041
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Area must be greater than 0")]
        public double Area { get; set; }

        public bool IsAvailable { get; set; }

        public string? Description { get; set; }

        [Required(ErrorMessage = "Room Type is required")]
        public int RoomTypeId { get; set; }

        // Navigation properties
        [ForeignKey("RoomTypeId")]
        public RoomType_BCS240041? RoomType { get; set; }

        public ICollection<RoomImage_BCS240041>? RoomImages { get; set; }
    }
}
