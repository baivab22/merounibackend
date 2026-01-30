import express from "express";

import VacancyController from "../controllers/vacancy/Vacancy.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  slugParamSchema,
  createVacancySchema,
  updateVacancyQuerySchema,
  updateVacancyBodySchema,
  deleteVacancyQuerySchema,
} from "../validators/vacancy/Vacancy.validator.js";

const route = express.Router();

/**
 * @swagger
 * /vacancy:
 *   get:
 *     summary: List all job vacancies with pagination
 *     tags: [Vacancies]
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
 *         name: college_id
 *         schema:
 *           type: integer
 *         description: Filter by College ID
 *     responses:
 *       200:
 *         description: List of vacancies
 */
route.get(
  "/",
  requestValidator(paginationSchema, "query"),
  VacancyController.listVacancies
);

/**
 * @swagger
 * /vacancy/{slugs}:
 *   get:
 *     summary: Get vacancy by slug
 *     tags: [Vacancies]
 *     parameters:
 *       - in: path
 *         name: slugs
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vacancy details
 *       404:
 *         description: Vacancy not found
 */
route.get(
  "/:slugs",
  requestValidator(slugParamSchema, "params"),
  VacancyController.getVacancyBySlug
);

/**
 * @swagger
 * /vacancy:
 *   post:
 *     summary: Create a new job vacancy
 *     tags: [Vacancies]
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
 *               - author_id
 *             properties:
 *               title:
 *                 type: string
 *                 example: Software Engineer Position
 *               description:
 *                 type: string
 *               author_id:
 *                 type: integer
 *               featuredImage:
 *                 type: string
 *                 format: uri
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vacancy created successfully
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
  requestValidator(createVacancySchema, "body"),
  VacancyController.createVacancy
);

/**
 * @swagger
 * /vacancy:
 *   delete:
 *     summary: Delete a job vacancy (Admin only)
 *     tags: [Vacancies]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: vacancy_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vacancy deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Vacancy not found
 */
route.delete(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(deleteVacancyQuerySchema, "query"),
  VacancyController.deleteVacancy
);

/**
 * @swagger
 * /vacancy:
 *   put:
 *     summary: Update a job vacancy
 *     tags: [Vacancies]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: vacancy_id
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
 *               content:
 *                 type: string
 *               featuredImage:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Vacancy updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Vacancy not found
 */
route.put(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidatorMultiple([
    { schema: updateVacancyQuerySchema, property: "query" },
    { schema: updateVacancyBodySchema, property: "body" },
  ]),
  VacancyController.updateVacancy
);

export default route;
