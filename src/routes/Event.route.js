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

/**
 * @swagger
 * /event:
 *   get:
 *     summary: List all events with pagination
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of events
 *       500:
 *         description: Server error
 */
router.get(
  "/",
  requestValidator(paginationSchema, "query"),
  EventController.listEvents
);

/**
 * @swagger
 * /event/unexpired:
 *   get:
 *     summary: Get all unexpired events (for website homepage)
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of unexpired events
 *       500:
 *         description: Server error
 */
router.get(
  "/unexpired",
  requestValidator(paginationSchema, "query"),
  EventController.getUnExpiredEvents
);

/**
 * @swagger
 * /event/this-week:
 *   get:
 *     summary: Get events happening this week (Monday to Sunday)
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of events happening this week
 *       500:
 *         description: Server error
 */
router.get(
  "/this-week",
  requestValidator(paginationSchema, "query"),
  EventController.getThisWeekEvents
);

/**
 * @swagger
 * /event/next-month:
 *   get:
 *     summary: Get events happening next month (first day to last day of next month)
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of events happening next month
 *       500:
 *         description: Server error
 */
router.get(
  "/next-month",
  requestValidator(paginationSchema, "query"),
  EventController.getNextMonthEvents
);

/**
 * @swagger
 * /event/{slugs}:
 *   get:
 *     summary: Get event by slug
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: slugs
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 */
router.get(
  "/:slugs",
  requestValidator(eventSlugParamSchema, "params"),
  EventController.getEvent
);

/**
 * @swagger
 * /event:
 *   post:
 *     summary: Create or update an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - startDate
 *               - endDate
 *             properties:
 *               title:
 *                 type: string
 *                 example: Tech Conference 2024
 *               description:
 *                 type: string
 *                 example: Annual technology conference
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               is_featured:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Event created/updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor", "agent"]),
  requestValidator(createOrUpdateEventSchema, "body"),
  EventController.createOrUpdateEvent
);

/**
 * @swagger
 * /event:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: event_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Event not found
 */
router.delete(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(deleteEventQuerySchema, "query"),
  EventController.deleteEvent
);

export default router;
