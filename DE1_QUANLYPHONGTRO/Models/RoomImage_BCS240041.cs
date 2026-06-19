using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DE1_QUANLYPHONGTRO.Models
{
    [Table("RoomImages_BCS240041")]
    public class RoomImage_BCS240041
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string ImageUrl { get; set; }

        public bool IsThumbnail { get; set; }

        public int RoomId { get; set; }

        [ForeignKey("RoomId")]
        public Room_BCS240041? Room { get; set; }
    }
}
