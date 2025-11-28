import { Op } from "sequelize";
import slug from "slug";

import CareerModel from "../../models/career/Career.model.js";
import UserModel from "../../models/users/User.model.js";

class CareerService {
  async listCareers(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const sort = (query.sort || "asc").toUpperCase();
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
        order: [["id", sort]],
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
    const { title, author_id, featuredImage, description, content } = data;
    const slugs = slug(title);

    return CareerModel.create({
      title,
      slugs,
      author_id,
      description,
      content,
      featuredImage,
    });
  }

  async updateCareer(id, data) {
    const career = await CareerModel.findByPk(id);
    if (!career) {
      const error = new Error("Career not found");
      error.status = 404;
      throw error;
    }

    const slugs = data.title ? slug(data.title) : career.slugs;

    await career.update({
      title: data.title || career.title,
      slugs,
      author_id: data.author_id || career.author_id,
      description: data.description || career.description,
      content: data.content || career.content,
      featuredImage: data.featuredImage || career.featuredImage,
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
