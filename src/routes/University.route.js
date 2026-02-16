import express from "express";

import UniversityController from "../controllers/university/University.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  universitySlugParamSchema,
  createOrUpdateUniversitySchema,
  deleteUniversityQuerySchema,
  universityListSchema,
} from "../validators/university/University.validator.js";

const route = express.Router();

/**
 * @swagger
 * /university:
 *   get:
 *     summary: List all universities with pagination
 *     tags: [Universities]
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
 *         description: List of universities
 */
route.get(
  "/",
  requestValidator(universityListSchema, "query"),
  UniversityController.listUniversities
);

/**
 * @swagger
 * /university/{slug}:
 *   get:
 *     summary: Get university profile by slug
 *     tags: [Universities]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: University profile details
 *       404:
 *         description: University not found
 */
route.get(
  "/:slug",
  requestValidator(universitySlugParamSchema, "params"),
  UniversityController.getUniversityProfile
);

/**
 * @swagger
 * /university:
 *   post:
 *     summary: Create or update a university
 *     tags: [Universities]
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Harvard University
 *               description:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: uri
 *     responses:
 *       201:
 *         description: University created/updated successfully
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
  requestValidator(createOrUpdateUniversitySchema, "body"),
  UniversityController.createOrUpdateUniversity
);

/**
 * @swagger
 * /university:
 *   put:
 *     summary: Update a university
 *     tags: [Universities]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/University'
 *     responses:
 *       200:
 *         description: University updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: University not found
 */
route.put(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(createOrUpdateUniversitySchema, "body"),
  UniversityController.createOrUpdateUniversity
);

/**
 * @swagger
 * /university:
 *   delete:
 *     summary: Delete a university
 *     tags: [Universities]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: university_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: University deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: University not found
 */
route.delete(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(deleteUniversityQuerySchema, "query"),
  UniversityController.deleteUniversity
);

// Update university order
route.put(
  "/order",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  UniversityController.updateUniversityOrder
);

export default route;
