import Material from '../models/MaterialModel.js';
import slug from 'slug';

// Create
export const createMaterial = async (req, res) => {
  try {
    const { title, tags, image, file, author, status, visibility } = req.body;

    const newMaterial = await Material.create({
      title,
      slug: slug(title),
      tags,
      image,
      file,
      author,
      status,
      visibility,
    });

    res.status(201).json({ message: 'Material created', material: newMaterial });
  } catch (error) {
    console.error("Error creating material:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};