import FacultyService from "../../services/faculty/Faculty.service.js";

const facultyService = new FacultyService();

class FacultyController {
  static async listFaculty(req, res) {
    try {
      const { items, pagination } = await facultyService.listFaculty(req.query);
      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      console.error("Error getting faculty:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async getFaculty(req, res) {
    try {
      const faculty = await facultyService.getFaculty(req.params.slugs);
      return res.status(200).json({ message: "Faculty retrieved", faculty });
    } catch (error) {
      console.error("Error getting Faculty by ID:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async createFaculty(req, res) {
    try {
      await facultyService.createFaculty(req.body);

      return res.status(201).json({
        message: "Faculty created",
      });
    } catch (error) {
      console.error("Error creating faculty:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async updateFaculty(req, res) {
    try {
      await facultyService.updateFaculty(req.query.faculty_id, req.body);

      return res.status(200).json({ message: "Faculty updated" });
    } catch (error) {
      console.error("Error updating Faculty:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async deleteFaculty(req, res) {
    try {
      await facultyService.deleteFaculty(req.query.id);
      return res.status(200).json({ message: "Faculty deleted" });
    } catch (error) {
      console.error("Error deleting Faculty:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }
}

export default FacultyController;
