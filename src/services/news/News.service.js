import { Op } from "sequelize";
import slugify from "slug";

import News from "../../models/news/News.model.js";
import Category from "../../models/category/Category.model.js";
import UserModel from "../../models/users/User.model.js";

class NewsService {
  async listNews(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const search = query.q || "";
    const author = query.author;
    const categoryFilter = query.category_title || query.category;
    const status = query.status || "published";
    const visibility = query.visibility || "public";

    let categoryItem;
    if (categoryFilter) {
      categoryItem = await Category.findOne({
        where: {
          [Op.or]: [{ title: categoryFilter }, { slugs: categoryFilter }],
        },
      });

      if (!categoryItem) {
        const error = new Error("Category Not Found");
        error.status = 404;
        throw error;
      }
    }

    const whereCondition = {
      status,
      visibility,
    };

    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };
    }

    if (author) {
      whereCondition.author = author;
    }

    if (categoryItem) {
      whereCondition.category = categoryItem.id;
    }

    const { count: totalCount, rows: items } = await News.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      distinct: true,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Category,
          as: "newsCategory",
          attributes: ["id", "title", "slugs"],
        },
        {
          model: UserModel,
          as: "newsAuthor",
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

  async getNews(slug) {
    const news = await News.findOne({
      attributes: {
        exclude: ["author"],
      },
      where: {
        slug,
      },
      include: [
        {
          model: Category,
          as: "newsCategory",
          attributes: ["id", "title", "slugs"],
        },
        {
          model: UserModel,
          as: "newsAuthor",
          attributes: ["firstName", "middleName", "lastName"],
        },
      ],
    });

    if (!news) {
      const error = new Error("News not found");
      error.status = 404;
      throw error;
    }

    const similarNews = await News.findAll({
      attributes: {
        exclude: ["author"],
      },
      where: {
        slug: { [Op.ne]: slug },
        status: "published",
      },
      include: [
        {
          model: UserModel,
          as: "newsAuthor",
          attributes: ["firstName", "middleName", "lastName"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    return { news, similarNews };
  }

  async createNews(data) {
    return News.create({
      ...data,
      slug: slugify(data.title),
    });
  }

  async updateNews(id, data) {
    const news = await News.findByPk(id);
    if (!news) {
      const error = new Error("News not found");
      error.status = 404;
      throw error;
    }

    let updatedSlug = news.slug;
    if (data.title && data.title !== news.title) {
      updatedSlug = slugify(data.title);
    }

    await News.update(
      {
        ...data,
        slug: updatedSlug,
      },
      { where: { id } }
    );

    return News.findByPk(id, {
      include: [
        {
          model: Category,
          as: "newsCategory",
          attributes: ["id", "title", "slugs"],
        },
        {
          model: UserModel,
          as: "newsAuthor",
          attributes: ["firstName", "middleName", "lastName"],
        },
      ],
    });
  }

  async deleteNews(id) {
    const deletedRows = await News.destroy({ where: { id } });
    if (deletedRows === 0) {
      const error = new Error("News not found");
      error.status = 404;
      throw error;
    }
  }
}

export default NewsService;
