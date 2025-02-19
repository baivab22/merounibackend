import { Op } from "sequelize";
import Category from "../model/CategoryModel.js";

export const getAllCategories = async (req, res) => {
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

    const { count: totalCount, rows: items } = await Category.findAndCountAll({
      where: whereCondition,
      distinct: true,
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
    console.error("Error getting categories:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    let { slugs } = req.params;
    const category = await Category.findOne({ where: { slugs } });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category retrieved", category });
  } catch (error) {
    console.error("Error getting category by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
