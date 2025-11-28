import CourseService from "../../services/course/Course.service.js";

const courseService = new CourseService();

class CourseController {
  static async listCourses(req, res) {
    try {
      const { items, pagination } = await courseService.listCourses(req.query);
      return res.status(200).json({
        message: "Course retrieved",
        items,
        pagination,
      });
    } catch (error) {
      console.error("Error getting Course:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async getCourse(req, res) {
    try {
      const course = await courseService.getCourse(req.params.slugs);
      return res.status(200).json(course);
    } catch (error) {
      console.error("Error getting course by ID:", error);
      return res.status(500).json({ error: "Failed to get course" });
    }
  }

  static async createOrUpdateCourse(req, res) {
    try {
      const result = await courseService.createOrUpdateCourse(req.body);
      const status = req.body.id ? 200 : 201;
      const message = req.body.id
        ? "Course updated successfully"
        : "Course created successfully";
      return res.status(status).json({ message, course: result });
    } catch (error) {
      console.error("Error in createOrUpdateCourse:", error);
      return res.status(500).json({ error: "Failed to process request" });
    }
  }

  static async deleteCourse(req, res) {
    try {
      await courseService.deleteCourse(req.query.id);
      return res.status(200).json({ message: "Course deleted" });
    } catch (error) {
      console.error("Error deleting course:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }
}

export default CourseController;
