import slug from "slug";
import Consultancy from "../model/ConsultancyModel.js";
import Course from "../../courses/model/CourseModel.js";

export const createOrUpdateConsultancy = async (req, res) => {
  try {
    const { id, title, destination, address, featured_image, pinned, courses } =
      req.body;

    let slugs = slug(title);
    const parsedCourses =
      typeof courses === "string" ? JSON.parse(courses) : courses;

    if (!Array.isArray(parsedCourses)) {
      return res.status(400).json({ error: "Courses should be an array" });
    }

    for (const courseId of parsedCourses) {
      const courseExists = await Course.findByPk(courseId);
      if (!courseExists) {
        return res
          .status(400)
          .json({ error: `Invalid course ID: ${courseId}` });
      }
    }

    let consultancy;

    if (id) {
      consultancy = await Consultancy.findByPk(id);
      if (!consultancy) {
        return res.status(404).json({ error: "Consultancy not found" });
      }
      await consultancy.update({
        title,
        slugs,
        destination,
        address,
        featured_image,
        pinned,
      });
    } else {
      consultancy = await Consultancy.create({
        title,
        slugs,
        destination,
        address,
        featured_image,
        pinned,
      });
    }

    await consultancy.setConsultancyCourses(parsedCourses);

    return res
      .status(200)
      .json({ message: "Consultancy saved successfully", consultancy });
  } catch (error) {
    console.error("Error in createOrUpdateConsultancy:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
