import express from "express";

import NewsletterController from "../controllers/newsletter/Newsletter.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  createNewsletterSchema,
} from "../validators/newsletter/Newsletter.validator.js";

const route = express.Router();

/**
 * @swagger
 * /newsletter:
 *   get:
 *     summary: List all newsletter subscriptions with pagination
 *     tags: [Newsletter]
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
 *         description: List of newsletter subscriptions
 */
route.get(
  "/",
  requestValidator(paginationSchema, "query"),
  NewsletterController.listNewsletter
);

/**
 * @swagger
 * /newsletter:
 *   post:
 *     summary: Subscribe to newsletter
 *     tags: [Newsletter]
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
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: subscriber@example.com
 *     responses:
 *       201:
 *         description: Successfully subscribed to newsletter
 *       400:
 *         description: Bad request (email already exists)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
route.post(
  "/",
  // authenticateUser,
  // authorizeRole(["admin", "editor"]),
  requestValidator(createNewsletterSchema, "body"),
  NewsletterController.createNewsletter
);
//   .delete(
//     "/",
//     authenticateUser,
//     authorizeRole(["admin"]),
//     deleteMaterial
//   )
//   .put(
//     "/",
//     authenticateUser,
//     authorizeRole(["admin", "editor"]),
//     updateMaterial
//   );

export default route;
