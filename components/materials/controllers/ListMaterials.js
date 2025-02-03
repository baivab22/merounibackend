import Material from "../models/MaterialModel.js";

export const getAllMaterials = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
  
      const { count: totalCount, rows: materials } = await Material.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });
  
      const totalPages = Math.ceil(totalCount / limit);
      res.status(200).json({
        message: 'Materials retrieved',
        materials,
        pagination: { currentPage: page, totalPages, limit, totalCount },
      });
    } catch (error) {
      console.error("Error getting materials:", error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  // Get One by ID
  export const getMaterialById = async (req, res) => {
    try {
      const material = await Material.findByPk(req.params.id);
      if (!material) {
        return res.status(404).json({ message: 'Material not found' });
      }
      res.status(200).json({ message: 'Material retrieved', material });
    } catch (error) {
      console.error("Error getting material by ID:", error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };