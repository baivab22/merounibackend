import { Op } from "sequelize";

import Faculty from "../model/FacultyModel.js";
import UserModel from "../../users/model/UserModel.js";

export const getAllFaculty = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let sort = req.query.sort || "asc";
    let search = req.query.q || "";

    const offset = (page - 1) * limit;

    let whereCondition = {};

    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };
    }

    const { count: totalCount, rows: items } = await Faculty.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      attributes: {
        exclude: ["author"],
      },
      include: [
        {
          model: UserModel,
          as: "authorDetails",
          attributes: ["firstName", "middleName", "lastName"],
        },
      ],
      order: [["id", sort.toUpperCase()]],
    });

    const totalPages = Math.ceil(totalCount / limit);
    res.status(200).json({
      message: "success",
      items,
      pagination: { currentPage: page, totalPages, limit, totalCount },
    });
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFacultyById = async (req, res) => {
  try {
    let { slugs } = req.params;
    const faculty = await Faculty.findOne({
      where: {
        slugs,
      },
    });
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(200).json({ message: "Faculty retrieved", category });
  } catch (error) {
    console.error("Error getting Faculty by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
