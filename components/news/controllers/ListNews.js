import { Op } from "sequelize";

import Blog from "../model/NewsModel.js";
import Category from "../../category/model/CategoryModel.js";
import User from "../../users/model/UserModel.js";

export const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let search = req.query.q || "";
    let categoryTitle = req.query.category_title;
    let authorId = req.query.author_id;
    let is_featured = req.query.is_featured;

    let categoryItem;
    if (categoryTitle) {
      categoryItem = await Category.findOne({
        where: {
          title: categoryTitle,
        },
      });

      if (!categoryItem) {
        return res.status(200).json({
          status: 200,
          message: "Category Not Found",
        });
      }
    }

    let whereCondition = {
      status: "published",
      visibility: "public",
    };
    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };
    }

    if (categoryItem) {
      whereCondition.category = categoryItem.id;
    }

    if (is_featured) {
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
    });

    const totalPages = Math.ceil(totalCount / limit);
    res.status(200).json({
      message: "Blogs retrieved",
      items,
      pagination: { currentPage: page, totalPages, limit, totalCount },
    });
  } catch (error) {
    console.error("Error getting blogs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    let { slug } = req.params;
    const blog = await Blog.findOne({
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
          model: User,
          as: "newsAuthor",
          attributes: ["firstName", "middleName", "lastName"],
        },
      ],
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const similarBlogs = await Blog.findAll({
      attributes: {
        exclude: ["category", "author"],
      },
      where: {
        category: blog.newsCategory.id,
        slug: { [Op.ne]: slug },
      },
      include: [
        {
          model: Category,
          as: "newsCategory",
          attributes: ["id", "title", "slugs"],
        },
        {
          model: User,
          as: "newsAuthor",
          attributes: ["firstName", "middleName", "lastName"],
        },
      ],
      limit: 5,
    });

    res.status(200).json({
      message: "Blog retrieved",
      blog,
      similarBlogs,
    });
  } catch (error) {
    console.error("Error getting blog by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
