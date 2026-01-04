import express from "express";

import WishlistController from "../controllers/wishlist/Wishlist.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  getUserWishlistQuerySchema,
  addToWishlistSchema,
  removeFromWishlistSchema,
} from "../validators/wishlist/Wishlist.validator.js";

const router = express.Router();

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Get user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User's wishlist with college details
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  authenticateUser,
  requestValidator(getUserWishlistQuerySchema, "query"),
  WishlistController.getUserWishlist
);

/**
 * @swagger
 * /wishlist:
 *   post:
 *     summary: Add college to wishlist
 *     tags: [Wishlist]
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
 *               - user_id
 *               - college_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               college_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item added to wishlist successfully
 *       400:
 *         description: Bad request (already exists or invalid IDs)
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticateUser,
  requestValidator(addToWishlistSchema, "body"),
  WishlistController.addToWishlist
);

/**
 * @swagger
 * /wishlist:
 *   delete:
 *     summary: Remove item from wishlist
 *     tags: [Wishlist]
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
 *               - user_id
 *               - college_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               college_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item removed from wishlist successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found in wishlist
 */
router.delete(
  "/",
  authenticateUser,
  requestValidator(removeFromWishlistSchema, "body"),
  WishlistController.removeFromWishlist
);

export default router;
