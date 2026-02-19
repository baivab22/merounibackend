import express from "express";
import DatabaseController from "../controllers/database/Database.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

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

export default router;
