import express from "express";

import MaterialController from "../controllers/material/Material.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  materialIdParamSchema,
  createMaterialSchema,
  updateMaterialQuerySchema,
  updateMaterialBodySchema,
  deleteMaterialQuerySchema,
  materialCategoryQuerySchema,
} from "../validators/material/Material.validator.js";

const route = express.Router();

/**
 * @swagger
 * /material:
 *   get:
 *     summary: List all materials with pagination
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
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of materials
 */
route.get(
  "/",
  requestValidator(materialCategoryQuerySchema, "query"),
  MaterialController.listMaterials
);

/**
 * @swagger
 * /material/category:
 *   get:
 *     summary: List materials by category
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
 *           default: 12
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Category ID (use 'unlisted' for materials without category)
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of materials by category
 */
route.get(
  "/category",
  requestValidator(materialCategoryQuerySchema, "query"),
  MaterialController.listMaterialsByCategory
);

/**
 * @swagger
 * /material/{id}:
 *   get:
 *     summary: Get material by ID
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Material details
 *       404:
 *         description: Material not found
 */
route.get(
  "/:id",
  requestValidator(materialIdParamSchema, "params"),
  MaterialController.getMaterial
);

/**
 * @swagger
 * /material:
 *   post:
 *     summary: Create a new material
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
 *               - title
 *               - file
 *             properties:
 *               title:
 *                 type: string
 *                 example: Study Guide PDF
 *               description:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: uri
 *               category_id:
 *                 type: integer
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Material created successfully
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
  requestValidator(createMaterialSchema, "body"),
  MaterialController.createMaterial
);

/**
 * @swagger
 * /material:
 *   delete:
 *     summary: Delete a material (Admin only)
 *     tags: [Materials]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: material_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Material deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Material not found
 */
route.delete(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(deleteMaterialQuerySchema, "query"),
  MaterialController.deleteMaterial
);

/**
 * @swagger
 * /material:
 *   put:
 *     summary: Update a material
 *     tags: [Materials]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: material_id
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
 *               file:
 *                 type: string
 *                 format: uri
 *               category_id:
 *                 type: integer
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Material updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Material not found
 */
route.put(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidatorMultiple([
    { schema: updateMaterialQuerySchema, property: "query" },
    { schema: updateMaterialBodySchema, property: "body" },
  ]),
  MaterialController.updateMaterial
);

export default route;
