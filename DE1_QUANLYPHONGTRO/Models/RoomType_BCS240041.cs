using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DE1_QUANLYPHONGTRO.Models
{
    [Table("RoomTypes_BCS240041")]
    public class RoomType_BCS240041
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }

        public string? Description { get; set; }

        // Navigation property
        public ICollection<Room_BCS240041>? Rooms { get; set; }
    }
}
