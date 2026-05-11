import express from "express";

import FacultyController from "../controllers/faculty/Faculty.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  facultySlugParamSchema,
  createFacultySchema,
  updateFacultyQuerySchema,
  updateFacultyBodySchema,
  deleteFacultyQuerySchema,
} from "../validators/faculty/Faculty.validator.js";

const route = express.Router();

/**
 * @swagger
 * /faculty:
 *   get:
 *     summary: List all faculties with pagination
 *     tags: [Faculties]
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
 *         description: List of faculties
 */
route.get(
  "/",
  requestValidator(paginationSchema, "query"),
  FacultyController.listFaculty
);

/**
 * @swagger
 * /faculty/{slug}:
 *   get:
 *     summary: Get faculty by slug
 *     tags: [Faculties]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Faculty details
 *       404:
 *         description: Faculty not found
 */
route.get(
  "/:slug",
  requestValidator(facultySlugParamSchema, "params"),
  FacultyController.getFaculty
);

/**
 * @swagger
 * /faculty:
 *   post:
 *     summary: Create a new faculty
 *     tags: [Faculties]
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
 *                 example: Engineering
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Faculty created successfully
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
  requestValidator(createFacultySchema, "body"),
  FacultyController.createFaculty
);

/**
 * @swagger
 * /faculty:
 *   delete:
 *     summary: Delete a faculty (Admin only)
 *     tags: [Faculties]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: faculty_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Faculty deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Faculty not found
 */
route.delete(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(deleteFacultyQuerySchema, "query"),
  FacultyController.deleteFaculty
);

/**
 * @swagger
 * /faculty:
 *   put:
 *     summary: Update a faculty
 *     tags: [Faculties]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: faculty_id
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
 *         description: Faculty updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Faculty not found
 */
route.put(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidatorMultiple([
    { schema: updateFacultyQuerySchema, property: "query" },
    { schema: updateFacultyBodySchema, property: "body" },
  ]),
  FacultyController.updateFaculty
);

export default route;
