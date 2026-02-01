import { Op } from "sequelize";
import slug from "slug";

import Degree from "../../models/degree/Degree.model.js";
import Program from "../../models/program/Program.model.js";

class DegreeService {
  async listDegrees(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const q = query.q || "";

    const whereCondition = {};
    if (q) {
      whereCondition[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { short_name: { [Op.like]: `%${q}%` } },
      ];
    }

    const { count: totalCount, rows: items } = await Degree.findAndCountAll({
      where: whereCondition,
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

  async getDegree(slugOrId) {
    const str = String(slugOrId).trim();
    const isNumeric = /^\d+$/.test(str);
    const where = isNumeric ? { id: Number(str) } : { slug: str };
    const degree = await Degree.findOne({
      where,
      include: [
        {
          model: Program,
          as: "programs",
          attributes: ["id", "title", "slugs", "code", "duration"],
          required: false,
        },
      ],
    });
    if (!degree) {
      const error = new Error("Degree not found");
      error.status = 404;
      throw error;
    }
    return degree;
  }

  async createDegree({ cover_image, short_name, title }) {
    const slugValue = this._generateSlug(title, short_name);
    const existing = await Degree.findOne({ where: { slug: slugValue } });
    if (existing) {
      const error = new Error("A degree with this title/short name already exists");
      error.status = 400;
      throw error;
    }
    return Degree.create({
      cover_image: cover_image || null,
      short_name,
      title,
      slug: slugValue,
    });
  }

  async updateDegree(id, { cover_image, short_name, title }) {
    const degree = await Degree.findByPk(id);
    if (!degree) {
      const error = new Error("Degree not found");
      error.status = 404;
      throw error;
    }

    const updates = {};
    if (cover_image !== undefined) updates.cover_image = cover_image || null;
    if (short_name !== undefined) updates.short_name = short_name;
    if (title !== undefined) updates.title = title;

    if (updates.title || updates.short_name) {
      updates.slug = this._generateSlug(
        updates.title ?? degree.title,
        updates.short_name ?? degree.short_name
      );
    }

    await degree.update(updates);
    return degree;
  }

  async deleteDegree(id) {
    const deleted = await Degree.destroy({ where: { id } });
    if (!deleted) {
      const error = new Error("Degree not found");
      error.status = 404;
      throw error;
    }
  }

  _generateSlug(title, shortName) {
    const base = (title || shortName || "").trim();
    return slug(base) || "degree";
  }
}

export default DegreeService;
