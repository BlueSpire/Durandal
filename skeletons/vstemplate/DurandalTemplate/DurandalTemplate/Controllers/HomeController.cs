using System.Web.Mvc;

namespace DurandalTemplate.Controllers {
  public class HomeController : Controller {
    public ActionResult Index() {
      return View();
    }
  }
}