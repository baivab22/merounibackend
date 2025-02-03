import Scholarship from "../model/ScholarshipModel.js";

export const deleteScholarship = async (req, res) => {
  try {
    const deletedRows = await Scholarship.destroy({
      where: { id: req.query.scholarship_id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Scholarship not found" });
    }
    res.status(204).json({ message: "Scholarship deleted" });
  } catch (error) {
    console.error("Error deleting scholarship:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
