import { Op } from "sequelize";

import MaterialCategory from "../../models/materials/MaterialCategory.model.js";

class MaterialCategoryService {
  async listCategories(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 100; // Higher default for dropdowns
    const search = query.q || "";

    const offset = (page - 1) * limit;

    const whereCondition = {};
    if (search) {
      whereCondition.name = { [Op.like]: `%${search}%` };
    }

    const { count: totalCount, rows: items } =
      await MaterialCategory.findAndCountAll({
        where: whereCondition,
        distinct: true,
        limit,
        offset,
        order: [["name", "ASC"]],
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

  async getCategory(id) {
    const category = await MaterialCategory.findByPk(id);
    if (!category) {
      const error = new Error("Material category not found");
      error.status = 404;
      throw error;
    }
    return category;
  }

  async createCategory(data) {
    const { name, description } = data;

    const category = await MaterialCategory.create({
      name,
      description: description || null,
    });

    return category;
  }

  async updateCategory(category_id, data) {
    const category = await MaterialCategory.findByPk(category_id);

    if (!category) {
      const error = new Error("Material category not found");
      error.status = 404;
      throw error;
    }

    const [updatedCount] = await MaterialCategory.update(
      { ...data },
      {
        where: { id: category_id },
      }
    );

    if (updatedCount === 0) {
      const error = new Error("Material category already up to date");
      error.status = 404;
      throw error;
    }

    return MaterialCategory.findByPk(category_id);
  }

  async deleteCategory(category_id) {
    const deletedRows = await MaterialCategory.destroy({
      where: { id: category_id },
    });
    if (deletedRows === 0) {
      const error = new Error("Material category not found");
      error.status = 404;
      throw error;
    }
  }
}

export default MaterialCategoryService;
