import { sequelize } from "../../../config/database.js";
import { Op } from "sequelize";

export const searchController = async (req, res) => {
  try {
    let searchQuery = req.query.q || ""; // Get search query

    if (!searchQuery) {
      return res.status(400).json({ message: "Search query is required." });
    }

    // Raw SQL query using UNION to combine results from both tables
    const searchResults = await sequelize.query(
      `
      (SELECT id, name, slugs, 'colleges' AS type, createdAt FROM colleges WHERE name LIKE :search)
      UNION
      (SELECT id, title, slug, 'blog' AS type, createdAt FROM blogs WHERE title LIKE :search)
      UNION
      (SELECT id, title, slugs, 'event' AS type, createdAt FROM events WHERE title LIKE :search)
      ORDER BY createdAt DESC;
      `,
      {
        replacements: { search: `%${searchQuery}%` },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Separate blogs and events
    const colleges = searchResults.filter((item) => item.type === "colleges");
    const blogs = searchResults.filter((item) => item.type === "blog");
    const events = searchResults.filter((item) => item.type === "event");

    return res.status(200).json({
      message: "Search results retrieved",
      blogs,
      events,
      colleges,
    });
  } catch (error) {
    console.error("Error searching Blogs and Events:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
