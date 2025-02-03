import Course from "../model/CourseModel.js";
import User from "../../users/model/UserModel.js";
import Faculty from "../../faculty/model/FacultyModel.js";

export const getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count: totalCount, rows: items } = await Course.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        { model: User, as: "author", },
        { model: Faculty, as: "faculty" },
      ],
    });

    const totalPages = Math.ceil(totalCount / limit);
    res.status(200).json({
      message: "Course retrieved",
      items,
      pagination: { currentPage: page, totalPages, limit, totalCount },
    });
  } catch (error) {
    console.error("Error getting Course:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// READ a single course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: ["author", "faculty"],
    });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error("Error getting course by ID:", error);
    res.status(500).json({ error: "Failed to get course" });
  }
};
