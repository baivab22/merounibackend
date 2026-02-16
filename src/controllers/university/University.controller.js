import UniversityService from "../../services/university/University.service.js";

const universityService = new UniversityService();

class UniversityController {
  static async listUniversities(req, res) {
    try {
      const data = await universityService.listUniversities(req.query);
      return res.status(200).json(data);
    } catch (error) {
      console.log(error,"yoyo")
      const status = error.status || 500;
      return res
        .status(status)
        .json({ error: status === 500 ? "Server error" : error.message });
    }
  }

  static async getUniversityProfile(req, res) {
    try {
      const universityData = await universityService.getUniversityProfile(
        req.params.slug
      );
      return res.status(200).json(universityData);
    } catch (error) {
      const status = error.status || 500;
      return res
        .status(status)
        .json({ error: status === 500 ? "Server error" : error.message });
    }
  }

  static async createOrUpdateUniversity(req, res) {
    try {
      const universityId = await universityService.createOrUpdateUniversity(
        req.body
      );
      return res.status(200).json({
        message: req.body.id
          ? "University updated successfully!"
          : "University created successfully!",
        universityId,
      });
    } catch (error) {
      console.error("Transaction error:", error);
      const status = error.status || 500;
      return res
        .status(status)
        .json({ error: status === 500 ? "Server error" : error.message });
    }
  }

  static async deleteUniversity(req, res) {
    try {
      await universityService.deleteUniversity(req.query.id);
      return res
        .status(200)
        .json({ message: "University deleted successfully!" });
    } catch (error) {
      const status = error.status || 500;
      return res
        .status(status)
        .json({ error: status === 500 ? "Server error" : error.message });
    }
  }

  static async updateUniversityOrder(req, res) {
    try {
      const result = await universityService.updateUniversityOrder(
        req.body.universities
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error in updateUniversityOrder controller:", error);
      const status = error.status || 500;
      return res
        .status(status)
        .json({ error: status === 500 ? "Server error" : error.message });
    }
  }
}

export default UniversityController;
