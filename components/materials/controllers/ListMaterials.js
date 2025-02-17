import { Op } from "sequelize";
import Tag from "../../tags/model/TagModel.js";
import Material from "../models/MaterialModel.js";

export const getAllMaterials = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const searchQuery = req.query.q || "";

    let whereCondition = {};
    if (searchQuery) {
      whereCondition = {
        title: { [Op.like]: `%${searchQuery}%` },
      };
    }

    const { count: totalCount, rows: materials } =
      await Material.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

    const totalPages = Math.ceil(totalCount / limit);
    res.status(200).json({
      message: "Materials retrieved",
      materials,
      pagination: { currentPage: page, totalPages, limit, totalCount },
    });
  } catch (error) {
    console.error("Error getting materials:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    // Parse the tags JSON string into an array
    const tagIds = JSON.parse(material.tags);

    // Fetch tags from the database
    const tags = await Tag.findAll({
      where: { id: tagIds },
      attributes: ['title'], 
    });

    res.status(200).json({
      message: "Material retrieved",
      material: {
        ...material.toJSON(),
        tags,
      },
    });
  } catch (error) {
    console.error("Error getting material by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};