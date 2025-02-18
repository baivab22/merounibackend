import { Op } from "sequelize";

import Tag from "../model/TagModel.js";

export const getAllTags = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    let search = req.query.q || "";

    let whereCondition = {};

    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };
    }

    const { count: totalCount, rows: items } = await Tag.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(totalCount / limit);
    res.status(200).json({
      message: "Tags retrieved",
      items,
      pagination: { currentPage: page, totalPages, limit, totalCount },
    });
  } catch (error) {
    console.error("Error getting tags:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getTagById = async (req, res) => {
  try {
    if (!req.params.tag_id) {
      return res.status(400).json({ message: "Missing tag_id parameter" });
    }

    const item = await Tag.findByPk(req.params.tag_id);
    if (!item) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.status(200).json({ message: "Tag retrieved", item });
  } catch (error) {
    console.error("Error getting tag by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
