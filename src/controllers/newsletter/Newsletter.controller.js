import NewsletterService from "../../services/newsletter/Newsletter.service.js";

const newsletterService = new NewsletterService();

class NewsletterController {
  static async listNewsletter(req, res) {
    try {
      const { items, pagination } = await newsletterService.listNewsletter(
        req.query
      );
      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Error: ${error}`,
      });
    }
  }

  static async createNewsletter(req, res) {
    try {
      await newsletterService.createNewsletter(req.body);

      return res.status(201).json({
        message: "success",
      });
    } catch (error) {
      return res.status(500).json({
        message: `Error: ${error}`,
      });
    }
  }
}

export default NewsletterController;
