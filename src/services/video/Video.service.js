import { Op } from "sequelize";
import Video from "../../models/video/Video.model.js";
import Category from "../../models/category/Category.model.js";

import { generateUniqueSlug } from "../../utils/SlugHelper.js";


class VideoService {
    async listVideos(query = {}) {
        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const { q, category_id } = query;
        const whereCondition = {};

        if (q) {
            whereCondition.title = { [Op.like]: `%${q}%` };
        }

        if (category_id) {
            whereCondition.category_id = category_id;
        }

        const { count: totalCount, rows: items } = await Video.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: Category,
                    as: "category",
                    attributes: ["id", "title", "slug"],
                },
            ],
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

    async getVideoById(id) {
        const video = await Video.findByPk(id);

        if (!video) {
            const error = new Error("Video not found");
            error.status = 404;
            throw error;
        }

        return video;
    }

    async getVideoBySlug(slug) {
        const video = await Video.findOne({ where: { slug } });

        if (!video) {
            const error = new Error("Video not found");
            error.status = 404;
            throw error;
        }

        return video;
    }

    async createVideo(payload) {
        const { title, ...rest } = payload;

        const slug = generateUniqueSlug(title);
        return Video.create({ ...rest, title, slug });
    }

    async updateVideo(id, payload) {
        const video = await Video.findByPk(id);
        if (!video) {
            const error = new Error("Video not found");
            error.status = 404;
            throw error;
        }

        await video.update(payload);
        return video;
    }

    async deleteVideo(id) {
        const deletedRows = await Video.destroy({
            where: { id },
        });
        if (deletedRows === 0) {
            const error = new Error("Video not found");
            error.status = 404;
            throw error;
        }
    }
}

export default VideoService;
