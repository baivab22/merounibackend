import express from "express";

import AnalyticsController from "../controllers/analytics/Analytics.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const route = express.Router();

/**
 * @swagger
 * /analytics/admin-overview:
 *   get:
 *     summary: Get admin dashboard analytics overview
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: years
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         description: Filter by years (can specify multiple)
 *         style: form
 *         explode: true
 *     responses:
 *       200:
 *         description: Analytics data including user counts, enrollment growth, etc.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                     totalColleges:
 *                       type: integer
 *                     totalUniversities:
 *                       type: integer
 *                     studentEnrollmentGrowth:
 *                       type: array
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
route.get(
  "/admin-overview",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  AnalyticsController.getAdminOverview
);

export default route;
