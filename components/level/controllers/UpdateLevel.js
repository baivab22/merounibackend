import Level from "../model/LevelModel.js";
import slug from "slug";

export const updateTag = async (req, res) => {
  try {
    const { level_id } = req.query;
    const { title, author } = req.body;

    const level = await Level.findByPk(level_id);
    if (!level) {
      return res.status(404).json({ message: "Level not found" });
    }

    let updatedSlug = level.slugs;
    if (title !== level.title) {
      updatedSlug = slug(title);
    }

    const [updatedRows] = await Level.update(
      { title, author, slugs: updatedSlug },
      { where: { id:level_id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Level is upto Date" });
    }

    res.status(200).json({ message: "Level updated" });
  } catch (error) {
    console.error("Error updating level:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
