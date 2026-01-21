import EventService from "../../services/event/Event.service.js";

const eventService = new EventService();

class EventController {
  static async createOrUpdateEvent(req, res) {
    try {
      console.log("[EventController] createOrUpdateEvent called");
      console.log(
        "[EventController] req.body:",
        JSON.stringify(req.body, null, 2)
      );
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
      console.log("req.body:", JSON.stringify(req.body));
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

  // for website, to show all the un expired events.
  static async getUnExpiredEvents(req, res) {
    try {
      const { events, pagination } = await eventService.getUnExpiredEvents(
        req.query
      );
      return res.status(200).json({
        message: "Un expired events retrieved",
        items: events,
        pagination,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  // for admin dashboard, to show all the events.
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

  // for website, to show events happening this week.
  static async getThisWeekEvents(req, res) {
    try {
      const { events, pagination } = await eventService.getThisWeekEvents(
        req.query
      );
      return res.status(200).json({
        message: "This week events retrieved",
        items: events,
        pagination,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  // for website, to show events happening next month.
  static async getNextMonthEvents(req, res) {
    try {
      const { events, pagination } = await eventService.getNextMonthEvents(
        req.query
      );
      return res.status(200).json({
        message: "Next month events retrieved",
        items: events,
        pagination,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }
}

export default EventController;
