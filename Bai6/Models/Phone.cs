using System.ComponentModel.DataAnnotations;

namespace Bai6.Models
{
    public class Phone
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên điện thoại không được để trống")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Hãng sản xuất không được để trống")]
        public string Brand { get; set; }

        [Required(ErrorMessage = "Giá sản phẩm phải được nhập")]
        [Range(1, 100000000, ErrorMessage = "Giá sản phẩm phải lớn hơn 0")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Số lượng không được để trống")]
        [Range(0, 10000, ErrorMessage = "Số lượng phải lớn hơn hoặc bằng 0")]
        public int Quantity { get; set; }
    }
}