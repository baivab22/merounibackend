import slug from "slug";
import { Op } from "sequelize";

import { sequelize } from "../../config/database.config.js";
import {
  Exam,
  ExamDetail,
  ApplicationDetail,
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
      levelId,
      universityId,
      isOpen,
      isUpcoming,
      sortBy,
      sortOrder,
    } = query;

    const whereCondition = {};

    // Search query
    if (q) {
      whereCondition[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
      ];
    }

    // Direct filters
    if (levelId) whereCondition.level_id = levelId;
    if (universityId) whereCondition.affiliation = universityId;

    // Application Detail filters (Date based)
    const applicationWhere = {};
    const now = new Date();

    if (isOpen === "true") {
      applicationWhere.opening_date = { [Op.lte]: now };
      applicationWhere.closing_date = { [Op.gte]: now };
    }

    if (isUpcoming === "true") {
      applicationWhere.exam_date = { [Op.gt]: now };
    }

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
        { model: ExamDetail, as: "exam_details" },
        {
          model: ApplicationDetail,
          as: "application_details",
          where:
            Object.keys(applicationWhere).length > 0
              ? applicationWhere
              : undefined,
          required: Object.keys(applicationWhere).length > 0,
        },
      ],
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
        { model: ExamDetail, as: "exam_details" },
        { model: ApplicationDetail, as: "application_details" },
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
      examDetails,
      applicationDetails,
    } = payload;

    const transaction = await sequelize.transaction();
    try {
      let examId = id;
      const slugs = slug(title);

      if (!examId) {
        const exam = await Exam.create(
          {
            title,
            slugs,
            description,
            author,
            level_id,
            affiliation,
            syllabus,
            pastQuestion,
          },
          { transaction }
        );
        examId = exam.id;
      } else {
        await Exam.update(
          {
            title,
            slugs,
            description,
            author,
            level_id,
            affiliation,
            syllabus,
            pastQuestion,
          },
          { where: { id: examId }, transaction }
        );
      }

      if (Array.isArray(examDetails) && examDetails.length > 0) {
        await ExamDetail.destroy({ where: { exam_id: examId }, transaction });
        await ExamDetail.bulkCreate(
          examDetails.map((detail) => ({
            exam_id: examId,
            ...detail,
          })),
          { transaction }
        );
      }

      if (applicationDetails) {
        await ApplicationDetail.destroy({
          where: { exam_id: examId },
          transaction,
        });
        await ApplicationDetail.create(
          {
            exam_id: examId,
            ...applicationDetails,
          },
          { transaction }
        );
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
