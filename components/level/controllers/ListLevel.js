import Level from "../model/LevelModel.js";

export const getAllLevels = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count: totalCount, rows: items } = await Level.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(totalCount / limit);
    res.status(200).json({
      message: "success",
      items,
      pagination: { currentPage: page, totalPages, limit, totalCount },
    });
  } catch (error) {
    console.error("Error getting tags:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getLevellById = async (req, res) => {
  try {
    let { slugs } = req.params;
    const item = await Level.findOne({
      where: {
        slugs,
      },
    });
    if (!item) {
      return res.status(404).json({ message: "Level not found" });
    }
    res.status(200).json({ message: "Level retrieved", item });
  } catch (error) {
    console.error("Error getting tag by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
