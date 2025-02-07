import { Op, Sequelize } from "sequelize";
import College from "../models/CollegeModel.js";

export const listSchoolController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let sort = req.query.sort || "asc";

    let search = req.query.q || "";
    let isFeatured = req.query.is_featured;
    let pinned = req.query.pinned;

    const offset = (page - 1) * limit;

    let whereCondition = {
      [Op.and]: [
        Sequelize.literal(`JSON_CONTAINS(institute_level, '"School"')`)
      ],
    };

    if (search) {
      whereCondition.name = { [Op.like]: `%${search}%` };
    }

    if (isFeatured !== undefined) {
      whereCondition.isFeatured = isFeatured === "true" ? 1 : 0;
    }

    if (pinned !== undefined) {
      whereCondition.pinned = pinned === "true" ? 1 : 0;
    }

    const { count: totalCount, rows: items } = await College.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["id", sort.toUpperCase()]],
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      message: "success",
      items,
      pagination: { currentPage: page, totalPages, limit, totalCount },
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error: ${error}`,
    });
  }
};
