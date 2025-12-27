import express from "express";

import EventController from "../controllers/event/Event.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  eventSlugParamSchema,
  createOrUpdateEventSchema,
  deleteEventQuerySchema,
} from "../validators/event/Event.validator.js";

const router = express.Router();

router
  .get(
    "/",
    requestValidator(paginationSchema, "query"),
    EventController.listEvents
  )
  .get(
    "/this-week",
    requestValidator(paginationSchema, "query"),
    EventController.getEventsThisWeek
  )
  .get(
    "/next-month",
    requestValidator(paginationSchema, "query"),
    EventController.getEventsNextMonth
  )
  .get(
    "/:slugs",
    requestValidator(eventSlugParamSchema, "params"),
    EventController.getEvent
  )
  .post(
    "/",
    authenticateUser,
    authorizeRole(["admin", "editor", "agent"]),
    requestValidator(createOrUpdateEventSchema, "body"),
    EventController.createOrUpdateEvent
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["admin"]),
    requestValidator(deleteEventQuerySchema, "query"),
    EventController.deleteEvent
  );

export default router;
