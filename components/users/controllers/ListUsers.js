import { Op } from "sequelize";
import UserModel from "../model/UserModel.js";

export const ListUsers = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let sort = req.query.sort || "asc";
    let search = req.query.q;

    let whereCondition = {};
    if (search) {
      whereCondition = {
        [Op.or]: [
          { email: { [Op.like]: `%${search}%` } },
          { firstName: { [Op.like]: `%${search}% ` } },
        ],
      };
    }
    let offset = (page - 1) * limit;

    // Use findAndCountAll for efficiency
    const { count: totalCount, rows: items } = await UserModel.findAndCountAll({
      where: whereCondition,
      order: [["id", sort.toUpperCase()]],
      distinct: true,
      limit: limit,
      offset: offset,
      attributes: { exclude: ["password", "otp", "otpExpiresAt"] },
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
    console.error("Error in ListUsers:", error);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};

export const UserProfile = async (req, res) => {
  try {
    const userId = req.query.id;

    const user = await UserModel.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "success",
      user,
    });
  } catch (error) {
    console.error("Error in UserProfile:", error);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};
