import TagService from "../../services/tag/Tag.service.js";

const tagService = new TagService();

class TagController {
  static async listTags(req, res) {
    try {
      const { items, pagination } = await tagService.listTags(req.query);
      return res.status(200).json({
        message: "Tags retrieved",
        items,
        pagination,
      });
    } catch (error) {
      console.error("Error getting tags:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async getTag(req, res) {
    try {
      const item = await tagService.getTag(req.params.tag_id);

      return res.status(200).json({ message: "Tag retrieved", item });
    } catch (error) {
      console.error("Error getting tag by ID:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async createTag(req, res) {
    try {
      const item = await tagService.createTag(req.body);
      return res.status(201).json({ message: "Tag created", item });
    } catch (error) {
      console.error("Error creating tag:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async updateTag(req, res) {
    try {
      await tagService.updateTag(req.query.tag_id, req.body);
      return res.status(200).json({ message: "Tag updated" });
    } catch (error) {
      console.error("Error updating tag:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async deleteTag(req, res) {
    try {
      await tagService.deleteTag(req.query.tag_id);
      return res.status(200).json({ message: "Tag deleted" });
    } catch (error) {
      console.error("Error deleting tag:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }
}

export default TagController;
