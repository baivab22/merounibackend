import { Op } from "sequelize";
import slugify from "slug";

import News from "../../models/news/News.model.js";
import Category from "../../models/category/Category.model.js";
import UserModel from "../../models/users/User.model.js";
import CollegeModel from "../../models/college/College.model.js";

class NewsService {
  async listNews(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const search = query.q || "";
    const author = query.author || query.author_id;
    const categoryFilter = query.category_title || query.category || query.category_id;
    const collegeId = query.collegeId || query.college_id;
    const status = query.status || "published";
    const visibility = query.visibility || "public";

    let categoryItem;
    if (categoryFilter && isNaN(categoryFilter)) {
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
    } else if (categoryFilter && !isNaN(categoryFilter)) {
      whereCondition.category = categoryFilter;
    }

    if (collegeId) {
      whereCondition.college_id = collegeId;
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
        },
        {
          model: UserModel,
          as: "newsAuthor",
        },
        {
          model: CollegeModel,
          as: "newsCollege",
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

  async getNewsBySlug(slug) {
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
        },
        {
          model: UserModel,
          as: "newsAuthor",
        },
        {
          model: CollegeModel,
          as: "newsCollege",
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
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    return { news, similarNews };
  }

  async getNewsById(id) {
    const news = await News.findByPk(id, {
      attributes: {
        exclude: ["author"],
      },
      include: [
        {
          model: Category,
          as: "newsCategory",
        },
        {
          model: UserModel,
          as: "newsAuthor",
        },
        {
          model: CollegeModel,
          as: "newsCollege",
        },
      ],
    });

    if (!news) {
      const error = new Error("News not found");
      error.status = 404;
      throw error;
    }

    return news;
  }

  async createNews(data) {
    const { title, author, author_id, category_id, college_id, ...rest } = data;
    return News.create({
      ...rest,
      title,
      author: author || author_id,
      category: category_id || null,
      college_id: college_id || null,
      slug: slugify(title),
    });
  }

  async updateNews(id, data) {
    const news = await News.findByPk(id);
    if (!news) {
      const error = new Error("News not found");
      error.status = 404;
      throw error;
    }

    const { title, author, author_id, category, category_id, college_id, ...rest } = data;
    let updatedSlug = news.slug;
    if (title && title !== news.title) {
      updatedSlug = slugify(title);
    }

    await News.update(
      {
        ...rest,
        title: title || news.title,
        author: author || author_id || news.author,
        category:
          category !== undefined
            ? category
            : category_id !== undefined
              ? category_id
              : news.category,
        college_id: college_id !== undefined ? college_id : news.college_id,
        slug: updatedSlug,
      },
      { where: { id } }
    );

    return News.findByPk(id, {
      include: [
        {
          model: Category,
          as: "newsCategory",
        },
        {
          model: UserModel,
          as: "newsAuthor",
        },
        {
          model: CollegeModel,
          as: "newsCollege",
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
