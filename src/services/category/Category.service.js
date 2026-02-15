import { Op } from "sequelize";

import { generateUniqueSlug } from "../../utils/SlugHelper.js";
import Category from "../../models/category/Category.model.js";

class CategoryService {
  async listCategories(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const sort = (query.sort || "asc").toUpperCase();
    const search = query.q || "";

    const offset = (page - 1) * limit;

    const whereCondition = {};
    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };
    }
    if (query.type) {
      whereCondition.type = query.type;
    }

    const { count: totalCount, rows: items } = await Category.findAndCountAll({
      where: whereCondition,
      distinct: true,
      limit,
      offset,
      order: [["id", sort]],
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

  async getCategory(slugs) {
    const category = await Category.findOne({ where: { slugs } });
    if (!category) {
      const error = new Error("Category not found");
      error.status = 404;
      throw error;
    }
    return category;
  }

  async createCategory(data) {
    const { title, description, author, type } = data;

    await Category.create({
      title,
      slugs: generateUniqueSlug(title),
      description,
      author,
      type,
    });
  }

  async updateCategory(category_id, data) {
    const category = await Category.findByPk(category_id);

    if (!category) {
      const error = new Error("Category not found");
      error.status = 404;
      throw error;
    }

    const [updatedCount] = await Category.update(
      { ...data },
      {
        where: { id: category_id },
      }
    );

    if (updatedCount === 0) {
      const error = new Error("Category already up to date");
      error.status = 404;
      throw error;
    }
  }

  async deleteCategory(category_id) {
    const deletedRows = await Category.destroy({
      where: { id: category_id },
    });
    if (deletedRows === 0) {
      const error = new Error("Category not found");
      error.status = 404;
      throw error;
    }
  }
}

export default CategoryService;
