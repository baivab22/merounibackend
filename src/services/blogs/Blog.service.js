import { Op } from "sequelize";

import Blog from "../../models/blogs/Blog.model.js";
import Category from "../../models/category/Category.model.js";
import UserModel from "../../models/users/User.model.js";
import Tag from "../../models/tags/Tag.model.js";
import { getUniqueSlug } from "../../utils/SlugHelper.js";

class BlogService {
  async listBlogs(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const search = query.q || "";
    const categoryId = query.category_id || query.category;
    const status = query.status;

    const whereCondition = {};

    if (status) {
      whereCondition.status = status;
    }
    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };
    }

    if (categoryId && categoryId !== "all") {
      whereCondition.category = categoryId;
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
          attributes: ["id", "title", "slug"],
        },
        {
          model: UserModel,
          as: "blogAuthor",
          attributes: ["firstName", "middleName", "lastName"],
        },
      ],
    });

    // Populate tag details for each blog
    const itemsWithTags = await Promise.all(
      items.map(async (blog) => {
        const blogData = blog.toJSON();

        // Parse tags if they're stored as a JSON string
        let tagIds = blogData.tags;
        if (typeof tagIds === "string") {
          try {
            tagIds = JSON.parse(tagIds);
          } catch (e) {
            tagIds = [];
          }
        }

        // Fetch tag details if we have tag IDs
        if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
          const tagDetails = await Tag.findAll({
            where: { id: tagIds },
            attributes: ["id", "title"],
          });
          blogData.tags = tagDetails.map((tag) => tag.toJSON());
        } else {
          blogData.tags = [];
        }

        return blogData;
      }),
    );

    return {
      items: itemsWithTags,
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
          attributes: ["id", "title", "slug"],
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
          attributes: ["id", "title", "slug"],
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
    const slug = await getUniqueSlug(Blog, data.title, null, data.slug);
    return Blog.create({
      ...data,
      slug,
    });
  }

  async updateBlog(id, data) {
    const blog = await Blog.findByPk(id);
    if (!blog) {
      const error = new Error("Blog not found");
      error.status = 404;
      throw error;
    }

    data.slug = await getUniqueSlug(
      Blog,
      data.title || blog.title,
      id,
      data.slug,
    );

    const [updatedRows] = await Blog.update(
      {
        ...data,
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
