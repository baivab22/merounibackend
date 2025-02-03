import CareerModel from "../model/CareerModel.js";
import slug from "slug";

export const createCareer = async (req, res) => {
  try {
    const { title, author_id, featuredImage, description, content } = req.body;
    const slugs = slug(title);

    let item = await CareerModel.create({
      title,
      slugs,
      author_id,
      description,
      content,
      featuredImage,
    });
    res.status(201).json({ message: "Career created", item });
  } catch (error) {
    console.error("Error creating tag:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
