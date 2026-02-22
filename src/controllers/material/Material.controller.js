import MaterialService from "../../services/material/Material.service.js";

const materialService = new MaterialService();

class MaterialController {
  static async listMaterials(req, res) {
    try {
      const { materials, pagination } = await materialService.listMaterials(
        req.query
      );
      return res.status(200).json({
        message: "Materials retrieved",
        materials,
        pagination,
      });
    } catch (error) {
      console.error("Error getting materials:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async listMaterialsByCategory(req, res) {
    try {
      const { materials, pagination } = await materialService.listMaterials(
        req.query
      );
      return res.status(200).json({
        message: "Materials retrieved by category",
        materials,
        pagination,
      });
    } catch (error) {
      console.error("Error getting materials by category:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async getMaterial(req, res) {
    try {
      const material = await materialService.getMaterial(req.params.id);

      return res.status(200).json({
        message: "Material retrieved",
        material,
      });
    } catch (error) {
      console.error("Error getting material by ID:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async createMaterial(req, res) {
    try {
      // Extract author from authenticated user
      const authorId = req.user?.id;
      if (!authorId) {
        return res.status(401).json({
          message: "Unauthorized",
          error: "User ID not found in token",
        });
      }

      const newMaterial = await materialService.createMaterial({
        ...req.body,
        author: authorId,
      });

      return res
        .status(201)
        .json({ message: "Material created", material: newMaterial });
    } catch (error) {
      console.error("Error creating material:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async updateMaterial(req, res) {
    try {
      const updatedMaterial = await materialService.updateMaterial(
        req.query.id,
        req.body
      );
      return res
        .status(200)
        .json({ message: "Material updated", material: updatedMaterial });
    } catch (error) {
      console.error("Error updating material:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async deleteMaterial(req, res) {
    try {
      await materialService.deleteMaterial(req.query.id);
      return res.status(200).json({ message: "Material deleted" });
    } catch (error) {
      console.error("Error deleting material:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }
}

export default MaterialController;
