import express from "express";

import BannerController from "../controllers/banner/Banner.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  bannerIdParamSchema,
  galleryIdParamSchema,
  createBannerSchema,
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
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *                 example: Summer Sale Banner
 *               image:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/banner.jpg
 *               link:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/promotion
 *               gallery:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     image:
 *                       type: string
 *                       format: uri
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

/**
 * @swagger
 * /banner/{galleryId}/delete:
 *   delete:
 *     summary: Delete a banner gallery item
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: galleryId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gallery item deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Gallery item not found
 */
router.delete(
  "/:galleryId/delete",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(galleryIdParamSchema, "params"),
  BannerController.deleteBannerGalleryItem
);

export default router;
