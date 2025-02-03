import Category from "../model/CategoryModel.js";

export const deleteCategory = async (req, res) => {
  try {
    const deletedRows = await Category.destroy({
      where: { id: req.query.category_id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(204).json({ message: "Category deleted" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
