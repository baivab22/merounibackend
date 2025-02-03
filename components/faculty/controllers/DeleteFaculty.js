import Faculty from "../model/FacultyModel.js";

export const deleteFaculty = async (req, res) => {
  try {
    const deletedRows = await Faculty.destroy({
      where: { id: req.query.faculty_id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(204).json({ message: "Faculty deleted" });
  } catch (error) {
    console.error("Error deleting faculty:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
