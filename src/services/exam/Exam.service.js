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
import { safeParseJSON } from "../../utils/JsonHelper.js";
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

    // University/Affiliation filter (JSONB array contains)
    if (universityId) {
      const parsedUniversityId = parseInt(universityId, 10);
      if (!isNaN(parsedUniversityId)) {
        whereCondition.affiliation = { [Op.contains]: [parsedUniversityId] };
      }
    }

    // Since affiliation is now JSONB, we can't easily use belongsTo include.
    // We'll return the IDs as is, or fetch details after query if really needed.
    // For listing, usually IDs are enough or we can expand them if requested.
    // I will remove the include for University for now as it would fail.

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

    // Expand universities to maintain response consistency
    const universityMap = new Map();
    const allUniversityIds = [...new Set(items.flatMap(exam => safeParseJSON(exam.affiliation)))];
    
    if (allUniversityIds.length > 0) {
      const universities = await University.findAll({
        where: { id: allUniversityIds },
        attributes: ["id", "fullname", "logo"],
      });
      universities.forEach(u => universityMap.set(u.id, u));
    }

    items.forEach(exam => {
      const parsed = safeParseJSON(exam.affiliation);
      const expanded = parsed.map(id => universityMap.get(id)).filter(Boolean);
      exam.setDataValue("affiliation", expanded);
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

    // University/Affiliation filter (JSONB array contains)
    if (universityId) {
      const parsedUniversityId = parseInt(universityId, 10);
      if (!isNaN(parsedUniversityId)) {
        whereCondition.affiliation = { [Op.contains]: [parsedUniversityId] };
      }
    }

    // No include for University here since it's JSONB now.

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

    // Expand universities to maintain response consistency
    const universityMap = new Map();
    const allUniversityIds = [...new Set(items.flatMap(exam => safeParseJSON(exam.affiliation)))];
    
    if (allUniversityIds.length > 0) {
      const universities = await University.findAll({
        where: { id: allUniversityIds },
        attributes: ["id", "fullname", "logo"],
      });
      universities.forEach(u => universityMap.set(u.id, u));
    }

    items.forEach(exam => {
      const parsed = safeParseJSON(exam.affiliation);
      const expanded = parsed.map(id => universityMap.get(id)).filter(Boolean);
      exam.setDataValue("affiliation", expanded);
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

    // Manually expand universities to maintain response consistency
    const affiliationIds = safeParseJSON(exam.affiliation);
    let expanded = [];
    if (affiliationIds.length > 0) {
      const universities = await University.findAll({
        where: { id: affiliationIds },
        attributes: ["id", "fullname", "logo"],
      });
      const universityMap = new Map(universities.map(u => [u.id, u]));
      expanded = affiliationIds.map(id => universityMap.get(id)).filter(Boolean);
    }
    
    exam.setDataValue("affiliation", expanded);
    exam.setDataValue("affiliations", expanded); // Maintain plural for backward compatibility if needed

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
      conducted_by,
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
        conducted_by,
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
