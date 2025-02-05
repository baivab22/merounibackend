import express from "express";
import { getEvents, getEvent, getEventsThisWeek, getEventsNextMonth } from "../controllers/GetController.js";
import { createOrUpdateEvent } from "../controllers/CreateOrUpdateEvent.js";
import { deleteEvent } from "../controllers/DeleteEvent.js";

const router = express.Router();

router
  .get("/", getEvents)
  .get("/this-week", getEventsThisWeek)
  .get("/next-month", getEventsNextMonth)
  .get("/:slugs", getEvent)
  .post("/", createOrUpdateEvent);
router.delete("/", deleteEvent);

export default router;
