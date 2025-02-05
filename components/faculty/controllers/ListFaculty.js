import Faculty from "../model/FacultyModel.js";

export const getAllFaculty = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let sort = req.query.sort || "asc";
    const offset = (page - 1) * limit;

    const { count: totalCount, rows: items } = await Faculty.findAndCountAll({
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

export const getFacultyById = async (req, res) => {
  try {
    let { slugs } = req.params;
    const faculty = await Faculty.findOne({
      where: {
        slugs,
      },
    });
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(200).json({ message: "Faculty retrieved", category });
  } catch (error) {
    console.error("Error getting Faculty by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
