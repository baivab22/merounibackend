import Consultancy from "../model/ConsultancyModel.js";

export const listConsultancy = async (req, res) => {
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

    const { count: totalCount, rows: items } =
      await Consultancy.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        order: [["id", sort.toUpperCase()]],
      });

    const totalPages = Math.ceil(totalCount / limit);
    return res.status(200).json({
      message: "success",
      items,
      pagination: { currentPage: page, totalPages, limit, totalCount },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const listSingleConsultancy = async (req, res) => {
  try {
    try {
      let { slugs } = req.params;
      const category = await Consultancy.findOne({ where: { slugs } });
      if (!category) {
        return res.status(404).json({ message: "Consultancy not found" });
      }
      res.status(200).json({ message: "Consultancy retrieved", category });
    } catch (error) {
      console.error("Error getting category by ID:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
