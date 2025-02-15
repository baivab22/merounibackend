import { Exam, ExamDetail, ApplicationDetail } from "../model/ExamModel.js";
import Level from "../../level/model/LevelModel.js";
import { University } from "../../university/model/UniversityModel.js";
import UserModel from "../../users/model/UserModel.js";

export const getAllExams = async (req, res) => {
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

    const { count: totalCount, rows: items } = await Exam.findAndCountAll({
      where: whereCondition,
      order: [["id", sort.toUpperCase()]],
      limit,
      offset,
      include: [
        { model: Level, attributes: ["id", "title"], as: "level" },
        { model: University, attributes: ["id", "fullname"], as: "university" },
        {
          model: UserModel,
          attributes: ["id", "firstName"],
          as: "authorDetails",
        },
        { model: ExamDetail, as: "exam_details" },
        { model: ApplicationDetail, as: "application_details" },
      ],
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

export const getExam = async (req, res) => {
  try {
    let { slugs } = req.params;
    const item = await Exam.findOne({
      where: { slugs },
      include: [
        { model: Level, attributes: ["id", "title"], as: "level" },
        { model: University, attributes: ["id", "fullname"], as: "university" },
        {
          model: UserModel,
          attributes: ["id", "firstName"],
          as: "authorDetails",
        },
        { model: ExamDetail, as: "exam_details" },
        { model: ApplicationDetail, as: "application_details" },
      ],
    });
    if (!item) {
      return res.status(404).json({ message: "Exam not found" });
    }
    return res.status(200).json({ message: "Exam retrieved", item });
  } catch (error) {
    console.error("Error getting exam by ID:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
