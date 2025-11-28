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

    sqlQuery += ` LIMIT :limit OFFSET :offset`;

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
    const [university] = await sequelize.query(
      `SELECT * FROM university WHERE slugs = ?`,
      { replacements: [slugParam], type: QueryTypes.SELECT }
    );

    if (!university) {
      const error = new Error("University not found");
      error.status = 404;
      throw error;
    }

    const id = university.id;

    const contact = await sequelize.query(
      `SELECT faxes, poboxes, email, phone_number FROM university_contact WHERE university_id = ?`,
      { replacements: [id], type: QueryTypes.SELECT }
    );

    const levels = await sequelize.query(
      `SELECT level_id FROM university_levels WHERE university_id = ?`,
      { replacements: [id], type: QueryTypes.SELECT }
    );

    const programs = await sequelize.query(
      `SELECT p.id, p.title 
       FROM university_programs up
       JOIN programs p ON up.program_id = p.id
       WHERE up.university_id = ?`,
      { replacements: [id], type: QueryTypes.SELECT }
    );

    const members = await sequelize.query(
      `SELECT role, salutation, name, phone, email FROM university_members WHERE university_id = ?`,
      { replacements: [id], type: QueryTypes.SELECT }
    );

    const [assets] = await sequelize.query(
      `SELECT featured_image, videos FROM university_assets WHERE university_id = ?`,
      { replacements: [id], type: QueryTypes.SELECT }
    );

    const gallery = await sequelize.query(
      `SELECT image_url FROM university_gallery WHERE university_id = ?`,
      { replacements: [id], type: QueryTypes.SELECT }
    );

    return {
      ...university,
      contact: contact[0] || null,
      levels: levels.map((level) => level.level_id),
      programs: programs.map((p) => p.title),
      members,
      assets: assets || null,
      gallery: gallery.map((img) => img.image_url),
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
    if (!contact) return;
    await UniversityContact.upsert(
      {
        university_id: universityId,
        ...contact,
      },
      { transaction }
    );
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
    if (!Array.isArray(programs)) return;
    await UniversityProgram.destroy({
      where: { university_id: universityId },
      transaction,
    });
    await UniversityProgram.bulkCreate(
      programs.map((program_id) => ({
        university_id: universityId,
        program_id,
      })),
      { transaction }
    );
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
