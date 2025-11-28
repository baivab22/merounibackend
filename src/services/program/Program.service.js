import { Op } from "sequelize";
import slug from "slug";

import { sequelize } from "../../config/database.config.js";
import Program from "../../models/program/Program.model.js";
import ProgramSyllabus from "../../models/program/ProgramSyllabus.model.js";
import ProgramCollege from "../../models/program/ProgramCollege.model.js";
import Course from "../../models/courses/Course.model.js";
import Faculty from "../../models/faculty/Faculty.model.js";
import Scholarship from "../../models/scholarship/Scholarship.model.js";
import Level from "../../models/level/Level.model.js";
import { Exam } from "../../models/exams/Exam.model.js";
import UserModel from "../../models/users/User.model.js";
import College from "../../models/college/College.model.js";
import CollegeAddress from "../../models/college/CollegeAddress.model.js";

class ProgramService {
  async listPrograms(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { facultyId, levelId, examId, q } = query;

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
      distinct: true,
      order: [["createdAt", "DESC"]],
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
          model: UserModel,
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
        faculty_id,
        duration,
        credits,
        level_id,
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
        faculty_id,
        level_id,
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
            slugs: slug(title),
            author,
            faculty_id,
            duration,
            credits,
            level_id,
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
            slugs: slug(title),
            author,
            faculty_id,
            duration,
            credits,
            level_id,
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
          },
          { where: { id: programId }, transaction }
        );
      }

      if (Array.isArray(syllabus)) {
        await ProgramSyllabus.destroy({
          where: { program_id: programId },
          transaction,
        });

        const syllabusData = syllabus.map((item) => ({
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
    faculty_id,
    level_id,
    scholarship_id,
    exam_id,
    author,
  }) {
    const facultyExists = await Faculty.findByPk(faculty_id);
    if (!facultyExists) {
      const error = new Error("Invalid faculty_id");
      error.status = 400;
      throw error;
    }

    const levelExists = await Level.findByPk(level_id);
    if (!levelExists) {
      const error = new Error("Invalid level_id");
      error.status = 400;
      throw error;
    }

    if (scholarship_id) {
      const scholarshipExists = await Scholarship.findByPk(scholarship_id);
      if (!scholarshipExists) {
        const error = new Error("Invalid scholarship_id");
        error.status = 400;
        throw error;
      }
    }

    if (exam_id) {
      const examExists = await Exam.findByPk(exam_id);
      if (!examExists) {
        const error = new Error("Invalid exam_id");
        error.status = 400;
        throw error;
      }
    }

    const authorExists = await UserModel.findByPk(author);
    if (!authorExists) {
      const error = new Error("Invalid author ID");
      error.status = 400;
      throw error;
    }
  }
}

export default ProgramService;
