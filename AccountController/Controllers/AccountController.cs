using AccountController.Models;
using Microsoft.AspNetCore.Mvc;

namespace AccountController.Controllers
{
    public class AccountController : Controller
    {
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.Username == "admin" && model.Password == "123")
                {
                    ViewBag.Message = "Login success";
                }
                else
                {
                    ViewBag.Message = "Login failed";
                }
            }

            return View(model);
        }
    }
}
