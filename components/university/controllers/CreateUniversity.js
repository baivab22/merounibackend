import slug from "slug";
import { sequelize } from "../../../config/database.js";
import {
  University,
  UniversityContact,
  UniversityLevel,
  UniversityMember,
  UniversityAsset,
  UniversityGallery,
} from "../../university/model/UniversityModel.js";

export const createOrUpdateUniversity = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      id,
      fullname,
      country,
      state,
      city,
      street,
      postal_code,
      date_of_establish,
      type_of_institute,
      description,
      contact,
      levels,
      author_id,
      members,
      assets,
      gallery,
    } = req.body;

    const slugs = slug(fullname);

    let university;

    if (id) {
      // Update
      university = await University.update(
        {
          fullname,
          slugs,
          country,
          state,
          city,
          street,
          postal_code,
          author_id,
          date_of_establish,
          type_of_institute,
          description,
        },
        { where: { id }, transaction: t }
      );
      university = await University.findByPk(id, { transaction: t }); // Get the updated instance
    } else {
      // Create
      university = await University.create(
        {
          fullname,
          slugs,
          country,
          state,
          city,
          street,
          postal_code,
          author_id,
          date_of_establish,
          type_of_institute,
          description,
        },
        { transaction: t }
      );
    }

    if (contact) {
      await UniversityContact.upsert(
        {
          // Use upsert for insert/update
          university_id: university.id, // Crucial: Use the university instance's ID
          ...contact, // Spread the contact data
        },
        { transaction: t }
      );
    }

    if (levels?.length) {
      await UniversityLevel.destroy({
        where: { university_id: university.id },
        transaction: t,
      });
      await UniversityLevel.bulkCreate(
        levels.map((level_id) => ({
          university_id: university.id,
          level_id,
        })),
        { transaction: t }
      );
    }

    if (members?.length) {
      await UniversityMember.destroy({
        where: { university_id: university.id },
        transaction: t,
      });
      await UniversityMember.bulkCreate(
        members.map((member) => ({
          university_id: university.id,
          ...member,
        })),
        { transaction: t }
      );
    }

    if (assets) {
      await UniversityAsset.upsert(
        {
          university_id: university.id,
          ...assets,
        },
        { transaction: t }
      );
    }

    if (gallery?.length) {
      await UniversityGallery.destroy({
        where: { university_id: university.id },
        transaction: t,
      });
      await UniversityGallery.bulkCreate(
        gallery.map((image_url) => ({
          university_id: university.id,
          image_url,
        })),
        { transaction: t }
      );
    }

    await t.commit();
    res.status(200).json({
      message:         !id || id === "null" || id === "undefined" || id === ""
        ? "University updated successfully!"
        : "University created successfully!",
      universityId: university.id, // Access the ID from the university instance
    });
  } catch (error) {
    await t.rollback();
    console.error("Transaction error:", error); // Log the full error for debugging
    res.status(500).json({ error: error.message }); // Send error message to client
  }
};
