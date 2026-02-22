import { Op } from "sequelize";

import { sequelize } from "../../config/database.config.js";
import College from "../../models/college/College.model.js";
import CollegeAddress from "../../models/college/CollegeAddress.model.js";
import Course from "../../models/courses/Course.model.js";
import Degree from "../../models/degree/Degree.model.js";
import { Exam } from "../../models/exams/Exam.model.js";
import Level from "../../models/level/Level.model.js";
import Program from "../../models/program/Program.model.js";
import ProgramCollege from "../../models/program/ProgramCollege.model.js";
import ProgramSyllabus from "../../models/program/ProgramSyllabus.model.js";
import Scholarship from "../../models/scholarship/Scholarship.model.js";
import UserModel from "../../models/users/User.model.js";
import { generateUniqueSlug } from "../../utils/SlugHelper.js";

class ProgramService {

  async listPrograms(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const {
      facultyId,
      levelId,
      disciplineId,
      q,
      sortBy,
      sortOrder,
    } = query;

    const whereConditions = {};
    const include = [];


    if (levelId) {
      whereConditions.level_id = levelId;
    }
    if (disciplineId) {
      whereConditions.discipline_id = disciplineId;
    }
    if (q) {
      whereConditions[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { code: { [Op.like]: `%${q}%` } },
      ];
    }


    const validSortFields = [
      "title",
      "code",
      "createdAt",
      "duration",
      "credits",
      "fee",
    ];

    const sortField = validSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const order = [
      [sortField, sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC"],
    ];

    const { count: totalCount, rows: items } =
      await Program.findAndCountAll({
        where: whereConditions,
        include: include.length ? include : undefined,
        limit,
        offset,
        distinct: true,
        order,
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


  async getProgram(slugs) {
    const program = await Program.findOne({
      where: { slugs },
      attributes: {
        exclude: [
          "author",
          "level_id",
          "scholarship_id",
          "exam_id",
        ],
      },
      include: [
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
        { model: Level, as: "programlevel", attributes: ["title", "slugs","id"] },
        {
          model: Degree,
          as: "programdegree",
          attributes: ["id", "title", "short_name", "slug"],
          required: false,
        },
        {
          model: Scholarship,
          as: "programscholarship",
          attributes: ["name", "slugs","id"],
        },
        { model: Exam, as: "programexam", attributes: ["title", "slugs","id"] },
        {
          model: UserModel,
          as: "programauthorDetails",
          attributes: ["firstName", "middleName", "lastName"],
        },
        {
          model: College,
          as: "colleges",
          attributes: ["name", "slugs","id"],
        },
        {
          model: CollegeAddress,
          as: "collegesAddress",
          attributes: ["country", "city", "state","id"],
        },
      ],
    });

    if (!program) {
      const error = new Error("Program not found");
      error.status = 404;
      throw error;
    }

    return program;
  }

  async createOrUpdateProgram(payload) {
    const transaction = await sequelize.transaction();

    try {
      const {
        id,
        title,
        code,
        author,
        duration,
        credits,
        level_id,
        degree_id,
        language,
        eligibility_criteria,
        fee,
        scholarship_id,
        curriculum,
        learning_outcomes,
        delivery_type,
        delivery_mode,
        careers,
        exam_id,
        syllabus,
        colleges,
      } = payload;

      let programId = id;

      await this.validateReferences({
        level_id,
        degree_id,
        scholarship_id,
        exam_id,
        author,
      });

      if (!programId) {
        const existingProgram = await Program.findOne({ where: { title } });
        if (existingProgram) {
          const error = new Error("Program title already exists");
          error.status = 400;
          throw error;
        }

        const newProgram = await Program.create(
          {
            title,
            code,
            slugs: generateUniqueSlug(title),
            author,
            duration,
            credits,
            level_id,
            degree_id: degree_id || null,
            language,
            eligibility_criteria,
            fee,
            scholarship_id: scholarship_id || null,
            curriculum,
            learning_outcomes,
            delivery_type,
            delivery_mode,
            careers,
            exam_id: exam_id || null,
          },
          { transaction }
        );

        programId = newProgram.id;
      } else {
        const existingProgram = await Program.findByPk(programId);
        if (!existingProgram) {
          const error = new Error("Program not found");
          error.status = 404;
          throw error;
        }


        await Program.update(
          {
            title,
            code,
            author,
            duration,
            credits,
            level_id,
            degree_id: degree_id || null,
            language,
            eligibility_criteria,
            fee,
            scholarship_id: scholarship_id || null,
            curriculum,
            learning_outcomes,
            delivery_type,
            delivery_mode,
            careers,
            exam_id: exam_id || null,
          },
          { where: { id: programId }, transaction }
        );
      }

      if (Array.isArray(syllabus)) {
        await ProgramSyllabus.destroy({
          where: { program_id: programId },
          transaction,
        });

        const syllabusData = syllabus
          .filter(item => item.course_id)
          .map((item) => ({
          year: item.year,
          semester: item.semester,
          is_elective: item.is_elective || false,
          program_id: programId,
          course_id: item.course_id,
        }));

        await ProgramSyllabus.bulkCreate(syllabusData, { transaction });
      }

      if (Array.isArray(colleges)) {
        await ProgramCollege.destroy({
          where: { program_id: programId },
          transaction,
        });

        const programCollegeData = colleges.map((collegeId) => ({
          program_id: programId,
          college_id: collegeId,
        }));

        await ProgramCollege.bulkCreate(programCollegeData, { transaction });
      }

      await transaction.commit();
      return programId;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteProgram(id) {
    const deleted = await Program.destroy({ where: { id } });
    if (!deleted) {
      const error = new Error("Program not found");
      error.status = 404;
      throw error;
    }
  }

  async validateReferences({
    level_id,
    degree_id,
    scholarship_id,
    exam_id,
    author,
  }) {
    // Validate level_id
    if (!level_id) {
      const error = new Error("level_id is required");
      error.status = 400;
      throw error;
    }

    const levelExists = await Level.findByPk(Number(level_id));
    if (!levelExists) {
      console.error(`Level with ID ${level_id} not found`);
      const error = new Error(
        `Invalid level_id: ${level_id}. Level does not exist.`
      );
      error.status = 400;
      throw error;
    }

    // Validate degree_id (optional)
    if (degree_id) {
      const degreeExists = await Degree.findByPk(Number(degree_id));
      if (!degreeExists) {
        const error = new Error(
          `Invalid degree_id: ${degree_id}. Degree does not exist.`
        );
        error.status = 400;
        throw error;
      }
    }

    // Validate scholarship_id (optional)
    if (scholarship_id) {
      const scholarshipExists = await Scholarship.findByPk(
        Number(scholarship_id)
      );
      if (!scholarshipExists) {
        console.error(`Scholarship with ID ${scholarship_id} not found`);
        const error = new Error(
          `Invalid scholarship_id: ${scholarship_id}. Scholarship does not exist.`
        );
        error.status = 400;
        throw error;
      }
    }

    // Validate exam_id (optional)
    if (exam_id) {
      const examExists = await Exam.findByPk(Number(exam_id));
      if (!examExists) {
        console.error(`Exam with ID ${exam_id} not found`);
        const error = new Error(
          `Invalid exam_id: ${exam_id}. Exam does not exist.`
        );
        error.status = 400;
        throw error;
      }
    }

    // Validate author
    if (!author) {
      const error = new Error("author is required");
      error.status = 400;
      throw error;
    }

    const authorExists = await UserModel.findByPk(Number(author));
    if (!authorExists) {
      console.error(`User with ID ${author} not found`);
      const error = new Error(
        `Invalid author ID: ${author}. User does not exist.`
      );
      error.status = 400;
      throw error;
    }

  }
}

export default ProgramService;
