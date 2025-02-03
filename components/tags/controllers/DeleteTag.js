import Tag from "../model/TagModel.js";

export const deleteTag = async (req, res) => {
  try {
    const deletedRows = await Tag.destroy({ where: { id: req.query.id } });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.status(204).json({ message: "Tag deleted" });
  } catch (error) {
    console.error("Error deleting tag:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
