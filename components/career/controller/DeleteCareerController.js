import CareerModel from "../model/CareerModel.js";

export const deleteCareer = async (req, res) => {
  try {
    const deletedRows = await CareerModel.destroy({
      where: { id: req.query.id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Career not found" });
    }
    res.status(200).json({ message: "Career deleted" });
  } catch (error) {
    console.error("Error deleting Career:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
