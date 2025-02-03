import slug from "slug";
import Category from "../model/CategoryModel.js";

export const updateCategory = async (req, res) => {
  try {
    let { category_id } = req.query;
    let { title, description, author } = req.body;

    let category = Category.findByPk(category_id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    let updatedSlug = category.slugs;
    if (title !== category.title) {
      updatedSlug = slug(title);
    }

    let items = await Category.update(
      { title, slugs:updatedSlug, description, author },
      {
        where: { id: category_id },
      }
    );

    if (items === 0) {
      return res.status(404).json({ message: "Category already upto date" });
    }

    return res.status(200).json({ message: "Category updated" });
  } catch (error) {
    console.error("Error updating category:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
