import Scholarship from "../model/ScholarshipModel.js";

export const createScholarship = async (req, res) => {
  try {
    const newScholarship = await Scholarship.create(req.body);
    res
      .status(201)
      .json({ message: "Scholarship created", scholarship: newScholarship });
  } catch (error) {
    console.error("Error creating scholarship:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
