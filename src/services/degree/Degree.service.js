import { Op, Sequelize } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import Degree from "../../models/degree/Degree.model.js";
import Program from "../../models/program/Program.model.js";
import College from "../../models/college/College.model.js";
import { University, UniversityProgram } from "../../models/university/University.model.js";
import { generateUniqueSlug } from "../../utils/SlugHelper.js";

class DegreeService {
    async listDegrees(query = {}) {
        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 24;
        const offset = (page - 1) * limit;

        const { q } = query;
        const whereCondition = {};

        const statusParam = query.status;
        if (statusParam === "draft" || statusParam === "published") {
            whereCondition.status = statusParam;
        } else if (statusParam !== "all") {
            whereCondition.status = "published";
        }

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
            order: [
                [Sequelize.literal("order_no_for_website IS NULL"), "ASC"],
                ["order_no_for_website", "ASC"],
                ["createdAt", "DESC"]
            ],
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
            where: { slug, status: "published" },
            include: [
                {
                    model: College,
                    as: "colleges",
                    attributes: ["id", "name", "slug", "college_logo", "order_no_for_website"],
                    through: { attributes: [] }
                },
                {
                    model: Program,
                    as: "programs",
                    attributes: ["id", "title", "slug", "duration", "fee", "credits"],
                    include: [
                        {
                            model: College,
                            as: "colleges",
                            attributes: ["id", "name", "slug", "college_logo", "order_no_for_website"],
                            through: { attributes: [] }
                        },
                        {
                            model: UniversityProgram,
                            as: "university_programs",
                            include: [
                                {
                                    model: University,
                                    as: "university",
                                    attributes: ["id", "fullname", "slug"]
                                }
                            ]
                        }
                    ]
                }
            ],
            order: [
                [{ model: College, as: "colleges" }, "order_no_for_website", "ASC"],
                ["programs", { model: College, as: "colleges" }, "order_no_for_website", "ASC"]
            ]
        });

        if (!degree) {
            const error = new Error("Degree not found");
            error.status = 404;
            throw error;
        }

        return degree;
    }

    async createDegree(payload) {
        const { title, status, ...rest } = payload;
        const degreeSlug = generateUniqueSlug(title);
        const resolvedStatus = status === "draft" ? "draft" : "published";
        return Degree.create({
            ...rest,
            title,
            slug: payload.slug || degreeSlug,
            status: resolvedStatus,
            meta_description: payload.meta_description,
        });
    }

    async updateDegree(id, payload) {
        const degree = await Degree.findByPk(id);
        if (!degree) {
            const error = new Error("Degree not found");
            error.status = 404;
            throw error;
        }

        const { title, status, ...rest } = payload;
        const updateData = { ...rest };

        if (title !== undefined) {
            updateData.title = title;
            if (!payload.slug && title !== degree.title) {
                updateData.slug = generateUniqueSlug(title);
            }
        }

        if (status !== undefined) {
            updateData.status = status === "draft" ? "draft" : "published";
        }

        if (payload.slug) {
            updateData.slug = payload.slug;
        }

        if (payload.meta_description !== undefined) {
            updateData.meta_description = payload.meta_description;
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

    async updateDegreeOrder(degrees) {
        const transaction = await sequelize.transaction();
        try {
            const degreeIds = degrees.map((d) => d.id);
            const existingDegrees = await Degree.findAll({
                where: { id: { [Op.in]: degreeIds } },
                transaction,
            });

            console.log(existingDegrees, "existingDegrees")
            if (existingDegrees.length !== degreeIds.length) {
                throw new Error("Invalid degree IDs");
            }

            const updates = degrees.map((d) =>
                Degree.update(
                    { order_no_for_website: d.order_no },
                    { where: { id: d.id }, transaction }
                )
            );

            await Promise.all(updates);
            await transaction.commit();
            return { message: "Degree order updated successfully" };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

export default new DegreeService();
