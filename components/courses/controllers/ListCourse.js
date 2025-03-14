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
    let credits = req.query.credits || "";
    let duration = req.query.duration || "";
    let faculty = req.query.faculty || "";
    let isFeatured = req.query.is_featured;

    let whereCondition = {};

    // Search filter
    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };
    }

    // faculty filter
    if (faculty) {
      const facultyItem = await Faculty.findOne({
        where: {
          title: faculty,
        },
      });

      if (facultyItem) {
        whereCondition.facultyId = facultyItem.id; 
      } else {
        console.log("No faculty found with the title:", faculty); 
      }
    }

    // Credits filter
    if (credits) {
      // Assuming credits is a single value or a range (e.g., "3" or "3-5")
      if (credits.includes("-")) {
        const [minCredits, maxCredits] = credits.split("-").map(Number);
        whereCondition.credits = { [Op.between]: [minCredits, maxCredits] };
      } else {
        whereCondition.credits = parseInt(credits);
      }
    }

    // Duration filter
    if (duration) {
      // Assuming duration is a single value or a range (e.g., "6" or "6-12")
      if (duration.includes("-")) {
        const [minDuration, maxDuration] = duration.split("-").map(Number);
        whereCondition.duration = { [Op.between]: [minDuration, maxDuration] };
      } else {
        whereCondition.duration = parseInt(duration);
      }
    }

    const { count: totalCount, rows: items } = await Course.findAndCountAll({
      where: whereCondition,
      distinct: true,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
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
    const course = await Course.findOne({
      where: { slugs },
      attributes: {
        exclude: ["authorId", "facultyId"],
      },
      include: [
        {
          model: User,
          as: "courseauthor",
          attributes: ["firstName", "middleName", "lastName"],
        },
        {
          model: Faculty,
          as: "coursefaculty",
          attributes: ["title", "slugs"],
        },
      ],
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
