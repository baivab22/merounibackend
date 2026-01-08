import { Op, Sequelize } from "sequelize";
import slug from "slug";

import { sequelize } from "../../config/database.config.js";
import College from "../../models/college/College.model.js";
import CollegeAddress from "../../models/college/CollegeAddress.model.js";
import CollegeContact from "../../models/college/CollegeContact.model.js";
import CollegeCourse from "../../models/college/CollegeCourse.model.js";
import CollegeMember from "../../models/college/CollegeMember.model.js";
import CollegeAdmission from "../../models/college/CollegeAdmission.model.js";
import CollegeGallery from "../../models/college/CollegeGallery.model.js";
import CollegeFacility from "../../models/college/CollegeFacility.model.js";
import Program from "../../models/program/Program.model.js";
import UserModel from "../../models/users/User.model.js";
import { University } from "../../models/university/University.model.js";

class CollegeService {
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
        website_url,
        featured_img,
        college_logo,
        college_broucher,
        address,
        contacts,
        courses,
        facilities,
        members,
        is_featured,
        pinned,
        description,
        content,
        admissions,
        images,
      } = payload;

      let collegeId = id;

      // If updating and name is not provided, fetch existing name
      let collegeName = name;
      if (collegeId && !collegeName) {
        const existingCollege = await College.findByPk(collegeId, {
          transaction,
        });
        if (existingCollege) {
          collegeName = existingCollege.name;
        }
      }

      // Validate that name exists
      if (!collegeName) {
        const error = new Error("College name is required");
        error.status = 400;
        throw error;
      }

      const slugs = slug(collegeName);

      if (!collegeId) {
        const newCollege = await College.create(
          {
            name: collegeName,
            slugs,
            institute_type,
            institute_level,
            author_id,
            is_featured,
            pinned,
            featured_img,
            college_logo,
            college_broucher,
            description: description || "",
            content,
            university_id,
            google_map_url,
            website_url,
          },
          { transaction }
        );
        collegeId = newCollege.id;
      } else {
        const updateData = {
          slugs,
          institute_type,
          institute_level,
          author_id,
          is_featured,
          pinned,
          description: description || "",
          content,
          featured_img,
          college_logo,
          college_broucher,
          university_id,
          google_map_url,
          website_url,
        };

        // Only update name if it was provided
        if (name) {
          updateData.name = collegeName;
        }

        await College.update(updateData, {
          where: { id: collegeId },
          transaction,
        });
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

      if (Array.isArray(courses) && courses.length > 0) {
        // Validate that all program IDs exist in the programs table
        const existingPrograms = await Program.findAll({
          where: { id: courses },
          attributes: ["id"],
          transaction,
        });

        const existingProgramIds = existingPrograms.map(
          (program) => program.id
        );
        const invalidProgramIds = courses.filter(
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

        await CollegeCourse.destroy({
          where: { college_id: collegeId },
          transaction,
        });

        const courseRecords = courses.map((courseId) => ({
          college_id: collegeId,
          course_id: courseId,
        }));
        await CollegeCourse.bulkCreate(courseRecords, { transaction });
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
        }));
        await CollegeMember.bulkCreate(memberRecords, { transaction });
      }

      if (Array.isArray(admissions) && admissions.length > 0) {
        // Filter out admissions without course_id and validate course IDs
        const validAdmissions = admissions.filter(
          (admission) => admission.course_id
        );

        if (validAdmissions.length > 0) {
          const programIds = validAdmissions.map(
            (admission) => admission.course_id
          );

          // Validate that all program IDs exist in the programs table
          const existingPrograms = await Program.findAll({
            where: { id: programIds },
            attributes: ["id"],
            transaction,
          });

          const existingProgramIds = existingPrograms.map(
            (program) => program.id
          );
          const invalidProgramIds = programIds.filter(
            (programId) => !existingProgramIds.includes(programId)
          );

          if (invalidProgramIds.length > 0) {
            const error = new Error(
              `Invalid program IDs in admissions: ${invalidProgramIds.join(
                ", "
              )}. These program IDs do not exist in the programs table.`
            );
            error.status = 400;
            throw error;
          }
        }

        await CollegeAdmission.destroy({
          where: { college_id: collegeId },
          transaction,
        });

        const admissionRecords = validAdmissions.map((admission) => ({
          college_id: collegeId,
          course_id: admission.course_id,
          eligibility_criteria: admission.eligibility_criteria,
          admission_process: admission.admission_process,
          fee_details: admission.fee_details,
          description: admission.description,
        }));

        if (admissionRecords.length > 0) {
          await CollegeAdmission.bulkCreate(admissionRecords, { transaction });
        }
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
    const limit = parseInt(query.limit, 10) || 10;
    const sort = query.sort === "desc" ? "DESC" : "ASC";
    const search = query.q || "";

    const offset = (page - 1) * limit;

    let whereCondition = {};
    if (search) {
      whereCondition = {
        [Op.or]: [{ name: { [Op.like]: `%${search}%` } }],
      };
    }

    const { count: totalCount, rows: items } =
      await CollegeAdmission.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        distinct: true,
        order: [["id", sort]],
        attributes: {
          exclude: ["college_id", "course_id"],
        },
        include: [
          {
            model: College,
            as: "collegeAdmissionCollege",
            attributes: ["name", "slugs"],
          },
          {
            model: Program,
            as: "program",
            attributes: ["title", "slugs"],
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

  async listSchools(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const sort = (query.sort || "asc").toUpperCase();

    const search = query.q || "";
    const isFeatured = query.is_featured;
    const pinned = query.pinned;

    const country = query.country || "";
    const state = query.state || "";
    const city = query.city || "";

    const offset = (page - 1) * limit;

    const whereCondition = {
      [Op.and]: [
        Sequelize.literal(`JSON_CONTAINS(institute_level, '"School"')`),
      ],
    };

    if (search) {
      whereCondition.name = { [Op.like]: `%${search}%` };
    }

    if (isFeatured !== undefined) {
      whereCondition.isFeatured = isFeatured === "true" ? 1 : 0;
    }

    if (pinned !== undefined) {
      whereCondition.pinned = pinned === "true" ? 1 : 0;
    }

    const addressCondition = {};
    if (country) {
      addressCondition.country = { [Op.like]: `%${country}%` };
    }
    if (state) {
      addressCondition.state = { [Op.like]: `%${state}%` };
    }
    if (city) {
      addressCondition.city = { [Op.like]: `%${city}%` };
    }

    const { count: totalCount, rows: items } = await College.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      distinct: true,
      order: [["id", sort]],
      include: [
        {
          model: CollegeAddress,
          as: "address",
          attributes: ["country", "state", "city"],
          where: Object.keys(addressCondition).length
            ? addressCondition
            : undefined,
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

  async listColleges(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const sort = (query.sort || "asc").toUpperCase();
    const search = query.q || "";
    const isFeatured = query.is_featured;
    const pinned = query.pinned;

    const country = query.country || "";
    const state = query.state || "";
    const city = query.city || "";
    const degree = query.discipline || "";
    const university = query.university || "";
    const programId = query.program_id ? parseInt(query.program_id, 10) : null;

    const offset = (page - 1) * limit;

    const whereCondition = {};
    if (search) {
      whereCondition.name = {
        [Op.like]: `%${search}%`,
      };
    }

    if (isFeatured !== undefined) {
      whereCondition.is_featured = isFeatured === "true" ? 1 : 0;
    }

    if (pinned !== undefined) {
      whereCondition.pinned = pinned === "true" ? 1 : 0;
    }

    const addressCondition = {};
    if (country) {
      const countries = country.split(",").map((c) => c.trim());
      addressCondition.country = {
        [Op.or]: countries.map((c) => ({ [Op.like]: `%${c}%` })),
      };
    }
    if (state) {
      const states = state.split(",").map((s) => s.trim());
      addressCondition.state = {
        [Op.or]: states.map((s) => ({ [Op.like]: `%${s}%` })),
      };
    }
    if (city) {
      const cities = city.split(",").map((c) => c.trim());
      addressCondition.city = {
        [Op.or]: cities.map((c) => ({ [Op.like]: `%${c}%` })),
      };
    }

    const degreeCondition = {};
    if (degree) {
      const degrees = degree.split(",").map((d) => d.trim());
      degreeCondition.title = {
        [Op.or]: degrees.map((d) => ({ [Op.like]: `%${d}%` })),
      };
    }

    const { count: totalCount, rows: items } = await College.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      distinct: true,
      order: [
        ["order_no_for_website", "ASC"],
        ["id", sort],
      ],
      include: [
        {
          model: CollegeAddress,
          as: "address",
          attributes: ["country", "state", "city"],
          where: Object.keys(addressCondition).length
            ? addressCondition
            : undefined,
        },
        {
          model: CollegeCourse,
          as: "collegeCourses",
          attributes: { exclude: ["college_id"] }, // Include course_id for filtering
          required: !!programId, // Make required when filtering by program_id
          include: [
            {
              model: Program,
              as: "program",
              attributes: ["id", "title", "slugs"],
              where: (() => {
                const conditions = {};
                if (Object.keys(degreeCondition).length) {
                  Object.assign(conditions, degreeCondition);
                }
                // Filter by program_id if provided
                if (programId) {
                  conditions.id = programId;
                }
                return Object.keys(conditions).length ? conditions : undefined;
              })(),
            },
          ],
        },
        {
          model: CollegeGallery,
          as: "collegeGallery",
        },
        {
          model: University,
          as: "university",
          attributes: ["fullname", "slugs"],
          where: university
            ? {
                slugs: {
                  [Op.like]: `%${university}%`,
                },
              }
            : undefined,
        },
      ],
    });

    // Check if each college has a user account (institution user)
    const collegeIds = items.map((college) => college.id);

    // Find all users with institution role and matching collegeId
    // Since roles is JSON, we need to check for institution:true in the JSON
    const usersWithCollegeId = await UserModel.findAll({
      where: {
        collegeId: { [Op.in]: collegeIds },
      },
      attributes: ["collegeId", "roles"],
      raw: true,
    });

    // Filter users that have institution role and create a Set of college IDs
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
        exclude: ["author_id", "university_id"],
      },
      include: [
        {
          model: CollegeFacility,
          as: "collegeFacility",
          attributes: ["title", "description", "icon"],
        },
        {
          model: CollegeAddress,
          as: "collegeAddress",
          attributes: ["country", "state", "city", "street", "postal_code"],
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
          model: CollegeCourse,
          as: "collegeCourses",
          attributes: {
            exclude: ["college_id", "course_id"],
          },
          include: [
            {
              model: Program,
              as: "program",
              attributes: ["title", "slugs"],
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
          attributes: {
            exclude: ["id", "college_id", "course_id"],
          },
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
          as: "university",
          attributes: ["fullname", "slugs"],
        },
        {
          model: UserModel,
          as: "authorDetails",
          attributes: ["firstName", "middleName", "lastName"],
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
        exclude: ["author_id", "university_id"],
      },
      include: [
        {
          model: CollegeFacility,
          as: "collegeFacility",
          attributes: ["title", "description", "icon"],
        },
        {
          model: CollegeAddress,
          as: "collegeAddress",
          attributes: ["country", "state", "city", "street", "postal_code"],
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
          model: CollegeCourse,
          as: "collegeCourses",
          attributes: {
            exclude: ["college_id", "course_id"],
          },
          include: [
            {
              model: Program,
              as: "program",
              attributes: ["title", "slugs"],
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
          attributes: {
            exclude: ["id", "college_id", "course_id"],
          },
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
          as: "university",
          attributes: ["fullname", "slugs"],
        },
        {
          model: UserModel,
          as: "authorDetails",
          attributes: ["firstName", "middleName", "lastName"],
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

    // Ensure the payload college ID matches the user's college_id
    if (payload.id && payload.id !== collegeId) {
      const error = new Error("You can only edit your own college");
      error.status = 403;
      throw error;
    }

    // Set the college ID from user's college_id
    payload.id = collegeId;

    // Call the existing createOrUpdateCollege method
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
}

export default CollegeService;
