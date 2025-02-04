import Consultancy from "../model/ConsultancyModel.js";

export const listConsultancy = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let sort = req.query.sort || "asc";
    let search = req.query.q || "";

    const offset = (page - 1) * limit;

    const { count: totalCount, rows: items } =
      await Consultancy.findAndCountAll({
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
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
