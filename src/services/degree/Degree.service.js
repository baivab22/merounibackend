
import { Op } from "sequelize";
import Degree from "../../models/degree/Degree.model.js";
import { generateUniqueSlug } from "../../utils/SlugHelper.js";

class DegreeService {
    async listDegrees(query = {}) {
        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const { q } = query;
        const whereCondition = {};

        if (q) {
            whereCondition.title = { [Op.like]: `%${q}%` };
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

    async getDegreeById(id) {
        const degree = await Degree.findByPk(id);

        if (!degree) {
            const error = new Error("Degree not found");
            error.status = 404;
            throw error;
        }

        return degree;
    }

    async getDegreeBySlug(slug) {
        const degree = await Degree.findOne({
            where: { slug },
        });

        if (!degree) {
            const error = new Error("Degree not found");
            error.status = 404;
            throw error;
        }

        return degree;
    }

    async createDegree(payload) {
        const { title, ...rest } = payload;
        const degreeSlug = generateUniqueSlug(title);
        return Degree.create({ ...rest, title, slug: degreeSlug });
    }

    async updateDegree(id, payload) {
        const degree = await Degree.findByPk(id);
        if (!degree) {
            const error = new Error("Degree not found");
            error.status = 404;
            throw error;
        }

        const { title, ...rest } = payload;
        const updateData = { ...rest };

        if (title && title !== degree.title) {
            updateData.title = title;
            updateData.slug = generateUniqueSlug(title);
        }

        await degree.update(updateData);
        return degree;
    }

    async deleteDegree(id) {
        const deletedRows = await Degree.destroy({
            where: { id },
        });
        if (deletedRows === 0) {
            const error = new Error("Degree not found");
            error.status = 404;
            throw error;
        }
    }
}

export default new DegreeService();
