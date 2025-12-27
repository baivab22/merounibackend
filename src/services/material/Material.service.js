import { Op } from "sequelize";
import slug from "slug";

import Material from "../../models/materials/Material.model.js";
import Tag from "../../models/tags/Tag.model.js";
import MaterialCategory from "../../models/materials/MaterialCategory.model.js";

class MaterialService {
  async listMaterials(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const searchQuery = query.q || query.search || "";
    const categoryId = query.category_id;

    // Build where condition
    const whereCondition = {};

    // Add search filter if provided
    if (searchQuery) {
      whereCondition.title = { [Op.like]: `%${searchQuery}%` };
    }

    if (categoryId && categoryId !== "unlisted") {
      whereCondition.category_id = { [Op.eq]: categoryId };
    } else if (categoryId === "unlisted") {
      whereCondition.category_id = { [Op.is]: null };
    }

    // Execute query
    const { count: totalCount, rows: materials } =
      await Material.findAndCountAll({
        where: {
          ...whereCondition,
        },
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: MaterialCategory,
            as: "category",
            attributes: ["id", "name"],
            required: false,
          },
        ],
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
    const material = await Material.findByPk(id, {
      include: [
        {
          model: MaterialCategory,
          as: "category",
          attributes: ["id", "name"],
          required: false,
        },
      ],
    });

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
    const { title, category_id, file, author } = data;

    // Validate author is provided
    if (!author) {
      const error = new Error("Author is required");
      error.status = 400;
      throw error;
    }

    // Validate file URL (string) is provided
    if (!file || typeof file !== "string" || !file.trim()) {
      const error = new Error("File URL is required");
      error.status = 400;
      throw error;
    }

    let slugValue = slug(title);

    // If category is provided, fetch it and add to slug
    if (category_id) {
      const category = await MaterialCategory.findByPk(category_id);
      if (category) {
        slugValue = `${slug(category.name)}-${slugValue}`;
      }
    }

    return Material.create({
      ...data,
      slug: slugValue,
    });
  }

  async updateMaterial(id, data) {
    const material = await Material.findByPk(id, {
      include: [
        {
          model: MaterialCategory,
          as: "category",
          attributes: ["id", "name"],
          required: false,
        },
      ],
    });

    if (!material) {
      const error = new Error("Material not found");
      error.status = 404;
      throw error;
    }

    // Validate file URL (string) if being updated - must be provided
    if (data.file !== undefined) {
      if (!data.file || typeof data.file !== "string" || !data.file.trim()) {
        const error = new Error("File URL is required");
        error.status = 400;
        throw error;
      }
    }

    // Determine if slug needs to be regenerated
    const titleChanged = data.title && data.title !== material.title;
    const categoryChanged =
      data.category_id !== undefined &&
      data.category_id !== material.category_id;

    let updatedSlug = material.slug;

    if (titleChanged || categoryChanged) {
      const title = data.title || material.title;
      const categoryId =
        data.category_id !== undefined
          ? data.category_id
          : material.category_id;

      // Build slug from title and category
      let slugValue = slug(title);

      // If category is provided, fetch it and add to slug
      if (categoryId) {
        const category = await MaterialCategory.findByPk(categoryId);
        if (category) {
          slugValue = `${slug(category.name)}-${slugValue}`;
        }
      }

      updatedSlug = slugValue;
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
