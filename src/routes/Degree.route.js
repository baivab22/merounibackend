
import express from "express";
import DegreeController from "../controllers/degree/Degree.controller.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
    createDegreeSchema,
    updateDegreeSchema,
} from "../validators/degree/Degree.validator.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Degrees
 *   description: Degree management API
 */

/**
 * @swagger
 * /degrees:
 *   get:
 *     summary: List all degrees
 *     tags: [Degrees]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for name
 *     responses:
 *       200:
 *         description: List of degrees
 */
router.get("/", DegreeController.listDegrees);

/**
 * @swagger
 * /degrees/id/{id}:
 *   get:
 *     summary: Get degree by ID
 *     tags: [Degrees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Degree ID
 *     responses:
 *       200:
 *         description: Degree details
 *       404:
 *         description: Degree not found
 */
router.get("/id/:id", DegreeController.getDegreeById);

/**
 * @swagger
 * /degrees/slug/{slug}:
 *   get:
 *     summary: Get degree by Slug
 *     tags: [Degrees]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Degree Slug
 *     responses:
 *       200:
 *         description: Degree details
 *       404:
 *         description: Degree not found
 */
router.get("/slug/:slug", DegreeController.getDegreeBySlug);

/**
 * @swagger
 * /degrees:
 *   post:
 *     summary: Create a new degree
 *     tags: [Degrees]
 *     security:
 *       - bearerAuth: []
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
 *               description:
 *                 type: string
 *               featured_image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Degree created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
    "/",
    authenticateUser,
    authorizeRole(["admin", "editor"]),
    requestValidator(createDegreeSchema),
    DegreeController.createDegree
);

/**
 * @swagger
 * /degrees/{id}:
 *   patch:
 *     summary: Update a degree
 *     tags: [Degrees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Degree ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               featured_image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Degree updated successfully
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
    requestValidator(updateDegreeSchema),
    DegreeController.updateDegree
);

/**
 * @swagger
 * /degrees/{id}:
 *   delete:
 *     summary: Delete a degree
 *     tags: [Degrees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Degree ID
 *     responses:
 *       200:
 *         description: Degree deleted successfully
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
    DegreeController.deleteDegree
);

export default router;
