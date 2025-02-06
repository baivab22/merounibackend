import { sequelize } from "../../../config/database.js";
import { Op } from "sequelize";

export const searchController = async (req, res) => {
  try {
    let searchQuery = req.query.q || ""; // Get search query

    if (!searchQuery) {
      return res.status(400).json({ message: "Search query is required." });
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
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Separate blogs and events
    const colleges = searchResults.filter((item) => item.type === "colleges");
    const faculty = searchResults.filter((item) => item.type === "faculty");
    const events = searchResults.filter((item) => item.type === "event");
    const blogs = searchResults.filter((item) => item.type === "blog");
    const exams = searchResults.filter((item) => item.type === "exams");
    const materials = searchResults.filter((item) => item.type === "materials");
    const university = searchResults.filter(
      (item) => item.type === "university"
    );
    // const scholarships = searchResults.filter((item) => item.type === "scholarships");

    return res.status(200).json({
      message: "Search results retrieved",
      colleges,
      faculty,
      events,
      blogs,
      exams,
      materials,
      university,
    });
  } catch (error) {
    console.error("Error searching Blogs and Events:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
