import express from "express";

import ScholarshipController from "../controllers/scholarship/Scholarship.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  scholarshipIdParamSchema,
  createScholarshipSchema,
  updateScholarshipQuerySchema,
  updateScholarshipBodySchema,
  deleteScholarshipQuerySchema,
} from "../validators/scholarship/Scholarship.validator.js";

const route = express.Router();

/**
 * @swagger
 * /scholarship:
 *   get:
 *     summary: List all scholarships with pagination
 *     tags: [Scholarships]
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
 *         description: List of scholarships
 */
route.get(
  "/",
  requestValidator(paginationSchema, "query"),
  ScholarshipController.listScholarships
);

/**
 * @swagger
 * /scholarship/{id}:
 *   get:
 *     summary: Get scholarship by ID
 *     tags: [Scholarships]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Scholarship details
 *       404:
 *         description: Scholarship not found
 */
route.get(
  "/:id",
  requestValidator(scholarshipIdParamSchema, "params"),
  ScholarshipController.getScholarship
);

/**
 * @swagger
 * /scholarship:
 *   post:
 *     summary: Create a new scholarship
 *     tags: [Scholarships]
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
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: Merit Scholarship
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               eligibility:
 *                 type: string
 *     responses:
 *       201:
 *         description: Scholarship created successfully
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
  requestValidator(createScholarshipSchema, "body"),
  ScholarshipController.createScholarship
);

/**
 * @swagger
 * /scholarship:
 *   delete:
 *     summary: Delete a scholarship (Admin only)
 *     tags: [Scholarships]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: scholarship_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Scholarship deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Scholarship not found
 */
route.delete(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(deleteScholarshipQuerySchema, "query"),
  ScholarshipController.deleteScholarship
);

/**
 * @swagger
 * /scholarship:
 *   put:
 *     summary: Update a scholarship
 *     tags: [Scholarships]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: scholarship_id
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
 *               amount:
 *                 type: number
 *               eligibility:
 *                 type: string
 *     responses:
 *       200:
 *         description: Scholarship updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Scholarship not found
 */
route.put(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidatorMultiple([
    { schema: updateScholarshipQuerySchema, property: "query" },
    { schema: updateScholarshipBodySchema, property: "body" },
  ]),
  ScholarshipController.updateScholarship
);

export default route;
