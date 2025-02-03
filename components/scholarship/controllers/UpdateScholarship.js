import Scholarship from "../model/ScholarshipModel.js";

export const updateScholarship = async (req, res) => {
  try {
    const { scholarship_id: id } = req.query;
    const [updatedRows] = await Scholarship.update(req.body, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Scholarship not found" });
    }

    const updatedScholarship = await Scholarship.findByPk(id);
    res.status(200).json({
      message: "Scholarship updated",
      scholarship: updatedScholarship,
    });
  } catch (error) {
    console.error("Error updating scholarship:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
