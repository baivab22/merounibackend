import express from "express";

import MaterialCategoryController from "../controllers/material/MaterialCategory.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  materialCategoryIdParamSchema,
  createMaterialCategorySchema,
  updateMaterialCategoryQuerySchema,
  updateMaterialCategoryBodySchema,
  deleteMaterialCategoryQuerySchema,
} from "../validators/material/MaterialCategory.validator.js";

const route = express.Router();

/**
 * @swagger
 * /material-category:
 *   get:
 *     summary: List all material categories with pagination
 *     tags: [Materials]
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
 *     responses:
 *       200:
 *         description: List of material categories
 */
route.get(
  "/",
  requestValidator(paginationSchema, "query"),
  MaterialCategoryController.listCategories
);

/**
 * @swagger
 * /material-category/{id}:
 *   get:
 *     summary: Get material category by ID
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 */
route.get(
  "/:id",
  requestValidator(materialCategoryIdParamSchema, "params"),
  MaterialCategoryController.getCategory
);

/**
 * @swagger
 * /material-category:
 *   post:
 *     summary: Create a new material category
 *     tags: [Materials]
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
 *                 example: Study Materials
 *               description:
 *                 type: string
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
  authorizeRole(["admin", "editor"]),
  requestValidator(createMaterialCategorySchema, "body"),
  MaterialCategoryController.createCategory
);

/**
 * @swagger
 * /material-category:
 *   delete:
 *     summary: Delete a material category
 *     tags: [Materials]
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
  requestValidator(deleteMaterialCategoryQuerySchema, "query"),
  MaterialCategoryController.deleteCategory
);

/**
 * @swagger
 * /material-category:
 *   put:
 *     summary: Update a material category
 *     tags: [Materials]
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
 *               name:
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
    { schema: updateMaterialCategoryQuerySchema, property: "query" },
    { schema: updateMaterialCategoryBodySchema, property: "body" },
  ]),
  MaterialCategoryController.updateCategory
);

export default route;
