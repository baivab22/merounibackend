import express from "express";

import ProgramController from "../controllers/program/Program.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  createOrUpdateProgramSchema,
  programIdParamSchema,
  programSlugParamSchema
} from "../validators/program/Program.validator.js";

const router = express.Router();

/**
 * @swagger
 * /program:
 *   get:
 *     summary: List all programs with pagination
 *     tags: [Programs]
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
 *       - in: query
 *         name: universityId
 *         schema:
 *           type: string
 *         description: Filter by university ID (can be multiple IDs comma separated)
 *     responses:
 *       200:
 *         description: List of programs
 */
router.get(
  "/",
  // requestValidator(paginationSchema, "query"),
  ProgramController.listPrograms
);

/**
 * @swagger
 * /program/filter:
 *   post:
 *     summary: List all programs with filtering via body
 *     tags: [Programs]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               universityId:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: List of programs
 */
router.post("/filter", ProgramController.listPrograms);

/**
 * @swagger
 * /program/{slugs}:
 *   get:
 *     summary: Get program by slug
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: slugs
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Program details
 *       404:
 *         description: Program not found
 */
router.get(
  "/:slugs",
  requestValidator(programSlugParamSchema, "params"),
  ProgramController.getProgram
);

/**
 * @swagger
 * /program:
 *   post:
 *     summary: Create or update a program
 *     tags: [Programs]
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
 *               - level_id
 *             properties:
 *               title:
 *                 type: string
 *                 example: Bachelor of Computer Science
 *               description:
 *                 type: string
 *               level_id:
 *                 type: integer
 *               course_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *               universities:
 *                 type: array
 *                 description: List of university IDs to associate with this program
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Program created/updated successfully
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
  requestValidator(createOrUpdateProgramSchema, "body"),
  ProgramController.createOrUpdateProgram
);

/**
 * @swagger
 * /program/{id}:
 *   delete:
 *     summary: Delete a program
 *     tags: [Programs]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Program deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Program not found
 */
router.delete(
  "/:id",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(programIdParamSchema, "params"),
  ProgramController.deleteProgram
);

export default router;
