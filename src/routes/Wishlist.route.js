import express from "express";

import WishlistController from "../controllers/wishlist/Wishlist.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";

const router = express.Router();

router.get("/", authenticateUser, WishlistController.getUserWishlist);
router.post("/", authenticateUser, WishlistController.addToWishlist);
router.delete("/", authenticateUser, WishlistController.removeFromWishlist);

export default router;
