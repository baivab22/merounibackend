import NewsLetter from "../../models/newsletter/Newsletter.model.js";

class NewsletterService {
  async listNewsletter(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const sort = (query.sort || "asc").toUpperCase();

    const offset = (page - 1) * limit;

    const { count: totalCount, rows: items } = await NewsLetter.findAndCountAll(
      {
        limit,
        offset,
        order: [["id", sort]],
      }
    );

    return {
      items,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        limit,
        totalCount,
      },
    };
  }

  async createNewsletter(data) {
    return NewsLetter.create(data);
  }
}

export default NewsletterService;
