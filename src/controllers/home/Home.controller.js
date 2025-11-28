import HomeService from "../../services/home/Home.service.js";

const homeService = new HomeService();

class HomeController {
  static async search(req, res) {
    try {
      const results = await homeService.search(req.query.q);
      return res.status(200).json({
        message: "Search results retrieved",
        ...results,
      });
    } catch (error) {
      console.error("Error searching data:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }
}

export default HomeController;
