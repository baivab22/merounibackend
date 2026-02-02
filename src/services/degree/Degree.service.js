import { Op, Sequelize } from "sequelize";
import Degree from "../../models/degree/Degree.model.js";
import Program from "../../models/program/Program.model.js";
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

        const disciplineId = query.discipline_id;
        const include = [];

        if (disciplineId && (Array.isArray(disciplineId) ? disciplineId.length > 0 : disciplineId !== "")) {
            let disciplineIds = [];
            if (Array.isArray(disciplineId)) {
                disciplineIds = disciplineId;
            } else if (typeof disciplineId === "string") {
                disciplineIds = disciplineId.split(",").map((id) => id.trim());
            } else if (typeof disciplineId === "number") {
                disciplineIds = [disciplineId.toString()];
            }

            if (disciplineIds.length > 0) {
                const orConditions = disciplineIds.map(id => 
                    Sequelize.where(Sequelize.fn('JSON_CONTAINS', Sequelize.col('disciplines'), JSON.stringify(id.toString())), true)
                );
                whereCondition[Op.or] = orConditions;
            }
        }

        const { count: totalCount, rows: items } = await Degree.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            distinct: true,
            order: [["createdAt", "DESC"]],
            include: include.length ? include : undefined,
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
            include: [
                {
                    model: Program,
                    as: "programs",
                    attributes: ["id", "title", "slugs", "duration", "fee", "credits"],
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
