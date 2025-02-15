import { Exam } from "../model/ExamModel.js";

export const deleteExam = async (req, res) => {
  try {
    const deletedRows = await Exam.destroy({
      where: { id: req.params.id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json({ message: "Exam deleted" });
  } catch (error) {
    console.error("Error deleting Exam:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
