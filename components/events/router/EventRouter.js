import express from "express";
import {
  getEvents,
  getEvent,
  getEventsThisWeek,
  getEventsNextMonth,
} from "../controllers/GetController.js";
import { createOrUpdateEvent } from "../controllers/CreateOrUpdateEvent.js";
import { deleteEvent } from "../controllers/DeleteEvent.js";

// authorized middleware
import { authenticateUser } from "../../../middleware/AuthMiddleware.js";
import { authorizeRole } from "../../../middleware/AuthorizeRole.js";

const router = express.Router();

router
  .get("/", getEvents)
  .get("/this-week", getEventsThisWeek)
  .get("/next-month", getEventsNextMonth)
  .get("/:slugs", getEvent)
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor", "agent"]),
    createOrUpdateEvent
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    deleteEvent
  );

export default router;
