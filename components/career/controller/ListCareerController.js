import { Op } from "sequelize";

import CareerModel from "../model/CareerModel.js";

export const listCareerController = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let sort = req.query.sort || "asc";
    let search = req.query.q || "";

    let offset = (page - 1) * limit;

    let whereCondition = {};
    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };
    }

    // Use findAndCountAll for efficiency
    const { count: totalCount, rows: items } =
      await CareerModel.findAndCountAll({
        where: whereCondition,
        order: [["id", sort.toUpperCase()]],
        limit: limit,
        offset: offset,
      });

    let totalPages = Math.ceil(totalCount / limit);
    const pagination = {
      currentPage: page,
      totalPages: totalPages,
      limit,
      totalCount,
    };

    return res.status(200).json({
      message: "success",
      items,
      pagination,
    });
  } catch (error) {
    console.error("Error in ListCarrer:", error);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};

export const listSingleCareer = async (req, res) => {
  try {
    const { slugs } = req.params;

    // Find career post by slug
    const careerPost = await CareerModel.findOne({ where: { slugs } });

    if (!careerPost) {
      return res.status(404).json({ message: "Career post not found" });
    }

    return res.status(200).json({
      message: "success",
      item: careerPost,
    });
  } catch (error) {
    console.error("Error in getCareerBySlugController:", error);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};
