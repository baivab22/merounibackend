import Level from "../model/LevelModel.js";

export const deleteLevel = async (req, res) => {
  try {
    const deletedRows = await Level.destroy({ where: { id: req.query.id } });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Level not found" });
    }
    res.status(200).json({ message: "Level deleted" });
  } catch (error) {
    console.error("Error deleting level:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
