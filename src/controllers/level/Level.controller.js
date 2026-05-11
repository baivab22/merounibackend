import LevelService from "../../services/level/Level.service.js";

const levelService = new LevelService();

class LevelController {
  static async listLevels(req, res) {
    try {
      const { items, pagination } = await levelService.listLevels(req.query);
      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      console.error("Error getting levels:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async getLevel(req, res) {
    try {
      const item = await levelService.getLevel(req.params.slug);
      return res.status(200).json({ message: "Level retrieved", item });
    } catch (error) {
      console.error("Error getting level:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async createLevel(req, res) {
    try {
      const item = await levelService.createLevel(req.body);
      return res.status(201).json({ message: "Level created", item });
    } catch (error) {
      console.error("Error creating level:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async updateLevel(req, res) {
    try {
      await levelService.updateLevel(req.query.level_id, req.body);
      return res.status(200).json({ message: "Level updated" });
    } catch (error) {
      console.error("Error updating level:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async deleteLevel(req, res) {
    try {
      await levelService.deleteLevel(req.query.id);
      return res.status(200).json({ message: "Level deleted" });
    } catch (error) {
      console.error("Error deleting level:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }
}

export default LevelController;
