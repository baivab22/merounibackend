import EventService from "../../services/event/Event.service.js";

const eventService = new EventService();

class EventController {
  static async createOrUpdateEvent(req, res) {
    try {
      const { eventId, isNew } = await eventService.createOrUpdateEvent(
        req.body
      );
      return res.status(200).json({
        message: isNew
          ? "Event created successfully!"
          : "Event updated successfully!",
        eventId,
      });
    } catch (error) {
      console.error("Error creating/updating event:", error);
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Server error" });
    }
  }

  static async deleteEvent(req, res) {
    try {
      const { event_id } = req.query;
      await eventService.deleteEvent(event_id);
      return res.status(200).json({ message: "Event deleted" });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Server error" });
    }
  }

  static async getEvent(req, res) {
    try {
      const item = await eventService.getEvent(req.params.slugs);

      return res.status(200).json({ message: "Event retrieved", item });
    } catch (error) {
      console.error("Error getting event by ID:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async listEvents(req, res) {
    try {
      const { items, pagination } = await eventService.listEvents(req.query);
      return res.status(200).json({
        message: "success",
        items,
        pagination,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getEventsThisWeek(req, res) {
    try {
      const { events, pagination } = await eventService.listEventsThisWeek(
        req.query
      );

      return res.status(200).json({
        message: "success",
        events,
        pagination,
      });
    } catch (error) {
      console.error("Error in getEventsThisWeek:", error);
      return res.status(500).json({
        message: `Server Error: ${error.message}`,
      });
    }
  }

  static async getEventsNextMonth(req, res) {
    try {
      const { events, pagination } = await eventService.listEventsNextMonth(
        req.query
      );

      return res.status(200).json({
        message: "success",
        events,
        pagination,
      });
    } catch (error) {
      console.error("Error in getEventsNextMonth:", error);
      return res.status(500).json({
        message: `Server Error: ${error.message}`,
      });
    }
  }
}

export default EventController;
