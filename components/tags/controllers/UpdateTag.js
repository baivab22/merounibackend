import Tag from "../model/TagModel.js";
import slug from "slug";

export const updateTag = async (req, res) => {
  try {
    const { tag_id } = req.query;
    const { title, author } = req.body;

    const tag = await Tag.findByPk(tag_id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    let updatedSlug = tag.slugs;
    if (title !== tag.title) {
      updatedSlug = slug(title);
    }

    const [updatedRows] = await Tag.update(
      { title, author, slugs: updatedSlug },
      { where: { id:tag_id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Tag is upto Date" });
    }

    res.status(200).json({ message: "Tag updated" });
  } catch (error) {
    console.error("Error updating tag:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
