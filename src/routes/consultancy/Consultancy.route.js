import express from "express";

import ConsultancyController from "../../controllers/consultancy/Consultancy.controller.js";
import { authenticateUser } from "../../middlewares/Auth.middleware.js";
import { authorizeRole } from "../../middlewares/AuthorizeRole.js";
import { requestValidator } from "../../middlewares/RequestValidator.middleware.js";
import {
  listConsultancyQuerySchema,
  consultancySlugParamSchema,
  createOrUpdateConsultancySchema,
  deleteConsultancyQuerySchema,
} from "../../validators/consultancy/Consultancy.validator.js";

const route = express.Router();

/**
 * @swagger
 * /consultancy:
 *   get:
 *     summary: List all consultancies with pagination
 *     tags: [Consultancy]
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
 *         description: List of consultancies
 */
route.get(
  "/",
  requestValidator(listConsultancyQuerySchema, "query"),
  ConsultancyController.listConsultancy,
);

/**
 * @swagger
 * /consultancy
 *   get:
 *     summary: Get my consultancy
 *     tags: [Consultancy]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: My consultancy details
 *       404:
 *         description: Consultancy not found
 */
route.get(
  "/me",
  authenticateUser,
  authorizeRole(["admin", "editor","consultancy"]),
  ConsultancyController.getMyConsultancy,
);

/**
 * @swagger
 * /consultancy/{slugs}:
 *   get:
 *     summary: Get consultancy by slug
 *     tags: [Consultancy]
 *     parameters:
 *       - in: path
 *         name: slugs
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consultancy details
 *       404:
 *         description: Consultancy not found
 */
route.get(
  "/:slugs",
  requestValidator(consultancySlugParamSchema, "params"),
  ConsultancyController.getConsultancy,
);

/**
 * @swagger
 * /consultancy:
 *   post:
 *     summary: Create or update a consultancy
 *     tags: [Consultancy]
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
 *                 example: Education Consultancy Services
 *               description:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: uri
 *               website_url:
 *                 type: string
 *                 format: uri
 *               google_map_url:
 *                 type: string
 *                 format: uri
 *               course_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Consultancy created/updated successfully
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
  authorizeRole(["admin", "editor","consultancy"]),
  requestValidator(createOrUpdateConsultancySchema, "body"),
  ConsultancyController.createOrUpdateConsultancy,
);

/**
 * @swagger
 * /consultancy:
 *   delete:
 *     summary: Delete a consultancy (Admin only)
 *     tags: [Consultancy]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: consultancy_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Consultancy deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Consultancy not found
 */
route.delete(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(deleteConsultancyQuerySchema, "query"),
  ConsultancyController.deleteConsultancy,
);

export default route;
