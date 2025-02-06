import { Op } from "sequelize";

import Program from "../model/ProgramModel.js";
import ProgramSyllabus from "../model/ProgramSyllabusModel.js";
import Course from "../../courses/model/CourseModel.js";
import Faculty from "../../faculty/model/FacultyModel.js";
import Scholarship from "../../scholarship/model/ScholarshipModel.js";
import College from "../../college/models/CollegeModel.js";
import CollegeAddress from "../../college/models/CollegeAddress.js";
import Level from "../../level/model/LevelModel.js";
import { Exam } from "../../exams/model/ExamModel.js";
import User from "../../users/model/UserModel.js";

// Get All Programs
export const getAllPrograms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { facultyId, levelId, examId, q } = req.query;

    const whereConditions = {};
    if (facultyId) whereConditions.facultyId = facultyId;
    if (levelId) whereConditions.levelId = levelId;
    if (examId) whereConditions.examId = examId;

    if (q) {
      whereConditions.title = { [Op.like]: `%${q}%` };
    }

    const { count: totalCount, rows: items } = await Program.findAndCountAll({
      where: whereConditions,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
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
      attributes: {
        exclude: [
          "author",
          "faculty_id",
          "level_id",
          "scholarship_id",
          "exam_id",
        ],
      },
      include: [
        {
          model: Faculty,
          as: "programfaculty",
          attributes: ["title", "slugs"],
        },
        {
          model: ProgramSyllabus,
          as: "syllabus",
          include: [
            {
              model: Course,
              as: "programCourse",
              attributes: ["id", "title", "slugs", "description", "credits"],
            },
          ],
        },
        { model: Level, as: "programlevel", attributes: ["title", "slugs"] },
        {
          model: Scholarship,
          as: "programscholarship",
          attributes: ["name", "slugs"],
        },
        { model: Exam, as: "programexam", attributes: ["title", "slugs"] },
        {
          model: User,
          as: "programauthorDetails",
          attributes: ["firstName", "middleName", "lastName"],
        },
        {
          model: College,
          as: "colleges",
          attributes: ["name", "slugs"],
        },
        {
          model: CollegeAddress,
          as: "collegesAddress",
          attributes: ["country", "city", "state"],
        },
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
