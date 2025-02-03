import { sequelize } from "../../../config/database.js";

export const deleteUniversity = async (req, res) => {
  const { id } = req.query;

  try {
    await sequelize.query(`DELETE FROM university WHERE id=?`, {
      replacements: [id],
    });
    res.status(200).json({ message: "University deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
