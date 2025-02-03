import { Op } from "sequelize";

import Program from "../model/ProgramModel.js";
import Faculty from "../../faculty/model/FacultyModel.js";
import Scholarship from "../../scholarship/model/ScholarshipModel.js";
import Level from "../../level/model/LevelModel.js";
import { Exam } from "../../exams/model/ExamModel.js";

// Get All Programs
export const getAllPrograms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // const { facultyId, levelId, examId, q } = req.query;

    // const whereConditions = {};
    // if (facultyId) whereConditions.facultyId = facultyId;
    // if (levelId) whereConditions.levelId = levelId;
    // if (examId) whereConditions.examId = examId;

    // if (q) {
    //   whereConditions.title = { [Op.like]: `%${q}%` };
    // }

    const { count: totalCount, rows: items } = await Program.findAll({
      // where: whereConditions,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        { model: Faculty, attributes: ["title"] },
        { model: Level, attributes: ["title"] },
        { model: Scholarship, attributes: ["name", "amount"] },
        { model: Exam, attributes: ["title"] },
      ],
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      message: "success",
      items,
      pagination: { currentPage: page, totalPages, limit, totalCount },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Program
export const getProgramById = async (req, res) => {
  try {
    const { slugs } = req.params;
    const program = await Program.findOne({
      where: { slugs },
      include: [
        { model: Faculty, attributes: ["name"] },
        { model: Level, attributes: ["title"] },
        { model: Scholarship, attributes: ["title", "amount"] },
        { model: Exam, attributes: ["title"] },
      ],
    });

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.status(200).json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
