import { Op } from "sequelize";
import { generateUniqueSlug } from "../../utils/SlugHelper.js";

import { sequelize } from "../../config/database.config.js";
import College from "../../models/college/College.model.js";
import CollegeAddress from "../../models/college/CollegeAddress.model.js";
import CollegeAdmission from "../../models/college/CollegeAdmission.model.js";
import CollegeContact from "../../models/college/CollegeContact.model.js";
import CollegeProgram from "../../models/college/CollegeProgram.model.js";
import CollegeFacility from "../../models/college/CollegeFacility.model.js";
import CollegeGallery from "../../models/college/CollegeGallery.model.js";
import CollegeMember from "../../models/college/CollegeMember.model.js";
import CollegeOfferingDegrees from "../../models/college/CollegeOfferingDegrees.model.js";
import CollegeBoard from "../../models/college/CollegeBoard.model.js";
import CollegeStream from "../../models/college/CollegeStream.model.js";
import Program from "../../models/program/Program.model.js";
import Degree from "../../models/degree/Degree.model.js";
import Level from "../../models/level/Level.model.js";
import Board from "../../models/board/Board.model.js";
import Stream from "../../models/stream/Stream.model.js";
import { University } from "../../models/university/University.model.js";
import UserModel from "../../models/users/User.model.js";



class CollegeService {
  async updateReferableStatus(id, is_referable) {
    const college = await College.findByPk(id);
    if (!college) {
      const error = new Error("College not found");
      error.status = 404;
      throw error;
    }

    await college.update({ is_referable });
    return college;
  }

  async createOrUpdateCollege(payload) {
    const transaction = await sequelize.transaction();

    try {
      const {
        id,
        name,
        institute_type,
        institute_level,
        author_id,
        university_id,
        google_map_url,

        map_type,
        website_url,
        featured_img,
        college_logo,
        college_broucher,
        address,
        contacts,
        programs,
        facilities,
        members,
        description,
        content,
        faqs,
        images,
        degrees,
        board_ids,
        stream_ids,
        status,
        is_referable,
      } = payload;


      console.log(programs, "programsprogramsprograms")
      let collegeId = (id === "null" || id === "undefined" || id === "") ? null : id;
      let existingCollege = null;

      if (collegeId) {
        existingCollege = await College.findByPk(collegeId, { transaction });
        if (!existingCollege && id) {
        }
      }

      let collegeName = name || existingCollege?.name;

      if (!collegeName) {
        const error = new Error("College name is required");
        error.status = 400;
        throw error;
      }


      if (!collegeId) {
        const existingCollege = await College.findOne({
          where: { name: collegeName },
          transaction,
        });
        if (existingCollege) {
          const error = new Error("College already exists");
          error.status = 400;
          throw error;
        }

        const slugs = generateUniqueSlug(collegeName);

        const maxOrder = await College.max('order_no_for_website', { transaction });
        const nextOrder = (maxOrder || 0) + 1;

        const newCollege = await College.create(
          {
            name: collegeName,
            slugs,
            institute_type,
            institute_level,
            author_id,
            featured_img,
            college_logo,
            college_broucher,
            description: description || "",
            content,
            google_map_url,

            map_type,
            website_url,
            faqs,
            order_no_for_website: nextOrder,
            status: status || "published",
            is_referable: is_referable ?? false,
          },
          { transaction }
        );
        collegeId = newCollege.id;
      } else {
        const updateData = {
          institute_type,
          institute_level,
          author_id,
          description: description || "",
          content,
          featured_img,
          college_logo,
          college_broucher,
          google_map_url,

          map_type,
          website_url,
          status: status || existingCollege.status,
          is_referable: is_referable !== undefined ? is_referable : existingCollege.is_referable,
        };

        // Only update name and slugs if name has changed
        if (name && existingCollege && name !== existingCollege.name) {
          updateData.name = name;
          updateData.slugs = generateUniqueSlug(name);
        } else if (name && !existingCollege) {
          // This case handles if collegeId was provided but not found in DB
          updateData.name = name;
          updateData.slugs = generateUniqueSlug(name);
        }

        await College.update(updateData, {
          where: { id: collegeId },
          transaction,
        });
      }

      if (faqs) {
        await College.update({ faqs }, { where: { id: collegeId }, transaction });
      }

      if (address) {
        await CollegeAddress.upsert(
          { college_id: collegeId, ...address },
          { transaction }
        );
      }

      if (Array.isArray(contacts)) {
        await CollegeContact.destroy({
          where: { college_id: collegeId },
          transaction,
        });

        const contactRecords = contacts.map((contact) => ({
          college_id: collegeId,
          contact_number: contact,
        }));
        await CollegeContact.bulkCreate(contactRecords, { transaction });
      }

      if (Array.isArray(university_id)) {
        await CollegeUniversity.destroy({
          where: { college_id: collegeId },
          transaction,
        });

        if (university_id.length > 0) {
          const universityRecords = university_id.map((unId) => ({
            college_id: collegeId,
            university_id: unId,
          }));
          await CollegeUniversity.bulkCreate(universityRecords, { transaction });
        }
      }

      if (Array.isArray(board_ids)) {
        await CollegeBoard.destroy({
          where: { college_id: collegeId },
          transaction,
        });

        if (board_ids.length > 0) {
          const boardRecords = board_ids.map((bId) => ({
            college_id: collegeId,
            board_id: bId,
          }));
          await CollegeBoard.bulkCreate(boardRecords, { transaction });
        }
      }

      if (Array.isArray(stream_ids)) {
        await CollegeStream.destroy({
          where: { college_id: collegeId },
          transaction,
        });

        if (stream_ids.length > 0) {
          const streamRecords = stream_ids.map((sId) => ({
            college_id: collegeId,
            stream_id: sId,
          }));
          await CollegeStream.bulkCreate(streamRecords, { transaction });
        }
      }


      if (Array.isArray(programs) && programs.length > 0) {
        const existingPrograms = await Program.findAll({
          where: { id: { [Op.in]: programs } },
          attributes: ["id"],
          transaction,
        });

        const existingProgramIds = existingPrograms.map(
          (program) => program.id
        );
        const invalidProgramIds = programs.filter(
          (programId) => !existingProgramIds.includes(programId)
        );

        if (invalidProgramIds.length > 0) {
          const error = new Error(
            `Invalid program IDs: ${invalidProgramIds.join(
              ", "
            )}. These program IDs do not exist in the programs table.`
          );
          error.status = 400;
          throw error;
        }

        await CollegeProgram.destroy({
          where: { college_id: collegeId },
          transaction,
        });

        const programRecords = programs.map((programId) => ({
          college_id: collegeId,
          program_id: programId,
        }));
        await CollegeProgram.bulkCreate(programRecords, { transaction });
      }

      if (Array.isArray(degrees)) {
        await CollegeOfferingDegrees.destroy({
          where: { college_id: collegeId },
          transaction,
        });

        if (degrees.length > 0) {
          const degreeRecords = degrees.map((degreeId) => ({
            college_id: collegeId,
            degree_id: degreeId,
          }));
          await CollegeOfferingDegrees.bulkCreate(degreeRecords, { transaction });
        }
      }

      if (Array.isArray(facilities)) {
        await CollegeFacility.destroy({
          where: { college_id: collegeId },
          transaction,
        });

        const facilityRecords = facilities.map((value) => ({
          college_id: collegeId,
          title: value.title,
          description: value.description,
          icon: value.icon,
        }));
        await CollegeFacility.bulkCreate(facilityRecords, { transaction });
      }

      if (Array.isArray(images)) {
        await CollegeGallery.destroy({
          where: { college_id: collegeId },
          transaction,
        });

        const galleryRecords = images.map((value) => ({
          college_id: collegeId,
          file_url: value.url,
          file_type: value.file_type || "image",
        }));
        await CollegeGallery.bulkCreate(galleryRecords, { transaction });
      }

      if (Array.isArray(members)) {
        await CollegeMember.destroy({
          where: { college_id: collegeId },
          transaction,
        });
        const memberRecords = members.map((member) => ({
          college_id: collegeId,
          name: member.name,
          contact_number: member.contact_number,
          role: member.role,
          description: member.description,
          image_url: member.image_url,
        }));
        await CollegeMember.bulkCreate(memberRecords, { transaction });
      }



      await transaction.commit();

      return {
        collegeId,
        isNew:
          !id || id === "null" || id === "undefined" || id === ""
            ? true
            : false,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async listAdmissions(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 24;
    const sort = query.sort === "desc" ? "DESC" : "ASC";
    const programIdOrSlug = query.program_id || query.course_id || query.programId;
    const { q, level_id, university_id } = query;

    const offset = (page - 1) * limit;

    const whereCondition = {};
    const include = [];

    // College and Affiliation (University) filter
    const collegeInclude = {
      model: College,
      as: "collegeAdmissionCollege",
      attributes: ["name", "slugs", "featured_img", "id"],
      include: [],
    };

    if (university_id) {
      const universityWhere = {};
      if (!isNaN(university_id)) {
        universityWhere.id = parseInt(university_id, 10);
      } else {
        universityWhere.slugs = university_id;
      }
      collegeInclude.include.push({
        model: University,
        as: "universities",
        where: universityWhere,
        required: true,
        through: { attributes: [] },
      });
      collegeInclude.required = true;
    } else {
      collegeInclude.include.push({
        model: University,
        as: "universities",
        attributes: ["fullname", "slugs", "id"],
        through: { attributes: [] },
      });
    }

    include.push(collegeInclude);

    // Handle Program filtering - course_id/program_id is passed as numeric ID from frontend
    const programId = programIdOrSlug ? parseInt(programIdOrSlug, 10) : null;
    if (programId && !isNaN(programId)) {
      whereCondition.program_id = programId;
    }

    // Handle Program filtering for q and level_id (requires Program lookup)
    let filteredProgramIds = null;
    if (q || level_id) {
      const programWhere = {};
      const programInclude = [];

      if (q) {
        programWhere.title = { [Op.like]: `%${q}%` };
      }

      if (level_id) {
        const levelWhere = {};
        if (!isNaN(level_id)) levelWhere.id = parseInt(level_id, 10);
        else levelWhere.slugs = level_id;
        programInclude.push({
          model: Level,
          as: "programlevel",
          where: levelWhere,
          required: true,
        });
      }

      const matchingPrograms = await Program.findAll({
        where: programWhere,
        include: programInclude,
        attributes: ["id"],
      });
      filteredProgramIds = matchingPrograms.map((p) => p.id);
    }

    if (q) {
      // Fetch college IDs matching the search query to avoid join scope issues in subqueries
      const matchingColleges = await College.findAll({
        where: { name: { [Op.like]: `%${q}%` } },
        attributes: ["id"],
        raw: true,
      });
      const matchingCollegeIds = matchingColleges.map((c) => c.id);

      const orConditions = [];
      if (matchingCollegeIds.length > 0) {
        orConditions.push({ college_id: { [Op.in]: matchingCollegeIds } });
      }
      if (filteredProgramIds?.length) {
        orConditions.push({ program_id: { [Op.in]: filteredProgramIds } });
      }

      if (orConditions.length > 0) {
        if (programId && !isNaN(programId)) {
          whereCondition[Op.and] = [{ [Op.or]: orConditions }];
        } else {
          whereCondition[Op.or] = orConditions;
        }
      } else {
        // If q is provided but no matching colleges or programs found
        whereCondition.id = -1;
      }
    } else if (filteredProgramIds?.length && !programId) {
      whereCondition.program_id = { [Op.in]: filteredProgramIds };
    }

    const { count: totalCount, rows: rawItems } =
      await CollegeAdmission.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        distinct: true,
        order: [
          [sequelize.literal("order_no IS NULL"), "ASC"],
          ["order_no", "ASC"],
          ["id", sort]
        ],
        include,
      });

    // Manually fetch program details for the returned items
    const programIdsToFetch = rawItems.map((item) => item.program_id);
    const programs = await Program.findAll({
      where: { id: { [Op.in]: programIdsToFetch } },
      attributes: ["id", "title", "slugs"],
      include: [
        { model: Level, as: "programlevel", attributes: ["id", "title", "slugs"] },
      ],
    });

    const programsMap = programs.reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {});

    const items = rawItems.map((item) => {
      const itemData = item.toJSON();
      itemData.program = programsMap[item.program_id] || null;
      // Maintain consistency
      itemData.course_id = item.program_id;
      delete itemData.program_id;
      delete itemData.college_id;
      return itemData;
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


  async getAdmissionById(id) {
    const admission = await CollegeAdmission.findByPk(id, {
      include: [
        {
          model: College,
          as: "collegeAdmissionCollege",
          attributes: ["name", "slugs", "featured_img"],
          include: [
            {
              model: University,
              as: "universities",
              attributes: ["fullname", "slugs"],
            },

          ],
        },
      ],
    });

    if (!admission) {
      const error = new Error("Admission detail not found!");
      error.status = 404;
      throw error;
    }

    const program = await Program.findOne({
      where: { id: admission.program_id },
      attributes: ["id", "title", "slugs"],
      include: [
        { model: Level, as: "programlevel", attributes: ["id", "title", "slugs"] },
        // { model: FacultyModel, as: "programfaculty", attributes: ["id", "title", "slugs"] },
      ],
    });

    const admissionData = admission.toJSON();
    admissionData.program = program;
    admissionData.course_id = admission.program_id;
    delete admissionData.program_id;
    delete admissionData.college_id;

    return admissionData;
  }

  async listColleges(query = {}, isAdmin = false) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 24;
    const sort = (query.sort || "asc").toUpperCase();
    const status = query.status
    const search = query.q
    const isReferable = query.is_referable

    // Helper to parse potential array/string/comma-separated params
    const parseFilter = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val.map(v => String(v).trim());
      if (typeof val === "string") return val.split(",").map(v => v.trim()).filter(Boolean);
      return [String(val).trim()];
    };

    const districts = parseFilter(query.districts || query.district);
    const types = parseFilter(query.types || query.type);
    const degreeIdsInput = parseFilter(query.degree_ids || query.degree_id);
    const programIdsInput = parseFilter(query.program_ids || query.program_id);
    const universityIdsInput = parseFilter(query.university_ids);

    const programIds = programIdsInput.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    const programIdFilter = programIds.length > 0 ? { [Op.in]: programIds } : null;

    const directDegreeIds = degreeIdsInput.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    const degreeIdFilter = directDegreeIds.length > 0 ? { [Op.in]: directDegreeIds } : null;

    const universityIds = universityIdsInput.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    const universityIdFilter = universityIds.length > 0 ? { [Op.in]: universityIds } : null;

    const offset = (page - 1) * limit;

    const whereCondition = {
      [Op.and]: [
        sequelize.literal(`NOT JSON_CONTAINS(institute_level, '"School"')`)
      ]
    };
    if (search) {
      whereCondition.name = {
        [Op.like]: `%${search}%`,
      };
    }

    if (types.length > 0) {
      whereCondition.institute_type = { [Op.in]: types };
    }
    if (isAdmin) {
      if (status) {
        whereCondition.status = status;
      }
    } else {
      whereCondition.status = "published";
    }

    if (isReferable === 'true' || isReferable === true || isReferable === 1 || isReferable === '1') {
      whereCondition.is_referable = true;
    }


    const addressCondition = {};
    if (districts.length > 0) {
      addressCondition.district = {
        [Op.in]: districts,
      };
    }


    const { count: totalCount, rows: items } = await College.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      distinct: true,
      order: [
        [sequelize.literal('`colleges`.`order_no_for_website` IS NULL'), "ASC"],
        [sequelize.col('colleges.order_no_for_website'), "ASC"],
        ["id", sort],
      ],
      include: [
        {
          model: CollegeAddress,
          as: "collegeAddress",
          attributes: ["country", "district", "city"],
          where: Object.keys(addressCondition).length
            ? addressCondition
            : undefined,
          required: Object.keys(addressCondition).length > 0,
        },
        {
          model: CollegeFacility,
          as: "facilities",
          attributes: ["id", "title", "description", "icon"],
        },
        {
          model: CollegeMember,
          as: "collegeMembers",
          attributes: ["id", "name", "contact_number", "role", "description", "image_url"],
        },
        {
          model: CollegeProgram,
          as: "collegePrograms",
          include: [
            {
              model: Program,
              as: "program",
              attributes: ["id", "title", "slugs"],
            },
          ],
          required: !!programIdFilter,
          where: programIdFilter ? { program_id: programIdFilter } : undefined,
        },
        {
          model: CollegeGallery,
          as: "collegeGallery",
        },
        {
          model: University,
          as: "universities",
          attributes: ["id", "fullname", "slugs"],
          required: !!universityIdFilter,
          where: universityIdFilter ? { id: universityIdFilter } : undefined,
          through: { attributes: [] }
        },
        {
          model: Degree,
          as: "degrees",
          attributes: ["id", "title", "slug", "short_name"],
          through: { attributes: [] },
          required: !!degreeIdFilter,
          where: degreeIdFilter ? { id: degreeIdFilter } : undefined,
        }
      ],
    });

    // Check if each college has a user account (institution user)
    const collegeIds = items.map((college) => college.id);

    const usersWithCollegeId = await UserModel.findAll({
      where: {
        collegeId: { [Op.in]: collegeIds },
      },
      attributes: ["collegeId", "roles"],
      raw: true,
    });

    const collegesWithAccounts = new Set(
      usersWithCollegeId
        .filter((user) => {
          try {
            const roles =
              typeof user.roles === "string"
                ? JSON.parse(user.roles)
                : user.roles;
            return roles?.institution === true && user.collegeId;
          } catch {
            return false;
          }
        })
        .map((user) => user.collegeId)
        .filter(Boolean)
    );

    // Add has_account field to each college item
    const itemsWithAccountStatus = items.map((college) => {
      const collegeData = college.toJSON ? college.toJSON() : college;
      return {
        ...collegeData,
        has_account: collegesWithAccounts.has(college.id),
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

  async getCollegeBySlug(slugs) {
    const college = await College.findOne({
      where: { slugs },
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
          as: "collegeAddress",
          attributes: ["country", "district", "city", "street", "postal_code"],
        },
        {
          model: CollegeContact,
          as: "collegeContacts",
          attributes: ["contact_number"],
        },
        {
          model: CollegeGallery,
          as: "collegeGallery",
        },
        {
          model: CollegeProgram,
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
          attributes: ["name", "contact_number", "role", "description", "image_url", "id"],
        },
        {
          model: CollegeAdmission,
          as: "collegeAdmissions",
          attributes: {
            exclude: ["id", "college_id", "program_id"],
          },
        },

        {
          model: University,
          as: "universities",
          attributes: ["fullname", "slugs", "id"],
          through: { attributes: [] },
        },
        {
          model: Board,
          as: "boards",
          attributes: ["name", "id"],
          through: { attributes: [] },
        },
        {
          model: Stream,
          as: "streams",
          attributes: ["name", "id"],
          through: { attributes: [] },
        },
        {
          model: UserModel,
          as: "authorDetails",
          attributes: ["firstName", "middleName", "lastName"],
        },

        {
          model: Degree,
          as: "degrees",
          attributes: ["id", "title", "slug", "short_name"],
          through: { attributes: [] }
        },
      ],
    });

    if (!college) {
      const error = new Error("College not found!");
      error.status = 404;
      throw error;
    }

    return college;
  }

  async deleteCollege(id) {
    const college = await College.findByPk(id);
    if (!college) {
      const error = new Error("College not found");
      error.status = 404;
      throw error;
    }

    await college.destroy();
  }

  async getCollegeByInstitutionUser(user) {
    // Fetch the full user from database to get college_id
    const fullUser = await UserModel.findByPk(user?.id || user?.user_id);

    if (!fullUser) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    const collegeId = fullUser.collegeId || fullUser.college_id;

    if (!collegeId) {
      const error = new Error("User is not associated with a college");
      error.status = 400;
      throw error;
    }

    const college = await College.findOne({
      where: { id: collegeId },
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
          as: "collegeAddress",
          attributes: ["country", "district", "city", "street", "postal_code"],
        },
        {
          model: CollegeContact,
          as: "collegeContacts",
          attributes: ["contact_number"],
        },
        {
          model: CollegeGallery,
          as: "collegeGallery",
        },
        {
          model: Program,
          as: "programs",
          attributes: ["id", "title", "slugs"],
          through: { attributes: [] },
        },
        {
          model: CollegeMember,
          as: "collegeMembers",
          attributes: ["name", "contact_number", "role", "description"],
        },
        {
          model: CollegeAdmission,
          as: "collegeAdmissions",
          attributes: {
            exclude: ["id", "college_id", "program_id"],
          },
        },
        {
          model: University,
          as: "universities",

          attributes: ["fullname", "slugs"],
        },
        {
          model: UserModel,
          as: "authorDetails",
          attributes: ["firstName", "middleName", "lastName"],
        },
        {
          model: Degree,
          as: "degrees",
          attributes: ["id", "title", "slug"],
          through: { attributes: [] }
        },
      ],
    });

    if (!college) {
      const error = new Error("College not found!");
      error.status = 404;
      throw error;
    }

    return college;
  }

  async updateCollegeByInstitutionUser(user, payload) {
    const fullUser = await UserModel.findByPk(user?.id || user?.user_id);

    if (!fullUser) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    const collegeId = fullUser.collegeId || fullUser.college_id;

    if (!collegeId) {
      const error = new Error("User is not associated with a college");
      error.status = 400;
      throw error;
    }

    // Ensure the payload college ID matches the user's college_id
    if (payload.id && payload.id !== collegeId) {
      const error = new Error("You can only edit your own college");
      error.status = 403;
      throw error;
    }

    // Set the college ID from user's college_id
    payload.id = collegeId;

    const { collegeId: updatedCollegeId, isNew } =
      await this.createOrUpdateCollege(payload);

    return { collegeId: updatedCollegeId, isNew };
  }

  async updateCollegeOrder(colleges) {
    const transaction = await sequelize.transaction();
    try {
      // Validate all college IDs exist
      const collegeIds = colleges.map((c) => c.id);
      const existingColleges = await College.findAll({
        where: {
          id: { [Op.in]: collegeIds },
        },
        transaction,
      });

      if (existingColleges.length !== collegeIds.length) {
        const error = new Error("Invalid college IDs");
        error.status = 400;
        throw error;
      }

      // Update order_no_for_website for each college
      const updates = colleges.map((college) =>
        College.update(
          { order_no_for_website: college.order_no },
          { where: { id: college.id }, transaction }
        )
      );

      await Promise.all(updates);
      await transaction.commit();

      return { message: "College order updated successfully" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async createOrUpdateAdmission(payload) {
    const {
      id,
      college_id,
      program_id,
      course_id,
      eligibility_criteria,
      admission_process,
      fee_details,
      description,
    } = payload;

    const final_program_id = program_id || course_id;

    let admission;
    let isNew = false;
    const admissionId = (id === "null" || id === "undefined" || id === "") ? null : id;

    if (admissionId) {
      admission = await CollegeAdmission.findByPk(admissionId);
      if (!admission) {
        const error = new Error("Admission detail not found");
        error.status = 404;
        throw error;
      }
      await admission.update({
        college_id,
        program_id: final_program_id,
        eligibility_criteria,
        admission_process,
        fee_details,
        description,
      });
    } else {
      admission = await CollegeAdmission.create({
        college_id,
        program_id: final_program_id,
        eligibility_criteria,
        admission_process,
        fee_details,
        description,
      });
      isNew = true;
    }

    return { id: admission.id, isNew };
  }

  async deleteAdmission(id) {
    const admission = await CollegeAdmission.findByPk(id);
    if (!admission) {
      const error = new Error("Admission detail not found");
      error.status = 404;
      throw error;
    }
    await admission.destroy();
  }
  async updateAdmissionOrder(orders) {
    const transaction = await sequelize.transaction();
    try {
      for (const order of orders) {
        await CollegeAdmission.update(
          { order_no: order.order_no },
          {
            where: { id: order.id },
            transaction,
          }
        );
      }
      await transaction.commit();
      return { message: "Admission order updated successfully!" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getFeaturedColleges(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 6;
    const offset = (page - 1) * limit;

    const { count: totalCount, rows: colleges } = await College.findAndCountAll({
      where: {
        order_no_for_website: { [Op.ne]: null },
        status: "published",
      },
      attributes: ["id", "name", "slugs", "college_logo", "featured_img", "order_no_for_website"],
      include: [
        {
          model: Degree,
          as: "degrees",
          attributes: ["id", "title", "slug", "short_name"],
          through: { attributes: [] },
        },
      ],
      limit,
      offset,
      distinct: true,
      order: [
        [sequelize.literal('`colleges`.`order_no_for_website` IS NULL'), "ASC"],
        [sequelize.col('colleges.order_no_for_website'), "ASC"],
      ],
    });

    return {
      items: colleges,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        limit,
        totalCount,
      },
    };
  }

  async listProgramsByCollegeId(collegeId) {
    const college = await College.findByPk(collegeId, {
      include: [
        {
          model: Program,
          as: "programs",
          attributes: ["id", "title", "slugs"],
          through: { attributes: [] },
        },
      ],
    });

    if (!college) {
      const error = new Error("College not found");
      error.status = 404;
      throw error;
    }

    return college.programs;
  }
}

export default CollegeService;
