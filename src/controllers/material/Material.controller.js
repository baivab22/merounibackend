import MaterialService from "../../services/material/Material.service.js";

const materialService = new MaterialService();

class MaterialController {
  static async listMaterials(req, res) {
    try {
      const materials = await materialService.listMaterialsNested(req.query);
      return res.status(200).json({
        message: "Materials retrieved successfully",
        data: materials,
      });
    } catch (error) {
      console.error("Error getting hierarchical materials:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async listMaterialsFlat(req, res) {
    try {
      const { materials, pagination } = await materialService.listMaterialsFlat(req.query);
      return res.status(200).json({
        message: "Materials flat list retrieved successfully",
        data: materials,
        pagination,
      });
    } catch (error) {
      console.error("Error getting flat materials:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async listMaterialsByTopic(req, res) {
    try {
      const materials = await materialService.listByTopic(req.params.topicId);
      return res.status(200).json({
        message: "Topic materials retrieved successfully",
        data: materials,
      });
    } catch (error) {
      console.error("Error getting materials by topic:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async getMaterial(req, res) {
    try {
      const material = await materialService.getMaterial(req.params.id);
      return res.status(200).json({
        message: "Material retrieved successfully",
        data: material,
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
        .json({ message: "Material created successfully", data: newMaterial });
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
        .json({ message: "Material updated successfully", data: updatedMaterial });
    } catch (error) {
      console.error("Error updating material:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async deleteMaterial(req, res) {
    try {
      await materialService.deleteMaterial(req.params.id);
      return res.status(200).json({ message: "Material deleted successfully" });
    } catch (error) {
      console.error("Error deleting material:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async updateMaterialCategoryOrder(req, res) {
    try {
      const result = await materialService.updateCategoryOrder(req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error updating material category order:", error);
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Server error" });
    }
  }

  static async updateMaterialOrder(req, res) {
    try {
      const result = await materialService.updateMaterialOrder(req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error updating material order:", error);
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Server error" });
    }
  }
}

export default MaterialController;
