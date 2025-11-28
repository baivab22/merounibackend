import { Op } from "sequelize";
import slug from "slug";

import Material from "../../models/materials/Material.model.js";
import Tag from "../../models/tags/Tag.model.js";

class MaterialService {
  async listMaterials(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const searchQuery = query.q || "";

    let whereCondition = {};
    if (searchQuery) {
      whereCondition = {
        title: { [Op.like]: `%${searchQuery}%` },
      };
    }

    const { count: totalCount, rows: materials } =
      await Material.findAndCountAll({
        where: whereCondition,
        distinct: true,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

    return {
      materials,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        limit,
        totalCount,
      },
    };
  }

  async getMaterial(id) {
    const material = await Material.findByPk(id);

    if (!material) {
      const error = new Error("Material not found");
      error.status = 404;
      throw error;
    }

    const tagIds = JSON.parse(material.tags || "[]");

    const tags = await Tag.findAll({
      where: { id: tagIds },
      attributes: ["title"],
    });

    return {
      ...material.toJSON(),
      tags,
    };
  }

  async createMaterial(data) {
    const { title } = data;
    return Material.create({
      ...data,
      slug: slug(title),
    });
  }

  async updateMaterial(id, data) {
    const material = await Material.findByPk(id);
    if (!material) {
      const error = new Error("Material not found");
      error.status = 404;
      throw error;
    }

    let updatedSlug = material.slug;
    if (data.title && data.title !== material.title) {
      updatedSlug = slug(data.title);
    }

    const [updatedRows] = await Material.update(
      {
        ...data,
        slug: updatedSlug,
      },
      { where: { id } }
    );

    if (updatedRows === 0) {
      const error = new Error("No changes made");
      error.status = 404;
      throw error;
    }

    return Material.findByPk(id);
  }

  async deleteMaterial(id) {
    const deletedRows = await Material.destroy({
      where: { id },
    });
    if (deletedRows === 0) {
      const error = new Error("Material not found");
      error.status = 404;
      throw error;
    }
  }
}

export default MaterialService;
