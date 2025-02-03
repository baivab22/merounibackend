import Tag from "../model/LevelModel.js";
import slug from "slug";

export const createLevel = async (req, res) => {
  try {
    const { title, author } = req.body;
    const slugs = slug(title);

    let item = await Tag.create({ title, slugs, author });
    res.status(201).json({ message: "Level created", item });
  } catch (error) {
    console.error("Error creating level:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
