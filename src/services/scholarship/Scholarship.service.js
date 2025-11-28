import { Op } from "sequelize";
import slug from "slug";

import Scholarship from "../../models/scholarship/Scholarship.model.js";

class ScholarshipService {
  async listScholarships(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const searchQuery = query.q || "";

    const whereCondition = {};
    if (searchQuery) {
      whereCondition.name = { [Op.like]: `%${searchQuery}%` };
    }

    const { count: totalCount, rows: scholarships } =
      await Scholarship.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        distinct: true,
        order: [["applicationDeadline", "ASC"]],
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
    const scholarship = await Scholarship.findByPk(id);
    if (!scholarship) {
      const error = new Error("Scholarship not found");
      error.status = 404;
      throw error;
    }
    return scholarship;
  }

  async createScholarship(data) {
    return Scholarship.create({
      ...data,
      slugs: slug(data.name),
    });
  }

  async updateScholarship(id, data) {
    const [updatedRows] = await Scholarship.update(data, {
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
