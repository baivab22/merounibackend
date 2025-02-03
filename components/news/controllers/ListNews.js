import Blog from "../model/NewsModel.js";
import Category from "../../category/model/CategoryModel.js";
import User from "../../users/model/UserModel.js";

export const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count: totalCount, rows: items } = await Blog.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      //   include: [
      //     { model: Category, as: "blogCategory" },
      //     { model: User, as: "blogAuthor" },
      //   ],
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
    const blog = await Blog.findByPk(req.query.id, {
      include: [
        { model: Category, as: "blogCategory" },
        { model: User, as: "blogAuthor" },
      ],
    });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog retrieved", blog });
  } catch (error) {
    console.error("Error getting blog by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
