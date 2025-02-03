import slug from "slug";
import Blog from "../model/NewsModel.js";

export const createBlog = async (req, res) => {
  try {
    const {
      title,
      category,
      tags,
      description,
      content,
      featuredImage,
      author,
      reactions,
      status,
      visibility,
    } = req.body;

    const newBlog = await Blog.create({
      title,
      slug: slug(title),
      category,
      tags,
      description,
      content,
      featuredImage,
      author,
      reactions,
      status,
      visibility,
    });

    return res.status(201).json({ message: "Blog created", blog: newBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
