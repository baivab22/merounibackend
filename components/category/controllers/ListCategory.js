import Category from "../model/CategoryModel.js";

export const getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let sort = req.query.sort || "asc";
    const offset = (page - 1) * limit;

    const { count: totalCount, rows: items } = await Category.findAndCountAll({
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

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.query.category_id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category retrieved", category });
  } catch (error) {
    console.error("Error getting category by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
