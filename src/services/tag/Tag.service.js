import { Op } from "sequelize";
import slug from "slug";

import Tag from "../../models/tags/Tag.model.js";

class TagService {
  async listTags(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const search = query.q || "";

    const whereCondition = {};

    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };
    }

    const { count: totalCount, rows: items } = await Tag.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      distinct: true,
      order: [["createdAt", "DESC"]],
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

  async getTag(tag_id) {
    if (!tag_id) {
      const error = new Error("Missing tag_id parameter");
      error.status = 400;
      throw error;
    }

    const tag = await Tag.findByPk(tag_id);
    if (!tag) {
      const error = new Error("Tag not found");
      error.status = 404;
      throw error;
    }

    return tag;
  }

  async createTag({ title, author }) {
    const generatedSlug = slug(title);
    return Tag.create({ title, slug: generatedSlug, author });
  }

  async updateTag(tag_id, data) {
    const tag = await Tag.findByPk(tag_id);

    if (!tag) {
      const error = new Error("Tag not found");
      error.status = 404;
      throw error;
    }

    const [updatedCount] = await Tag.update(
      { ...data },
      {
        where: { id: tag_id },
      }
    );

    if (updatedCount === 0) {
      const error = new Error("Tag already up to date");
      error.status = 404;
      throw error;
    }
  }

  async deleteTag(id) {
    const deletedRows = await Tag.destroy({
      where: { id },
    });
    if (deletedRows === 0) {
      const error = new Error("Tag not found");
      error.status = 404;
      throw error;
    }
  }
}

export default TagService;
