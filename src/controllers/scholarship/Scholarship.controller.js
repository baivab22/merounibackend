import ScholarshipService from "../../services/scholarship/Scholarship.service.js";

const scholarshipService = new ScholarshipService();

class ScholarshipController {
  static async listScholarships(req, res) {
    try {
      const { scholarships, pagination } =
        await scholarshipService.listScholarships(req.query);
      return res.status(200).json({
        message: "Scholarships retrieved",
        scholarships,
        pagination,
      });
    } catch (error) {
      console.error("Error getting scholarships:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async getScholarship(req, res) {
    try {
      const scholarship = await scholarshipService.getScholarship(
        req.params.id
      );
      return res
        .status(200)
        .json({ message: "Scholarship retrieved", scholarship });
    } catch (error) {
      console.error("Error getting scholarship by ID:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async createScholarship(req, res) {
    try {
      return res.status(201).json({
        message: "Scholarship created",
        scholarship: newScholarship,
      });
    } catch (error) {
      console.error("Error creating scholarship:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async updateScholarship(req, res) {
    try {
      const updatedScholarship = await scholarshipService.updateScholarship(
        req.query.scholarship_id,
        req.body
      );
      return res.status(200).json({
        message: "Scholarship updated",
        scholarship: updatedScholarship,
      });
    } catch (error) {
      console.error("Error updating scholarship:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async deleteScholarship(req, res) {
    try {
      await scholarshipService.deleteScholarship(req.query.scholarship_id);
      return res.status(200).json({ message: "Scholarship deleted" });
    } catch (error) {
      console.error("Error deleting scholarship:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }
}

export default ScholarshipController;
