import MaterialCategoryService from "../../services/material/MaterialCategory.service.js";

const materialCategoryService = new MaterialCategoryService();

class MaterialCategoryController {
  static async listCategories(req, res) {
    try {
      const { items, pagination } =
        await materialCategoryService.listCategories(req.query);
      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      console.error("Error getting material categories:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async getCategory(req, res) {
    try {
      const category = await materialCategoryService.getCategory(req.params.id);
      return res
        .status(200)
        .json({ message: "Material category retrieved", category });
    } catch (error) {
      console.error("Error getting material category:", error);
      return res
        .status(error.status || 500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async createCategory(req, res) {
    try {
      const category = await materialCategoryService.createCategory(req.body);

      return res.status(201).json({
        message: "Material category created",
        category,
      });
    } catch (error) {
      console.error("Error creating material category:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async updateCategory(req, res) {
    try {
      const category = await materialCategoryService.updateCategory(
        req.query.category_id,
        req.body
      );

      return res
        .status(200)
        .json({ message: "Material category updated", category });
    } catch (error) {
      console.error("Error updating material category:", error);
      return res
        .status(error.status || 500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async deleteCategory(req, res) {
    try {
      await materialCategoryService.deleteCategory(req.query.category_id);
      return res.status(200).json({ message: "Material category deleted" });
    } catch (error) {
      console.error("Error deleting material category:", error);
      return res
        .status(error.status || 500)
        .json({ message: "Server error", error: error.message });
    }
  }
}

export default MaterialCategoryController;
