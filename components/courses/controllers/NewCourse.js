// import slug from "slug";
// import Course from "../model/CourseModel.js";

// export const createCourse = async (req, res) => {
//   try {
//     const { title, ...rest } = req.body;

//     const slugs = slug(title);
//     const course = await Course.create({ ...rest, title, slugs });
//     res.status(201).json({ message: "success", course });
//   } catch (error) {
//     console.error("Error creating course:", error);
//     res.status(500).json({ error: "Failed to create course" });
//   }
// };

import slug from "slug";
import Course from "../model/CourseModel.js";

export const createCourse = async (req, res) => {
  try {
    const { id, title, ...rest } = req.body;
    const slugs = slug(title);

    if (!id) {
      // Create new course
      const course = await Course.create({ ...rest, title, slugs });
      return res
        .status(201)
        .json({ message: "Course created successfully", course });
    } else {
      // Update existing course
      const course = await Course.findByPk(id);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      await Course.update({ ...rest, title, slugs }, { where: { id } });

      return res.status(200).json({ message: "Course updated successfully" });
    }
  } catch (error) {
    console.error("Error in createOrUpdateCourse:", error);
    return res.status(500).json({ error: "Failed to process request" });
  }
};
