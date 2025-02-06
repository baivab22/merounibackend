import ContactUs from "../model/ContactModel.js";

export const listContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count: totalCount, rows: items } = await ContactUs.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(totalCount / limit);
    res.status(200).json({
      message: "Contact Us retrieved",
      items,
      pagination: { currentPage: page, totalPages, limit, totalCount },
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error: ${error}`,
    });
  }
};

export const listContact = async (req, res) => {
  try {
    let { email } = req.query;

    let item = await ContactUs.findOne({
      where: {
        email,
      },
    });

    return res.status(200).json({
      message: "Retrived",
      item,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error: ${error}`,
    });
  }
};
