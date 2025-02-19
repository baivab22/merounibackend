import { Op } from "sequelize";

import Banner from "../model/BannerModel.js";
import BannerGallery from "../model/BannerGallery.js";
import College from "../../college/models/CollegeModel.js";

export const getBanners = async (req, res) => {
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

    const { count: totalCount, rows: items } = await Banner.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["id", sort.toUpperCase()]],
      include: {
        model: BannerGallery,
      },
    });

    const totalPages = Math.ceil(totalCount / limit);
    res.status(200).json({
      message: "success",
      items,
      pagination: { currentPage: page, totalPages, limit, totalCount },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getBannersById = async (req, res) => {
  try {
    const collegeId = req.params.id;

    const college = await College.findByPk(collegeId, {
      include: {
        model: Banner,
        include: [BannerGallery],
      },
    });

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    return res.json({
      message: "success",
      items: college,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
