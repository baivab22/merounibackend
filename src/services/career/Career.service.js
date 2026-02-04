import { Op } from "sequelize";

import CareerModel from "../../models/career/Career.model.js";
import UserModel from "../../models/users/User.model.js";
import {generateUniqueSlug} from "../../utils/SlugHelper.js";

class CareerService {
  async listCareers(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const sort = (query.sort || "desc").toUpperCase();
    const search = query.q || "";

    const offset = (page - 1) * limit;

    const whereCondition = {};
    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };
    }

    const { count: totalCount, rows: items } =
      await CareerModel.findAndCountAll({
        where: whereCondition,
        distinct: true,
        order: [["createdAt", sort]],
        limit,
        offset,
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

  async getCareerBySlug(slugs) {
    const careerPost = await CareerModel.findOne({
      where: { slugs },
      attributes: {
        exclude: ["author_id"],
      },
      include: [
        {
          model: UserModel,
          as: "careerAuthor",
          attributes: ["firstName", "middleName", "lastName"],
        },
      ],
    });

    if (!careerPost) {
      const error = new Error("Career post not found");
      error.status = 404;
      throw error;
    }

    return careerPost;
  }

  async createCareer(data) {
    const {
      title,
      author_id,
      featuredImage,
      description,
      content,
      status,
    } = data;
    const slugs = generateUniqueSlug(title);

    return CareerModel.create({
      title,
      slugs,
      author_id,
      description,
      content,
      featuredImage,
      status: status || "active",
    });
  }

  async updateCareer(id, data) {
    const career = await CareerModel.findByPk(id);
    if (!career) {
      const error = new Error("Career not found");
      error.status = 404;
      throw error;
    }
    if (data.title && data.title !== career.title) {
      data.slugs = generateUniqueSlug(data.title);
    }

    await career.update({
      title: data.title || career.title,
      slugs: data.slugs || career.slugs,
      author_id: data.author_id || career.author_id,
      description: data.description || career.description,
      content: data.content || career.content,
      featuredImage: data.featuredImage || career.featuredImage,
      status: data.status !== undefined ? data.status : career.status,
    });

    return career;
  }

  async deleteCareer(id) {
    const deletedRows = await CareerModel.destroy({
      where: { id },
    });
    if (deletedRows === 0) {
      const error = new Error("Career not found");
      error.status = 404;
      throw error;
    }
  }
}

export default CareerService;
