import express from "express";
import { getUserWishlist } from "../controller/GetWishlist.js";
import {
  addToWishlist,
  removeFromWishlist,
} from "../controller/AddOrRemoveWishlist.js";

import { authenticateUser } from "../../../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser, getUserWishlist);
router.post("/", authenticateUser,addToWishlist);
router.delete("/", authenticateUser,removeFromWishlist);

export default router;
