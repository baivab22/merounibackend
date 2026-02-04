import { Op } from "sequelize";

import Blog from "../../models/blogs/Blog.model.js";
import Category from "../../models/category/Category.model.js";
import UserModel from "../../models/users/User.model.js";
import { generateUniqueSlug } from "../../utils/SlugHelper.js";

class BlogService {
  async listBlogs(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const search = query.q || "";
    const categoryFilter = query.category_title || query.category;
    const authorId = query.author_id;
    const is_featured = query.is_featured;
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

    if (categoryItem) {
      whereCondition.category = categoryItem.id;
    }

    if (typeof is_featured !== "undefined") {
      whereCondition.is_featured = is_featured;
    }

    if (authorId) {
      whereCondition.author_id = authorId;
    }

    const { count: totalCount, rows: items } = await Blog.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      distinct: true,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Category,
          as: "blogCategory",
          attributes: ["id", "title", "slugs"],
        },
        {
          model: UserModel,
          as: "blogAuthor",
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

  async getBlog(identifier) {
    let whereCondition = {};
    if (!isNaN(identifier)) {
      whereCondition = { id: identifier };
    } else {
      whereCondition = { slug: identifier };
    }

    const blog = await Blog.findOne({
      attributes: {
        exclude: ["category", "author"],
      },
      where: whereCondition,
      include: [
        {
          model: Category,
          as: "blogCategory",
          attributes: ["id", "title", "slugs"],
        },
        {
          model: UserModel,
          as: "blogAuthor",
          attributes: ["firstName", "middleName", "lastName"],
        },
      ],
    });

    if (!blog) {
      const error = new Error("Blog not found");
      error.status = 404;
      throw error;
    }

    const similarBlogs = await Blog.findAll({
      attributes: {
        exclude: ["category", "author"],
      },
      where: {
        category: blog.blogCategory.id,
        status: "published",
        id: { [Op.ne]: blog.id },
      },
      include: [
        {
          model: Category,
          as: "blogCategory",
          attributes: ["id", "title", "slugs"],
        },
        {
          model: UserModel,
          as: "blogAuthor",
          attributes: ["firstName", "middleName", "lastName"],
        },
      ],
      limit: 5,
    });

    return { blog, similarBlogs };
  }

  async createBlog(data) {
    return Blog.create({
      ...data,
      slug: generateUniqueSlug(data.title),
    });
  }

  async updateBlog(id, data) {
    const blog = await Blog.findByPk(id);
    if (!blog) {
      const error = new Error("Blog not found");
      error.status = 404;
      throw error;
    }

    let updatedSlug = blog.slug;
    if (data.title && data.title !== blog.title) {
      updatedSlug = generateUniqueSlug(data.title);
    }

    const [updatedRows] = await Blog.update(
      {
        ...data,
        slug: updatedSlug,
      },
      { where: { id } },
    );

    if (updatedRows === 0) {
      const error = new Error("Blog not found");
      error.status = 404;
      throw error;
    }

    return Blog.findByPk(id);
  }

  async deleteBlog(id) {
    const deletedRows = await Blog.destroy({ where: { id } });
    if (deletedRows === 0) {
      const error = new Error("Blog not found");
      error.status = 404;
      throw error;
    }
  }
}

export default BlogService;
