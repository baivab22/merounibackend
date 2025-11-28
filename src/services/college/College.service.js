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
      const slugs = slug(name);

      if (!collegeId) {
        const newCollege = await College.create(
          {
            name,
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
        await College.update(
          {
            name,
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
          },
          { where: { id: collegeId }, transaction }
        );
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

      if (Array.isArray(courses)) {
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

      if (Array.isArray(admissions)) {
        await CollegeAdmission.destroy({
          where: { college_id: collegeId },
          transaction,
        });

        const admissionRecords = admissions.map((admission) => ({
          college_id: collegeId,
          course_id: admission.course_id,
          eligibility_criteria: admission.eligibility_criteria,
          admission_process: admission.admission_process,
          fee_details: admission.fee_details,
          description: admission.description,
        }));
        await CollegeAdmission.bulkCreate(admissionRecords, { transaction });
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
        {
          model: CollegeCourse,
          as: "collegeCourses",
          attributes: { exclude: ["college_id", "course_id"] },
          include: [
            {
              model: Program,
              as: "program",
              attributes: ["title", "slugs"],
              where: Object.keys(degreeCondition).length
                ? degreeCondition
                : undefined,
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
}

export default CollegeService;
