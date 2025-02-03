import slug from "slug";
import Category from "../model/CategoryModel.js";

export const createCategory = async (req, res) => {
  try {
    const { title, description, author } = req.body;

    await Category.create({
      title,
      slugs: slug(title),
      description,
      author,
    });

    return res.status(201).json({
      message: "Category created",
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
