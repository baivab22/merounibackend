import { Op } from "sequelize";
import slug from "slug";

import Scholarship from "../../models/scholarship/Scholarship.model.js";
import Category from "../../models/category/Category.model.js";

class ScholarshipService {
  async listScholarships(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const searchQuery = query.q || "";
    const categoryId = query.categoryId;
    const minAmount = query.minAmount;
    const maxAmount = query.maxAmount;
    const activeOnly = query.activeOnly === "true";
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "DESC";

    const whereCondition = {};

    if (searchQuery) {
      whereCondition[Op.or] = [
        { name: { [Op.like]: `%${searchQuery}%` } },
        { description: { [Op.like]: `%${searchQuery}%` } },
      ];
    }

    if (categoryId) {
      whereCondition.category_id = categoryId;
    }

    if (minAmount || maxAmount) {
      whereCondition.amount = {};
      if (minAmount) whereCondition.amount[Op.gte] = minAmount;
      if (maxAmount) whereCondition.amount[Op.lte] = maxAmount;
    }

    if (activeOnly) {
      whereCondition.applicationDeadline = { [Op.gte]: new Date() };
    }

    // Validate sort fields
    const validSortFields = [
      "createdAt",
      "amount",
      "applicationDeadline",
      "name",
    ];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const order = [
      [sortField, sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC"],
    ];

    const { count: totalCount, rows: scholarships } =
      await Scholarship.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        distinct: true,
        order,
        include: [
          {
            model: Category,
            as: "scholarshipCategory",
            attributes: ["id", "title", "slugs"],
            required: false,
          },
        ],
      });

    return {
      scholarships,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        limit,
        totalCount,
      },
    };
  }

  async getScholarship(id) {
    const scholarship = await Scholarship.findByPk(id, {
      include: [
        {
          model: Category,
          as: "scholarshipCategory",
          attributes: ["id", "title", "slugs"],
          required: false,
        },
      ],
    });
    if (!scholarship) {
      const error = new Error("Scholarship not found");
      error.status = 404;
      throw error;
    }
    return scholarship;
  }

  async createScholarship(data) {
    const title = data.title?.trim();
    const name = data.name?.trim();
    const titleOrName = title || name;

    if (!titleOrName || titleOrName.length === 0) {
      console.error(
        "Scholarship creation error - received data:",
        JSON.stringify(data, null, 2)
      );
      const error = new Error("Title or name is required to generate slug");
      error.status = 400;
      throw error;
    }

    const createData = {
      ...data,
      slugs: slug(titleOrName),
    };

    // Map old field names to new field names for backward compatibility
    if (data.category && !data.category_id) {
      createData.category_id = data.category;
    }
    if (data.author && !data.author_id) {
      createData.author_id = data.author;
    }

    return Scholarship.create(createData);
  }

  async updateScholarship(id, data) {
    // If title or name is being updated, regenerate the slug
    const updateData = { ...data };
    if (data.title || data.name) {
      const titleOrName = data.title || data.name;
      updateData.slugs = slug(titleOrName);
    }

    // Map old field names to new field names for backward compatibility
    if (data.category && !data.category_id) {
      updateData.category_id = data.category;
    }
    if (data.author && !data.author_id) {
      updateData.author_id = data.author;
    }

    const [updatedRows] = await Scholarship.update(updateData, {
      where: { id },
    });

    if (updatedRows === 0) {
      const error = new Error("Scholarship not found");
      error.status = 404;
      throw error;
    }

    return Scholarship.findByPk(id);
  }

  async deleteScholarship(id) {
    const deletedRows = await Scholarship.destroy({
      where: { id },
    });
    if (deletedRows === 0) {
      const error = new Error("Scholarship not found");
      error.status = 404;
      throw error;
    }
  }
}

export default ScholarshipService;
