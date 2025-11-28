import express from "express";

import EventController from "../controllers/event/Event.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const router = express.Router();

router
  .get("/", EventController.listEvents)
  .get("/this-week", EventController.getEventsThisWeek)
  .get("/next-month", EventController.getEventsNextMonth)
  .get("/:slugs", EventController.getEvent)
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor", "agent"]),
    EventController.createOrUpdateEvent
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    EventController.deleteEvent
  );

export default router;
