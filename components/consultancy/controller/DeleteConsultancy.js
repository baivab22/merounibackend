import Consultancy from "../model/ConsultancyModel.js";

export const deleteConsultancy = async (req, res) => {
  try {
    const { id } = req.query;

    // Check if the consultancy exists
    const consultancy = await Consultancy.findByPk(id);
    if (!consultancy) {
      return res.status(404).json({ error: "Consultancy not found" });
    }

    // Delete the consultancy
    await consultancy.destroy();

    return res
      .status(200)
      .json({ message: "Consultancy deleted successfully" });
  } catch (error) {
    console.error("Error deleting consultancy:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
