import CareerModel from "../model/CareerModel.js";
import slug from "slug";

export const updateCareer = async (req, res) => {
  try {
    const { id } = req.query;
    const { title, author_id, featuredImage, description, content } = req.body;

    // Find the career entry by ID
    let career = await CareerModel.findByPk(id);
    if (!career) {
      return res.status(404).json({ message: "Career not found" });
    }

    // Update slug if the title changes
    const slugs = title ? slug(title) : career.slugs;

    // Update career entry
    await career.update({
      title: title || career.title,
      slugs,
      author_id: author_id || career.author_id,
      description: description || career.description,
      content: content || career.content,
      featuredImage: featuredImage || career.featuredImage,
    });

    res.status(200).json({ message: "Career updated successfully", career });
  } catch (error) {
    console.error("Error updating career:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
