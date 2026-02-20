import express from "express";

import BannerController from "../controllers/banner/Banner.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  bannerIdParamSchema,
  createBannerSchema,
  updateBannerSchema,
} from "../validators/banner/Banner.validator.js";

const router = express.Router();

/**
 * @swagger
 * /banner:
 *   post:
 *     summary: Create a new banner
 *     tags: [Banners]
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
 *               - banner_image
 *               - display_position
 *             properties:
 *               title:
 *                 type: string
 *                 example: Summer Sale Banner
 *               banner_image:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/banner.jpg
 *               college_id:
 *                 type: integer
 *               website_url:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/promotion
 *               display_position:
 *                 type: string
 *               priority:
 *                 type: integer
 *               date_of_expiry:
 *                 type: string
 *                 format: date-time
 *               is_featured:
 *                 type: integer
 *                 enum: [0, 1]
 *     responses:
 *       201:
 *         description: Banner created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(createBannerSchema, "body"),
  BannerController.createBanner
);

/**
 * @swagger
 * /banner:
 *   get:
 *     summary: Get all banners with pagination
 *     tags: [Banners]
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
 *         description: List of banners
 *       500:
 *         description: Server error
 */
router.get(
  "/",
  requestValidator(paginationSchema, "query"),
  BannerController.getBanners
);

/**
 * @swagger
 * /banner/{id}:
 *   get:
 *     summary: Get banner by ID
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Banner details
 *       404:
 *         description: Banner not found
 */
router.get(
  "/:id",
  requestValidator(bannerIdParamSchema, "params"),
  BannerController.getBannersById
);

/**
 * @swagger
 * /banner/{id}:
 *   put:
 *     summary: Update a banner
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
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
 *               college_id:
 *                 type: integer
 *               website_url:
 *                 type: string
 *               display_position:
 *                 type: string
 *               priority:
 *                 type: integer
 *               date_of_expiry:
 *                 type: string
 *                 format: date-time
 *               title:
 *                 type: string
 *               banner_image:
 *                 type: string
 *               is_featured:
 *                 type: integer
 *                 enum: [0, 1]
 *     responses:
 *       200:
 *         description: Banner updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Banner not found
 */
router.put(
  "/:id",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(bannerIdParamSchema, "params"),
  requestValidator(updateBannerSchema, "body"),
  BannerController.updateBanner
);

/**
 * @swagger
 * /banner/{id}:
 *   delete:
 *     summary: Delete a banner
 *     tags: [Banners]
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
 *         description: Banner deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Banner not found
 */
router.delete(
  "/:id",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(bannerIdParamSchema, "params"),
  BannerController.deleteBanner
);

export default router;
