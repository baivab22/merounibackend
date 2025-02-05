import { Op } from "sequelize";
import Event from "../model/EventModel.js";
import Category from "../../category/model/CategoryModel.js";
import User from "../../users/model/UserModel.js";
import College from "../../college/models/CollegeModel.js";
import moment from "moment";

export const getEvent = async (req, res) => {
  try {
    let { slugs } = req.params;
    const item = await Event.findOne({
      where: { slugs },
      attributes: {
        exclude: ["category_id", "college_id", "author_id"],
      },
      include: [
        { model: Category, as: "category", attributes: ["title", "slugs"] },
        {
          model: User,
          as: "author",
          attributes: ["firstName", "middleName", "lastName"],
        },
        {
          model: College,
          as: "college",
          attributes: ["name", "slugs"],
        },
      ],
    });
    if (!item) {
      return res.status(404).json({ message: "Event not found" });
    }
    return res.status(200).json({ message: "Event retrieved", item });
  } catch (error) {
    console.error("Error getting event by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let sort = req.query.sort || "asc";
    const offset = (page - 1) * limit;
    let isFeatured = req.query.is_featured;

    let search = req.query.q || "";

    let whereCondition = {};
    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };
    }

    if (isFeatured !== undefined) {
      whereCondition.isFeatured = isFeatured === "true" ? 1 : 0;
    }

    const { count: totalCount, rows: items } = await Event.findAndCountAll({
      where: whereCondition,
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
    return res.status(500).json({ error: error.message });
  }
};

export const getEventsThisWeek = async (req, res) => {
  try {
    const startOfWeek = moment().startOf("isoWeek").format("YYYY-MM-DD");
    const endOfWeek = moment().endOf("isoWeek").format("YYYY-MM-DD");

    const events = await Event.findAll({
      where: {
        event_date: {
          [Op.between]: [startOfWeek, endOfWeek],
        },
      },
      order: [["event_date", "ASC"]],
    });

    return res.status(200).json({
      message: "success",
      events,
    });
  } catch (error) {
    console.error("Error in getEventsThisWeek:", error);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};
