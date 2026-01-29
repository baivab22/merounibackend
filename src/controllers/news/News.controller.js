import NewsService from "../../services/news/News.service.js";

const newsService = new NewsService();

class NewsController {
  static async listNews(req, res) {
    try {
      const { items, pagination } = await newsService.listNews(req.query);
      return res.status(200).json({
        message: "News retrieved",
        items,
        pagination,
      });
    } catch (error) {
      console.error("Error getting news:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async getNews(req, res) {
    try {
      const { news, similarNews } = await newsService.getNews(req.params.slug);

      return res.status(200).json({
        message: "News retrieved",
        news,
        similarNews,
      });
    } catch (error) {
      console.error("Error getting news:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async createNews(req, res) {
    try {
      const newNews = await newsService.createNews(req.body);

      return res.status(201).json({ message: "News created", news: newNews });
    } catch (error) {
      console.error("Error creating news:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async updateNews(req, res) {
    try {
      const updatedNews = await newsService.updateNews(req.query.id, req.body);
      return res
        .status(200)
        .json({ message: "News updated", news: updatedNews });
    } catch (error) {
      console.error("Error updating news:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }

  static async deleteNews(req, res) {
    try {
      await newsService.deleteNews(req.query.id);
      return res.status(200).json({ message: "News deleted" });
    } catch (error) {
      console.error("Error deleting news:", error);
      const status = error.status || 500;
      return res.status(status).json({
        message: status === 500 ? "Server error" : error.message,
        error: error.message,
      });
    }
  }
}

export default NewsController;
