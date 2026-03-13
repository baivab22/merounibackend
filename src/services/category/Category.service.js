import { Op } from "sequelize";

import { sequelize } from "../../config/database.config.js";
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
    if (query.parent_id) {
      whereCondition.parent_id = query.parent_id;
    }else {
      whereCondition.parent_id = null
    }

    const { count: totalCount, rows: items } = await Category.findAndCountAll({
      where: whereCondition,
      distinct: true,
      limit,
      offset,
      order: [["id", sort]],
      include: [
        {
          model: Category,
          as: "subcategories",
          attributes: ["id", "title"],
          required: false
        },
      ],
    });

    let processedItems = items;
    if (query.depth === "1") {
      processedItems = items.map(item => {
        const plain = item.get({ plain: true });
        delete plain.subcategories;
        return plain;
      });
    }

    return {
      items: processedItems,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        limit,
        totalCount,
      },
    };
  }

  async getCategory(slugs) {
    const category = await Category.findOne({
      where: { slugs },
      include: ["subcategories", "parent"],
    });
    if (!category) {
      const error = new Error("Category not found");
      error.status = 404;
      throw error;
    }
    return category;
  }

  async listSubCategories(parentId) {
    const categories = await Category.findAll({
      where: { parent_id: parentId },
      include: [
        {
          model: sequelize.model("materials"),
          as: "materials",
          attributes: ["id"],
        },
      ],
    });

    return categories.map(cat => {
      const plain = cat.get({ plain: true });
      plain.materials_count = plain.materials ? plain.materials.length : 0;
      delete plain.materials;
      return plain;
    });
  }

  async createCategory(data, userId) {
    const { title, description, type, parent_id } = data;

    // check if title alreay exist oor not 
    const existingCategory = await Category.findOne({
      where: { title },
    });
    if (existingCategory) {
      const error = new Error("Category already exists");
      error.status = 400;
      throw error;
    }

    const category = await Category.create({
      title,
      slugs: generateUniqueSlug(title),
      description,
      author: userId,
      type,
      parent_id,
    });

    return category;
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
