import { sequelize } from "../../../config/database.js";

export const listAllUniversities = async (req, res) => {
  try {
    const items = await sequelize.query(`SELECT * FROM university`, {
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      message : "success",
      items
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const universityProfile = async (req, res) => {
  const { slug } = req.params;

  try {
    //  Get University Data
    const [university] = await sequelize.query(
      `SELECT * FROM university WHERE slugs = ?`,
      { replacements: [slug], type: sequelize.QueryTypes.SELECT }
    );

    if (!university) return res.status(404).json({ error: "University not found" });

    let id = university.id;

    //  Get Contact Info
    const contact = await sequelize.query(
      `SELECT faxes, poboxes, email, phone_number FROM university_contact WHERE university_id = ?`,
      { replacements: [id], type: sequelize.QueryTypes.SELECT }
    );

    //  Get Levels
    const levels = await sequelize.query(
      `SELECT level_id FROM university_levels WHERE university_id = ?`,
      { replacements: [id], type: sequelize.QueryTypes.SELECT }
    );

    //  Get Members
    const members = await sequelize.query(
      `SELECT role, salutation, name, phone, email FROM university_members WHERE university_id = ?`,
      { replacements: [id], type: sequelize.QueryTypes.SELECT }
    );

    //  Get Assets
    const [assets] = await sequelize.query(
      `SELECT featured_image, videos FROM university_assets WHERE university_id = ?`,
      { replacements: [id], type: sequelize.QueryTypes.SELECT }
    );

    //  Get Gallery Images
    const gallery = await sequelize.query(
      `SELECT image_url FROM university_gallery WHERE university_id = ?`,
      { replacements: [id], type: sequelize.QueryTypes.SELECT }
    );

    // Combine All Data
    const universityData = {
      ...university,
      contact: contact[0] || null,
      levels: levels.map(level => level.level_id),
      members,
      assets: assets || null,
      gallery: gallery.map(img => img.image_url),
    };

    res.status(200).json(universityData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

