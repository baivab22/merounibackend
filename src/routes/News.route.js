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
  createNewsSchema,
  updateNewsQuerySchema,
  updateNewsBodySchema,
  deleteNewsQuerySchema,
} from "../validators/news/News.validator.js";

const route = express.Router();

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: List all news/blog posts with pagination
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
 *         description: List of news/blog posts
 *       500:
 *         description: Server error
 */
route.get(
  "/",
  requestValidator(paginationSchema, "query"),
  NewsController.listBlogs
);

/**
 * @swagger
 * /blogs/{slug}:
 *   get:
 *     summary: Get news/blog post by slug
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: News/blog post details with similar posts
 *       404:
 *         description: Post not found
 */
route.get(
  "/:slug",
  requestValidator(newsSlugParamSchema, "params"),
  NewsController.getBlog
);

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a new news/blog post
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
 *               - author_id
 *             properties:
 *               title:
 *                 type: string
 *                 example: Latest Education News
 *               content:
 *                 type: string
 *                 example: Full article content here...
 *               author_id:
 *                 type: integer
 *               description:
 *                 type: string
 *               featuredImage:
 *                 type: string
 *                 format: uri
 *               category_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: News/blog post created successfully
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
  NewsController.createBlog
);

/**
 * @swagger
 * /blogs:
 *   delete:
 *     summary: Delete a news/blog post
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: blog_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Post not found
 */
route.delete(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(deleteNewsQuerySchema, "query"),
  NewsController.deleteBlog
);

/**
 * @swagger
 * /blogs:
 *   put:
 *     summary: Update a news/blog post
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: blog_id
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
 *               description:
 *                 type: string
 *               featuredImage:
 *                 type: string
 *                 format: uri
 *               category_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Post not found
 */
route.put(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidatorMultiple([
    { schema: updateNewsQuerySchema, property: "query" },
    { schema: updateNewsBodySchema, property: "body" },
  ]),
  NewsController.updateBlog
);

export default route;
