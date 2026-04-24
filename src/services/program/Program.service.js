import { Op } from "sequelize";

import { sequelize } from "../../config/database.config.js";
import College from "../../models/college/College.model.js";
import CollegeAddress from "../../models/college/CollegeAddress.model.js";
import Course from "../../models/courses/Course.model.js";
import Degree from "../../models/degree/Degree.model.js";
import { Exam } from "../../models/exams/Exam.model.js";
import Level from "../../models/level/Level.model.js";
import Program from "../../models/program/Program.model.js";
import ProgramDegree from "../../models/program/ProgramDegree.model.js";
import CollegeOfferingProgram from "../../models/college/CollegeOfferingProgram.model.js";
import ProgramSyllabus from "../../models/program/ProgramSyllabus.model.js";
import Scholarship from "../../models/scholarship/Scholarship.model.js";
import UserModel from "../../models/users/User.model.js";
import { University, UniversityProgram } from "../../models/university/University.model.js";
import { generateUniqueSlug } from "../../utils/SlugHelper.js";
import Stream from "../../models/stream/Stream.model.js";


class ProgramService {

  async listPrograms(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const {
      levelId,
      disciplineId,
      universityIds,
      q,
      sortBy,
      sortOrder,
      status,
      streamId,
      degreeIds,
    } = query;


    const whereConditions = { status: "published" };
    const universityInclude = {
      model: University,
      as: "universities",
      attributes: ["id", "fullname"],
      through: { attributes: [] },
      required: false,
    };

    if (universityIds) {
      const universityIdsList = Array.isArray(universityIds)
        ? universityIds
        : typeof universityIds === "string"
          ? universityIds.split(",").map((id) => id.trim())
          : [universityIds];
      universityInclude.where = { id: { [Op.in]: universityIdsList } };
      universityInclude.required = true;
    }

    const degreeInclude = {
      model: Degree,
      as: "degrees",
      attributes: ["id", "title", "short_name", "slug"],
      through: { attributes: [] },
      required: false,
    };
    if (degreeIds) {
      const degreeIdsList = Array.isArray(degreeIds)
        ? degreeIds
        : typeof degreeIds === "string"
          ? degreeIds.split(",").map((id) => id.trim())
          : [degreeIds];
      degreeInclude.where = { id: { [Op.in]: degreeIdsList } };
      degreeInclude.required = true;
    }

    const include = [
      { model: Level, as: "programlevel", attributes: ["title", "slugs", "id"] },
      degreeInclude,
      universityInclude,
    ];

    if (levelId) {
      whereConditions.level_id = levelId;
    }
    if (disciplineId) {
      whereConditions.discipline_id = disciplineId;
    }
    const streamIdsRaw = query.stream_ids || query.stream_id;
    if (streamIdsRaw) {
      const streamIds = Array.isArray(streamIdsRaw) 
        ? streamIdsRaw.map(Number) 
        : String(streamIdsRaw).split(',').map(Number).filter(id => !isNaN(id));
      
      if (streamIds.length > 0) {
        // Since it's a many-to-many relationship through stream_programs
        include.push({
          model: Stream,
          as: "streams",
          where: { id: { [Op.in]: streamIds } },
          attributes: ["id", "name"],
          through: { attributes: [] },
          required: true,
        });
      }
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
        include,
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

  async listAdminPrograms(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const {
      levelId,
      disciplineId,
      universityIds,
      q,
      sortBy,
      sortOrder,
      status,
      streamId,
      degreeIds,
    } = query;

    const whereConditions = {};
    const universityInclude = {
      model: University,
      as: "universities",
      attributes: ["id", "fullname"],
      through: { attributes: [] },
      required: false,
    };

    if (universityIds) {
      const universityIdsList = Array.isArray(universityIds)
        ? universityIds
        : typeof universityIds === "string"
          ? universityIds.split(",").map((id) => id.trim())
          : [universityIds];
      universityInclude.where = { id: { [Op.in]: universityIdsList } };
      universityInclude.required = true;
    }

    const degreeInclude = {
      model: Degree,
      as: "degrees",
      attributes: ["id", "title", "short_name", "slug"],
      through: { attributes: [] },
      required: false,
    };
    if (degreeIds) {
      const degreeIdsList = Array.isArray(degreeIds)
        ? degreeIds
        : typeof degreeIds === "string"
          ? degreeIds.split(",").map((id) => id.trim())
          : [degreeIds];
      degreeInclude.where = { id: { [Op.in]: degreeIdsList } };
      degreeInclude.required = true;
    }

    const include = [
      { model: Level, as: "programlevel", attributes: ["title", "slugs", "id"] },
      degreeInclude,
      universityInclude,
    ];

    if (streamId) {
      include.push({
        model: Stream,
        as: "streams",
        where: { id: streamId },
        attributes: ["id", "name"],
        through: { attributes: [] },
        required: true,
      });
    }


    if (levelId) {
      whereConditions.level_id = levelId;
    }
    if (disciplineId) {
      whereConditions.discipline_id = disciplineId;
    }
    if (status) {
      whereConditions.status = status;
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
        include,
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
        { model: Level, as: "programlevel", attributes: ["title", "slugs", "id"] },
        {
          model: Degree,
          as: "degrees",
          attributes: ["id", "title", "short_name", "slug"],
          through: { attributes: [] },
          required: false,
        },
        {
          model: Scholarship,
          as: "programscholarship",
          attributes: ["name", "slugs", "id"],
        },
        { model: Exam, as: "programexam", attributes: ["title", "slugs", "id"] },
        {
          model: UserModel,
          as: "programauthorDetails",
          attributes: ["firstName", "middleName", "lastName"],
        },
        {
          model: College,
          as: "colleges",
          attributes: ["name", "slugs", "id"],
        },
        {
          model: CollegeAddress,
          as: "collegesAddress",
          attributes: ["country", "city", "district", "id"],
        },
        {
          model: University,
          as: "universities",
          attributes: ["id", "fullname", "slugs", "logo"],
          through: { attributes: [] },
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
        degree_ids,
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
        universities,
        stream_id,
        status,
      } = payload;


      let programId = id;

      await this.validateReferences({
        level_id,
        degree_ids,
        scholarship_id,
        exam_id,
        author,
        universities,
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
            stream_id: stream_id || null,
            status: status || "published",

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
            stream_id: stream_id || null,
            status: status || existingProgram.status,

          },
          { where: { id: programId }, transaction }
        );
      }

      if (Array.isArray(degree_ids)) {
        await this.syncProgramDegrees(programId, degree_ids, transaction);
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
        await CollegeOfferingProgram.destroy({
          where: { program_id: programId },
          transaction,
        });

        const programCollegeData = colleges.map((collegeId) => ({
          program_id: programId,
          college_id: collegeId,
        }));

        await CollegeOfferingProgram.bulkCreate(programCollegeData, { transaction });
      }

      // Sync universities
      if (Array.isArray(universities)) {
        await UniversityProgram.destroy({
          where: { program_id: programId },
          transaction,
        });

        if (universities.length > 0) {
          const universityProgramData = universities.map((universityId) => ({
            program_id: programId,
            university_id: universityId,
          }));
          await UniversityProgram.bulkCreate(universityProgramData, { transaction });
        }
      }

      await transaction.commit();
      return programId;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async syncProgramDegrees(programId, degreeIds, transaction) {
    await ProgramDegree.destroy({
      where: { program_id: programId },
      transaction,
    });
    const valid = [
      ...new Set(
        degreeIds
          .map((id) => parseInt(id, 10))
          .filter((id) => !isNaN(id) && id > 0)
      ),
    ];
    if (valid.length === 0) return;
    await ProgramDegree.bulkCreate(
      valid.map((degree_id) => ({ program_id: programId, degree_id })),
      { transaction }
    );
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
    degree_ids,
    scholarship_id,
    exam_id,
    author,
    universities,
  }) {
    // Validate level_id
    if (level_id) {
      const levelExists = await Level.findByPk(Number(level_id));
      if (!levelExists) {
        console.error(`Level with ID ${level_id} not found`);
        const error = new Error(
          `Invalid level_id: ${level_id}. Level does not exist.`
        );
        error.status = 400;
        throw error;
      }
    }


    if (Array.isArray(degree_ids) && degree_ids.length > 0) {
      const ids = [
        ...new Set(
          degree_ids
            .map((id) => parseInt(id, 10))
            .filter((id) => !isNaN(id) && id > 0)
        ),
      ];
      const found = await Degree.findAll({
        where: { id: { [Op.in]: ids } },
        attributes: ["id"],
      });
      if (found.length !== ids.length) {
        const valid = new Set(found.map((d) => d.id));
        const invalid = ids.filter((id) => !valid.has(id));
        const error = new Error(
          `Invalid degree_ids: ${invalid.join(", ")}. Degrees do not exist.`
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
    if (author) {
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

    // Validate university IDs (optional)
    if (Array.isArray(universities) && universities.length > 0) {
      const found = await University.findAll({
        where: { id: universities },
        attributes: ["id"],
      });
      if (found.length !== universities.length) {
        const foundIds = found.map((u) => u.id);
        const invalid = universities.filter((uid) => !foundIds.includes(uid));
        const error = new Error(
          `Invalid university IDs: ${invalid.join(", ")}. Universities do not exist.`
        );
        error.status = 400;
        throw error;
      }
    }

  }
}

export default ProgramService;
