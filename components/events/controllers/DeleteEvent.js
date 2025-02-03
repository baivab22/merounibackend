import Event from "../model/EventModel.js";

// Delete College
export const deleteEvent = async (req, res) => {
  try {
    let { event_id } = req.query;
    const college = await Event.findByPk(event_id);
    if (!college) return res.status(404).json({ error: "Event not found" });

    await college.destroy();
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
