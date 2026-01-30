import express from "express";
import ConfigController from "../controllers/config/Config.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  createConfigSchema,
  configTypeParamSchema,
  updateConfigSchema,
} from "../validators/config/Config.validator.js";

const router = express.Router();

/**
 * @swagger
 * /config:
 *   get:
 *     summary: List all configs (admin)
 *     tags: [Config]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of configs
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(paginationSchema, "query"),
  ConfigController.list
);

/**
 * @swagger
 * /config/{type}:
 *   get:
 *     summary: Get config by type (admin)
 *     tags: [Config]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Config details
 *       404:
 *         description: Config not found
 */
router.get(
  "/:type",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(configTypeParamSchema, "params"),
  ConfigController.getByType
);

/**
 * @swagger
 * /config:
 *   post:
 *     summary: Create or update a config (admin). Use type "referral_point" for agent referral points.
 *     tags: [Config]
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
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *                 example: referral_point
 *               value:
 *                 type: string
 *                 example: "10"
 *     responses:
 *       200:
 *         description: Config saved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(createConfigSchema, "body"),
  ConfigController.createOrUpdate
);

/**
 * @swagger
 * /config/{type}:
 *   put:
 *     summary: Update config by type (admin)
 *     tags: [Config]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *     responses:
 *       200:
 *         description: Config updated
 *       404:
 *         description: Config not found
 */
router.put(
  "/:type",
  authenticateUser,
  authorizeRole(["admin"]),
  requestValidator(configTypeParamSchema, "params"),
  requestValidator(updateConfigSchema, "body"),
  ConfigController.updateByType
);

export default router;
