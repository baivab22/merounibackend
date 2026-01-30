import { QueryTypes } from "sequelize";

import { sequelize } from "../../config/database.config.js";

class HomeService {
  async search(q) {
    const searchQuery = q || "";
    if (!searchQuery) {
      const error = new Error("Search query is required.");
      error.status = 400;
      throw error;
    }

    const searchResults = await sequelize.query(
      `
      (SELECT id, CONVERT(name USING utf8mb4) COLLATE utf8mb4_unicode_ci AS title, CONVERT(slugs USING utf8mb4) COLLATE utf8mb4_unicode_ci AS slugs, CONVERT('colleges' USING utf8mb4) COLLATE utf8mb4_unicode_ci AS type, createdAt FROM colleges WHERE name LIKE :search)
      UNION
      (SELECT id, CONVERT(title USING utf8mb4) COLLATE utf8mb4_unicode_ci, CONVERT(slugs USING utf8mb4) COLLATE utf8mb4_unicode_ci, CONVERT('faculty' USING utf8mb4) COLLATE utf8mb4_unicode_ci, createdAt FROM faculty WHERE title LIKE :search)
      UNION
      (SELECT id, CONVERT(title USING utf8mb4) COLLATE utf8mb4_unicode_ci, CONVERT(slugs USING utf8mb4) COLLATE utf8mb4_unicode_ci, CONVERT('event' USING utf8mb4) COLLATE utf8mb4_unicode_ci, createdAt FROM events WHERE title LIKE :search)
      UNION
      (SELECT id, CONVERT(title USING utf8mb4) COLLATE utf8mb4_unicode_ci, CONVERT(slug USING utf8mb4) COLLATE utf8mb4_unicode_ci AS slugs, CONVERT('blog' USING utf8mb4) COLLATE utf8mb4_unicode_ci, createdAt FROM blogs WHERE title LIKE :search)
      UNION
      (SELECT id, CONVERT(title USING utf8mb4) COLLATE utf8mb4_unicode_ci, CONVERT(slugs USING utf8mb4) COLLATE utf8mb4_unicode_ci, CONVERT('exams' USING utf8mb4) COLLATE utf8mb4_unicode_ci, createdAt FROM exams WHERE title LIKE :search)
      UNION
      (SELECT id, CONVERT(title USING utf8mb4) COLLATE utf8mb4_unicode_ci, CONVERT(slug USING utf8mb4) COLLATE utf8mb4_unicode_ci AS slugs, CONVERT('materials' USING utf8mb4) COLLATE utf8mb4_unicode_ci, createdAt FROM materials WHERE title LIKE :search)
      UNION
      (SELECT id, CONVERT(fullname USING utf8mb4) COLLATE utf8mb4_unicode_ci, CONVERT(slugs USING utf8mb4) COLLATE utf8mb4_unicode_ci, CONVERT('university' USING utf8mb4) COLLATE utf8mb4_unicode_ci, createdAt  FROM university WHERE fullname LIKE :search)
      UNION
      (SELECT id, CONVERT(title USING utf8mb4) COLLATE utf8mb4_unicode_ci, CONVERT(slug USING utf8mb4) COLLATE utf8mb4_unicode_ci AS slugs, CONVERT('news' USING utf8mb4) COLLATE utf8mb4_unicode_ci, createdAt FROM news WHERE title LIKE :search)
      ORDER BY createdAt DESC;
      `,
      {
        replacements: { search: `%${searchQuery}%` },
        type: QueryTypes.SELECT,
      }
    );

    return {
      colleges: searchResults.filter((item) => item.type === "colleges"),
      faculty: searchResults.filter((item) => item.type === "faculty"),
      events: searchResults.filter((item) => item.type === "event"),
      blogs: searchResults.filter((item) => item.type === "blog"),
      exams: searchResults.filter((item) => item.type === "exams"),
      materials: searchResults.filter((item) => item.type === "materials"),
      university: searchResults.filter((item) => item.type === "university"),
      news: searchResults.filter((item) => item.type === "news"),
    };
  }
}

export default HomeService;
