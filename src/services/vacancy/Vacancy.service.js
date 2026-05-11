import { Op } from "sequelize";

import VacancyModel from "../../models/vacancy/Vacancy.model.js";
import UserModel from "../../models/users/User.model.js";
import { generateUniqueSlug, getUniqueSlug } from "../../utils/SlugHelper.js";

class VacancyService {
  async listVacancies(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const sort = (query.sort || "desc").toUpperCase();
    const search = query.q || "";
    const status = query.status;

    const offset = (page - 1) * limit;

    const whereCondition = {};

    if (status && (status === "published" || status === "draft")) {
      whereCondition.status = status;
    }

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

  async getVacancyBySlug(slug) {
    const vacancy = await VacancyModel.findOne({
      where: { slug },
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
      pdf_file,
      description,
      content,
      slug,
      meta_description,
    } = data;
    const finalSlug = await getUniqueSlug(VacancyModel, title, null, slug);

    return VacancyModel.create({
      title,
      slug: finalSlug,
      author_id,
      associated_organization_name: associated_organization_name || null,
      description,
      content,
      featuredImage,
      pdf_file: pdf_file || null,
      status: status === "draft" ? "draft" : "published",
      meta_description,
    });
  }

  async updateVacancy(id, data) {
    const vacancy = await VacancyModel.findByPk(id);
    if (!vacancy) {
      const error = new Error("Vacancy not found");
      error.status = 404;
      throw error;
    }

    const updateData = {
      title: data.title || vacancy.title,
      author_id: data.author_id || vacancy.author_id,
      associated_organization_name:
        data.associated_organization_name !== undefined
          ? data.associated_organization_name
          : vacancy.associated_organization_name,
      description: data.description || vacancy.description,
      content: data.content || vacancy.content,
      featuredImage: data.featuredImage || vacancy.featuredImage,
      pdf_file:
        data.pdf_file !== undefined ? data.pdf_file || null : vacancy.pdf_file,
      ...(data.status !== undefined && {
        status: data.status === "draft" ? "draft" : "published",
      }),
      meta_description:
        data.meta_description !== undefined
          ? data.meta_description
          : vacancy.meta_description,
    };

    updateData.slug = await getUniqueSlug(VacancyModel, data.title || vacancy.title, id, data.slug);

    await vacancy.update(updateData);

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
