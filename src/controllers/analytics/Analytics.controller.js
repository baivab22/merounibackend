import AnalyticsService from "../../services/analytics/Analytics.service.js";

const analyticsService = new AnalyticsService();

class AnalyticsController {
  static async getAdminOverview(req, res) {
    try {
      const data = await analyticsService.getAdminOverview(req.query);
      return res.status(200).json({
        message: "Analytics overview fetched successfully",
        data,
      });
    } catch (error) {
      console.error("Error fetching analytics overview:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }
}

export default AnalyticsController;
