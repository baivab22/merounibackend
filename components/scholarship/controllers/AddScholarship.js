import slug from "slug";
import Scholarship from "../model/ScholarshipModel.js";

export const createScholarship = async (req, res) => {
  try {
    let {
      name,
      description,
      eligibilityCriteria,
      amount,
      applicationDeadline,
      renewalCriteria,
      contactInfo,
      author,
    } = req.body;
    const newScholarship = await Scholarship.create({
      name,
      slugs: slug(name),
      description,
      eligibilityCriteria,
      amount,
      applicationDeadline,
      renewalCriteria,
      contactInfo,
      author,
    });
    res
      .status(201)
      .json({ message: "Scholarship created", scholarship: newScholarship });
  } catch (error) {
    console.error("Error creating scholarship:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
