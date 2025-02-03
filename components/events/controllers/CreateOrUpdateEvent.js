import { sequelize } from "../../../config/database.js";
import Event from "../model/EventModel.js";
import slug from 'slug'; 

export const createOrUpdateEvent = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      id,
      title,
      description,
      content,  // Added content
      image, // Added image
      category_id, // Make sure you have category model and table
      college_id, // Make sure you have college model and table
      author_id, // Make sure you have user model and table
    } = req.body;

    console.log(req.body);

    let eventId = id;
    let slugs = slug(title);

    if (!eventId) {
      // Create Event
      const event = await Event.create(
        {
          title,
          slugs,
          description,
          content,
          image,
          category_id,
          college_id,
          author_id,
        },
        { transaction: t }
      );
      eventId = event.id;
    } else {
      // Update Event
      await Event.update(
        {
          title,
          slugs,
          description,
          content,
          image,
          category_id,
          college_id,
          author_id,
        },
        { where: { id: eventId }, transaction: t }
      );
    }

    await t.commit();
    res.status(200).json({
      message: eventId ? "Event updated successfully!" : "Event created successfully!",
      eventId,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error creating/updating event:", error); // Very important for debugging
    res.status(500).json({ error: error.message });
  }
};