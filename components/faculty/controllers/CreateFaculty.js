import slug from "slug";
import Faculty from "../model/FacultyModel.js";

export const createFaculty = async (req, res) => {
  try {
    const { title, description, author } = req.body;

    await Faculty.create({
      title,
      slugs: slug(title),
      description,
      author,
    });

    return res.status(201).json({
      message: "Faculty created",
    });
  } catch (error) {
    console.error("Error creating faculty:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
