import Courses from "../model/CourseModel.js";

export const deleteCourses = async (req, res) => {
  try {
    const deletedRows = await Courses.destroy({
      where: { id: req.query.id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Courses not found" });
    }
    res.status(204).json({ message: "Courses deleted" });
  } catch (error) {
    console.error("Error deleting Courses:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
