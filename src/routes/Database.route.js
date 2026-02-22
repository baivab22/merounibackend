import express from "express";
import DatabaseController from "../controllers/database/Database.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
    listDownloadsSchema,
    trackDownloadSchema,
} from "../validators/database/Database.validator.js";

const router = express.Router();

/**
 * @swagger
 * /database/export:
 *   get:
 *     summary: Export all database data to a SQL file (admin only)
 *     tags: [Database]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: SQL file download
 *         content:
 *           application/sql:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get(
    "/export",
    authenticateUser,
    authorizeRole(["admin"]),
    DatabaseController.exportSql
);

/**
 * @swagger
 * /database/downloads:
 *   get:
 *     summary: List all downloads (admin only)
 *     tags: [Database]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
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
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by download type
 *     responses:
 *       200:
 *         description: List of downloads
 */
router.get(
    "/downloads",
    authenticateUser,
    authorizeRole(["admin"]),
    requestValidator(listDownloadsSchema, "query"),
    DatabaseController.listDownloads
);

/**
 * @swagger
 * /database/status:
 *   get:
 *     summary: Get database status and size (admin only)
 *     tags: [Database]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Database status details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
    "/status",
    authenticateUser,
    authorizeRole(["admin"]),
    DatabaseController.getDbStatus
);

export default router;
