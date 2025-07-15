import slug from "slug";
import Faculty from "../model/FacultyModel.js";

export const createFaculty = async (req, res) => {
  try {
    const { title, description, featured_image, author } = req.body;

    await Faculty.create({
      title,
      slugs: slug(title),
      description,
      author,
      featured_image,
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
