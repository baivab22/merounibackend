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

router.get(
  "/",
  authenticateUser,
  requestValidator(getUserWishlistQuerySchema, "query"),
  WishlistController.getUserWishlist
);
router.post(
  "/",
  authenticateUser,
  requestValidator(addToWishlistSchema, "body"),
  WishlistController.addToWishlist
);
router.delete(
  "/",
  authenticateUser,
  requestValidator(removeFromWishlistSchema, "body"),
  WishlistController.removeFromWishlist
);

export default router;
