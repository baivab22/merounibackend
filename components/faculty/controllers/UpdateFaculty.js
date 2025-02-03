import slug from "slug";
import Faculty from "../model/FacultyModel.js";

export const updateFaculty = async (req, res) => {
  try {
    let { faculty_id } = req.query;
    let { title, description, author } = req.body;

    let faculty = Faculty.findByPk(faculty_id);

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    let updatedSlug = faculty.slugs;
    if (title !== faculty.title) {
      updatedSlug = slug(title);
    }

    let items = await Faculty.update(
      { title, slugs:updatedSlug, description, author },
      {
        where: { id: faculty_id },
      }
    );

    if (items === 0) {
      return res.status(404).json({ message: "Faculty already upto date" });
    }

    return res.status(200).json({ message: "Faculty updated" });
  } catch (error) {
    console.error("Error updating Faculty:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
