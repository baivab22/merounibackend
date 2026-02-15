import express from "express";

import CategoryController from "../controllers/category/Category.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  categorySlugParamSchema,
  categoryListQuerySchema,
  createCategorySchema,
  updateCategoryQuerySchema,
  updateCategoryBodySchema,
  deleteCategoryQuerySchema,
} from "../validators/category/Category.validator.js";

const route = express.Router();

/**
 * @swagger
 * /category:
 *   get:
 *     summary: List all categories with pagination
 *     tags: [Categories]
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
 *         description: List of categories
 *       500:
 *         description: Server error
 */
route.get(
  "/",
  requestValidator(categoryListQuerySchema, "query"),
  CategoryController.listCategories
);

/**
 * @swagger
 * /category/{slugs}:
 *   get:
 *     summary: Get category by slug
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slugs
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 */
route.get(
  "/:slugs",
  requestValidator(categorySlugParamSchema, "params"),
  CategoryController.getCategory
);

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
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
 *                 example: Technology
 *               description:
 *                 type: string
 *                 example: Technology related content
 *     responses:
 *       201:
 *         description: Category created successfully
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
  authorizeRole(["admin", "editor", "agent"]),
  requestValidator(createCategorySchema, "body"),
  CategoryController.createCategory
);

/**
 * @swagger
 * /category:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: category_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 */
route.delete(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(deleteCategoryQuerySchema, "query"),
  CategoryController.deleteCategory
);

/**
 * @swagger
 * /category:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: category_id
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
 *         description: Category updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 */
route.put(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidatorMultiple([
    { schema: updateCategoryQuerySchema, property: "query" },
    { schema: updateCategoryBodySchema, property: "body" },
  ]),
  CategoryController.updateCategory
);

export default route;
