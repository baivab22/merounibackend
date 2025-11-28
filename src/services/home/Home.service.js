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
      (SELECT id, name, slugs, 'colleges' AS type, createdAt FROM colleges WHERE name LIKE :search)
      UNION
      (SELECT id, title, slugs, 'faculty' AS type, createdAt FROM faculty WHERE title LIKE :search)
      UNION
      (SELECT id, title, slugs, 'event' AS type, createdAt FROM events WHERE title LIKE :search)
      UNION
      (SELECT id, title, slug, 'blog' AS type, createdAt FROM blogs WHERE title LIKE :search)
      UNION
      (SELECT id, title, slugs, 'exams' AS type, createdAt FROM exams WHERE title LIKE :search)
      UNION
      (SELECT id, title, slug, 'materials' AS type, createdAt FROM materials WHERE title LIKE :search)
      UNION
      (SELECT id, fullname, slugs, 'university' AS type, createdAt  FROM university WHERE fullname LIKE :search)
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
    };
  }
}

export default HomeService;
