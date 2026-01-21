import { QueryTypes } from "sequelize";
import slug from "slug";

import { sequelize } from "../../config/database.config.js";
import {
  University,
  UniversityContact,
  UniversityLevel,
  UniversityMember,
  UniversityAsset,
  UniversityGallery,
  UniversityProgram,
} from "../../models/university/University.model.js";
import Program from "../../models/program/Program.model.js";

class UniversityService {
  async listUniversities(query = {}) {
    let { page, limit, q } = query;

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const searchQuery = q || "";

    const offset = (page - 1) * limit;

    let sqlQuery = `SELECT * FROM university`;
    let countQuery = `SELECT COUNT(*) as total FROM university`;

    if (searchQuery) {
      const searchCondition = ` WHERE fullname LIKE :searchQuery`;
      sqlQuery += searchCondition;
      countQuery += searchCondition;
    }

    sqlQuery += ` ORDER BY createdAt DESC LIMIT :limit OFFSET :offset`;

    const items = await sequelize.query(sqlQuery, {
      replacements: { limit, offset, searchQuery: `%${searchQuery}%` },
      type: QueryTypes.SELECT,
    });

    const totalCountResult = await sequelize.query(countQuery, {
      replacements: { searchQuery: `%${searchQuery}%` },
      type: QueryTypes.SELECT,
    });

    const totalCount = totalCountResult[0].total;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      message: "success",
      currentPage: page,
      totalPages,
      totalItems: totalCount,
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
          required: false, // Make it a LEFT JOIN so it's included even if no contact exists
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
          model: UniversityAsset,
          as: "asset",
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

    console.log(
      "getUniversityProfile: universityData.contact:",
      universityData.contact
    );

    return {
      ...universityData,
      contact: universityData.contact || null,
      levels: (universityData.levels || []).map((level) => level.level_id),
      programs: universityData.university_programs || [],
      members: universityData.members || [],
      assets: universityData.asset || null,
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
        assets,
        gallery,
      } = payload;

      // Validate fullname exists
      if (!fullname || fullname.trim() === "") {
        const error = new Error("University name (fullname) is required");
        error.status = 400;
        throw error;
      }

      const slugs = slug(fullname);

      let university;

      if (id) {
        await University.update(
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
          },
          { where: { id }, transaction }
        );
        university = await University.findByPk(id, { transaction });
      } else {
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
          },
          { transaction }
        );
      }

      console.log(
        "createOrUpdateUniversity: contact payload:",
        JSON.stringify(contact)
      );
      await this.upsertContact(university.id, contact, transaction);
      await this.syncLevels(university.id, levels, transaction);
      await this.syncPrograms(university.id, programs, transaction);
      await this.syncMembers(university.id, members, transaction);
      await this.upsertAssets(university.id, assets, transaction);
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
      console.log("upsertContact: contact is null/undefined, skipping");
      return;
    }

    console.log(
      "upsertContact: Received contact data:",
      JSON.stringify(contact)
    );
    console.log("upsertContact: universityId:", universityId);

    // Find existing contact for this university
    const existingContact = await UniversityContact.findOne({
      where: { university_id: universityId },
      transaction,
    });

    console.log("upsertContact: existingContact found:", !!existingContact);

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
    };

    console.log(
      "upsertContact: contactData to save:",
      JSON.stringify(contactData)
    );

    if (existingContact) {
      // Update existing contact - use set and save to ensure changes are applied
      existingContact.set(contactData);
      await existingContact.save({ transaction });
      console.log(
        "upsertContact: Updated contact:",
        existingContact.get({ plain: true })
      );
    } else {
      // Create new contact - always create even if all fields are null/empty
      const created = await UniversityContact.create(
        {
          university_id: universityId,
          faxes: contactData.faxes,
          poboxes: contactData.poboxes,
          email: contactData.email,
          phone_number: contactData.phone_number,
        },
        { transaction }
      );
      console.log(
        "upsertContact: Created new contact:",
        created.get({ plain: true })
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
      { transaction }
    );
  }

  async syncPrograms(universityId, programs, transaction) {
    // If programs is not provided (undefined/null), skip updating programs
    // If programs is an empty array, clear all programs
    // If programs is an array with values, replace all programs
    if (programs === undefined || programs === null) return;

    if (!Array.isArray(programs)) return;

    // Always destroy existing programs first
    await UniversityProgram.destroy({
      where: { university_id: universityId },
      transaction,
    });

    // Only create new programs if the array is not empty
    if (programs.length > 0) {
      // Filter out invalid program IDs and ensure they are integers
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
          { transaction }
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
      { transaction }
    );
  }

  async upsertAssets(universityId, assets, transaction) {
    if (!assets) return;
    await UniversityAsset.upsert(
      {
        university_id: universityId,
        ...assets,
      },
      { transaction }
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
      { transaction }
    );
  }
}

export default UniversityService;
