import NewsLetter from "../model/NewsletterModel.js";

export const listNewsletter = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let sort = req.query.sort || "asc";

    const offset = (page - 1) * limit;

    const { count: totalCount, rows: items } = await NewsLetter.findAndCountAll(
      {
        limit,
        offset,
        order: [["id", sort.toUpperCase()]],
      }
    );

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
