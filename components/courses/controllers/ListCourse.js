import { Op } from "sequelize";
import Course from "../model/CourseModel.js";
import User from "../../users/model/UserModel.js";
import Faculty from "../../faculty/model/FacultyModel.js";

export const getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let search = req.query.q || "";
    let isFeatured = req.query.is_featured;

    let whereCondition = {};
    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };
    }

    if (isFeatured !== undefined) {
      whereCondition.isFeatured = isFeatured === "true" ? 1 : 0;
    }

    const { count: totalCount, rows: items } = await Course.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "author",
          //attributes: ["firstName, middleName, lastName"],
        },
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
export const getCourse = async (req, res) => {
  try {
    let { slugs } = req.params;
    const course = await Course.findOne(
      {
        where: { slugs },
      },
      {
        include: [
          { model: User, as: "author" },
          { model: Faculty, as: "faculty" },
        ],
      }
    );
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error("Error getting course by ID:", error);
    res.status(500).json({ error: "Failed to get course" });
  }
};
