import express from "express";

import MaterialController from "../controllers/material/Material.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  createMaterialSchema,
  deleteMaterialQuerySchema,
  materialCategoryQuerySchema,
  materialIdParamSchema,
  updateMaterialBodySchema,
  updateMaterialQuerySchema,
  updateMaterialCategoryOrderSchema,
} from "../validators/material/Material.validator.js";

const route = express.Router();


/**
 * @swagger
 * /material:
 *   get:
 *     summary: Get all materials in hierarchical tree structure (Public)
 *     tags: [Materials]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Hierarchical tree of materials
 */
route.get(
  "/",
  MaterialController.listMaterials
);

/**
 * @swagger
 * /material/list:
 *   get:
 *     summary: Get materials in a flat list (Admin/Search)
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
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Flat list of materials
 */
route.get(
  "/list",
  requestValidator(materialCategoryQuerySchema, "query"),
  MaterialController.listMaterialsFlat
);

/**
 * @swagger
 * /material/topic/{topicId}:
 *   get:
 *     summary: Get all materials for a specific topic
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of materials for the topic
 */
route.get(
  "/topic/:topicId",
  MaterialController.listMaterialsByTopic
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
 *               - file_url
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               file_url:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               tags:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Material created successfully
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
 *   put:
 *     summary: Update a material
 *     description: Provide id in query parameter
 *     tags: [Materials]
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
 *               description:
 *                 type: string
 *               file_url:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               tags:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Material updated successfully
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

/**
 * @swagger
 * /material:
 *   delete:
 *     summary: Delete a material
 *     tags: [Materials]
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
 *         description: Material deleted successfully
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
 * /material/category-order:
 *   put:
 *     summary: Update category ordering
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
 *               - categoryOrders
 *             properties:
 *               categoryOrders:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - category_id
 *                     - position
 *                   properties:
 *                     category_id:
 *                       type: integer
 *                     parent_id:
 *                       type: integer
 *                     context:
 *                       type: string
 *                     position:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Order updated successfully
 */
route.put(
  "/category-order",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(updateMaterialCategoryOrderSchema, "body"),
  MaterialController.updateMaterialCategoryOrder
);

export default route;
