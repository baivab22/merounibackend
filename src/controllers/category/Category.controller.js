import CategoryService from "../../services/category/Category.service.js";

const categoryService = new CategoryService();

class CategoryController {
  static async listCategories(req, res) {
    try {
      const { items, pagination } = await categoryService.listCategories(
        req.query
      );
      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      console.error("Error getting categories:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async getCategory(req, res) {
    try {
      const category = await categoryService.getCategory(req.params.slugs);
      return res.status(200).json({ message: "Category retrieved", category });
    } catch (error) {
      console.error("Error getting category:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async createCategory(req, res) {
    const userId = req.user.id;
    try {
      await categoryService.createCategory(req.body, userId);

      return res.status(201).json({
        message: "Category created",
      });
    } catch (error) {
      console.error("Error creating category:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async updateCategory(req, res) {
    try {
      await categoryService.updateCategory(req.query.category_id, req.body);

      return res.status(200).json({ message: "Category updated" });
    } catch (error) {
      console.error("Error updating category:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async deleteCategory(req, res) {
    try {
      await categoryService.deleteCategory(req.query.category_id);
      return res.status(200).json({ message: "Category deleted" });
    } catch (error) {
      console.error("Error deleting category:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }
}

export default CategoryController;
