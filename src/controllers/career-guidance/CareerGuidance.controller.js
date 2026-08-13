import CareerGuidanceService from "../../services/career-guidance/CareerGuidance.service.js";

const careerGuidanceService = new CareerGuidanceService();

class CareerGuidanceController {
  static async listSubmissions(req, res) {
    try {
      const { items, pagination } =
        await careerGuidanceService.listSubmissions(req.query);
      return res.status(200).json({
        message: "Career guidance submissions retrieved",
        items,
        pagination,
      });
    } catch (error) {
      return res.status(500).json({ message: `Error: ${error.message}` });
    }
  }

  static async createSubmission(req, res) {
    try {
      const data = await careerGuidanceService.createSubmission(req.body);
      return res.status(201).json({
        message: "Career guidance session requested successfully",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || "Internal Server Error",
      });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.query;
      const { status, comment } = req.body;
      const data = await careerGuidanceService.updateStatus(id, { status, comment });
      return res.status(200).json({
        message: "Status updated",
        data,
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        message: error.message || "Internal Server Error",
      });
    }
  }

  static async deleteSubmission(req, res) {
    try {
      await careerGuidanceService.deleteSubmission(req.query.id);
      return res.status(200).json({ message: "Submission deleted" });
    } catch (error) {
      return res.status(error.status || 500).json({
        error: error.message,
      });
    }
  }
}

export default CareerGuidanceController;
