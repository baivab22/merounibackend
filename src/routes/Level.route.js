import express from "express";

import LevelController from "../controllers/level/Level.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  levelSlugParamSchema,
  createLevelSchema,
  updateLevelQuerySchema,
  updateLevelBodySchema,
  deleteLevelQuerySchema,
} from "../validators/level/Level.validator.js";

const route = express.Router();

/**
 * @swagger
 * /level:
 *   get:
 *     summary: List all education levels with pagination
 *     tags: [Levels]
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
 *         description: List of levels
 */
route.get(
  "/",
  requestValidator(paginationSchema, "query"),
  LevelController.listLevels
);

/**
 * @swagger
 * /level/{slugs}:
 *   get:
 *     summary: Get level by slug
 *     tags: [Levels]
 *     parameters:
 *       - in: path
 *         name: slugs
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Level details
 *       404:
 *         description: Level not found
 */
route.get(
  "/:slugs",
  requestValidator(levelSlugParamSchema, "params"),
  LevelController.getLevel
);

/**
 * @swagger
 * /level:
 *   post:
 *     summary: Create a new education level
 *     tags: [Levels]
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
 *             properties:
 *               title:
 *                 type: string
 *                 example: Bachelor's Degree
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Level created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
route.post(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(createLevelSchema, "body"),
  LevelController.createLevel
);

/**
 * @swagger
 * /level:
 *   delete:
 *     summary: Delete an education level (Admin only)
 *     tags: [Levels]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: level_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Level deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Level not found
 */
route.delete(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(deleteLevelQuerySchema, "query"),
  LevelController.deleteLevel
);

/**
 * @swagger
 * /level:
 *   put:
 *     summary: Update an education level
 *     tags: [Levels]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: level_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Level updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Level not found
 */
route.put(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidatorMultiple([
    { schema: updateLevelQuerySchema, property: "query" },
    { schema: updateLevelBodySchema, property: "body" },
  ]),
  LevelController.updateLevel
);

export default route;
