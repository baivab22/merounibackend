import Material from "../models/MaterialModel.js"
import slug from "slug";

export const updateMaterial = async (req, res) => {
    try {
      const { id } = req.query;
      const { title, tags, image, file, author, status, visibility } = req.body;
  
      const material = await Material.findByPk(id);
      if (!material) {
        return res.status(404).json({ message: 'Material not found' });
      }
  
      let updatedSlug = material.slug;
      if (title && title !== material.title) {
        updatedSlug = slug(title);
      }
  
      const [updatedRows] = await Material.update(
        { title, slug: updatedSlug, tags, image, file, author, status, visibility },
        { where: { id } }
      );
  
      if (updatedRows === 0) {
        return res.status(404).json({ message: "Material not found" }); // Or "No changes made"
      }
  
      const updatedMaterial = await Material.findByPk(id);
      res.status(200).json({ message: 'Material updated', material: updatedMaterial });
    } catch (error) {
      console.error("Error updating material:", error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };