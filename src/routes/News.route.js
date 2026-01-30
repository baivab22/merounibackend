import express from "express";

import NewsController from "../controllers/news/News.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  newsSlugParamSchema,
  newsIdParamSchema,
  createNewsSchema,
  updateNewsParamsSchema,
  updateNewsBodySchema,
  deleteNewsQuerySchema,
} from "../validators/news/News.validator.js";

const route = express.Router();

/**
 * @swagger
 * /news:
 *   get:
 *     summary: List all news with pagination
 *     tags: [News]
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
 *         name: category_title
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of news
 *       500:
 *         description: Server error
 */
route.get(
  "/",
  requestValidator(paginationSchema, "query"),
  NewsController.listNews
);


/**
 * @swagger
 * /news:
 *   get:
 *     summary: List all news with pagination
 *     tags: [News]
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
 *         name: category_title
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of news
 *       500:
 *         description: Server error
 */
route.get(
  "/admin/list",
  requestValidator(paginationSchema, "query"),
  NewsController.listNews
);

/**
 * @swagger
 * /news/{slug}:
 *   get:
 *     summary: Get news by slug
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: News details with similar news
 *       404:
 *         description: News not found
 */
route.get(
  "/:slug",
  requestValidator(newsSlugParamSchema, "params"),
  NewsController.getNews
);

/**
 * @swagger
 * /news/id/{id}:
 *   get:
 *     summary: Get news by id (Authenticated)
 *     tags: [News]
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
 *         description: News details
 *       404:
 *         description: News not found
 *       401:
 *         description: Unauthorized
 */
route.get(
  "/id/:id",
  authenticateUser,
  requestValidator(newsIdParamSchema, "params"),
  NewsController.getNewsById
);

/**
 * @swagger
 * /news:
 *   post:
 *     summary: Create a new news post
 *     tags: [News]
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
 *               - content
 *               - author
 *               - category
 *               - featuredImage
 *             properties:
 *               title:
 *                 type: string
 *                 example: Latest Education News
 *               content:
 *                 type: string
 *                 example: Full article content here...
 *               author:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               description:
 *                 type: string
 *               featuredImage:
 *                 type: string
 *                 format: uri
 *               college_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: News created successfully
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
  requestValidator(createNewsSchema, "body"),
  NewsController.createNews
);

/**
 * @swagger
 * /news:
 *   delete:
 *     summary: Delete a news post
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: News deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: News not found
 */
route.delete(
  "/:id",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(deleteNewsQuerySchema, "params"),
  NewsController.deleteNews
);

/**
 * @swagger
 * /news:
 *   put:
 *     summary: Update a news post
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: id
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
 *               content:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               author:
 *                 type: integer
 *               description:
 *                 type: string
 *               featuredImage:
 *                 type: string
 *                 format: uri
 *               college_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: News updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: News not found
 */
route.put(
  "/:id",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidatorMultiple([
    { schema: updateNewsParamsSchema, property: "params" },
    { schema: updateNewsBodySchema, property: "body" },
  ]),
  NewsController.updateNews
);

export default route;
