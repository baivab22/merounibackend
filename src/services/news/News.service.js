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
    const categoryTitle = query.category_title;
    const authorId = query.author_id;
    const is_featured = query.is_featured;
    const status = query.status || "published";
    const visibility = query.visibility || "public";

    let categoryItem;
    if (categoryTitle) {
      categoryItem = await Category.findOne({
        where: {
          title: categoryTitle,
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

    if (categoryItem) {
      whereCondition.category = categoryItem.id;
    }

    if (typeof is_featured !== "undefined") {
      whereCondition.is_featured = is_featured;
    }

    if (authorId) {
      whereCondition.author_id = authorId;
    }

    const { count: totalCount, rows: items } = await News.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      distinct: true,
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

  async getNews(slug) {
    const news = await News.findOne({
      attributes: {
        exclude: ["category", "author"],
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
        exclude: ["category", "author"],
      },
      where: {
        category: news.newsCategory.id,
        slug: { [Op.ne]: slug },
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

    const [updatedRows] = await News.update(
      {
        ...data,
        slug: updatedSlug,
      },
      { where: { id } }
    );

    if (updatedRows === 0) {
      const error = new Error("News not found");
      error.status = 404;
      throw error;
    }

    return News.findByPk(id);
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
