import { Op } from "sequelize"; // Ensure Op is imported
import CollegeAdmission from "../models/CollegeAdmission.js";
import College from "../models/CollegeModel.js";
import Program from "../../program/model/ProgramModel.js";

export const listAdmission = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let sort = req.query.sort === "desc" ? "DESC" : "ASC"; 
    let search = req.query.q || "";

    const offset = (page - 1) * limit;

    let whereCondition = {};
    if (search) {
      whereCondition = {
        [Op.or]: [{ name: { [Op.like]: `%${search}%` } }],
      };
    }

    const { count: totalCount, rows: items } =
      await CollegeAdmission.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        distinct: true,
        order: [["id", sort]], // Use validated sort
        attributes: {
          exclude: ["college_id", "course_id"],
        },
        include: [
          {
            model: College,
            as: "collegeAdmissionCollege",
            attributes: ["name", "slugs"],
          },
          {
            model: Program,
            as: "program",
            attributes: ["title", "slugs"],
          },
        ],
      });

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      message: "success",
      items,
      pagination: { currentPage: page, totalPages, limit, totalCount },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: `Error: ${error.message}`,
    });
  }
};
