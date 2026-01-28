import express from "express";

import BlogController from "../controllers/blogs/Blog.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
    requestValidator,
    requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
    paginationSchema,
    blogSlugParamSchema,
    createBlogSchema,
    updateBlogQuerySchema,
    updateBlogBodySchema,
    deleteBlogQuerySchema,
} from "../validators/blogs/Blog.validator.js";

const route = express.Router();

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: List all blog posts with pagination
 *     tags: [Blogs]
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
 *         description: List of blog posts
 *       500:
 *         description: Server error
 */
route.get(
    "/",
    requestValidator(paginationSchema, "query"),
    BlogController.listBlogs
);

/**
 * @swagger
 * /blogs/{slug}:
 *   get:
 *     summary: Get blog post by slug
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog post details with similar posts
 *       404:
 *         description: Post not found
 */
route.get(
    "/:slug",
    requestValidator(blogSlugParamSchema, "params"),
    BlogController.getBlog
);

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blogs]
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
 *                 example: Latest Blog Post
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
 *         description: Blog post created successfully
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
    requestValidator(createBlogSchema, "body"),
    BlogController.createBlog
);

/**
 * @swagger
 * /blogs:
 *   delete:
 *     summary: Delete a blog post
 *     tags: [Blogs]
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
    requestValidator(deleteBlogQuerySchema, "query"),
    BlogController.deleteBlog
);

/**
 * @swagger
 * /blogs:
 *   put:
 *     summary: Update a blog post
 *     tags: [Blogs]
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
        { schema: updateBlogQuerySchema, property: "query" },
        { schema: updateBlogBodySchema, property: "body" },
    ]),
    BlogController.updateBlog
);

export default route;
