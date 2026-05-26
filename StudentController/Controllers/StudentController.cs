using Microsoft.AspNetCore.Mvc;

namespace StudentController.Controllers
{
    public class StudentController : Controller
    {
        public IActionResult Info()
        {
            ViewBag.Name = "Nguyễn Văn A";
            ViewData["Age"] = 20;
            string major = "CNTT";
            
            return View((object)major);
        }
    }
}
