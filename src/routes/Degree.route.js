import express from "express";

import DegreeController from "../controllers/degree/Degree.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  degreeSlugParamSchema,
  degreeIdParamSchema,
  createDegreeSchema,
  updateDegreeSchema,
} from "../validators/degree/Degree.validator.js";

const router = express.Router();

/**
 * @swagger
 * /degree:
 *   get:
 *     summary: List all degrees with pagination
 *     tags: [Degrees]
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
 *         description: List of degrees
 */
router.get(
  "/",
  requestValidator(paginationSchema, "query"),
  DegreeController.listDegrees
);

/**
 * @swagger
 * /degree/{slug}:
 *   get:
 *     summary: Get degree by slug or id
 *     tags: [Degrees]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Degree details
 *       404:
 *         description: Degree not found
 */
router.get(
  "/:slug",
  requestValidator(degreeSlugParamSchema, "params"),
  DegreeController.getDegree
);

/**
 * @swagger
 * /degree:
 *   post:
 *     summary: Create a degree
 *     tags: [Degrees]
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
 *               - short_name
 *               - title
 *             properties:
 *               cover_image:
 *                 type: string
 *                 format: uri
 *               short_name:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Degree created
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
  authorizeRole(["admin", "editor"]),
  requestValidator(createDegreeSchema, "body"),
  DegreeController.createDegree
);

/**
 * @swagger
 * /degree/{id}:
 *   put:
 *     summary: Update a degree
 *     tags: [Degrees]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cover_image:
 *                 type: string
 *                 format: uri
 *               short_name:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Degree updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Degree not found
 */
router.put(
  "/:id",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(degreeIdParamSchema, "params"),
  requestValidator(updateDegreeSchema, "body"),
  DegreeController.updateDegree
);

/**
 * @swagger
 * /degree/{id}:
 *   delete:
 *     summary: Delete a degree
 *     tags: [Degrees]
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
 *         description: Degree deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Degree not found
 */
router.delete(
  "/:id",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(degreeIdParamSchema, "params"),
  DegreeController.deleteDegree
);

export default router;
