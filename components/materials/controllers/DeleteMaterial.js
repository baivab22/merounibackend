import Material from "../models/MaterialModel.js";

export const deleteMaterial = async (req, res) => {
  try {
    const deletedRows = await Material.destroy({
      where: { id: req.query.id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.status(200).json({ message: "Material deleted" });
  } catch (error) {
    console.error("Error deleting material:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
