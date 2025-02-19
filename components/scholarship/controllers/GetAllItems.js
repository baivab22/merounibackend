import { Op } from "sequelize";
import Scholarship from "../model/ScholarshipModel.js";

export const getAllScholarships = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const searchQuery = req.query.q || "";

    let whereCondition = {};
    if (searchQuery) {
      whereCondition = {
        name: { [Op.like]: `%${searchQuery}%` },
      };
    }

    const { count: totalCount, rows: scholarships } =
      await Scholarship.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        distinct: true,
        order: [["applicationDeadline", "ASC"]],
      });

    const totalPages = Math.ceil(totalCount / limit);
    res.status(200).json({
      message: "Scholarships retrieved",
      scholarships,
      pagination: { currentPage: page, totalPages, limit, totalCount },
    });
  } catch (error) {
    console.error("Error getting scholarships:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get One by ID
export const getScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findByPk(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ message: "Scholarship not found" });
    }
    res.status(200).json({ message: "Scholarship retrieved", scholarship });
  } catch (error) {
    console.error("Error getting scholarship by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
