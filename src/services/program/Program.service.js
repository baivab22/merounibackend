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
import Discipline from "../../models/discipline/Discipline.model.js";

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

    console.log("[ProgramService] listPrograms query:", JSON.stringify(query, null, 2));

    if (facultyId) {
      whereConditions.faculty_id = facultyId;
    }
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

    console.log(
      "[ProgramService] whereConditions:",
      JSON.stringify(whereConditions, null, 2)
    );

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
          model: Discipline,
          as: "discipline",
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
        discipline_id,
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
        discipline_id,
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
            discipline_id,
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
            discipline_id,
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
    discipline_id,
  }) {
    // Validate faculty_id
    if (!faculty_id) {
      const error = new Error("faculty_id is required");
      error.status = 400;
      throw error;
    }

    const facultyIdNum = Number(faculty_id);
    console.log(
      `Checking faculty with ID: ${facultyIdNum} (original: ${faculty_id}, type: ${typeof faculty_id})`
    );

    // Try findByPk first, if it fails try findOne as fallback
    let facultyExists = await Faculty.findByPk(facultyIdNum);

    if (!facultyExists) {
      // Try with findOne as fallback
      facultyExists = await Faculty.findOne({
        where: { id: facultyIdNum },
      });
    }

    if (!facultyExists) {
      // Try raw query to see if record exists
      const [results] = await sequelize.query(
        `SELECT id FROM faculty WHERE id = :id`,
        {
          replacements: { id: facultyIdNum },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      console.log(`Raw query result for faculty ${facultyIdNum}:`, results);

      console.error(`Faculty with ID ${facultyIdNum} not found via Sequelize`);
      const error = new Error(
        `Invalid faculty_id: ${facultyIdNum}. Faculty does not exist.`
      );
      error.status = 400;
      throw error;
    }

    console.log(
      `Faculty ${facultyIdNum} found successfully:`,
      facultyExists.title
    );

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

    // Validate discipline_id (optional)
    if (discipline_id) {
      const disciplineExists = await Discipline.findByPk(Number(discipline_id));
      if (!disciplineExists) {
        console.error(`Discipline with ID ${discipline_id} not found`);
        const error = new Error(
          `Invalid discipline_id: ${discipline_id}. Discipline does not exist.`
        );
        error.status = 400;
        throw error;
      }
    }
  }
}

export default ProgramService;
