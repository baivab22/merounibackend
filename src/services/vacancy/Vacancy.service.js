import { Op } from "sequelize";
import slug from "slug";

import VacancyModel from "../../models/vacancy/Vacancy.model.js";
import UserModel from "../../models/users/User.model.js";

class VacancyService {
  async listVacancies(query = {}) {
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
      await VacancyModel.findAndCountAll({
        where: whereCondition,
        distinct: true,
        order: [["id", sort]],
        limit,
        offset,
        include: [
          {
            model: UserModel,
            as: "vacancyAuthor",
            attributes: ["firstName", "middleName", "lastName"],
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

  async getVacancyBySlug(slugs) {
    const vacancy = await VacancyModel.findOne({
      where: { slugs },
      include: [
        {
          model: UserModel,
          as: "vacancyAuthor",
          attributes: ["firstName", "middleName", "lastName"],
        },
      ],
    });

    if (!vacancy) {
      const error = new Error("Vacancy not found");
      error.status = 404;
      throw error;
    }

    return vacancy;
  }

  async createVacancy(data) {
    const { title, author_id, featuredImage, description, content } = data;
    const slugs = slug(title);

    return VacancyModel.create({
      title,
      slugs,
      author_id,
      description,
      content,
      featuredImage,
    });
  }

  async updateVacancy(id, data) {
    const vacancy = await VacancyModel.findByPk(id);
    if (!vacancy) {
      const error = new Error("Vacancy not found");
      error.status = 404;
      throw error;
    }

    const slugs = data.title ? slug(data.title) : vacancy.slugs;

    await vacancy.update({
      title: data.title || vacancy.title,
      slugs,
      author_id: data.author_id || vacancy.author_id,
      description: data.description || vacancy.description,
      content: data.content || vacancy.content,
      featuredImage: data.featuredImage || vacancy.featuredImage,
    });

    return vacancy;
  }

  async deleteVacancy(id) {
    const deletedRows = await VacancyModel.destroy({
      where: { id },
    });
    if (deletedRows === 0) {
      const error = new Error("Vacancy not found");
      error.status = 404;
      throw error;
    }
  }
}

export default VacancyService;
