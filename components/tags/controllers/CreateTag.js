import Tag from "../model/TagModel.js";
import slug from "slug";

export const createTag = async (req, res) => {
  try {
    const { title, author } = req.body;
    const slugs = slug(title);

    let item = await Tag.create({ title, slugs, author });
    res.status(201).json({ message: "Tag created", item });
  } catch (error) {
    console.error("Error creating tag:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
