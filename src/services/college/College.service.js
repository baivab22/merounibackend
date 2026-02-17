import { Op, Sequelize } from "sequelize";
import { generateUniqueSlug } from "../../utils/SlugHelper.js";

import { sequelize } from "../../config/database.config.js";
import College from "../../models/college/College.model.js";
import CollegeAddress from "../../models/college/CollegeAddress.model.js";
import CollegeContact from "../../models/college/CollegeContact.model.js";
import CollegeCourse from "../../models/college/CollegeCourse.model.js";
import CollegeMember from "../../models/college/CollegeMember.model.js";
import CollegeAdmission from "../../models/college/CollegeAdmission.model.js";
import CollegeGallery from "../../models/college/CollegeGallery.model.js";
import CollegeFacility from "../../models/college/CollegeFacility.model.js";
import CollegeOfferingDegrees from "../../models/college/CollegeOfferingDegrees.model.js";
import Program from "../../models/program/Program.model.js";
import UserModel from "../../models/users/User.model.js";
import { University } from "../../models/university/University.model.js";
import Degree from "../../models/degree/Degree.model.js";

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
        description,
        content,
        faqs,
        images,
        degrees,
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

      // const slugs = slug(collegeName);

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

        // Find the maximum order number and increment it
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
            university_id,
            google_map_url,
            website_url,
            faqs,
            order_no_for_website: nextOrder,
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

      if (Array.isArray(courses) && courses.length > 0) {
        console.log(courses, "coursescoursescoursescourses")
        const existingPrograms = await Program.findAll({
          where: { id: { [Op.in]: courses } },
          attributes: ["id"],
          transaction,
        });
        console.log(existingPrograms, "existingProgramsexistingProgramsexistingPrograms")

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
          contact_number: member.contact_info,
          role: member.role,
          description: member.bio,
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
    const limit = parseInt(query.limit, 10) || 10;
    const sort = query.sort === "desc" ? "DESC" : "ASC";
    const { q, level, affiliation, discipline } = query;

    const offset = (page - 1) * limit;

    const whereCondition = {};
    const include = [];

    if (q) {
      whereCondition[Op.or] = [
        { "$collegeAdmissionCollege.name$": { [Op.like]: `%${q}%` } },
        { "$program.title$": { [Op.like]: `%${q}%` } },
      ];
    }

    // College and Affiliation (University) filter
    const collegeInclude = {
      model: College,
      as: "collegeAdmissionCollege",
      attributes: ["name", "slugs", "featured_img"],
      include: [],
    };

    if (affiliation) {
      const universityWhere = {};
      if (!isNaN(affiliation)) {
        universityWhere.id = parseInt(affiliation, 10);
      } else {
        universityWhere.slugs = affiliation;
      }
      collegeInclude.include.push({
        model: University,
        as: "university",
        where: universityWhere,
        required: true,
      });
      collegeInclude.required = true;
    } else {
      collegeInclude.include.push({
        model: University,
        as: "university",
        attributes: ["fullname", "slugs"],
      });
    }
    include.push(collegeInclude);

    // Program, Level, and Discipline filter
    const programInclude = {
      model: Program,
      as: "program",
      attributes: ["title", "slugs"],
      include: [],
    };

    if (level) {
      const levelWhere = {};
      if (!isNaN(level)) {
        levelWhere.id = parseInt(level, 10);
      } else {
        levelWhere.slugs = level;
      }
      programInclude.include.push({
        model: Level,
        as: "programlevel",
        where: levelWhere,
        required: true,
      });
      programInclude.required = true;
    }

    if (discipline) {
      const facultyWhere = {};
      if (!isNaN(discipline)) {
        facultyWhere.id = parseInt(discipline, 10);
      } else {
        facultyWhere.slugs = discipline;
      }
      programInclude.include.push({
        model: FacultyModel,
        as: "programfaculty",
        where: facultyWhere,
        required: true,
      });
      programInclude.required = true;
    }

    include.push(programInclude);

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

  async getAdmissionById(id) {
    const admission = await CollegeAdmission.findByPk(id, {
      attributes: {
        exclude: ["college_id", "course_id"],
      },
      include: [
        {
          model: College,
          as: "collegeAdmissionCollege",
          attributes: ["name", "slugs", "featured_img"],
          include: [
            {
              model: University,
              as: "university",
              attributes: ["fullname", "slugs"],
            },
          ],
        },
        {
          model: Program,
          as: "program",
          attributes: ["title", "slugs"],
        },
      ],
    });

    if (!admission) {
      const error = new Error("Admission detail not found!");
      error.status = 404;
      throw error;
    }

    return admission;
  }

  async listColleges(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const sort = (query.sort || "asc").toUpperCase();
    const search = query.q || "";

    // Helper to parse potential array/string/comma-separated params
    const parseFilter = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      if (typeof val === "string") return val.split(",").map(v => v.trim());
      return [val];
    };

    const states = parseFilter(query.state);
    const cities = parseFilter(query.city);
    const types = parseFilter(query.type);
    const degreeIdsInput = parseFilter(query.degree_ids);
    const programIdsInput = parseFilter(query.program_id);
    const university = query.university;
    const programIds = programIdsInput.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    const programIdFilter = programIds.length > 0 ? { [Op.in]: programIds } : null;

    const offset = (page - 1) * limit;

    const whereCondition = {};
    if (search) {
      whereCondition.name = {
        [Op.like]: `%${search}%`,
      };
    }

    if (types.length > 0) {
      whereCondition.institute_type = { [Op.in]: types };
    }

    const addressCondition = {};
    if (states.length > 0) {
      addressCondition.state = {
        [Op.or]: states.map((s) => ({ [Op.like]: `%${s}%` })),
      };
    }

    if (cities.length > 0) {
      addressCondition.city = {
        [Op.or]: cities.map((c) => ({ [Op.like]: `%${c}%` })),
      };
    }

    const degreeCondition = {};
    const orConditions = [];

    // 1. Handle direct Degree IDs (degree_ids)
    const directDegreeIds = degreeIdsInput.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    if (directDegreeIds.length > 0) {
      orConditions.push({ degree_id: { [Op.in]: directDegreeIds } });
    }


    const { count: totalCount, rows: items } = await College.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      distinct: true,
      order: [
        [Sequelize.literal("`colleges`.`order_no_for_website` IS NULL"), "ASC"],
        [Sequelize.literal("`colleges`.`order_no_for_website`"), "ASC"],
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
          model: CollegeCourse,
          as: "collegeCourses",
          attributes: { exclude: ["college_id"] },
          required: !!programIdFilter || Object.keys(degreeCondition).length > 0,
          duplicating: !!programIdFilter || Object.keys(degreeCondition).length > 0,
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
                if (programIdFilter) {
                  conditions.id = programIdFilter;
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
          where: (() => {
            if (!university || (Array.isArray(university) && university.length === 0)) return undefined;
            let universities = [];
            if (Array.isArray(university)) {
              universities = university;
            } else if (typeof university === "string") {
              universities = university.split(",").map((u) => u.trim());
            }

            if (universities.length === 0) return undefined;

            return {
              [Op.or]: universities.map((u) => ({
                [Op.or]: [
                  { slugs: { [Op.like]: `%${u}%` } },
                  { fullname: { [Op.like]: `%${u}%` } }
                ]
              }))
            };
          })(),
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
