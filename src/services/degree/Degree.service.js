import { Op, Sequelize } from "sequelize";
import Degree from "../../models/degree/Degree.model.js";
import Program from "../../models/program/Program.model.js";
import College from "../../models/college/College.model.js";
import { University, UniversityProgram } from "../../models/university/University.model.js";
import { generateUniqueSlug } from "../../utils/SlugHelper.js";

class DegreeService {
    async listDegrees(query = {}) {
        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const { q } = query;
        const whereCondition = {};

        if (q) {
            whereCondition[Op.or] = [
                { title: { [Op.like]: `%${q}%` } },
                { short_name: { [Op.like]: `%${q}%` } }
            ];
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
                const disciplineConditions = disciplineIds.map(id =>
                    Sequelize.where(Sequelize.fn('JSON_CONTAINS', Sequelize.col('disciplines'), JSON.stringify(Number(id))), true)
                );
                
                // If we already have a search query (q), we need to combine it with discipline filters using Op.and
                if (q) {
                    const searchOrCondition = whereCondition[Op.or];
                    delete whereCondition[Op.or];
                    whereCondition[Op.and] = [
                        { [Op.or]: searchOrCondition },
                        { [Op.or]: disciplineConditions }
                    ];
                } else {
                    whereCondition[Op.or] = disciplineConditions;
                }
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
                    include: [
                        {
                            model: College,
                            as: "colleges",
                            attributes: ["id", "name", "slugs", "college_logo"],
                            through: { attributes: [] }
                        },
                        {
                            model: UniversityProgram,
                            as: "university_programs",
                            include: [
                                {
                                    model: University,
                                    as: "university",
                                    attributes: ["id", "fullname", "slugs"]
                                }
                            ]
                        }
                    ]
                },
                {
                    model: College,
                    as: "colleges",
                    attributes: ["id", "name", "slugs", "college_logo"],
                    through: { attributes: [] }
                }
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
