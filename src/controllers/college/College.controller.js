import CollegeService from "../../services/college/College.service.js";

const collegeService = new CollegeService();

class CollegeController {
  static async createOrUpdateCollege(req, res) {
    try {
      const { collegeId, isNew } = await collegeService.createOrUpdateCollege(
        req.body
      );
      return res.status(200).json({
        message: isNew
          ? "College created successfully!"
          : "College updated successfully!",
        collegeId,
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Server error" });
    }
  }

  static async listAdmissions(req, res) {
    try {
      const { items, pagination } = await collegeService.listAdmissions(
        req.query
      );

      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: `Error: ${error.message}`,
      });
    }
  }

  static async listSchools(req, res) {
    try {
      const { items, pagination } = await collegeService.listSchools(req.query);

      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Error: ${error}`,
      });
    }
  }

  static async listColleges(req, res) {
    try {
      const { items, pagination } = await collegeService.listColleges(
        req.query
      );

      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getCollegeBySlug(req, res) {
    try {
      const college = await collegeService.getCollegeBySlug(req.params.slugs);

      return res.status(200).json({ item: college });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async deleteCollege(req, res) {
    try {
      await collegeService.deleteCollege(req.params.id);
      return res.status(200).json({ message: "College deleted" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default CollegeController;
