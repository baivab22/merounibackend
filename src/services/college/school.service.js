import { Op, Sequelize } from "sequelize";
import College from "../../models/college/College.model.js";
import CollegeAddress from "../../models/college/CollegeAddress.model.js";
import CollegeContact from "../../models/college/CollegeContact.model.js";
import CollegeOfferingProgram from "../../models/college/CollegeOfferingProgram.model.js";
import CollegeMember from "../../models/college/CollegeMember.model.js";
import CollegeAdmission from "../../models/college/CollegeAdmission.model.js";
import CollegeGallery from "../../models/college/CollegeGallery.model.js";
import CollegeFacility from "../../models/college/CollegeFacility.model.js";
import { University } from "../../models/university/University.model.js";
import Program from "../../models/program/Program.model.js";
import UserModel from "../../models/users/User.model.js";
import CollegeUniversity from "../../models/college/CollegeUniversity.model.js";
import Board from "../../models/board/Board.model.js";
import Stream from "../../models/stream/Stream.model.js";
import SchoolBoardStreamProgram from "../../models/college/SchoolBoardStreamProgram.model.js";
import { safeParseJSON } from "../../utils/JsonHelper.js";
import CollegeService from "./College.service.js";

const collegeService = new CollegeService();

import { sequelize } from "../../config/database.config.js";

const parseFilter = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string")
    return val
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  return [val];
};

class SchoolService {
  async listSchools(query = {}, isAdmin = false) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 24;
    const sort = (query.sort || "asc").toUpperCase();
    const search = query.q || "";

    const types = parseFilter(query.type);
    const affiliations = parseFilter(query.affiliation || query.university);
    const boardIds = parseFilter(query.board_ids || query.board_id);
    const streamIds = parseFilter(query.stream_ids || query.stream_id);
    const status = query.status;

    const offset = (page - 1) * limit;

    const whereCondition = {
      [Op.and]: [
        Sequelize.literal(`JSON_CONTAINS(institute_level, '"School"')`),
      ],
    };

    if (search) {
      whereCondition.name = { [Op.like]: `%${search}%` };
    }

    if (types.length > 0) {
      whereCondition.institute_type = { [Op.in]: types };
    }

    if (isAdmin) {
      if (status && status !== "all") {
        whereCondition.status = status;
      }
    } else {
      whereCondition.status = "published";
    }

    if (affiliations.length > 0) {
      const matchedUniversities = await University.findAll({
        where: {
          [Op.or]: [
            { id: { [Op.in]: affiliations.filter((a) => !isNaN(a)) } },
            { fullname: { [Op.in]: affiliations } },
            { slugs: { [Op.in]: affiliations } },
          ],
        },
        attributes: ["id"],
        raw: true,
      });

      const universityIds = matchedUniversities.map((u) => u.id);

      if (universityIds.length > 0) {
        const collegeWithUniversities = await CollegeUniversity.findAll({
          where: { university_id: { [Op.in]: universityIds } },
          attributes: ["college_id"],
          raw: true,
        });
        const collegeIds = collegeWithUniversities.map((cu) => cu.college_id);
        whereCondition.id = { [Op.in]: collegeIds };
      } else {
        whereCondition.id = { [Op.in]: [] };
      }
    }

    if (boardIds.length > 0) {
      const schoolBoardStreams = await SchoolBoardStreamProgram.findAll({
        where: { board_id: { [Op.in]: boardIds } },
        attributes: ["college_school_id"],
        raw: true,
      });
      const collegeIds = schoolBoardStreams.map((sbs) => sbs.college_school_id);
      if (whereCondition.id) {
        whereCondition.id = {
          [Op.and]: [whereCondition.id, { [Op.in]: collegeIds }],
        };
      } else {
        whereCondition.id = { [Op.in]: collegeIds };
      }
    }

    if (streamIds.length > 0) {
      const schoolBoardStreams = await SchoolBoardStreamProgram.findAll({
        where: { stream_id: { [Op.in]: streamIds } },
        attributes: ["college_school_id"],
        raw: true,
      });
      const collegeIds = schoolBoardStreams.map((sbs) => sbs.college_school_id);
      if (whereCondition.id) {
        whereCondition.id = {
          [Op.and]: [whereCondition.id, { [Op.in]: collegeIds }],
        };
      } else {
        whereCondition.id = { [Op.in]: collegeIds };
      }
    }

    const include = [
      {
        model: CollegeAddress,
        as: "address",
        attributes: ["country", "district", "city", "street", "postal_code"],
      },
      {
        model: CollegeGallery,
        as: "collegeGallery",
      },
    ];
    const { count: totalCount, rows: items } = await College.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      distinct: true,
      order: [
        [Sequelize.literal("order_no_for_website IS NULL"), "ASC"],
        ["order_no_for_website", "ASC"],
        ["id", sort],
      ],
      include,
    });

    const collegeIds = items.map((college) => college.id);

    const usersWithCollegeId = await UserModel.findAll({
      where: {
        collegeId: { [Op.in]: collegeIds },
      },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "phoneNo",
        "collegeId",
        "roles",
      ],
      raw: true,
    });

    const collegeAccountMap = new Map();
    usersWithCollegeId.forEach((user) => {
      try {
        const roles =
          typeof user.roles === "string"
            ? safeParseJSON(user.roles, {})
            : user.roles;
        if (roles?.institution === true && user.collegeId) {
          collegeAccountMap.set(user.collegeId, user);
        }
      } catch {}
    });

    const itemsWithAccountStatus = items.map((college) => {
      const collegeData = college.toJSON ? college.toJSON() : college;
      const account = collegeAccountMap.get(college.id);
      return {
        ...collegeData,
        has_account: !!account,
        account: account || null,
      };
    });

    return {
      items: itemsWithAccountStatus,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        limit,
        totalCount,
      },
    };
  }

  async getSchoolBySlug(slugs) {
    const school = await College.findOne({
      where: {
        slugs,
        [Op.and]: [
          Sequelize.literal(`JSON_CONTAINS(institute_level, '"School"')`),
        ],
      },
      attributes: {
        exclude: ["author_id"],
      },

      include: [
        {
          model: CollegeFacility,
          as: "facilities",
          attributes: ["title", "description", "icon"],
        },
        {
          model: CollegeAddress,
          as: "address",
          attributes: ["country", "district", "city", "street", "postal_code"],
        },
        {
          model: CollegeContact,
          as: "contacts",
          attributes: ["contact_number"],
        },
        {
          model: CollegeGallery,
          as: "collegeGallery",
        },
        {
          model: CollegeOfferingProgram,
          as: "collegePrograms",
          include: [
            {
              model: Program,
              as: "program",
              attributes: ["id", "title", "slugs"],
            },
          ],
        },
        {
          model: CollegeMember,
          as: "collegeMembers",
          attributes: ["name", "contact_number", "role", "description"],
        },
        {
          model: CollegeAdmission,
          as: "collegeAdmissions",
          include: [
            {
              model: Program,
              as: "program",
              attributes: ["title", "slugs"],
            },
          ],
        },
        {
          model: University,
          as: "universities",
          attributes: ["fullname", "slugs", "id"],
        },
        {
          model: SchoolBoardStreamProgram,
          as: "schoolBoardStreamPrograms",
          include: [
            { model: Board, as: "board", attributes: ["name", "id"] },
            { model: Stream, as: "stream", attributes: ["name", "id"] },
            { model: Program, as: "program", attributes: ["title", "id"] },
          ],
        },

        {
          model: UserModel,
          as: "authorDetails",
          attributes: ["firstName", "middleName", "lastName"],
        },
      ],
    });

    if (!school) {
      const error = new Error("School not found!");
      error.status = 404;
      throw error;
    }

    const schoolData = school.get({ plain: true });

    // Map schoolBoardStreamPrograms back to flat boards, streams, and programs for frontend compatibility
    const boardsMap = new Map();
    const streamsMap = new Map();
    const programsMap = new Map();

    if (schoolData.schoolBoardStreamPrograms) {
      schoolData.schoolBoardStreamPrograms.forEach((sbsp) => {
        if (sbsp.board && !boardsMap.has(sbsp.board.id)) {
          boardsMap.set(sbsp.board.id, sbsp.board);
        }
        if (sbsp.stream && !streamsMap.has(sbsp.stream.id)) {
          streamsMap.set(sbsp.stream.id, sbsp.stream);
        }
        if (sbsp.program && !programsMap.has(sbsp.program.id)) {
          programsMap.set(sbsp.program.id, sbsp.program);
        }
      });
    }

    schoolData.boards = Array.from(boardsMap.values());
    schoolData.streams = Array.from(streamsMap.values());
    schoolData.programs = Array.from(programsMap.values());

    // Robust JSON parsing
    schoolData.faqs = safeParseJSON(schoolData.faqs);
    schoolData.institute_level = safeParseJSON(schoolData.institute_level);
    return schoolData;
  }

  async updateSchoolOrder(schools) {
    const transaction = await sequelize.transaction();
    try {
      // Validate all school IDs exist and are actually schools
      const schoolIds = schools.map((s) => s.id);
      const existingSchools = await College.findAll({
        where: {
          id: { [Op.in]: schoolIds },
          [Op.and]: [
            Sequelize.literal(`JSON_CONTAINS(institute_level, '"School"')`),
          ],
        },
        transaction,
      });

      if (existingSchools.length !== schoolIds.length) {
        const error = new Error(
          "Invalid school IDs or some items are not schools",
        );
        error.status = 400;
        throw error;
      }

      // Update order_no_for_website for each school
      const updates = schools.map((school) =>
        College.update(
          { order_no_for_website: school.order_no },
          { where: { id: school.id }, transaction },
        ),
      );

      await Promise.all(updates);
      await transaction.commit();

      return { message: "School order updated successfully" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async listSchoolAffiliations() {
    const universities = await University.findAll({
      include: [
        {
          model: College,
          as: "colleges",
          required: true,
          where: {
            [Op.and]: [
              Sequelize.literal(`JSON_CONTAINS(institute_level, '"School"')`),
            ],
          },
          attributes: [],
          through: { attributes: [] },
        },
      ],
      attributes: ["id", "fullname", "slugs"],
      group: ["University.id", "University.fullname", "University.slugs"],
      order: [["fullname", "ASC"]],
    });

    return universities;
  }

  async listSchoolBoards() {
    const boards = await Board.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    return boards;
  }

  async listSchoolStreams() {
    const streams = await Stream.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    return streams;
  }

  async createOrUpdateSchool(payload) {
    return collegeService.createOrUpdateCollege(payload);
  }
}

export default new SchoolService();
