import express from "express";

import CareerController from "../controllers/career/Career.controller.js";
import { authenticateUser,optionalAuthenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  slugParamSchema,
  createCareerSchema,
  updateCareerQuerySchema,
  updateCareerBodySchema,
  deleteCareerQuerySchema,
  applyForCareerSchema,
} from "../validators/career/Career.validator.js";

const route = express.Router();

/**
 * @swagger
 * /career:
 *   get:
 *     summary: List all career posts with pagination
 *     tags: [Careers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of career posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *       500:
 *         description: Server error
 */
route.get(
  "/",
  optionalAuthenticateUser,
  requestValidator(paginationSchema, "query"),
  CareerController.listCareers
);

/**
 * @swagger
 * /career/applications:
 *   get:
 *     summary: List all career applications with pagination
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search by name or email
 *       - in: query
 *         name: career_id
 *         schema:
 *           type: integer
 *         description: Filter by specific career ID
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order by created date
 *     responses:
 *       200:
 *         description: List of career applications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
route.get(
  "/applications",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(paginationSchema, "query"),
  CareerController.listCareerApplications
);

/**
 * @swagger
 * /career/{slug}:
 *   get:
 *     summary: Get career post by slug
 *     tags: [Careers]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Career post slug
 *     responses:
 *       200:
 *         description: Career post details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 item:
 *                   type: object
 *       404:
 *         description: Career post not found
 *       500:
 *         description: Server error
 */
route.get(
  "/:slug",
  optionalAuthenticateUser,
  requestValidator(slugParamSchema, "params"),
  CareerController.getCareerBySlug
);

/**
 * @swagger
 * /career:
 *   post:
 *     summary: Create a new career post
 *     tags: [Careers]
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
 *               - author_id
 *               - description
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Software Engineer Position
 *               author_id:
 *                 type: integer
 *                 example: 1
 *               description:
 *                 type: string
 *                 example: We are looking for a skilled software engineer
 *               content:
 *                 type: string
 *                 example: Full job description here...
 *               featuredImage:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/image.jpg
 *     responses:
 *       201:
 *         description: Career post created successfully
 *       400:
 *         description: Bad request (validation error)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (insufficient permissions)
 *       500:
 *         description: Server error
 */
route.post(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(createCareerSchema, "body"),
  CareerController.createCareer
);

/**
 * @swagger
 * /career:
 *   delete:
 *     summary: Delete a career post
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Career post ID
 *     responses:
 *       200:
 *         description: Career post deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (insufficient permissions)
 *       404:
 *         description: Career post not found
 *       500:
 *         description: Server error
 */
route.delete(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(deleteCareerQuerySchema, "query"),
  CareerController.deleteCareer
);

/**
 * @swagger
 * /career:
 *   put:
 *     summary: Update a career post
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Career post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Software Engineer Position
 *               author_id:
 *                 type: integer
 *                 example: 1
 *               description:
 *                 type: string
 *                 example: Updated description
 *               content:
 *                 type: string
 *                 example: Updated content
 *               featuredImage:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/updated-image.jpg
 *     responses:
 *       200:
 *         description: Career post updated successfully
 *       400:
 *         description: Bad request (validation error)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (insufficient permissions)
 *       404:
 *         description: Career post not found
 *       500:
 *         description: Server error
 */
route.put(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidatorMultiple([
    { schema: updateCareerQuerySchema, property: "query" },
    { schema: updateCareerBodySchema, property: "body" },
  ]),
  CareerController.updateCareer
);

/**
 * @swagger
 * /career/apply/{career_id}:
 *   post:
 *     summary: Apply for a career post
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: career_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Career ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resume
 *             properties:
 *               resume:
 *                 type: string
 *               cover_letter:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Bad request (validation error)
 *       404:
 *         description: Career not found
 *       500:
 *         description: Server error
 */
route.post(
  "/apply/:career_id",
  authenticateUser,
  requestValidator(applyForCareerSchema, "body"),
  CareerController.applyForCareer
);

export default route;
