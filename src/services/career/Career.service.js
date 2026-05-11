import { Op } from "sequelize";

import CareerModel from "../../models/career/Career.model.js";
import CareerApplication from "../../models/career/CareerApplication.model.js";
import UserModel from "../../models/users/User.model.js";
import Category from "../../models/category/Category.model.js";
import { generateUniqueSlug } from "../../utils/SlugHelper.js";

class CareerService {
  async listCareers(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const sort = (query.sort || "desc").toUpperCase();
    const search = query.q || "";
    const category_id = query.category_id || "";

    const offset = (page - 1) * limit;

    const whereCondition = {};
    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };
    }

    if (category_id) {
      whereCondition.category_id = category_id;
    }

    const { count: totalCount, rows: items } =
      await CareerModel.findAndCountAll({
        where: whereCondition,
        distinct: true,
        order: [["createdAt", sort]],
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["id", "title", "slug"],
          },
        ],
        limit,
        offset,
      });

    let finalItems = items;
    if (query.user_id) {
      const userApplications = await CareerApplication.findAll({
        where: { user_id: query.user_id },
        attributes: ["career_id"],
      });
      const appliedCareerIds = new Set(userApplications.map((a) => a.career_id));

      finalItems = items.map((item) => {
        const itemData = item.toJSON ? item.toJSON() : item;
        itemData.hasApplied = appliedCareerIds.has(itemData.id);
        return itemData;
      });
    }

    return {
      items: finalItems,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        limit,
        totalCount,
      },
    };
  }

  async getCareerBySlug(slug, userId = null) {
    const careerPost = await CareerModel.findOne({
      where: { slug },
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

    const data = careerPost.toJSON ? careerPost.toJSON() : careerPost;

    if (userId) {
      const application = await CareerApplication.findOne({
        where: { career_id: data.id, user_id: userId },
      });
      data.hasApplied = !!application;
    }

    return data;
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
    const slug = generateUniqueSlug(title);

    return CareerModel.create({
      title,
      slug,
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
    const updateData = {
      title: data.title || career.title,
      author_id: data.author_id || career.author_id,
      description: data.description || career.description,
      content: data.content || career.content,
      featuredImage: data.featuredImage || career.featuredImage,
      status: data.status !== undefined ? data.status : career.status,
    };

    if (data.title && data.title !== career.title) {
      updateData.slug = generateUniqueSlug(data.title);
    }

    await career.update(updateData);

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

  async applyForCareer(careerId, data) {
    const career = await CareerModel.findByPk(careerId);
    if (!career || career.status !== "active") {
      const error = new Error("Career post is not active or not found");
      error.status = 404;
      throw error;
    }

    const existingApplication = await CareerApplication.findOne({
      where: {
        career_id: career.id,
        user_id: data.user_id,
      },
    });

    if (existingApplication) {
      const error = new Error("You have already applied for this career post");
      error.status = 400;
      throw error;
    }

    const application = await CareerApplication.create({
      career_id: career.id,
      user_id: data.user_id,
      resume: data.resume,
      cover_letter: data.cover_letter || null,
    });

    return application;
  }

  async listCareerApplications(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const sort = (query.sort || "desc").toUpperCase();
    const search = query.q || "";
    const career_id = query.career_id;

    const offset = (page - 1) * limit;

    const whereCondition = {};
    const userIncludeWhere = {};

    if (search) {
      userIncludeWhere[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { middleName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    if (career_id) {
      whereCondition.career_id = parseInt(career_id, 10);
    }

    const { count: totalCount, rows: items } =
      await CareerApplication.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: CareerModel,
            as: "career",
            attributes: ["id", "title", "slug"],
          },
          {
            model: UserModel,
            as: "applicant",
            attributes: ["id", "firstName", "middleName", "lastName", "email", "phoneNo"],
            where: Object.keys(userIncludeWhere).length > 0 ? userIncludeWhere : undefined,
          },
        ],
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
}

export default CareerService;
