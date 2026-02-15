import { Op } from "sequelize";

import VacancyModel from "../../models/vacancy/Vacancy.model.js";
import UserModel from "../../models/users/User.model.js";
import {generateUniqueSlug} from "../../utils/SlugHelper.js";

class VacancyService {
  async listVacancies(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const sort = (query.sort || "desc").toUpperCase();
    const search = query.q || "";

    const offset = (page - 1) * limit;

    const whereCondition = {};

    if (search) {
      whereCondition[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { associated_organization_name: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count: totalCount, rows: items } =
      await VacancyModel.findAndCountAll({
        where: whereCondition,
        distinct: true,
        order: [["createdAt", sort]],
        limit,
        offset,
        include: [
          {
            model: UserModel,
            as: "vacancyAuthor",
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
    const {
      title,
      author_id,
      associated_organization_name,
      featuredImage,
      description,
      content,
    } = data;
    const slugs = generateUniqueSlug(title);

    return VacancyModel.create({
      title,
      slugs,
      author_id,
      associated_organization_name: associated_organization_name || null,
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

    await vacancy.update({
      title: data.title || vacancy.title,
      author_id: data.author_id || vacancy.author_id,
      associated_organization_name:
        data.associated_organization_name !== undefined
          ? data.associated_organization_name
          : vacancy.associated_organization_name,
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
