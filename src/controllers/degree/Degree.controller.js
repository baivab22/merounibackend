import DegreeService from "../../services/degree/Degree.service.js";

const degreeService = new DegreeService();

class DegreeController {
  static async listDegrees(req, res) {
    try {
      const { items, pagination } = await degreeService.listDegrees(req.query);
      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Server error" : error.message,
      });
    }
  }

  static async getDegree(req, res) {
    try {
      const item = await degreeService.getDegree(req.params.slug);
      return res.status(200).json({ message: "success", item });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Server error" : error.message,
      });
    }
  }

  static async createDegree(req, res) {
    try {
      const item = await degreeService.createDegree(req.body);
      return res.status(201).json({ message: "Degree created", item });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Server error" : error.message,
      });
    }
  }

  static async updateDegree(req, res) {
    try {
      const item = await degreeService.updateDegree(req.params.id, req.body);
      return res.status(200).json({ message: "Degree updated", item });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Server error" : error.message,
      });
    }
  }

  static async deleteDegree(req, res) {
    try {
      await degreeService.deleteDegree(req.params.id);
      return res.status(200).json({ message: "Degree deleted successfully" });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({
        error: status === 500 ? "Server error" : error.message,
      });
    }
  }
}

export default DegreeController;
