import { QueryTypes, Op } from "sequelize";
import slug from "slug";

import { sequelize } from "../../config/database.config.js";
import {
  University,
  UniversityContact,
  UniversityLevel,
  UniversityMember,
  UniversityGallery,
  UniversityProgram,
} from "../../models/university/University.model.js";
import Program from "../../models/program/Program.model.js";
import { generateUniqueSlug } from "../../utils/SlugHelper.js";

class UniversityService {
  async listUniversities(query = {}) {
    let { page, limit, q } = query;

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const status = query.status;

    const searchQuery = q || "";

    const offset = (page - 1) * limit;

    let sqlQuery = `SELECT * FROM university`;
    let countQuery = `SELECT COUNT(*) as total FROM university`;

    const replacements = { limit, offset };

    if (searchQuery) {
      sqlQuery += ` WHERE fullname LIKE :searchQuery`;
      countQuery += ` WHERE fullname LIKE :searchQuery`;
      replacements.searchQuery = `%${searchQuery}%`;
    }

    if (query.type) {
      const typeCondition = searchQuery
        ? ` AND type_of_institute = :type`
        : ` WHERE type_of_institute = :type`;

      sqlQuery += typeCondition;
      countQuery += typeCondition;
      replacements.type = query.type;
    }

    if (status) {
      const statusCondition = searchQuery
        ? ` AND status = :status`
        : ` WHERE status = :status`;

      sqlQuery += statusCondition;
      countQuery += statusCondition;
      replacements.status = status;
    }

    sqlQuery += ` ORDER BY order_no_for_website ASC, id DESC LIMIT :limit OFFSET :offset`;

    const items = await sequelize.query(sqlQuery, {
      replacements,
      type: QueryTypes.SELECT,
    });

    const totalCountResult = await sequelize.query(countQuery, {
      replacements,
      type: QueryTypes.SELECT,
    });

    const totalCount = totalCountResult[0].total;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      message: "success",
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
      },
      items,
    };
  }

  async getUniversityProfile(slugParam) {
    const university = await University.findOne({
      where: { slugs: slugParam },
      include: [
        {
          model: UniversityProgram,
          as: "university_programs",
          include: [
            {
              model: Program,
              as: "program",
              attributes: ["id", "title"],
            },
          ],
        },
        {
          model: UniversityContact,
          as: "contact",
          required: false,
        },
        {
          model: UniversityLevel,
          as: "levels",
        },
        {
          model: UniversityMember,
          as: "members",
        },
        {
          model: UniversityGallery,
          as: "gallery",
          attributes: ["image_url"],
        },
      ],
    });

    if (!university) {
      const error = new Error("University not found");
      error.status = 404;
      throw error;
    }

    // Convert to plain object to avoid Sequelize instance issues
    const universityData = university.get({ plain: true });

    return {
      ...universityData,
      contact: universityData.contact || null,
      levels: (universityData.levels || []).map((level) => level.level_id),
      programs: universityData.university_programs || [],
      members: universityData.members || [],
      featured_image: universityData.featured_image || null,
      videos: universityData.videos || null,
      map: universityData.map || null,
      gallery: (universityData.gallery || []).map((img) => img.image_url),
    };
  }

  async createOrUpdateUniversity(payload) {
    const transaction = await sequelize.transaction();

    try {
      const {
        id,
        fullname,
        country,
        state,
        city,
        street,
        postal_code,
        date_of_establish,
        type_of_institute,
        description,
        contact,
        levels,
        programs,
        author_id,
        members,
        featured_image,
        videos,
        map,
        gallery,
        logo,
        status,
      } = payload;

      if (!fullname || fullname.trim() === "") {
        const error = new Error("University name (fullname) is required");
        error.status = 400;
        throw error;
      }

      let university;

      if (id) {
        university = await University.findByPk(id, { transaction });

        if (!university) {
          const error = new Error("University not found");
          error.status = 404;
          throw error;
        }

        university.fullname = fullname;
        university.country = country;
        university.state = state;
        university.city = city;
        university.street = street;
        university.postal_code = postal_code;
        university.author_id = author_id;
        university.date_of_establish = date_of_establish;
        university.type_of_institute = type_of_institute;
        university.description = description;
        university.logo = logo; // Update logo
        university.featured_image = featured_image;
        university.videos = videos;
        university.map = map;
        if (status) university.status = status;

        if (university.fullname !== fullname) {
          university.slugs = generateUniqueSlug(fullname);
        }

        await university.save({ transaction });
      } else {
        // 🔹 CREATE
        const slugs = generateUniqueSlug(fullname);

        university = await University.create(
          {
            fullname,
            slugs,
            country,
            state,
            city,
            street,
            postal_code,
            author_id,
            date_of_establish,
            type_of_institute,
            description,
            logo,
            order_no_for_website: await this.getNextOrderNo(),
            featured_image,
            videos,
            map,
            status: status || "published",
          },
          { transaction },
        );
      }

      // 🔹 Related data (NO guards)
      await this.upsertContact(university.id, contact, transaction);
      await this.syncLevels(university.id, levels, transaction);
      await this.syncPrograms(university.id, programs, transaction);
      await this.syncMembers(university.id, members, transaction);
      await this.syncGallery(university.id, gallery, transaction);

      await transaction.commit();
      return university.id;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteUniversity(id) {
    await sequelize.query(`DELETE FROM university WHERE id=?`, {
      replacements: [id],
    });
  }

  async upsertContact(universityId, contact, transaction) {
    // Allow empty object but not null/undefined
    if (contact === null || contact === undefined) {
      return;
    }

    // Find existing contact for this university
    const existingContact = await UniversityContact.findOne({
      where: { university_id: universityId },
      transaction,
    });

    // Preserve empty strings - convert empty strings to null for database
    // but keep actual values as they are
    const contactData = {
      faxes:
        contact.faxes !== undefined
          ? contact.faxes === ""
            ? null
            : contact.faxes
          : null,
      poboxes:
        contact.poboxes !== undefined
          ? contact.poboxes === ""
            ? null
            : contact.poboxes
          : null,
      email:
        contact.email !== undefined
          ? contact.email === ""
            ? null
            : contact.email
          : null,
      phone_number:
        contact.phone_number !== undefined
          ? contact.phone_number === ""
            ? null
            : contact.phone_number
          : null,
      website_url:
        contact.website_url !== undefined
          ? contact.website_url === ""
            ? null
            : contact.website_url
          : null,
    };

    if (existingContact) {
      // Update existing contact - use set and save to ensure changes are applied
      existingContact.set(contactData);
      await existingContact.save({ transaction });
    } else {
      // Create new contact - always create even if all fields are null/empty
      const created = await UniversityContact.create(
        {
          university_id: universityId,
          faxes: contactData.faxes,
          poboxes: contactData.poboxes,
          email: contactData.email,
          phone_number: contactData.phone_number,
          website_url: contactData.website_url,
        },
        { transaction },
      );
    }
  }

  async syncLevels(universityId, levels, transaction) {
    if (!Array.isArray(levels)) return;
    await UniversityLevel.destroy({
      where: { university_id: universityId },
      transaction,
    });
    await UniversityLevel.bulkCreate(
      levels.map((level_id) => ({
        university_id: universityId,
        level_id,
      })),
      { transaction },
    );
  }

  async syncPrograms(universityId, programs, transaction) {
    if (programs === undefined || programs === null) return;

    if (!Array.isArray(programs)) return;

    await UniversityProgram.destroy({
      where: { university_id: universityId },
      transaction,
    });

    if (programs.length > 0) {
      const validPrograms = programs
        .map((program_id) => {
          const id = parseInt(program_id, 10);
          return isNaN(id) ? null : id;
        })
        .filter((id) => id !== null && id > 0);

      if (validPrograms.length > 0) {
        await UniversityProgram.bulkCreate(
          validPrograms.map((program_id) => ({
            university_id: universityId,
            program_id,
          })),
          { transaction },
        );
      }
    }
  }

  async syncMembers(universityId, members, transaction) {
    if (!Array.isArray(members)) return;
    await UniversityMember.destroy({
      where: { university_id: universityId },
      transaction,
    });
    await UniversityMember.bulkCreate(
      members.map((member) => ({
        university_id: universityId,
        ...member,
      })),
      { transaction },
    );
  }

  async syncGallery(universityId, gallery, transaction) {
    if (!Array.isArray(gallery)) return;
    await UniversityGallery.destroy({
      where: { university_id: universityId },
      transaction,
    });
    await UniversityGallery.bulkCreate(
      gallery.map((image_url) => ({
        university_id: universityId,
        image_url,
      })),
      { transaction },
    );
  }

  async getNextOrderNo() {
    const maxOrder = await University.max("order_no_for_website");
    return (maxOrder || 0) + 1;
  }

  async updateUniversityOrder(universities) {
    const transaction = await sequelize.transaction();
    try {
      // Validate all university IDs exist
      const universityIds = universities.map((u) => u.id);
      const existingUniversities = await University.findAll({
        where: {
          id: { [Op.in]: universityIds },
        },
        transaction,
      });

      if (existingUniversities.length !== universityIds.length) {
        const error = new Error("Invalid university IDs");
        error.status = 400;
        throw error;
      }

      // Update order_no_for_website for each university
      const updates = universities.map((university) =>
        University.update(
          { order_no_for_website: university.order_no },
          { where: { id: university.id }, transaction },
        ),
      );

      await Promise.all(updates);
      await transaction.commit();

      return { message: "University order updated successfully" };
    } catch (error) {
      console.error("Error in updateUniversityOrder service:", error);
      await transaction.rollback();
      throw error;
    }
  }
}

export default UniversityService;
