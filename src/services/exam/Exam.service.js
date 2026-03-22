import slug from "slug";
import { Op } from "sequelize";

import { sequelize } from "../../config/database.config.js";
import {
  Exam,
} from "../../models/exams/Exam.model.js";
import Level from "../../models/level/Level.model.js";
import { University } from "../../models/university/University.model.js";
import UserModel from "../../models/users/User.model.js";
import Category from "../../models/category/Category.model.js";

import { generateUniqueSlug } from "../../utils/SlugHelper.js"
class ExamService {
  async listExams(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const {
      q,
      levelId,
      universityId,
      discipline,
      examType,
      categoryId,
      isOpen,
      isUpcoming,
      sortBy,
      sortOrder,
      status,
    } = query;

    const whereCondition = { status: "published" };
    const include = [];

    // Search query
    if (q) {
      whereCondition[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
      ];
    }

    // University/Affiliation filter
    if (universityId) {
      const parsedUniversityId = parseInt(universityId, 10);
      if (!isNaN(parsedUniversityId)) {
        whereCondition.affiliation = parsedUniversityId;
      }
    }

    include.push({
      model: University,
      attributes: ["id", "fullname"],
      as: "university",
    });

    // Category filter
    if (categoryId) {
      const parsedCategoryId = parseInt(categoryId, 10);
      if (!isNaN(parsedCategoryId)) {
        whereCondition.category_id = parsedCategoryId;
      }
    }

    include.push({
      model: Category,
      attributes: ["id", "title"],
      as: "category",
    });

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
        association: "programs",
        required: true,
        attributes: [],
        include: [
          {
            association: "programfaculty",
            where: facultyWhere,
            required: true,
            attributes: [],
          },
        ],
      });
    }

    // Date based filters
    const now = new Date();

    if (isOpen === true || isOpen === "true") {
      whereCondition.opening_date = { [Op.lte]: now };
      whereCondition.closing_date = { [Op.gte]: now };
    }

    if (isUpcoming === true || isUpcoming === "true") {
      whereCondition.exam_date = { [Op.gt]: now };
    }

    // Level Filter
    if (levelId) {
      const parsedLevelId = parseInt(levelId, 10);
      if (!isNaN(parsedLevelId)) {
        whereCondition.level_id = parsedLevelId;
      }
    }

    // Include Level Details
    include.push({
      model: Level,
      attributes: ["id", "title"],
      as: "level",
    });

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

  async listAdminExams(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const {
      q,
      levelId,
      universityId,
      examType,
      categoryId,
      status,
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

    // Status filter
    if (status) {
      whereCondition.status = status;
    }

    // University/Affiliation filter
    if (universityId) {
      const parsedUniversityId = parseInt(universityId, 10);
      if (!isNaN(parsedUniversityId)) {
        whereCondition.affiliation = parsedUniversityId;
      }
    }

    include.push({
      model: University,
      attributes: ["id", "fullname"],
      as: "university",
    });

    // Category filter
    if (categoryId) {
      const parsedCategoryId = parseInt(categoryId, 10);
      if (!isNaN(parsedCategoryId)) {
        whereCondition.category_id = parsedCategoryId;
      }
    }

    include.push({
      model: Category,
      attributes: ["id", "title"],
      as: "category",
    });

    // Exam Type filter
    if (examType) {
      whereCondition.exam_type = examType;
    }

    // Level Filter
    if (levelId) {
      const parsedLevelId = parseInt(levelId, 10);
      if (!isNaN(parsedLevelId)) {
        whereCondition.level_id = parsedLevelId;
      }
    }

    // Include Level Details
    include.push({
      model: Level,
      attributes: ["id", "title"],
      as: "level",
    });

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
    const whereCondition = {};
    if (!isNaN(slugs) && !isNaN(parseFloat(slugs))) {
      whereCondition[Op.or] = [{ id: parseInt(slugs, 10) }, { slugs }];
    } else {
      whereCondition.slugs = slugs;
    }

    const exam = await Exam.findOne({
      where: whereCondition,
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
        {
          model: Category,
          attributes: ["id", "title"],
          as: "category",
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
    console.log(payload, "payloadpayload")
    const {
      id,
      title,
      description,
      meta_description,
      author,
      level_id,
      category_id,
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
      status,
    } = payload;

    const transaction = await sequelize.transaction();
    try {
      let examId = id;

      const examData = {
        title,
        description,
        meta_description,
        author,
        level_id,
        category_id,
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
        status,
      };

      if (!examId) {
        const existingExam = await Exam.findOne({ where: { title } });
        if (existingExam) {
          const error = new Error("Exam already exists");
          error.status = 400;
          throw error;
        }
        // Create
        const slugs = generateUniqueSlug(title);
        examData.slugs = slugs;
        const exam = await Exam.create(examData, { transaction });
        examId = exam.id;
      } else {

        if (examData.title !== title) {
          examData.slugs = generateUniqueSlug(title);
        }
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
