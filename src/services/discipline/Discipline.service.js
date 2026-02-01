import { Op } from "sequelize";
import Discipline from "../../models/discipline/Discipline.model.js";
import { generateUniqueSlug } from "../../utils/SlugHelper.js";

class DisciplineService {
    async listDisciplines(query = {}) {
        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const { q, status } = query;
        const whereCondition = {};

        if (q) {
            whereCondition.title = { [Op.like]: `%${q}%` };
        }

        if (status) {
            whereCondition.status = status;
        }

        const { count: totalCount, rows: items } = await Discipline.findAndCountAll({
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

    async getDisciplineById(id) {
        const discipline = await Discipline.findByPk(id);

        if (!discipline) {
            const error = new Error("Discipline not found");
            error.status = 404;
            throw error;
        }

        return discipline;
    }

    async getDisciplineBySlug(slugs) {
        const discipline = await Discipline.findOne({
            where: { slugs },
        });

        if (!discipline) {
            const error = new Error("Discipline not found");
            error.status = 404;
            throw error;
        }

        return discipline;
    }

    async createDiscipline(payload) {
        const { title, ...rest } = payload;
        const slug = generateUniqueSlug(title);
        return Discipline.create({ ...rest, title, slug });
    }

    async updateDiscipline(id, payload) {
        const discipline = await Discipline.findByPk(id);
        if (!discipline) {
            const error = new Error("Discipline not found");
            error.status = 404;
            throw error;
        }

        const { title, ...rest } = payload;
        const updateData = { ...rest };

        if (title && title !== discipline.title) {
            updateData.title = title;
            updateData.slug = generateUniqueSlug(title);
        }

        await discipline.update(updateData);
        return discipline;
    }

    async deleteDiscipline(id) {
        const deletedRows = await Discipline.destroy({
            where: { id },
        });
        if (deletedRows === 0) {
            const error = new Error("Discipline not found");
            error.status = 404;
            throw error;
        }
    }
}

export default DisciplineService;
