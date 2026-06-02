using System.ComponentModel.DataAnnotations;

namespace baitapbuoi4.Models
{
    public class Book
    {
        [Display(Name = "Tên sách")]
        [Required(ErrorMessage = "Không được để trống")]
        public string Name { get; set; }

        [Display(Name = "Giá")]
        [Required(ErrorMessage = "Không được để trống")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Giá phải lớn hơn 0")]
        public double Price { get; set; }
    }
}
