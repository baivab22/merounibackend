import CareerModel from "../model/CareerModel.js";

export const listCareerController = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let sort = req.query.sort || "asc";

    let offset = (page - 1) * limit;

    // Use findAndCountAll for efficiency
    const { count: totalCount, rows: items } =
      await CareerModel.findAndCountAll({
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
