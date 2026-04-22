import SearchTerm from "../../models/search/SearchTerm.model.js";

class SearchTermController {
  static async listAdmin(req, res) {
    try {
      const items = await SearchTerm.findAll({
        order: [["count", "DESC"]],
        attributes: ["id", "term", "count", "createdAt", "updatedAt"],
      });
      return res.status(200).json({
        message: "Search terms retrieved",
        data: items,
      });
    } catch (error) {
      console.error("Error listing search terms:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  }

  static async remove(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "Invalid id" });
      }
      const row = await SearchTerm.findByPk(id);
      if (!row) {
        return res.status(404).json({ message: "Search term not found" });
      }
      await row.destroy();
      return res.status(200).json({ message: "Search term deleted" });
    } catch (error) {
      console.error("Error deleting search term:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  }
}

export default SearchTermController;
