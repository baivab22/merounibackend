import slug from "slug";
import { Op } from "sequelize";
import SkillsBasedCourse from "../../models/skills-based-courses/SkillsBasedCourse.model.js";
import { generateUniqueSlug } from "../../utils/SlugHelper.js";

class SkillsBasedCourseService {
    async listCourses(query = {}) {
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

        const { count: totalCount, rows: items } =
            await SkillsBasedCourse.findAndCountAll({
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

    async getCourseById(id) {
        const course = await SkillsBasedCourse.findByPk(id);

        if (!course) {
            const error = new Error("Skills Based Course not found");
            error.status = 404;
            throw error;
        }

        return course;
    }

    async getCourseBySlug(slug) {
        const course = await SkillsBasedCourse.findOne({
            where: { slug },
        });

        if (!course) {
            const error = new Error("Skills Based Course not found");
            error.status = 404;
            throw error;
        }

        return course;
    }

    async createCourse(payload) {
        const { title, ...rest } = payload;
        const slug =  generateUniqueSlug(title);
        return SkillsBasedCourse.create({ ...rest, title, slug });
    }

    async updateCourse(id, payload) {
        const course = await SkillsBasedCourse.findByPk(id);
        if (!course) {
            const error = new Error("Skills Based Course not found");
            error.status = 404;
            throw error;
        }

        const { title, ...rest } = payload;
        const updateData = { ...rest };

        if (title && title !== course.title) {
            updateData.title = title;
            updateData.slug = generateUniqueSlug(title);
        }

        await course.update(updateData);
        return course;
    }

    async deleteCourse(id) {
        const deletedRows = await SkillsBasedCourse.destroy({
            where: { id },
        });
        if (deletedRows === 0) {
            const error = new Error("Skills Based Course not found");
            error.status = 404;
            throw error;
        }
    }
}

export default SkillsBasedCourseService;
