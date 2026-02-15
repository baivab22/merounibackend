import { Op } from "sequelize";
import slug from "slug";

import Level from "../../models/level/Level.model.js";

class LevelService {
  async listLevels(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const search = query.q || "";

    const whereCondition = {};

    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };
    }

    const { count: totalCount, rows: items } = await Level.findAndCountAll({
      where: whereCondition,
      distinct: true,
      limit,
      offset,
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

  async getLevel(slugs) {
    const level = await Level.findOne({
      where: { slugs },
    });
    if (!level) {
      const error = new Error("Level not found");
      error.status = 404;
      throw error;
    }

    return level;
  }

  async createLevel({ title, author }) {
    const slugs = slug(title);
    return Level.create({ title, slugs, author });
  }

  async updateLevel(levelId, data) {
    const level = await Level.findByPk(levelId);

    if (!level) {
      const error = new Error("Level not found");
      error.status = 404;
      throw error;
    }

    const [updatedCount] = await Level.update(
      { ...data },
      {
        where: { id: levelId },
      }
    );

    if (updatedCount === 0) {
      const error = new Error("Level already up to date");
      error.status = 404;
      throw error;
    }
  }

  async deleteLevel(id) {
    const deletedRows = await Level.destroy({
      where: { id },
    });
    if (deletedRows === 0) {
      const error = new Error("Level not found");
      error.status = 404;
      throw error;
    }
  }
}

export default LevelService;
