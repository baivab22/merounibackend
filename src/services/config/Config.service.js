import { Op } from "sequelize";
import Config from "../../models/config/Config.model.js";

class ConfigService {
  async list(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 50;
    const offset = (page - 1) * limit;

    const where = {};
    if (query.types) {
      const typesList = query.types.split(",").map((t) => t.trim());
      where.type = { [Op.in]: typesList };
    }

    const { count: totalCount, rows: items } = await Config.findAndCountAll({
      where,
      limit,
      offset,
      order: [["type", "ASC"]],
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

  async getByType(type) {
    const config = await Config.findOne({ where: { type } });
    if (!config) {
      const error = new Error("Config not found");
      error.status = 404;
      throw error;
    }
    return config;
  }

  async createOrUpdate(data) {
    const { type, value } = data;
    const [config] = await Config.findOrCreate({
      where: { type },
      defaults: { value: value != null ? String(value) : null },
    });
    if (!config.isNewRecord) {
      await config.update({ value: value != null ? String(value) : null });
    }
    return config;
  }

  async create(data) {
    const { type, value } = data;
    const config = await Config.create({
      type,
      value: value != null ? String(value) : null,
    });
    return config;
  }

  async updateByType(type, data) {
    const config = await Config.findOne({ where: { type } });
    if (!config) {
      const error = new Error("Config not found");
      error.status = 404;
      throw error;
    }
    await config.update({
      value: data.value != null ? String(data.value) : config.value,
    });
    return config;
  }

  async deleteByType(type) {
    const config = await Config.findOne({ where: { type } });
    if (!config) {
      const error = new Error("Config not found");
      error.status = 404;
      throw error;
    }
    await config.destroy();
  }
}

export default ConfigService;
