import slug from "slug";
import { Op } from "sequelize";

import { sequelize } from "../../config/database.config.js";
import {
  Exam,
} from "../../models/exams/Exam.model.js";
import Level from "../../models/level/Level.model.js";
import { University } from "../../models/university/University.model.js";
import UserModel from "../../models/users/User.model.js";

class ExamService {
  async listExams(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const {
      q,
      level,
      affiliation,
      discipline,
      examType,
      isOpen,
      isUpcoming,
      sortBy,
      sortOrder,
    } = query;

    const whereCondition = {};
    const include = [];

    // Search query
    if (q) {
      whereCondition[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
      ];
    }

    // Affiliation filter (ID or Slug)
    if (affiliation) {
      if (!isNaN(affiliation)) {
        whereCondition.affiliation = parseInt(affiliation, 10);
      } else {
        include.push({
          model: University,
          as: "university",
          where: { slugs: affiliation },
          attributes: ["id", "fullname"],
        });
      }
    } else {
      include.push({
        model: University,
        attributes: ["id", "fullname"],
        as: "university",
      });
    }

    // Exam Type filter
    if (examType) {
      whereCondition.exam_type = examType;
    }

    // Discipline filter (ID or Slug) - Joined via Program
    if (discipline) {
      const facultyWhere = {};
      if (!isNaN(discipline)) {
        facultyWhere.id = parseInt(discipline, 10);
      } else {
        facultyWhere.slugs = discipline;
      }

      include.push({
        association: "programs", // Exam.hasMany(Program)
        required: true,
        attributes: [],
        include: [
          {
            association: "programfaculty", // Program.belongsTo(Faculty)
            where: facultyWhere,
            required: true,
            attributes: [],
          },
        ],
      });
    }

    // Date based filters
    const now = new Date();

    if (isOpen === "true") {
      whereCondition.opening_date = { [Op.lte]: now };
      whereCondition.closing_date = { [Op.gte]: now };
    }

    if (isUpcoming === "true") {
      whereCondition.exam_date = { [Op.gt]: now };
    }

    // Author Details
    include.push({
      model: UserModel,
      attributes: ["id", "firstName"],
      as: "authorDetails",
    });

    // Sorting
    const validSortFields = ["title", "createdAt"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const order = [
      [sortField, sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC"],
    ];

    const { count: totalCount, rows: items } = await Exam.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      distinct: true,
      order,
      include,
    });

    return {
      items,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        limit,
        totalCount,
      },
    };
  }

  async getExam(slugs) {
    const exam = await Exam.findOne({
      where: { slugs },
      include: [
        { model: Level, attributes: ["id", "title"], as: "level" },
        {
          model: University,
          attributes: ["id", "fullname"],
          as: "university",
        },
        {
          model: UserModel,
          attributes: ["id", "firstName"],
          as: "authorDetails",
        },
      ],
    });

    if (!exam) {
      const error = new Error("Exam not found");
      error.status = 404;
      throw error;
    }

    return exam;
  }

  async createOrUpdateExam(payload) {
    const {
      id,
      title,
      description,
      author,
      level_id,
      affiliation,
      syllabus,
      pastQuestion,
      // Flattened fields
      exam_type,
      full_marks,
      pass_marks,
      questions_count,
      question_type,
      duration,
      normal_fee,
      late_fee,
      exam_date,
      opening_date,
      closing_date,
    } = payload;

    const transaction = await sequelize.transaction();
    try {
      let examId = id;
      const slugs = slug(title);

      const examData = {
        title,
        description,
        author,
        level_id,
        affiliation,
        syllabus,
        pastQuestion,
        exam_type,
        full_marks,
        pass_marks,
        questions_count,
        question_type,
        duration,
        normal_fee,
        late_fee,
        exam_date,
        opening_date,
        closing_date,
      };

      if (!examId) {
        // Create
        examData.slugs = slugs;
        const exam = await Exam.create(examData, { transaction });
        examId = exam.id;
      } else {
        // Update
        // Check if title changed to update slugs? user might not want slug change valid SEO
        // For now not updating slug on edit unless explicitly requested logic changes
        await Exam.update(examData, { where: { id: examId }, transaction });
      }

      await transaction.commit();
      return { id: examId };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteExam(id) {
    const deletedRows = await Exam.destroy({
      where: { id },
    });
    if (deletedRows === 0) {
      const error = new Error("Exam not found");
      error.status = 404;
      throw error;
    }
  }
}

export default ExamService;
