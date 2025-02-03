import slug from "slug";
import Course from "../model/CourseModel.js";

export const createCourse = async (req, res) => {
  try {
    const { title, ...rest } = req.body;

    const slugs = slug(title);
    const course = await Course.create({ ...rest, title, slugs });
    res.status(201).json({ message: "success", course });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Failed to create course" });
  }
};
