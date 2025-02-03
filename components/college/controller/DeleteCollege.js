import College from "../models/CollegeModel.js";

// Delete College
export const deleteCollege = async (req, res) => {
  try {
    const college = await College.findByPk(req.params.id);
    if (!college) return res.status(404).json({ error: "College not found" });

    await college.destroy();
    res.status(200).json({ message: "College deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
